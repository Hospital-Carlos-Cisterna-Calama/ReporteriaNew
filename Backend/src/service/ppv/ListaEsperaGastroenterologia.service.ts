import { Op } from 'sequelize';
import  Prestacion  from '../../models/BdCorporativa/PrePrestacion';
import  SolicitudPrestacion  from '../../models/BdPpv/SolicitudPrestacion';
import  Paciente  from '../../models/BdCorporativa/Paciente';
import dayjs from 'dayjs';
import { Response } from 'express';

export class ListaEsperaGastroenterologiaService {
  async obtenerListaEsperaGastroenterologia(fechaInicio: Date, fechaFin: Date, tipo: number) {
    const filtroFechas =
      tipo === 1 ? { fecha_solicitud: { [Op.between]: [fechaInicio, fechaFin] } } : { fecha_realizacion: { [Op.between]: [fechaInicio, fechaFin] } };

    const prestaciones = await Prestacion.findAll({
      where: { ...filtroFechas },
      include: [
        {
          model: SolicitudPrestacion,
          as: 'solicitud',
          where: {
            vigencia: 0,
            estado: 1,
            prestacion: { [Op.in]: ['18-01-006', '18-01-001'] },
          },
          include: [
            {
              model: Paciente,
              as: 'paciente',
              required: true,
            },
          ],
        },
      ],
      order: [['fecha_solicitud', 'ASC']],
    });

    return prestaciones;
  }

  async procesarEsperaGastroenterologia(prestaciones: any[]) {
    return prestaciones.map((p: any) => {
      const pac = p.solicitud?.paciente;

      return {
        SERV_SALUD: '03',
        RUN: pac?.PAC_PAC_Rut?.slice(0, 8) ?? '',
        DV: pac?.PAC_PAC_Rut?.slice(-1) ?? '',
        NOMBRES: pac?.PAC_PAC_Nombre ?? '',
        PRIMER_APELLIDO: pac?.PAC_PAC_ApellPater ?? '',
        SEGUNDO_APELLIDO: pac?.PAC_PAC_ApellMater ?? '',
        FECHA_NAC: dayjs(pac?.PAC_PAC_FechaNacim).format('DD/MM/YYYY'),
        SEXO: pac?.PAC_PAC_Sexo?.trim() === 'M' ? '1' : '2',
        PREVISION: pac?.PAC_PAC_Prevision?.trim() === 'F' ? '1' : pac?.PAC_PAC_Prevision?.trim() === 'P' ? '2' : '3',
        TIPO_PREST: '3',
        PRESTA_MIN: p.prestacion,
        PLANO: '',
        EXTREMIDAD: '',
        PRESTA_EST:
          p.prestacion === '18-01-001'
            ? 'Gastroduodenoscopía (incluye esofagoscopía)'
            : p.prestacion === '18-01-006'
              ? 'Colonoscopía larga incluye sigmoidoscopía y colonoscopía izquierdo'
              : '-',
        F_ENTRADA: dayjs(p.solicitud?.fecha_solicitud).format('DD/MM/YYYY'),
        ESTAB_ORIG: p.solicitud?.estaSolicitud ?? '',
        ESTAB_DEST: '103101',
        F_SALIDA: dayjs(p.fecha_realizacion).format('DD/MM/YYYY'),
        C_SALIDA: '',
        E_OTOR_AT: '103101',
        PRESTA_MIN_SALIDA: p.prestacion,
        PRAIS: pac?.PAC_PAC_Prais ?? '',
        REGION: pac?.PAC_PAC_CiudaHabit ?? '',
        COMUNA: p.solicitud?.comuna ?? '',
        SOSPECHA_DIAG: p.diagnostico ?? '',
        CONFIR_DIAG: '',
        CIUDAD: 'Calama',
        COND_RURALIDAD: '01',
        VIA_DIRECCION: '09',
        NOM_CALLE: '',
        NUM_DIRECCION: '',
        RESTO_DIRECCION: pac?.PAC_PAC_DireccionGralHabit ?? '',
        FONO_FIJO: pac?.PAC_PAC_Fono ?? '',
        FONO_MOVIL: pac?.PAC_PAC_TelefonoMovil ?? '',
        EMAIL: '',
        F_CITACION: '',
        RUN_PROF_SOL: '',
        DV_PROF_SOL: '',
        RUN_PROF_RESOL: '',
        DV_PROF_RESOL: '',
        ID_LOCAL: '',
        RESULTADO: '',
        SIGTE_ID: '',
      };
    });
  }

  async generarArchivoExcel(datos: any[], res: Response) {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Lista Espera Gastro');

//     const headers = Object.keys(datos[0] || {});
//     hoja.addRow(headers);

    hoja.getRow(1).font = { bold: true };
    hoja.getRow(1).fill = {
      type: 'gradient',
      gradient: 'angle',
      degree: 90,
      stops: [
        { position: 0, color: { argb: 'FFA0A0A0' } },
        { position: 1, color: { argb: 'FFFFFFFF' } },
      ],
    };

    datos.forEach(fila => hoja.addRow(Object.values(fila)));
    hoja.columns.forEach((col: Partial<(typeof hoja.columns)[0]>) => {
      col.width = 18;
    });

//     const nombreArchivo = `Lista_Espera_Gastro_${dayjs().format('YYYYMMDD_HHmm')}.xlsx`;

//     res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

//     await workbook.xlsx.write(res);
//     res.end();
//   }

  async exportarReporte(fechaInicio: Date, fechaFin: Date, tipo: number, res: Response) {
    const lista = await this.obtenerListaEsperaGastroenterologia(fechaInicio, fechaFin, tipo);
    const datosProcesados = await this.procesarEsperaGastroenterologia(lista);
    await this.generarArchivoExcel(datosProcesados, res);
  }
}
