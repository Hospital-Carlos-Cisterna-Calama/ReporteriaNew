import { Response } from 'express';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import { ListaEsperaGastroenterologia } from '../../sql/PpvConsulta';

export class ListaEsperaGastroenterologiaService {
  async obtenerListaEsperaGastroenterologia(fechaInicio: string, fechaFin: string, tipo_reporte: number) {
    return await ListaEsperaGastroenterologia(fechaInicio, fechaFin, tipo_reporte);
  }

  async generarArchivoExcel(datos: any[], res: Response, fechaInicio: string, fechaFin: string) {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Lista Espera Gastro');

    if (!datos.length) {
      hoja.addRow(['No se encontraron registros para el rango seleccionado']);
    } else {
      const encabezados = Object.keys(datos[0]);
      hoja.addRow(encabezados);

      hoja.getRow(1).font = { bold: true };
      hoja.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF59ACA5' },
      };

      datos.forEach(fila => hoja.addRow(Object.values(fila)));
      hoja.columns.forEach(col => (col.width = 20));
    }

    const inicioFormat = dayjs(fechaInicio).format('DD-MM-YYYY');
    const finFormat = dayjs(fechaFin).format('DD-MM-YYYY');
    const nombreArchivo = `Lista_Espera_Gastro_${inicioFormat}-${finFormat}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportarReporte(fechaInicio: string, fechaFin: string, tipo_reporte: number, res: Response) {
    const lista = await this.obtenerListaEsperaGastroenterologia(fechaInicio, fechaFin, tipo_reporte);
    await this.generarArchivoExcel(lista, res, fechaInicio, fechaFin);
  }
}
