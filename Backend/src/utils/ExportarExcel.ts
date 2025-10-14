import ExcelJS from 'exceljs';
import { Response } from 'express';
import { procesarHospitalizado, procesarPabellon, anchoCabecera } from './CabeceraExcel';

export function procesarDatos(datos: any[], tipo: string) {
  return tipo === 'Pabellon' ? procesarPabellon(datos) : procesarHospitalizado(datos);
}
export function convertirFecha(dateLike: string, endOfDay = false): string {
  // Detectar si viene en formato DD/MM/YYYY
  const formatoDDMMYYYY = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateLike.match(formatoDDMMYYYY);
  let fechaISO: string;
  if (match) {
    // Convertir DD/MM/YYYY a YYYY-MM-DD
    const [, dia, mes, anio] = match;
    fechaISO = `${anio}-${mes}-${dia}`;
  } else {
    // Ya viene en formato YYYY-MM-DD o con hora
    fechaISO = dateLike;
  }
  // Si ya tiene hora, solo reemplazar T por espacio
  const hasTime = /\d{2}:\d{2}/.test(fechaISO);
  if (hasTime) return fechaISO.replace('T', ' ');
  // Agregar hora según sea inicio o fin del día
  return endOfDay ? `${fechaISO} 23:59:59.997` : `${fechaISO} 00:00:00.000`;
}

export async function generarArchivoExcel(
  datos: any[],
  res: Response,
  nombreInforme: 'IRAS' | 'Pabellón' | 'Hospitalizado' | 'Categorizaciones' | 'Urgencia' | string = 'Registros'
) {
  const workbook = new ExcelJS.Workbook();
  const hoja = workbook.addWorksheet(nombreInforme);

  if (!datos.length) {
    hoja.addRow(['No se encontraron registros en el rango seleccionado']);
  } else {
    const encabezados = Object.keys(datos[0]);
    hoja.addRow(encabezados);
    hoja.getRow(1).font = { bold: true };
    hoja.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF59ACA5' } };
    // Agregar datos en lotes para mejor rendimiento
    const batchSize = 1000;
    for (let i = 0; i < datos.length; i += batchSize) {
      const batch = datos.slice(i, i + batchSize);
      batch.forEach(fila => hoja.addRow(Object.values(fila)));
    }
    const anchoColumnas = anchoCabecera(nombreInforme);
    hoja.columns.forEach((col, i) => (col.width = anchoColumnas![i] || 15));
  }
  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader('Content-Disposition', `attachment; filename="Reporte.xlsx"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Length', buffer.byteLength);
  return res.send(buffer);
}
