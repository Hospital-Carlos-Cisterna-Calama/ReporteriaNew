import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/databaseEnti';
import { UrgenciaDoceHoraFila, InformeUrgenciaRow, UrgenciaIrasFila, UrgenciaHospOrPabFila } from '../interfaces/RpaFormularario.interface';
import { convertirFecha } from '../utils/helperRPA';

export class RpaFormularioService {
  async ObtenerUrgencia(fechaIni: string, fechaTerm: string, box: 'A' | 'U' | 'M' | string): Promise<InformeUrgenciaRow[]> {
    const tipoFormu = '04';
    const fechaInicio = convertirFecha(fechaIni, false);
    const fechaFin = convertirFecha(fechaTerm, true);
    const sql = `EXEC REPORTERIA_GetUrgenciaInforme @FechaInicio= :fechaInicio, @FechaFin= :fechaFin,@tipoFormu= :tipoFormu,@box= :box`;
    const resultados = await sequelize.query<InformeUrgenciaRow>(sql, {
      type: QueryTypes.SELECT,
      replacements: { fechaInicio: fechaInicio, fechaFin: fechaFin, tipoFormu: tipoFormu, box },
    });
    return resultados;
  }

  async ObtenerUrgenciaDoceHoras(fechaInicio: string, fechaTermino: string): Promise<UrgenciaDoceHoraFila[]> {
    const desde = convertirFecha(fechaInicio, false);
    const hasta = convertirFecha(fechaTermino, true);
    const sql = `EXEC REPORTERIA_GetUrgenciaDoceHoras @desde=:desde, @hasta=:hasta`;
    const resultados = await sequelize.query<UrgenciaDoceHoraFila>(sql, {
      replacements: { desde: desde, hasta: hasta },
      type: QueryTypes.SELECT,
    });
    return resultados;
  }

  async ObtenerCategorizadores(fecha: string): Promise<UrgenciaDoceHoraFila[]> {
    const desde = `${fecha}-01 00:00:00.000`;

    const [year, month] = fecha.split('-').map(Number);
    const ultimoDia = new Date(year, month, 0).getDate(); // Ej: 30 o 31 según el mes
    const hasta = `${fecha}-${String(ultimoDia).padStart(2, '0')} 23:59:59.997`;

    const sql = `EXEC REPORTERIA_GetUrgenciaCategorizaciones @desde=:desde, @hasta=:hasta`;
    const resultados = await sequelize.query<UrgenciaDoceHoraFila>(sql, {
      replacements: { desde, hasta },
      type: QueryTypes.SELECT,
    });
    return resultados;
  }

  async ObtenerUrgenciaHospitalizado(fechaIni: string, fechaTerm: string, tipo: 'H' | 'P' | string): Promise<UrgenciaHospOrPabFila[]> {
    const desde = convertirFecha(fechaIni, false);
    const hasta = convertirFecha(fechaTerm, true);
    const sql =
      tipo !== 'H'
        ? `EXEC REPORTERIA_GetUrgenciaPabellon @desde=:desde, @hasta=:hasta`
        : `EXEC REPORTERIA_GetUrgenciaHospitalizado @desde=:desde, @hasta=:hasta`;
    const resultados = await sequelize.query<UrgenciaHospOrPabFila>(sql, {
      replacements: { desde, hasta },
      type: QueryTypes.SELECT,
    });
    return resultados;
  }

  async ObtenerInformeIras(fechaInicio: string, fechaFin: string, tipo: 'M' | 'U' | string): Promise<UrgenciaIrasFila[]> {
    const desde = convertirFecha(fechaInicio, false);
    const hasta = convertirFecha(fechaFin, true);
    const sql = `EXEC REPORTERIA_GetUrgenciaIras @desde=:desde, @hasta=:hasta, @tipo=:tipo`;
    const resultados = await sequelize.query<UrgenciaIrasFila>(sql, {
      replacements: { desde, hasta, tipo },
      type: QueryTypes.SELECT,
    });
    return resultados;
  }
}
