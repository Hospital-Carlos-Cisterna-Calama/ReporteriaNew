import dayjs from 'dayjs';
import { Response } from 'express';
import { Sequelize, QueryTypes } from 'sequelize';
import { sequelize } from '../../config/initDatabase';
import { convertirFecha } from '../../utils/helperRPA';

export class IrGrdService {
  async obtenerIrGrd(fechaInicio: string, fechaFin: string) {
    // Convertir fechas DD/MM/YYYY a YYYY-MM-DD y luego a DD-MM-YYYY para el SP
    const inicioStr = convertirFecha(fechaInicio, false).split(' ')[0];
    const finStr = convertirFecha(fechaFin, true).split(' ')[0];
    
    const finic = dayjs(inicioStr).format('DD-MM-YYYY');
    const ftermin = dayjs(finStr).format('DD-MM-YYYY');

    const resultados = await sequelize.query('EXEC IR_GRD_PAC_Datost_JUN2020 :finic, :ftermin', {
      replacements: { finic, ftermin },
      type: QueryTypes.SELECT,
    });

    return resultados;
  }

  async procesarIrGrd(datos: any[]) {
    const encabezado =
      'HOSPITAL|HISTORIA|EPISODIO|FECNAC|SEXO|FECING|TIPING|REGCON_01|ETNIA|DIST_PAC|MRES|PAIS|FECALT|TIPALT|SERVING|SERVALT|TIPO_CIP|ESPECIALIDAD|SERVICIO_SALUD|FEC_INT_1|FECPART|TGESTAC|RN_PESO_01|RN_SEXO_01|RN_PESO_02|RN_SEXO_02|RN_PESO_03|RN_SEXO_03|RN_PESO_04|RN_SEXO_04|TRASHOSPITAL|PROCHOSPITAL|MEDICOALT|CIP|PROC|TIPO_ACTIVIDAD|RN_EST_01|RN_EST_02|RN_EST_03|RN_EST_04|ESTADO|NOMBRE|APELLIDO1|APELLIDO2|PROGRAMA|RN_COND_ING_01|RN_COND_ING_02|RN_COND_ING_03|RN_COND_ING_04|CUMPLIMENTACION|MED_INT_1|ESPINT|TIP_PAB|TRAS_FEC_01|TRAS_SRV_01|TRAS_FEC_02|TRAS_SRV_02|TRAS_FEC_03|TRAS_SRV_03|TRAS_FEC_04|TRAS_SRV_04|TRAS_FEC_05|TRAS_SRV_05|TRAS_FEC_06|TRAS_SRV_06|TRAS_FEC_07|TRAS_SRV_07|TRAS_FEC_08|TRAS_SRV_08|TRAS_FEC_09|TRAS_SRV_09|TRAS_FEC_10|TRAS_SRV_10|FEC_URGENCIAS|OCUPACION|CAT_OCP\n';

    let cuerpo = '';

    for (const d of datos) {
      const fila = [
        d.HOSPITAL,
        d.HISTORIA,
        d.EPISODIO,
        d.FECNAC,
        d.SEXO,
        d.FECING,
        d.TIPING,
        d.REGCON_01,
        d.ETNIA,
        d.DIST_PAC,
        d.MRES,
        d.PAIS,
        d.FECALT,
        d.TIPALT,
        d.SERVING,
        d.SERVALT,
        d.TIPO_CIP,
        d.ESPECIALIDAD,
        d.SERVICIO_SALUD,
        d.FEC_INT_1,
        d.FECPART,
        d.TGESTAC,
        d.RN_PESO_01,
        d.RN_SEXO_01,
        d.RN_PESO_02,
        d.RN_SEXO_02,
        d.RN_PESO_03,
        d.RN_SEXO_03,
        d.RN_PESO_04,
        d.RN_SEXO_04,
        d.TRASHOSPITAL,
        d.PROCHOSPITAL,
        d.MEDICOALT,
        d.CIP,
        d.PROC,
        d.TIPO_ACTIVIDAD,
        d.RN_EST_01,
        d.RN_EST_02,
        d.RN_EST_03,
        d.RN_EST_04,
        d.ESTADO,
        d.NOMBRE,
        d.APELLIDO1,
        d.APELLIDO2,
        d.PROGRAMA,
        d.RN_COND_ING_01,
        d.RN_COND_ING_02,
        d.RN_COND_ING_03,
        d.RN_COND_ING_04,
        d.CUMPLIMENTACION,
        d.MED_INT_1,
        d.ESPINT,
        d.TIP_PAB,
        d.TRAS_FEC_01,
        d.TRAS_SRV_01,
        d.TRAS_FEC_02,
        d.TRAS_SRV_02,
        d.TRAS_FEC_03,
        d.TRAS_SRV_03,
        d.TRAS_FEC_04,
        d.TRAS_SRV_04,
        d.TRAS_FEC_05,
        d.TRAS_SRV_05,
        d.TRAS_FEC_06,
        d.TRAS_SRV_06,
        d.TRAS_FEC_07,
        d.TRAS_SRV_07,
        d.TRAS_FEC_08,
        d.TRAS_SRV_08,
        d.TRAS_FEC_09,
        d.TRAS_SRV_09,
        d.TRAS_FEC_10,
        d.TRAS_SRV_10,
        d.FEC_URGENCIAS,
        d.OCUPACION,
        d.CAT_OCP,
      ]
        .map(v => (v ?? '').toString().trim())
        .join('|');

      cuerpo += fila + '\n';
    }

    return encabezado + cuerpo;
  }

  async generarArchivoTxt(fechaInicio: string, fechaFin: string) {
    const datos = await this.obtenerIrGrd(fechaInicio, fechaFin);
    const contenido = await this.procesarIrGrd(datos);
    const nombreArchivo = `IR-GRD ${dayjs(fechaInicio).format('DD-MM-YYYY')} - ${dayjs(fechaFin).format('DD-MM-YYYY')}.txt`;

    return { nombreArchivo, contenido };
  }

  async exportarTxt(res: Response, fechaInicio: string, fechaFin: string) {
    const { nombreArchivo, contenido } = await this.generarArchivoTxt(fechaInicio, fechaFin);

    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');
    res.send(contenido);
  }
}
