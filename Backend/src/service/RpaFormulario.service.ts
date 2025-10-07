import { QueryTypes, Op, literal, Sequelize } from 'sequelize';
import { sequelize } from '../config/databaseEnti';
import { ResultadoFila, InformeUrgenciaRow } from '../interfaces/RpaFormularario.interface';
import { convertirFecha } from '../utils/helperRPA';

export class RpaFormularioService {
  async ObtenerUrgencia(fechaIni: string, fechaTerm: string, box: 'A' | 'U' | 'M' | string): Promise<InformeUrgenciaRow[]> {
    const tipoFormu = '04';
    const fechaInicio = convertirFecha(fechaIni, false);
    const fechaFin = convertirFecha(fechaTerm, true);
    const sql = `EXEC REPORTERIA_GetInformeUrgencia @FechaInicio= :fechaInicio, @FechaFin= :fechaFin,@tipoFormu= :tipoFormu,@box= :box`;
    const resultado = await sequelize.query<InformeUrgenciaRow>(sql, {
      type: QueryTypes.SELECT,
      replacements: { fechaInicio: fechaInicio, fechaFin: fechaFin, tipoFormu: tipoFormu, box },
    });
    return resultado;
  }
  async ObtenerUrgenciaDoceHoras(fechaIni: string, fechaTerm: string): Promise<ResultadoFila[]> {
    const fechaInicio = convertirFecha(fechaIni, false);
    const fechaFin = convertirFecha(fechaTerm, true);
    const sql = `EXEC dbo.USP_UrgDoceHoras @desde=:fIni, @hasta=:fter`;
    const resultado = await sequelize.query<ResultadoFila>(sql, {
      replacements: { desde: fechaInicio, hasta: fechaFin },
      type: QueryTypes.SELECT,
    });
    return resultado;
  }
  async ObtenerCategorizadores(fecha: string): Promise<ResultadoFila[]> {
    const fechaBase = convertirFecha(fecha, false);
    const sql = `EXEC dbo.USP_UrgDoceHoras @desde=:fIni, @hasta=:fter`;
    const resultado = await sequelize.query<ResultadoFila>(sql, {
      replacements: { desde: fechaBase },
      type: QueryTypes.SELECT,
    });
    return resultado;
  }
  async ObtenerUrgenciaHospitalizado(fechaIni: string, fechaTerm: string, box: 'A' | 'U' | 'M' | string): Promise<ResultadoFila[]> {
    const fechaInicio = convertirFecha(fechaIni, false);
    const fechaFin = convertirFecha(fechaTerm, true);
    const sql = `EXEC dbo.USP_UrgDoceHoras @desde=:fIni, @hasta=:fter`;
    const resultado = await sequelize.query<ResultadoFila>(sql, {
      replacements: { desde: fechaInicio, hasta: fechaFin },
      type: QueryTypes.SELECT,
    });
    return resultado;
  }
  async ObtenerInformeIras(fechaInicio: string, fechaFin: string, box: 'A' | 'U' | 'M' | string): Promise<ResultadoFila[]> {
    const fIni = convertirFecha(fechaInicio, false);
    const fter = convertirFecha(fechaFin, true);
    const sql = `EXEC dbo.USP_UrgDoceHoras @desde=:fIni, @hasta=:fter`;
    const rows = await sequelize.query<ResultadoFila>(sql, {
      replacements: { desde: fIni, hasta: fter },
      type: QueryTypes.SELECT,
    });
    return rows;
  }
}
