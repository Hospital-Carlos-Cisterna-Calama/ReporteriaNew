import { QueryTypes } from 'sequelize';
import { sequelize } from '../../config/initDatabase';
import { Response } from 'express';
import { generarExcelContrareferenciaConFormato, procesarContrareferencia, procesarResumenPorServicio } from '../../utils';

export class SiclopeService {
  async ObtenerNominaPorFecha(fechaIni: string, fechaTermino: string, rut: string, res: Response) {}

  async ObtenerListadoContrareferencia(fechaIni: string, fechaTermino: string, res: Response) {
    // Convertir fechas a formato DD/MM/YYYY HH:mm:ss
    function toSqlDateTime(dateStr: string, endOfDay = false) {
      // Si ya tiene hora, solo cambiar formato
      if (/\d{2}\/\d{2}\/\d{4}/.test(dateStr)) {
        // Si viene DD/MM/YYYY, agregar hora
        return endOfDay ? `${dateStr} 23:59:59` : `${dateStr} 00:00:00`;
      }
      if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        // YYYY-MM-DD a DD/MM/YYYY
        const [y, m, d] = dateStr.split('-');
        const fecha = `${d}/${m}/${y}`;
        return endOfDay ? `${fecha} 23:59:59` : `${fecha} 00:00:00`;
      }
      return dateStr;
    }

    const fechaInicioSql = toSqlDateTime(fechaIni, false);
    const fechaFinSql = toSqlDateTime(fechaTermino, true);
    const sql = `exec BD_HCE..PRO_HCE_ContraReferenciasSolicitadasV2 @FechaInicio=N'${fechaInicioSql}',@FechaTermino=N'${fechaFinSql}'`;
    const result = await sequelize.query(sql);
    const resultadosDetalle = Array.isArray(result[0][0]) ? result[0][0] : result[0];
    const resultadosResumen = Array.isArray(result[0][1]) ? result[0][1] : [];

    const datos = procesarContrareferencia(resultadosDetalle);
    const resumen = procesarResumenPorServicio(resultadosResumen);

    return await generarExcelContrareferenciaConFormato(datos, resumen, fechaInicioSql, fechaFinSql, res);
  }

  async ObtenerDiagnosticosRealizados(fechaIni: string, fechaTermino: string, especialidad: string, res: Response) {}
}
