import { Op, QueryTypes } from 'sequelize';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import { Response } from 'express';
import { sequelize } from '../../config/initDatabase';
import CamasCritica from '../../models/BdPpv/CamasCriticas';
import { IPacienteEnti, IProfesionalEnti, IEspecialidadEnti } from '../../interfaces/Ppv.interface';

export class IngresosEgresosService {
  async obtenerIngresosEgresos(unidadId: number, fechaInicio: string, fechaFin: string, filtro: 'ingreso' | 'egreso') {
    const condicionFecha =
      filtro === 'ingreso'
        ? {
            date_ingreso: {
              [Op.between]: [dayjs(fechaInicio).startOf('day').toDate(), dayjs(fechaFin).endOf('day').toDate()],
            },
          }
        : {
            date_egreso: {
              [Op.between]: [dayjs(fechaInicio).startOf('day').toDate(), dayjs(fechaFin).endOf('day').toDate()],
            },
          };

    const registros = await CamasCritica.findAll({
      where: { unidad_id: unidadId, estado: 0, ...condicionFecha },
      raw: true,
      nest: true,
      order: [[filtro === 'ingreso' ? 'date_ingreso' : 'date_egreso', 'ASC']],
    });

    return registros;
  }

  async enriquecerDatosConEnti(registros: any[]) {
    if (!registros.length) return [];

    const especialidades = [...new Set(registros.map(r => r.especialidad_medico).filter(Boolean))];
    const rutMedicos = [...new Set(registros.map(r => r.medico_responsable).filter(Boolean))];
    const rutPacientes = [...new Set(registros.map(r => r.rut_paciente).filter(Boolean))];

    const [medicos = []] = await sequelize.query<IProfesionalEnti[]>(
      `
  SELECT SER_PRO_Rut, SER_PRO_Nombres, SER_PRO_ApellPater, SER_PRO_ApellMater
  FROM SerProfesional
  WHERE SER_PRO_Rut IN (:rutMedicos)
  `,
      {
        replacements: { rutMedicos },
        type: QueryTypes.SELECT,
      }
    );

    const [especialidadesEnti = []] = await sequelize.query<IEspecialidadEnti[]>(
      `
  SELECT SER_SER_CodigoIfl, SER_SER_DescripcioIfl
  FROM SerServiciosAuge
  WHERE SER_SER_CodigoIfl IN (:especialidades)
  `,
      {
        replacements: { especialidades },
        type: QueryTypes.SELECT,
      }
    );

    const [pacientes = []] = await sequelize.query<IPacienteEnti[]>(
      `
  SELECT PAC_PAC_Rut, PAC_PAC_Nombre, PAC_PAC_ApellPater, PAC_PAC_ApellMater,
         PAC_PAC_Sexo, PAC_PAC_FechaNacim, PAC_PAC_Prevision,
         PAC_PAC_TelefonoMovil, PAC_PAC_Fono, PAC_PAC_DireccionGralHabit, PAC_PAC_NumerHabit
  FROM Pac_Paciente
  WHERE PAC_PAC_Rut IN (:rutPacientes)
  `,
      {
        replacements: { rutPacientes },
        type: QueryTypes.SELECT,
      }
    );

    return registros.map(r => {
      const paciente = pacientes.find(p => p.PAC_PAC_Rut === r.rut_paciente);
      const medico = medicos.find(m => m.SER_PRO_Rut === r.medico_responsable);
      const especialidad = especialidadesEnti.find(e => e.SER_SER_CodigoIfl === r.especialidad_medico);

      const edad = paciente?.PAC_PAC_FechaNacim ? Math.floor(dayjs().diff(paciente.PAC_PAC_FechaNacim, 'year')) : '';

      return {
        Previsión: paciente?.PAC_PAC_Prevision ?? '',
        Nombre_Paciente: `${paciente?.PAC_PAC_Nombre ?? ''} ${paciente?.PAC_PAC_ApellPater ?? ''} ${paciente?.PAC_PAC_ApellMater ?? ''}`.trim(),
        Sexo: paciente?.PAC_PAC_Sexo ?? '',
        Edad: edad,
        RUT: paciente?.PAC_PAC_Rut ?? '',
        Teléfono: `${paciente?.PAC_PAC_TelefonoMovil ?? ''} - ${paciente?.PAC_PAC_Fono ?? ''}`.trim(),
        Domicilio: `${paciente?.PAC_PAC_DireccionGralHabit ?? ''} ${paciente?.PAC_PAC_NumerHabit ?? ''}`.trim(),
        Fecha_Hora_Ingreso: r.date_ingreso ? dayjs(r.date_ingreso).format('DD-MM-YYYY HH:mm') : '',
        Diagnóstico_Ingreso: r.diagnostico_ingreso ?? '',
        Apache: r.apache ?? '',
        Fecha_Hora_Egreso: r.date_egreso ? dayjs(r.date_egreso).format('DD-MM-YYYY HH:mm') : '',
        Destino: r.destino_egreso ?? '',
        Médico: medico ? `${medico.SER_PRO_Nombres ?? ''} ${medico.SER_PRO_ApellPater ?? ''} ${medico.SER_PRO_ApellMater ?? ''}`.trim() : '',
        Especialidad: especialidad?.SER_SER_DescripcioIfl ?? '',
        Coronario: r.coronario ?? '',
        Aisl: r.aisl ?? '',
        Criterios_I: r.criterios_i ?? '',
        Criterios_E: r.criterios_e ?? '',
        LPP: r.lpp ?? '',
        Caídas: r.caidas ?? '',
        Error_Médico: r.error_medico ?? '',
        Diagnóstico_Egreso: r.diagnostico_egreso ?? '',
      };
    });
  }

  async generarArchivoExcel(datos: any[], respuesta: Response) {
    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet('Ingresos y Egresos');

    const encabezados = Object.keys(datos[0] || {});
    hoja.addRow(encabezados);

    const cabecera = hoja.getRow(1);
    cabecera.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cabecera.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2E8B57' },
    };

    datos.forEach(fila => hoja.addRow(Object.values(fila)));

    hoja.columns.forEach(col => (col.width = 20));

    respuesta.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    respuesta.setHeader('Content-Disposition', 'attachment; filename=ReporteIngresosEgresos.xlsx');
    await libro.xlsx.write(respuesta);
    respuesta.end();
  }

  async exportarReporte(respuesta: Response, unidadId: number, fechaInicio: string, fechaFin: string, filtro: 'ingreso' | 'egreso') {
    const registros = await this.obtenerIngresosEgresos(unidadId, fechaInicio, fechaFin, filtro);

    const registrosCompletos = await this.enriquecerDatosConEnti(registros);
    await this.generarArchivoExcel(registrosCompletos, respuesta);
  }
}
