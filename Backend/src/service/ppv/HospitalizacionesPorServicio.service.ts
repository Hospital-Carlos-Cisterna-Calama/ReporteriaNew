import ExcelJS from 'exceljs';
import { Response } from 'express';
import { HospitalizacionesPorServicio } from '../../sql/PpvConsulta';

export class HospitalizacionesPorServicioService {
  async obtenerHospitalizacionesPorServicios(servicios: number[], fechaInicio: string, fechaFin: string) {
    return await HospitalizacionesPorServicio(servicios, fechaInicio, fechaFin);
  }

  async procesarHospitalizaciones(registros: any[]) {
    return registros.map(r => ({
      cama: r.RPH_cama,
      tipo_cama: r.RPH_tipo_cama,
      rut: r.PAC_PAC_Rut ?? '',
      nombre_paciente: r.nombre_paciente ?? '',
      diagnostico: r.RPH_diag,
      pcr: r.RPH_pcr,
      angiotac: r.RPH_angiotac,
      sato2: r.RPH_sato2,
      medio_ventilacion: r.RPH_med_vent,
      disp_ventilacion: r.RPH_disp_vent,
      prono: r.RPH_prono,
      dias_estadia: r.RPH_dias_est,
      dias_vmi: r.RPH_dias_vmi,
      estado_paciente: r.RPH_estado_pac,
      rd: r.RPH_rd,
      triage: r.RPH_TRIAGE,
      fecha: r.RPH_fecha_reg,
      servicio: r.servicio ?? '',
    }));
  }

  async generarArchivoExcel(datos: any[]) {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Hospitalizaciones');

    const encabezados = [
      'Cama',
      'Tipo Cama',
      'RUT',
      'Nombre Paciente',
      'Diagnóstico',
      'PCR',
      'ANGIOTAC',
      'SATO₂',
      'Medio de Ventilación y FIO2%',
      'Dispositivo de Ventilación',
      'PRONO',
      'Días de Estadia',
      'Días VMI',
      'Estado del Paciente',
      'R/D',
      'TRIAGE',
      'Fecha',
      'Servicio',
    ];

    hoja.addRow(encabezados);

    const headerRow = hoja.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF808080' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    datos.forEach(fila => {
      hoja.addRow(Object.values(fila));
    });

    hoja.columns.forEach(col => {
      col.width = 20;
    });

    return workbook;
  }

  async exportarReporte(servicios: number[], fechaInicio: string, fechaFin: string, res: Response) {
    const registros = await this.obtenerHospitalizacionesPorServicios(servicios, fechaInicio, fechaFin);
    const datos = await this.procesarHospitalizaciones(registros);
    const workbook = await this.generarArchivoExcel(datos);
    const nombreArchivo = `Hospitalizaciones_${fechaInicio}_a_${fechaFin}.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();
  }
}
