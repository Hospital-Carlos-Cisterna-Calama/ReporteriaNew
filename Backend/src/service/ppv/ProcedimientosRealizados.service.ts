import ExcelJS from 'exceljs';
import { Response } from 'express';
import { ProcedimientosRealizados } from '../../sql/PpvConsulta';
import { convertirFecha } from '../../utils/helperRPA';
import dayjs from 'dayjs';

export class ProcedimientosRealizadosService {
  async exportarReporte(res: Response, fechaInicio: string, fechaFin: string, especialidad: string, subEspecialidad?: string) {
    // Convertir fechas DD/MM/YYYY a YYYY-MM-DD
    const inicioStr = convertirFecha(fechaInicio, false).split(' ')[0];
    const finStr = convertirFecha(fechaFin, true).split(' ')[0];

    const registros: any[] = await ProcedimientosRealizados(inicioStr, finStr, especialidad, subEspecialidad);

    console.log('📊 Cantidad de registros:', registros.length);
    console.log('📁 Ejemplo registro:', registros[0]);

    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Procedimientos Realizados');

    const encabezados = [
      'Folio',
      'Nombre Paciente',
      'RUT',
      'Etnia',
      'Sexo',
      'Edad',
      'Previsión',
      'Informe',
      'Hallazgo',
      'Conclusión',
      'Especialidad',
      'SubEspecialidad',
    ];

    hoja.addRow(encabezados);

    const headerRow = hoja.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    if (registros.length === 0) {
      // Agregar fila con mensaje cuando no hay datos
      const mensajeRow = hoja.addRow(['No se encontraron procedimientos en el rango de fechas especificado']);
      mensajeRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
      mensajeRow.getCell(1).font = { italic: true, color: { argb: 'FF666666' } };
      hoja.mergeCells(mensajeRow.number, 1, mensajeRow.number, encabezados.length);
    } else {
      // Agregar filas en lotes para mejor rendimiento
      const batchSize = 1000;
      for (let i = 0; i < registros.length; i += batchSize) {
        const batch = registros.slice(i, i + batchSize);
        batch.forEach(r =>
          hoja.addRow([
            r.Folio,
            r.Nombre_Paciente,
            r.RUT,
            r.Etnia,
            r.Sexo,
            r.Edad,
            r.Prevision,
            r.Informe,
            r.Hallazgo,
            r.Conclusion,
            r.Especialidad,
            r.Sub_Especialidad,
          ])
        );
      }
    }

    const anchoCol = [10, 30, 15, 20, 10, 8, 20, 60, 60, 60, 20, 25];
    hoja.columns.forEach((col, i) => (col.width = anchoCol[i] || 15));

    // ✅ Aplicar bordes solo al encabezado para mejor rendimiento
    headerRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    hoja.views = [{ state: 'frozen', ySplit: 1 }];

    // ✅ Usar buffer en vez de write(res)
    const nombreArchivo = `Procedimientos_${dayjs(fechaInicio).format('YYYYMMDD')}_${dayjs(fechaFin).format('YYYYMMDD')}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Length', buffer.byteLength);
    return res.send(buffer);
  }
}
