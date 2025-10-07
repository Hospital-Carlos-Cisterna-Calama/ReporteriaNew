// src/utils/excel.ts
import ExcelJS from 'exceljs';

export type ColDef<T> = { header: string; key: keyof T | string; width?: number };

export function fmtDate(val: unknown): string {
  if (!val) return '';
  // Acepta Date o string(iso) y devuelve "dd/mm/yyyy HH:mm"
  const d = val instanceof Date ? val : new Date(String(val));
  if (isNaN(d.getTime())) return String(val);
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

export function autoFit(worksheet: ExcelJS.Worksheet) {
  worksheet.columns?.forEach(col => {
    let max = 10;
    if (typeof col.eachCell === 'function') {
      col.eachCell({ includeEmpty: true }, cell => {
        const v = cell.value ?? '';
        const len = typeof v === 'string' ? v.length : String(v).length;
        if (len > max) max = len;
      });
    }
    col.width = Math.min(Math.max(max + 2, 10), 60);
  });
}

export function styleHeader(worksheet: ExcelJS.Worksheet) {
  const header = worksheet.getRow(1);
  header.font = { bold: true };
  header.alignment = { vertical: 'middle' };
}

export async function buildSheet<T extends Record<string, any>>(
  wb: ExcelJS.Workbook,
  sheetName: string,
  columns: ColDef<T>[],
  rows: T[],
  opts?: { dateKeys?: (keyof T | string)[] }
) {
  const ws = wb.addWorksheet(sheetName);
  ws.columns = columns.map(c => ({ header: c.header, key: c.key as string, width: c.width ?? 15 }));

  const dateKeys = new Set((opts?.dateKeys ?? []).map(String));

  rows.forEach(r => {
    const clean = nullToEmpty(r);
    // Formatear fechas en claves definidas
    for (const k of Object.keys(clean)) {
      if (dateKeys.has(k)) (clean as Record<string, any>)[k] = fmtDate(clean[k]);
    }
    ws.addRow(clean);
  });

  styleHeader(ws);
  autoFit(ws);
  return ws;
}

export async function sendWorkbook(res: import('express').Response, wb: ExcelJS.Workbook, filename: string) {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await wb.xlsx.write(res);
  res.end();
}
