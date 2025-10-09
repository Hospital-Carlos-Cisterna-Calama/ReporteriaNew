import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/initDatabase';
import {
  UrgenciaDoceHoraFila,
  InformeUrgenciaFila,
  UrgenciaIrasFila,
  UrgenciaHospPabllFila,
  UrgenciaCategorizacion,
} from '../interfaces/RpaFormularario.interface';
import { convertirFecha } from '../utils/helperRPA';

export class RpaFormularioService {
  async ObtenerUrgencia(fechaIni: string, fechaTerm: string, tipo: 'A' | 'U' | 'M' | string): Promise<InformeUrgenciaFila[]> {
    const tipoFormu = '04';
    const fechaInicio = convertirFecha(fechaIni, false);
    const fechaFin = convertirFecha(fechaTerm, true);
    const sql = `EXEC REPORTERIA_URG_GetUrgenciaInforme @FechaInicio= :fechaInicio, @FechaFin= :fechaFin,@tipoFormu= :tipoFormu,@tipo= :tipo`;
    const resultados = await sequelize.query<InformeUrgenciaFila>(sql, {
      type: QueryTypes.SELECT,
      replacements: { fechaInicio, fechaFin, tipoFormu, tipo },
    });
    return resultados;
  }

  async ObtenerUrgenciaDoceHoras(fechaInicio: string, fechaTermino: string): Promise<UrgenciaDoceHoraFila[]> {
    const desde = convertirFecha(fechaInicio, false);
    const hasta = convertirFecha(fechaTermino, true);
    const sql = `EXEC REPORTERIA_URG_GetUrgenciaDoceHoras @desde=:desde, @hasta=:hasta`;
    const resultados = await sequelize.query<UrgenciaDoceHoraFila>(sql, {
      replacements: { desde, hasta },
      type: QueryTypes.SELECT,
    });
    return resultados;
  }

  async ObtenerCategorizadores(fecha: string): Promise<UrgenciaCategorizacion[]> {
    const desde = `${fecha}-01 00:00:00.000`;
    const [year, month] = fecha.split('-').map(Number);
    const ultimoDia = new Date(year, month, 0).getDate();
    const hasta = `${fecha}-${String(ultimoDia).padStart(2, '0')} 23:59:59.997`;
    const sql = `EXEC REPORTERIA_URG_GetUrgenciaCategorizaciones @desde=:desde, @hasta=:hasta`;
    const resultados = await sequelize.query<UrgenciaCategorizacion>(sql, {
      replacements: { desde, hasta },
      type: QueryTypes.SELECT,
    });
    return resultados;
  }

  async ObtenerUrgenciaHospitalizado(fechaIni: string, fechaTerm: string, tipo: 'H' | 'P' | string): Promise<UrgenciaHospPabllFila[]> {
    const desde = convertirFecha(fechaIni, false);
    const hasta = convertirFecha(fechaTerm, true);
    const sql =
      tipo !== 'H'
        ? `EXEC REPORTERIA_URG_GetUrgenciaPabellon @desde=:desde, @hasta=:hasta`
        : `EXEC REPORTERIA_URG_GetUrgenciaHospitalizado @desde=:desde, @hasta=:hasta`;
    const resultados = await sequelize.query<UrgenciaHospPabllFila>(sql, {
      replacements: { desde, hasta },
      type: QueryTypes.SELECT,
    });
    return resultados;
  }

  async ObtenerInformeIras(fechaInicio: string, fechaFin: string, tipo: 'M' | 'U' | string): Promise<UrgenciaIrasFila[]> {
    const desde = convertirFecha(fechaInicio, false);
    const hasta = convertirFecha(fechaFin, true);
    const sql = `EXEC REPORTERIA_URG_GetUrgenciaIras @desde=:desde, @hasta=:hasta, @tipo=:tipo`;
    const resultados = await sequelize.query<UrgenciaIrasFila>(sql, {
      replacements: { desde, hasta, tipo },
      type: QueryTypes.SELECT,
    });
    return resultados;
  }
}
