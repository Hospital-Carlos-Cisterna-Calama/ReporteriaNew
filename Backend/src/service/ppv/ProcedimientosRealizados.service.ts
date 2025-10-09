import { Response } from 'express';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import  ProcCitas  from '../../models/BdProcedimientos/ProcCitas';
import  ProcRegClinico  from '../../models/BdProcedimientos/ProcRegClinico';
import  Paciente  from '../../models/BdCorporativa/Paciente';

export class ProcedimientosRealizadosService {
  async obtenerProcedimientosRealizados(fechaInicio: Date, fechaFin: Date, especialidadId: string) {
    const citas = await ProcCitas.findAll({
      where: {
        PROC_CIT_Fecha: { [Op.between]: [fechaInicio, fechaFin] },
        PROC_PER_Equip: especialidadId,
      },
      include: [
        { model: Paciente, as: 'paciente', required: true },
        {
          model: ProcRegClinico,
          as: 'registros',
          required: true,
          include: [{ model: Paciente, as: 'paciente' }],
        },
      ],
    });

    return citas;
  }

  async procesarProcedimientos(citas: any[]) {
    return citas.map((c: any) => {
      const p = c.paciente;
      const r = c.registros?.[0];

      const edad = p?.PAC_PAC_FechaNacim ? Math.floor(dayjs().diff(dayjs(p.PAC_PAC_FechaNacim), 'year')) : '—';

      let prevision = 'No Informado';
      switch (p?.PAC_PAC_Prevision) {
        case 'F':
          prevision = 'Fonasa';
          break;
        case 'P':
          prevision = 'Particular';
          break;
        case 'C':
          prevision = 'Convenio';
          break;
      }

      return {
        Folio: c.ID_ListaEspera,
        Nombre_Paciente: `${p?.PAC_PAC_Nombre ?? ''} ${p?.PAC_PAC_ApellPater ?? ''} ${p?.PAC_PAC_ApellMater ?? ''}`,
        RUT: p?.PAC_PAC_Rut ?? '',
        Etnia: p?.PAC_PAC_Etnia ?? '',
        Sexo: p?.PAC_PAC_Sexo === 'M' ? 'Masculino' : 'Femenino',
        Edad: edad,
        Prevision: `${prevision} ${p?.PAC_PAC_TipoBenef ?? ''}`,
        Informe: r?.PROC_RC_TextoInforme?.replace(/\n/g, ' - ') ?? '',
        Hallazgo: r?.PROC_RC_TextoHallazgo?.replace(/\n/g, ' - ') ?? '',
        Conclusión: r?.PROC_RC_TextoConclusion?.replace(/\n/g, ' - ') ?? '',
      };
    });
  }

  async generarArchivoExcel(datos: any[], res: Response) {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Procedimientos');

    const encabezados = Object.keys(datos[0] || {});
    hoja.addRow(encabezados);

    hoja.getRow(1).font = { bold: true };
    hoja.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

    hoja.columns.forEach((col, idx) => {
      col.width = idx < 7 ? 15 : 60;
    });

    datos.forEach(fila => hoja.addRow(Object.values(fila)));
    hoja.getRow(1).alignment = { wrapText: true };

    const nombreArchivo = `Procedimientos_${dayjs().format('YYYYMMDD_HHmm')}.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();
  }

  async exportarReporte(fechaInicio: Date, fechaFin: Date, especialidadId: string, res: Response) {
    const citas = await this.obtenerProcedimientosRealizados(fechaInicio, fechaFin, especialidadId);
    const procesados = await this.procesarProcedimientos(citas);
    await this.generarArchivoExcel(procesados, res);
  }
}
