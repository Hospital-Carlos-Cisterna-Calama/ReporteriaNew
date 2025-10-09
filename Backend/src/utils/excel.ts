// src/utils/excel.ts
import ExcelJS from 'exceljs';
import type { Response } from 'express';

export type ColDef<T> = { header: string; key: keyof T | string; width?: number };

function colToLetter(n: number) {
  let s = '';
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - m) / 26);
  }
  return s;
}

export function fmtDate(val: unknown): string {
  if (!val) return '';
  const d = val instanceof Date ? val : new Date(String(val));
  if (isNaN(d.getTime())) return String(val ?? '');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

export function nullToEmpty<T extends Record<string, any>>(row: T): T {
  const out: Record<string, any> = {};
  for (const k of Object.keys(row)) {
    const v = (row as any)[k];
    out[k] = v === null || v === undefined ? '' : v;
  }
  return out as T;
}

function sanitizeText(val: any): string {
  const text = typeof val === 'string' ? val : String(val ?? '');
  // Elimina caracteres no válidos para XML (xlsx)
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

/* =========================
   MODO BUFFER (volúmenes pequeños/medios)
   ========================= */

export function autoFit(worksheet: ExcelJS.Worksheet, opts?: { min?: number; max?: number }) {
  const min = opts?.min ?? 10;
  const max = opts?.max ?? 40; // cap para que no queden exageradamente anchas
  worksheet.columns?.forEach(col => {
    let width = min;
    if (typeof col.eachCell === 'function') {
      col.eachCell({ includeEmpty: true }, cell => {
        const v = cell.value ?? '';
        const len = typeof v === 'string' ? v.length : String(v).length;
        if (len + 2 > width) width = len + 2; // padding
      });
    }
    col.width = Math.min(Math.max(width, min), max);
  });
}

function styleHeader(ws: ExcelJS.Worksheet, headerColor = 'FF6D28D9', headerHeight = 16) {
  const header = ws.getRow(1);
  header.height = headerHeight; // más bajo para ver más filas
  header.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerColor } };
  });
  // Congelar encabezado y autofiltro
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  const lastCol = colToLetter(ws.columnCount || 1);
  ws.autoFilter = `A1:${lastCol}1`;
}

function applyBordersAndWrap(
  ws: ExcelJS.Worksheet,
  wrapKeys: string[] | undefined,
  opts?: { dataRowHeight?: number; defaultWrap?: boolean; borders?: boolean }
) {
  const thin: Partial<ExcelJS.Border> = { style: 'thin' as ExcelJS.BorderStyle, color: { argb: 'FFCBD5E1' } }; // slate-300
  const rowH = opts?.dataRowHeight ?? 14; // más bajo por defecto
  const defaultWrap = opts?.defaultWrap ?? false; // por defecto SIN wrap (más compacto)
  const useBorders = opts?.borders ?? true; // en buffer podemos dejar bordes por defecto

  // map índice de columna → key
  const keysByCol: string[] = [];
  for (let c = 1; c <= ws.columnCount; c++) {
    const key = (ws.getColumn(c).key ?? '') as string;
    keysByCol[c] = key;
  }

  const startRow = 2;
  const endRow = ws.lastRow?.number ?? 1;
  for (let r = startRow; r <= endRow; r++) {
    const row = ws.getRow(r);
    row.height = rowH;
    for (let c = 1; c <= ws.columnCount; c++) {
      const cell = row.getCell(c);
      const colKey = keysByCol[c] ?? '';
      const shouldWrap = wrapKeys && wrapKeys.length ? wrapKeys.includes(colKey) : defaultWrap;

      cell.alignment = {
        ...(cell.alignment ?? {}),
        vertical: 'middle',
        wrapText: shouldWrap,
        shrinkToFit: !shouldWrap,
      };
      if (useBorders) {
        cell.border = { top: thin, left: thin, bottom: thin, right: thin };
      }
    }
  }
}

export async function buildSheet<T extends Record<string, any>>(
  wb: ExcelJS.Workbook,
  name: string,
  columns: ColDef<T>[],
  rows: T[],
  opts?: {
    dateKeys?: (keyof T | string)[];
    headerColorArgb?: string;
    wrapKeys?: (keyof T | string)[];
    headerHeight?: number; // NUEVO
    dataRowHeight?: number; // NUEVO
    defaultWrap?: boolean; // NUEVO
    zoomScale?: number; // NUEVO (p.ej. 90)
    borders?: boolean; // NUEVO (por si quieres desactivar)
  }
) {
  const ws = wb.addWorksheet(name, { properties: { defaultRowHeight: 14 } }); // default más bajo
  if (opts?.zoomScale) ws.views = [{ state: 'normal', zoomScale: opts.zoomScale }];

  ws.columns = columns.map(c => ({ header: c.header, key: String(c.key), width: c.width ?? 15 }));

  const dateKeys = new Set((opts?.dateKeys ?? []).map(String));
  rows.forEach(r => {
    const clean = nullToEmpty(r);
    for (const k of Object.keys(clean)) {
      if (dateKeys.has(k)) (clean as Record<string, any>)[k] = fmtDate(clean[k]);
      else (clean as Record<string, any>)[k] = sanitizeText(clean[k]);
    }
    ws.addRow(clean);
  });

  styleHeader(ws, opts?.headerColorArgb, opts?.headerHeight ?? 16);
  autoFit(ws, { max: 32 }); // cap de ancho para no “desbocarse”
  applyBordersAndWrap(ws, opts?.wrapKeys?.map(String), {
    dataRowHeight: opts?.dataRowHeight,
    defaultWrap: opts?.defaultWrap,
    borders: opts?.borders,
  });

  return ws;
}

export async function sendWorkbook(res: import('express').Response, wb: ExcelJS.Workbook, filename: string) {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await wb.xlsx.write(res);
  res.end();
}

/* =========================
   MODO STREAMING (volúmenes grandes)
   ========================= */

/**
 * Envía un XLSX de UNA hoja en streaming (memoria constante).
 * Estilos simplificados para alto rendimiento.
 */
export async function sendOneSheetStream<T extends Record<string, any>>(
  res: Response,
  filename: string,
  sheetName: string,
  columns: ColDef<T>[],
  rows: T[],
  opts?: {
    dateKeys?: (keyof T | string)[];
    headerColorArgb?: string; // p.ej. 'FF4F46E5' o 'FF6D28D9'
    wrapKeys?: (keyof T | string)[]; // si omites => NO wrap por defecto
    borders?: boolean; // ⚠️ caro en grandes; default false
    columnWidths?: Record<string, number>;
    headerHeight?: number; // altura header (default 16)
    dataRowHeight?: number; // altura datos (default 14)
    defaultWrap?: boolean; // default false para ver más filas
    zoomScale?: number; // p.ej. 90 para ver más líneas
  }
) {
  // Headers HTTP
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const wb = new (ExcelJS as any).stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: true,
    useSharedStrings: true,
  }) as ExcelJS.stream.xlsx.WorkbookWriter;

  const ws = wb.addWorksheet(sheetName, { properties: { defaultRowHeight: 14 } });

  // Aunque WorksheetWriter no tipa .views, ExcelJS lo soporta internamente
  if (opts?.zoomScale) (ws as any).views = [{ state: 'normal', zoomScale: opts.zoomScale }];

  // Definir columnas (no hay autoFit real en streaming)
  ws.columns = columns.map(c => ({
    header: c.header,
    key: String(c.key),
    width: opts?.columnWidths?.[String(c.key)] ?? c.width ?? 15,
  }));

  // Encabezado estilizado (simple y bajo)
  const headerRow = ws.getRow(1);
  headerRow.height = opts?.headerHeight ?? 16;
  headerRow.eachCell((cell: ExcelJS.Cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts?.headerColorArgb ?? 'FF6D28D9' } };
    if (opts?.borders) {
      cell.border = {
        top: { style: 'thin' as ExcelJS.BorderStyle },
        left: { style: 'thin' as ExcelJS.BorderStyle },
        bottom: { style: 'thin' as ExcelJS.BorderStyle },
        right: { style: 'thin' as ExcelJS.BorderStyle },
      };
    }
  });
  headerRow.commit();

  // Preparación de formateo por clave
  const dateKeys = new Set((opts?.dateKeys ?? []).map(String));
  const wrapSet = new Set((opts?.wrapKeys ?? []).map(String));
  const defaultWrap = opts?.defaultWrap ?? false; // por defecto SIN wrap
  const thin = { style: 'thin' as ExcelJS.BorderStyle, color: { argb: 'FFCBD5E1' } };

  // Map índice de col → key
  const keysByCol: string[] = [];
  for (let c = 1; c <= ws.columnCount; c++) {
    const key = (ws.getColumn(c).key ?? '') as string;
    keysByCol[c] = key;
  }

  // Filas (streaming)
  for (const r of rows) {
    const clean = nullToEmpty(r);
    for (const k of Object.keys(clean)) {
      if (dateKeys.has(k)) (clean as Record<string, any>)[k] = fmtDate(clean[k]);
      else (clean as Record<string, any>)[k] = sanitizeText(clean[k]);
    }

    const row = ws.addRow(clean);
    row.height = opts?.dataRowHeight ?? 14;

    row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
      const k: string = keysByCol[colNumber] ?? '';
      const shouldWrap: boolean = wrapSet.size ? wrapSet.has(k) : defaultWrap;
      cell.alignment = { vertical: 'middle', wrapText: shouldWrap, shrinkToFit: !shouldWrap };
      if (opts?.borders) {
        cell.border = { top: thin, left: thin, bottom: thin, right: thin };
      }
    });

    row.commit(); // IMPORTANTE en streaming
  }

  await ws.commit();
  await wb.commit(); // cierra el stream hacia res
}
