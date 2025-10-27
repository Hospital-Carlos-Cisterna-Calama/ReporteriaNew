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
  nombreInforme: 'IRAS' | 'Pabellón' | 'Hospitalizado' | 'Categorizaciones' | 'Urgencia' | 'DATOS' | string = 'Registros'
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

export async function generarExcelContrareferenciaConFormato(
  datos: any[],
  resumenInput: { Especialidad: string; ConsultaNueva: number; ConsultaAlta: number }[],
  fechaIni: string,
  fechaFin: string,
  res: Response
) {
  const workbook = new ExcelJS.Workbook();

  const hojaDatos = workbook.addWorksheet('DATOS');
  hojaDatos.addRow([]);
  hojaDatos.mergeCells('A2:I2');
  hojaDatos.getCell('A2').value = `Contrarreferencias Realizadas entre ${fechaIni} a ${fechaFin}`;
  hojaDatos.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF59ACA5' } };
  hojaDatos.getCell('A2').font = { bold: true, color: { argb: 'FFFFFFFF' } };
  hojaDatos.mergeCells('B4:C4');
  hojaDatos.getCell('B4').value = 'Paciente';
  hojaDatos.getCell('B4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF59ACA5' } };
  hojaDatos.getCell('B4').font = { bold: true, color: { argb: 'FFFFFFFF' } };
  hojaDatos.addRow(['Especialidad', 'Nombre', 'Rut', 'Procedencia', 'Medico', 'Fecha Citacion', 'Fecha Alta', 'Diagnostico', 'Tipo de Contrareferencia']);
  hojaDatos.columns = [{ width: 30 }, { width: 25 }, { width: 18 }, { width: 25 }, { width: 25 }, { width: 18 }, { width: 18 }, { width: 30 }, { width: 22 }];
  hojaDatos.getRow(5).eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF59ACA5' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  // Agregar filas con bordes
  let rowDatosIdx = 6;
  datos.forEach(d => {
    hojaDatos.addRow([
      d.Especialidad || '',
      d.Nombre || '',
      d.Rut || '',
      d.Procedencia || '',
      d.Medico || '',
      d.Fecha_Citacion || '',
      d.Fecha_Alta || '',
      d.Diagnostico || '',
      d.Tipo_de_Contrareferencia || '',
    ]);
    hojaDatos.getRow(rowDatosIdx).eachCell(cell => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    rowDatosIdx++;
  });
  hojaDatos.autoFilter = {
    from: 'A5',
    to: 'I5',
  };

  // Generar resumen por servicio aquí
  const resumenMap = new Map<string, { ConsultaNueva: number; ConsultaAlta: number }>();
  datos.forEach(d => {
    const especialidad = d.Especialidad || '';
    const tipo = d.Tipo_de_Contrareferencia || '';
    if (!especialidad || especialidad.trim().toUpperCase() === 'SIN ESPECIALIDAD') return; // Omitir sin especialidad
    if (!resumenMap.has(especialidad)) {
      resumenMap.set(especialidad, { ConsultaNueva: 0, ConsultaAlta: 0 });
    }
    if (tipo === 'CONSULTA NUEVA') resumenMap.get(especialidad)!.ConsultaNueva += 1;
    if (tipo === 'CONSULTA DE ALTA') resumenMap.get(especialidad)!.ConsultaAlta += 1;
  });
  const resumen = Array.from(resumenMap.entries()).map(([Especialidad, valores]) => ({
    Especialidad,
    ConsultaNueva: valores.ConsultaNueva,
    ConsultaAlta: valores.ConsultaAlta,
  }));

  // Calcular totales
  const totalNueva = resumen.reduce((acc, r) => acc + r.ConsultaNueva, 0);
  const totalAlta = resumen.reduce((acc, r) => acc + r.ConsultaAlta, 0);

  const hojaResumen = workbook.addWorksheet('RESUMEN POR SERVICIO');
  hojaResumen.addRow(['Especialidad', 'CONSULTA NUEVA', 'CONSULTA DE ALTA']);
  // Aumentar ancho de columnas
  hojaResumen.columns = [
    { width: 30 }, // Especialidad
    { width: 20 }, // CONSULTA NUEVA
    { width: 20 }, // CONSULTA DE ALTA
  ];
  hojaResumen.getRow(1).eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF59ACA5' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  // Agregar filas con formato de tabla (bordes)
  let rowIdx = 2;
  resumen.forEach(r => {
    hojaResumen.addRow([r.Especialidad ?? '', r.ConsultaNueva ?? '', r.ConsultaAlta ?? '']);
    hojaResumen.getRow(rowIdx).eachCell(cell => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    rowIdx++;
  });
  // Agregar fila de totales con formato
  hojaResumen.addRow(['TOTAL', totalNueva, totalAlta]);
  hojaResumen.getRow(rowIdx).eachCell(cell => {
    cell.font = { bold: true };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  hojaResumen.autoFilter = {
    from: 'A1',
    to: 'C1',
  };

  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader('Content-Disposition', `attachment; filename="Contrarreferencias.xlsx"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Length', buffer.byteLength);
  return res.send(buffer);
}

export function aFechaSqlServer(fecha: string, finDelDia = false): string {
  if (/\d{2}\/\d{2}\/\d{4}/.test(fecha)) {
    return finDelDia ? `${fecha} 23:59:59` : `${fecha} 00:00:00`;
  }
  if (/\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [anio, mes, dia] = fecha.split('-');
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    return finDelDia ? `${fechaFormateada} 23:59:59` : `${fechaFormateada} 00:00:00`;
  }
  return fecha;
}

export async function generarExcelDiagnosticosRealizados(datos: any[], fechaIni: string, fechaFin: string, res: Response) {
  const workbook = new ExcelJS.Workbook();
  const hoja = workbook.addWorksheet('Diagnósticos Realizados');

  hoja.addRow([]);
  hoja.mergeCells('A2:L2');
  hoja.getCell('A2').value = `Diagnósticos Realizados entre ${fechaIni} a ${fechaFin}`;
  hoja.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF59ACA5' } };
  hoja.getCell('A2').font = { bold: true, color: { argb: 'FFFFFFFF' } };

  hoja.addRow([
    'Rut Médico',
    'Nombre Médico',
    'Policlínico',
    'Fecha Citación',
    'Rut Paciente',
    'Nombre Paciente',
    'Edad Paciente',
    'Sexo Paciente',
    'Nacionalidad Paciente',
    'Comuna Paciente',
    'Diagnóstico',
    'Atención Presencial',
  ]);
  hoja.columns = [
    { width: 18 }, // Rut Médico
    { width: 25 }, // Nombre Médico
    { width: 22 }, // Policlínico
    { width: 18 }, // Fecha Citación
    { width: 18 }, // Rut Paciente
    { width: 25 }, // Nombre Paciente
    { width: 10 }, // Edad Paciente
    { width: 10 }, // Sexo Paciente
    { width: 18 }, // Nacionalidad Paciente
    { width: 18 }, // Comuna Paciente
    { width: 30 }, // Diagnóstico
    { width: 18 }, // Atención Presencial
  ];
  hoja.getRow(3).eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF59ACA5' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });

  // Agregar filas con bordes
  let rowDatosIdx = 4;
  datos.forEach(d => {
    hoja.addRow([
      d.Rut_Medico || '',
      d.Nombre_Medico || '',
      d.Policlínico || '',
      d.Fecha_Citacion || '',
      d.Rut_Paciente || '',
      d.Nombre_Paciente || '',
      d.Edad_Paciente || '',
      d.Sexo_Paciente || '',
      d.Nacionalidad_Paciente || '',
      d.Comuna_Paciente || '',
      d.Diagnostico || '',
      d.Atencion_Presencial || '',
    ]);
    hoja.getRow(rowDatosIdx).eachCell(cell => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    rowDatosIdx++;
  });
  hoja.autoFilter = {
    from: 'A3',
    to: 'L3',
  };
  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader('Content-Disposition', `attachment; filename="DiagnosticosRealizados.xlsx"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Length', buffer.byteLength);
  return res.send(buffer);
}
