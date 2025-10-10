import ExcelJS from 'exceljs';
import { Response } from 'express';
import { IngresosEgresos } from '../../sql/PpvConsulta';
import { convertirFecha } from '../../utils/helperRPA';
import dayjs from 'dayjs';

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

      if (registros.length === 0) {
        // Agregar fila con mensaje cuando no hay datos
        const mensajeRow = hoja.addRow(['No se encontraron datos en el rango de fechas especificado']);
        mensajeRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
        mensajeRow.getCell(1).font = { italic: true, color: { argb: 'FF666666' } };
        hoja.mergeCells(mensajeRow.number, 1, mensajeRow.number, encabezados.length);
      } else {
        // 🔹 Agregar registros al Excel
        registros.forEach((fila: any) => hoja.addRow(Object.values(fila)));
      }

      hoja.columns.forEach(col => (col.width = 20));

      // ✅ Usar buffer en vez de write(res)
      const nombreArchivo = `IngresosEgresos_${filtro}_${dayjs(fechaInicio, 'DD/MM/YYYY').format('YYYYMMDD')}_${dayjs(fechaFin, 'DD/MM/YYYY').format('YYYYMMDD')}.xlsx`;
      const buffer = await workbook.xlsx.writeBuffer();

      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Length', buffer.byteLength);
      return res.send(buffer);
    } catch (error) {
      console.error('❌ Error al generar el reporte Ingresos/Egresos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de Ingresos y Egresos.' });
    }
  }
}
