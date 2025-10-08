import { Response } from 'express';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';

// Modelos
import  Paciente  from '../../models/BdCorporativa/Paciente';
import  CamasCritica  from '../../models/BdPpv/CamasCriticas';
import  SerServicio  from '../../models/BdCorporativa/SerServicios';
import  SerProfesiona  from '../../models/BdCorporativa/Profesional';

export class PacienteHospitalizadoService {
  async obtenerPacienteHospitalizado(fechaInicio: Date, fechaFin: Date, servicioId?: string) {
    const whereCond: any = {
      date_ingreso: { [Op.between]: [fechaInicio, fechaFin] },
    };

    if (servicioId) {
      whereCond.unidad_id = servicioId;
    }

    const resultado = await CamasCritica.findAll({
      where: whereCond,
      include: [
        { model: Paciente, as: 'paciente', required: true },
        { model: SerServicio, as: 'servicio', required: false },
        { model: SerProfesiona, as: 'medico', required: false },
      ],
      order: [['date_ingreso', 'ASC']],
    });

    return resultado;
  }

  async procesarPacienteHospitalizado(hospitalizados: any[]) {
    return hospitalizados.map((h: any) => {
      const pac = h.paciente;
      const med = h.medico;
      const serv = h.servicio;

      return {
        RUT: pac?.PAC_PAC_Rut ?? '',
        Nombre: `${pac?.PAC_PAC_Nombre ?? ''} ${pac?.PAC_PAC_ApellPater ?? ''} ${pac?.PAC_PAC_ApellMater ?? ''}`,
        Edad: this.calcularEdad(pac?.PAC_PAC_FechaNacim),
        Sexo: pac?.PAC_PAC_Sexo === 'M' ? 'Masculino' : 'Femenino',
        Fecha_Ingreso: dayjs(h?.date_ingreso).format('DD/MM/YYYY HH:mm'),
        Fecha_Egreso: h?.date_egreso ? dayjs(h.date_egreso).format('DD/MM/YYYY HH:mm') : '—',
        Diagnóstico_Ingreso: h?.diagnostico_ingreso ?? '',
        Diagnóstico_Egreso: h?.diagnostico_egreso ?? '',
        Días_Estadía: h?.date_egreso ? dayjs(h.date_egreso).diff(h.date_ingreso, 'day') : dayjs().diff(h.date_ingreso, 'day'),
        Médico: med ? `${med.SER_PRO_Nombres ?? ''} ${med.SER_PRO_ApellPater ?? ''} ${med.SER_PRO_ApellMater ?? ''}` : '',
        Especialidad: serv?.SER_SER_Descripcio ?? '',
        Estado: h?.estado ?? '',
      };
    });
  }

  async generarArchivoExcel(datos: any[], res: Response) {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Pacientes Hospitalizados');

    const encabezados = Object.keys(datos[0] || {});
    hoja.addRow(encabezados);

    hoja.getRow(1).font = { bold: true };
    hoja.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };

    datos.forEach(fila => hoja.addRow(Object.values(fila)));
    hoja.columns.forEach(col => (col.width = 20));

    const nombreArchivo = `Pacientes_Hospitalizados_${dayjs().format('YYYYMMDD_HHmm')}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportarReporte(fechaInicio: Date, fechaFin: Date, servicioId: string | undefined, res: Response) {
    const lista = await this.obtenerPacienteHospitalizado(fechaInicio, fechaFin, servicioId);
    const procesados = await this.procesarPacienteHospitalizado(lista);
    await this.generarArchivoExcel(procesados, res);
  }

  private calcularEdad(fechaNac?: Date): number | string {
    if (!fechaNac) return '—';
    return dayjs().diff(dayjs(fechaNac), 'year');
  }
}
