import { QueryTypes } from 'sequelize';
import { sequelize } from '../../config/initDatabase';
import { Response } from 'express';
import { UrgenciaDoceHoraFila, InformeUrgenciaFila, UrgenciaIrasFila, UrgenciaHospPabllFila, UrgenciaCategorizacion } from '../../interfaces';
import { generarArchivoExcel, procesarDatos, convertirFecha, procesarIras, procesarCategorizadores, procesarDoceHoras, procesarUrgencia } from '../../utils';

export class UrgenciaService {
  async ObtenerUrgencia(fechaIni: string, fechaTermino: string, tipo: 'A' | 'U' | 'M' | string, res: Response) {
    const tipoFormu = '04';
    const fechaInicio = convertirFecha(fechaIni, false);
    const fechaFin = convertirFecha(fechaTermino, true);
    const sql = `EXEC REPORTERIA_URG_GetUrgenciaInforme @FechaInicio= :fechaInicio, @FechaFin= :fechaFin, @tipoFormu= :tipoFormu, @tipo= :tipo`;
    const resultadosTotales = await sequelize.query<InformeUrgenciaFila>(sql, {
      replacements: { fechaInicio, fechaFin, tipoFormu, tipo },
      type: QueryTypes.SELECT,
    });
    const mapeoCabecera = procesarUrgencia(resultadosTotales);
    return await generarArchivoExcel(mapeoCabecera, res, 'Urgencia');
  }

  async ObtenerUrgenciaDoceHoras(fechaInicio: string, fechaFin: string, res: Response) {
    const desde = convertirFecha(fechaInicio, false);
    const hasta = convertirFecha(fechaFin, true);
    const sql = `EXEC REPORTERIA_URG_GetUrgenciaDoceHoras @desde=:desde, @hasta=:hasta`;
    const resultados = await sequelize.query<UrgenciaDoceHoraFila>(sql, { replacements: { desde, hasta }, type: QueryTypes.SELECT });
    const mapeoCabecera = procesarDoceHoras(resultados);
    return await generarArchivoExcel(mapeoCabecera, res, 'DoceHoras');
  }

  async ObtenerCategorizadores(fechaInicio: string, res: Response) {
    const desde = `${fechaInicio}-01 00:00:00.000`;
    const [year, month] = fechaInicio.split('-').map(Number);
    const ultimoDia = new Date(year, month, 0).getDate();
    const hasta = `${fechaInicio}-${String(ultimoDia).padStart(2, '0')} 23:59:59.997`;
    const sql = `EXEC REPORTERIA_URG_GetUrgenciaCategorizaciones @desde=:desde, @hasta=:hasta`;
    const resultados = await sequelize.query<UrgenciaCategorizacion>(sql, { replacements: { desde, hasta }, type: QueryTypes.SELECT });
    const mapeoCabecera = procesarCategorizadores(resultados);
    return await generarArchivoExcel(mapeoCabecera, res, 'Categorizaciones');
  }

  async ObtenerUrgenciaHospitalizado(fechaInicio: string, fechaFin: string, tipo: 'H' | 'P' | string, res: Response) {
    const desde = convertirFecha(fechaInicio, false);
    const hasta = convertirFecha(fechaFin, true);
    const sql = `EXEC REPORTERIA_URG_GetUrgencia${tipo !== 'H' ? 'Pabellon' : 'Hospitalizado'} @desde=:desde, @hasta=:hasta`;
    const resultados = await sequelize.query<UrgenciaHospPabllFila>(sql, { replacements: { desde, hasta }, type: QueryTypes.SELECT });
    const mapeoCabecera = procesarDatos(resultados, tipo !== 'H' ? 'Pabellon' : 'Hospitalizado');
    return await generarArchivoExcel(mapeoCabecera, res, tipo !== 'H' ? 'Pabellón' : 'Hospitalizado');
  }

  async ObtenerInformeIras(fechaInicio: string, fechaFin: string, tipo: 'M' | 'U' | string, res: Response) {
    const desde = convertirFecha(fechaInicio, false);
    const hasta = convertirFecha(fechaFin, true);
    const sql = `EXEC REPORTERIA_URG_GetUrgenciaIras @desde=:desde, @hasta=:hasta, @tipo=:tipo`;
    const resultados = await sequelize.query<UrgenciaIrasFila>(sql, { replacements: { desde, hasta, tipo }, type: QueryTypes.SELECT });
    const mapeoCabecera = procesarIras(resultados);
    return await generarArchivoExcel(mapeoCabecera, res, 'IRAS');
  }
}
