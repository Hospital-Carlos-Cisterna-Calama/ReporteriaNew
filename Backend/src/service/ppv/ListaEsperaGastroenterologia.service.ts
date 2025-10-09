import { Op } from 'sequelize';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { Response } from 'express';
import { ListaEsperaGastroenterologia } from '../../sql/PpvConsulta';

export class ListaEsperaGastroenterologiaService {
  async obtenerListaEsperaGastroenterologia(fechaInicio: string, fechaFin: string, tipo: number) {
    return await ListaEsperaGastroenterologia(fechaInicio, fechaFin, tipo);
  }

  async procesarEsperaGastroenterologia(registros: any[]) {
    return registros;
  }

  async generarArchivoExcel(datos: any[], res: Response) {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Lista Espera Gastro');

    const headers = Object.keys(datos[0] || {});
    hoja.addRow(headers);

    const headerRow = hoja.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF808080' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    datos.forEach(row => hoja.addRow(Object.values(row)));

    hoja.columns.forEach(col => {
      col.width = 18;
    });

    const nombreArchivo = `Lista_Espera_Gastro_${dayjs().format('YYYYMMDD_HHmm')}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportarReporte(fechaInicio: string, fechaFin: string, tipo: number, res: Response) {
    const lista = await this.obtenerListaEsperaGastroenterologia(fechaInicio, fechaFin, tipo);
    const datos = await this.procesarEsperaGastroenterologia(lista);
    await this.generarArchivoExcel(datos, res);
  }
}
