import { generarArchivoExcel, convertirFecha, aFechaSqlServer } from '../../utils';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../../config/initDatabase';
import {
  generarExcelContrareferenciaConFormato,
  procesarContrareferencia,
  procesarResumenPorServicio,
  generarExcelDiagnosticosRealizados,
  procesarDiagnosticosRealizados,
} from '../../utils';
import { sequelizeHCE } from '../../config/initDatabase';
import { response, Response } from 'express';
import { servicioPdf } from '../pdf/pdf.service';

export class SiclopeService {
  async ObtenerNominaPorFecha(fechaIni: string, fechaTermino: string, rut: string, res: Response) {
    try {
      const fechaInicio103 = fechaIni;
      const fechaFin103 = fechaTermino;
      const sql = `
        EXEC PRO_HCE_RPT_ConsultaNomina
          @NOM_Fecha_Ini   = :fechaInicio,
          @NOM_Fecha_Fin   = :fechaFin,
          @NOM_CodigProfe  = :rut
      `;
      const resultados = await sequelizeHCE.query(sql, {
        replacements: { fechaInicio: fechaInicio103, fechaFin: fechaFin103, rut },
        type: QueryTypes.SELECT,
      });
      if (!resultados || (Array.isArray(resultados) && resultados.length === 0)) {
        return res.status(204).end();
      }
      const pdf = await servicioPdf.generarNominasDesdeResultados(
        resultados as any[],
        {
          periodo: { desde: fechaIni, hasta: fechaTermino },
          hospital: 'Hospital Dr. Carlos Cisternas de Calama',
          fechaImpresion: new Date().toLocaleDateString('es-CL'),
          horaImpresion: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        },
        {}
      );
      const nombreArchivo = `nominas_${rut || 'sin-rut'}_${fechaIni}_a_${fechaTermino}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
      res.setHeader('Cache-Control', 'no-store');
      return res.send(pdf);
    } catch (error: any) {
      console.error('[ObtenerNominaPorFecha] Error:', error?.parent ?? error);
      return res.status(500).json({ mensaje: 'No se pudo generar la nómina', detalle: error.message });
    }
  }

  async ObtenerListadoContrareferencia(fechaIni: string, fechaTermino: string, res: Response) {
    try {
      const fechaInicioSql = aFechaSqlServer(fechaIni, false);
      const fechaFinSql = aFechaSqlServer(fechaTermino, true);
      const sql = `exec BD_HCE..PRO_HCE_ContraReferenciasSolicitadasV2 @FechaInicio=N'${fechaInicioSql}',@FechaTermino=N'${fechaFinSql}'`;
      const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
      let resultadosDetalle = Array.isArray(result[0]) ? result[0] : result;
      if (!Array.isArray(resultadosDetalle)) resultadosDetalle = [];
      const datos = resultadosDetalle.length ? procesarContrareferencia(resultadosDetalle) : [];
      const resumenData = procesarResumenPorServicio(datos);

      return await generarExcelContrareferenciaConFormato(datos, resumenData, fechaIni, fechaTermino, res);
    } catch (error: any) {
      console.error('[ObtenerListadoContrareferenciaPlano] Error:', error?.parent ?? error);
      return res.status(500).json({ mensaje: 'No se pudo generar el Excel', detalle: error.message });
    }
  }

  async ObtenerDiagnosticosRealizados(fechaIni: string, fechaTermino: string, especialidadCode: string, res: Response) {
    try {
      const fechaInicioSql = convertirFecha(fechaIni, false);
      const fechaFinSql = convertirFecha(fechaTermino, true);
      const padreServicio = especialidadCode && especialidadCode !== '' ? especialidadCode : '%';
      const sql = `
      exec BD_HCE..getDataForReporteDiagnostico 
      @fechaInicio='${fechaInicioSql}', 
      @fechaTermino='${fechaFinSql}', 
      @padreServicio=N'${padreServicio}'
    `;
      const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
      const datos = result && Array.isArray(result) && result.length > 0 ? procesarDiagnosticosRealizados(result) : [];
      return await generarExcelDiagnosticosRealizados(datos, fechaIni, fechaTermino, res);
    } catch (error: any) {
      console.error('[ObtenerDiagnosticosRealizados] Error:', error?.parent ?? error);
      return res.status(500).json({ mensaje: 'No se pudo obtener el reporte', detalle: error.message });
    }
  }
}
