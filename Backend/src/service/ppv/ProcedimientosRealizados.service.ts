import ExcelJS from 'exceljs';
import { Response } from 'express';
import { ProcedimientosRealizados } from '../../sql/PpvConsulta';
import dayjs from 'dayjs';

export class ProcedimientosRealizadosService {
  async exportarReporte(res: Response, fechaInicio: string, fechaFin: string, especialidad: string, subEspecialidad?: string) {
    const registros: any[] = await ProcedimientosRealizados(fechaInicio, fechaFin, especialidad, subEspecialidad);

    console.log('📊 Cantidad de registros:', registros.length);
    console.log('📁 Ejemplo registro:', registros[0]);

    if (!registros.length) {
      return res.status(404).json({ message: 'No se encontraron procedimientos en el rango indicado.' });
    }

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

    registros.forEach(r =>
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

    const anchoCol = [10, 30, 15, 20, 10, 8, 20, 60, 60, 60, 20, 25];
    hoja.columns.forEach((col, i) => (col.width = anchoCol[i] || 15));

    hoja.eachRow({ includeEmpty: false }, row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { wrapText: true, vertical: 'middle' };
      });
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
