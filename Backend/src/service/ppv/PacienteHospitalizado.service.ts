import { Response } from 'express';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import { PacienteHospitalizado } from '../../sql/PpvConsulta';
import { convertirFecha } from '../../utils/helperRPA';

export class PacienteHospitalizadoService {
  async obtenerPacienteHospitalizado(fechaInicio: string, fechaFin: string) {
    const inicioStr = convertirFecha(fechaInicio, false).split(' ')[0];
    const finStr = convertirFecha(fechaFin, true).split(' ')[0];

    const resultado = await PacienteHospitalizado(inicioStr, finStr);
    return resultado;
  }

  async procesarPacienteHospitalizado(hospitalizados: any[]) {
    return hospitalizados.map((h: any) => ({
      RUT: h.rut ?? '',
      Nombre: h.nombre ?? '',
      Fecha_Nacimiento: h.fecha_nacimiento ?? '',
      Edad: h.edad ?? '',
      Etnia: h.etnia ?? '',
      Nacionalidad: h.nacionalidad ?? '',
      Fecha_Citacion: h.fecha_citacion ?? '',
      Sexo: h.sexo === 'M' || h.sexo === 'm' ? 'Masculino' : h.sexo === 'F' || h.sexo === 'f' ? 'Femenino' : h.sexo ? h.sexo : '',
      Prevision: h.prev ?? '',
      Trans:
        h.trans === true || h.trans === 1 || h.trans === '1' || (typeof h.trans === 'string' && h.trans.toUpperCase() === 'SI')
          ? 'SI'
          : h.trans === false ||
              h.trans === 0 ||
              h.trans === '0' ||
              h.trans === null ||
              h.trans === undefined ||
              (typeof h.trans === 'string' && h.trans.toUpperCase() === 'NO')
            ? 'NO'
            : 'NO',
      Folio: h.folio ?? '',
      Alta_Siclope: h.alta_siclope ?? '',
      Rut_Profesional: h.rut_prof ?? '',
      Nombre_Medico: h.nombre_medico ?? '',
      Policlinico: h.poli ?? '',
      Especialidad: h.esp ?? '',
      Pertinente: h.pertinente ?? '',
      Pertinente_Tiempo: h.pertinente_tiempo ?? '',
      Asistencia: h.asistencia ?? '',
      Nuevo_Control: h.nuevo_nontrol ?? '',
      Cod_Procedencia: h.cod_proc ?? '',
      Procedencia: h.Procedencia ?? '',
      Cod_DetalleProc: h.cod_detproc ?? '',
      Fecha_Cita: h.fecha_cita ? dayjs(h.fecha_cita).format('DD/MM/YYYY') : '',
      Codigo_Servicio: h.codigo_ser ?? '',
      Diagnostico: h.diagnostico ?? '',
    }));
  }

  async generarArchivoExcel(datos: any[], res: Response, fechaInicio: string, fechaFin: string) {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Pacientes Hospitalizados');

    if (!datos.length) {
      hoja.addRow(['No se encontraron registros en el rango seleccionado']);
    } else {
      const encabezados = Object.keys(datos[0]);
      hoja.addRow(encabezados);

      hoja.getRow(1).font = { bold: true };
      hoja.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF59ACA5' },
      };

      // Agregar datos en lotes para mejor rendimiento
      const batchSize = 1000;
      for (let i = 0; i < datos.length; i += batchSize) {
        const batch = datos.slice(i, i + batchSize);
        batch.forEach(fila => hoja.addRow(Object.values(fila)));
      }

      hoja.columns.forEach(col => (col.width = 20));
    }

    const nombreArchivo = `Pacientes_Hospitalizados_${dayjs(fechaInicio, 'DD/MM/YYYY').format('YYYYMMDD')}_${dayjs(fechaFin, 'DD/MM/YYYY').format('YYYYMMDD')}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Length', buffer.byteLength);
    return res.send(buffer);
  }

  async exportarReporte(fechaInicio: string, fechaFin: string, res: Response) {
    const lista = await this.obtenerPacienteHospitalizado(fechaInicio, fechaFin);
    const procesados = await this.procesarPacienteHospitalizado(lista);
    await this.generarArchivoExcel(procesados, res, fechaInicio, fechaFin);
  }
}
