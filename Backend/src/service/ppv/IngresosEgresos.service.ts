import ExcelJS from 'exceljs';
import { Response } from 'express';
import { IngresosEgresos } from '../../sql/PpvConsulta';
import { convertirFecha } from '../../utils/helperRPA';

export class IngresosEgresosService {
  async obtenerIngresosEgresos(unidadId: number, fechaInicio: string, fechaFin: string, filtro: 'ingreso' | 'egreso') {
    // Convertir fechas DD/MM/YYYY a YYYY-MM-DD
    const inicioStr = convertirFecha(fechaInicio, false).split(' ')[0];
    const finStr = convertirFecha(fechaFin, true).split(' ')[0];
    
    return await IngresosEgresos(unidadId, inicioStr, finStr, filtro);
  }

  async exportarReporte(res: Response, unidadId: number, fechaInicio: string, fechaFin: string, filtro: 'ingreso' | 'egreso') {
    try {
      const registros = await this.obtenerIngresosEgresos(unidadId, fechaInicio, fechaFin, filtro);

      if (!registros.length) {
        res.status(404).json({ message: 'No se encontraron datos para el rango de fechas.' });
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const hoja = workbook.addWorksheet('Ingresos y Egresos');

      const encabezados = [
        'Previsión',
        'Nombre Paciente',
        'Sexo',
        'Edad',
        'RUT',
        'Teléfono',
        'Domicilio',
        'Fecha/Hora Ingreso',
        'Diag. Ingreso',
        'Apache',
        'Fecha/Hora Egreso',
        'Destino',
        'Médico',
        'Especialidad',
        'Coronario',
        'AISL',
        'Criterios I°',
        'Criterios E°',
        'LPP',
        'Caídas',
        'Error Med.',
        'Diag. Egreso',
      ];

      hoja.addRow(encabezados);

      const headerRow = hoja.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '#59ACA5' },
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      registros.forEach((fila: any) => hoja.addRow(Object.values(fila)));

      hoja.columns.forEach(col => (col.width = 20));

      const nombreArchivo = `IngresosEgresos_${filtro}_${fechaInicio}_a_${fechaFin}.xlsx`;
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('❌ Error al generar el reporte Ingresos/Egresos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de Ingresos y Egresos.' });
    }
  }
}
