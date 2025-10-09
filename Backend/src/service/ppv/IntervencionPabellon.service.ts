import { Op } from 'sequelize';
import { Carpeta } from '../../models';
import  Especiali  from '../../models/BdCorporativa/Especiali';
import  EventIntr  from '../../models/BdCorporativa/EvenIntr';
import  Lugar  from '../../models/BdCorporativa/Lugar';
import  Paciente  from '../../models/BdCorporativa/Paciente';
import  Prestacion  from '../../models/BdCorporativa/PrePrestacion';
import  Solicitud  from '../../models/BdCorporativa/Solicitud';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import  Patagreg  from '../../models/BdCorporativa/Patagreg';
import ExcelJS from 'exceljs';
dayjs.extend(weekOfYear);

export class IntervencionPabellonService {
  async obtenerIntervencionesPabellon(fechaInicio: Date, fechaFin: Date) {
    return await Solicitud.findAll({
      where: {
        PAB_SOL_Estado: 'R',
        PAB_SOL_FechaSolicit: { [Op.between]: [fechaInicio, fechaFin] },
      },
      include: [{ model: Paciente }, { model: Prestacion }, { model: Especiali }, { model: Carpeta }, { model: EventIntr }, { model: Lugar }],
      order: [['PAB_SOL_Numero', 'ASC']],
    });
  }

  async procesarIntervenciones(listaIntervenciones: any[]) {
    const resultado: any[] = [];

    for (const solicitud of listaIntervenciones) {
      const datos: any = solicitud.toJSON();

      const patologias = await Patagreg.findAll({
        where: { PAB_SOL_Numero: datos.PAB_SOL_Numero },
        attributes: ['PAB_PAT_Codigo', 'PAB_PAT_PatologiaAgr'],
      });

      patologias.forEach((pat, i) => {
        datos[`patologia_adicional_${i + 1}`] = `${pat.PAB_PAT_Codigo}: ${pat.PAB_PAT_PatologiaAgr}`;
      });

      const fecha = dayjs(datos.PAB_SOL_FechaSolicit);
      datos.mes = fecha.format('MMMM');
      datos.dia = fecha.format('DD');
      datos.nombreDia = fecha.format('dddd');
      datos.semanaAnual = fecha.week();
      datos.semanaMensual = fecha.week() - dayjs(fecha).startOf('month').week() + 1;
      datos.anio = fecha.format('YYYY');

      switch (datos?.Paciente?.PAC_PAC_Prevision?.trim()) {
        case 'F':
          datos.prevision = 'FONASA';
          break;
        case 'C':
          datos.prevision = 'CONVENIO';
          break;
        case 'P':
          datos.prevision = 'PARTICULAR';
          break;
        case 'I':
          datos.prevision = 'ISAPRE';
          break;
        default:
          datos.prevision = 'SIN INFORMACIÓN';
          break;
      }

      if (datos.PAB_SOL_HoraSalida && datos.PAB_SOL_HoraSolicit) {
        const horaInicio = dayjs(datos.PAB_SOL_HoraSolicit, 'HH:mm');
        const horaFin = dayjs(datos.PAB_SOL_HoraSalida, 'HH:mm');
        let minutosTotales = horaFin.diff(horaInicio, 'minute');
        if (minutosTotales < 0) minutosTotales += 1440;

        datos.minutos = minutosTotales;
        datos.horas = (minutosTotales / 60).toFixed(2);
      } else {
        datos.minutos = '-';
        datos.horas = '-';
      }

      resultado.push(datos);
    }

    return resultado;
  }

  async generarArchivoExcel(datos: any[]) {
    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet('Solicitudes');

    const encabezados = Object.keys(datos[0] || {}).map(clave => ({ header: clave, key: clave, width: 20 }));
    hoja.columns = encabezados;

    datos.forEach(fila => hoja.addRow(fila));

    hoja.getRow(1).eachCell(celda => {
      celda.font = { bold: true };
      celda.alignment = { vertical: 'middle', horizontal: 'center' };
      celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDDDDD' } };
    });

    const rutaArchivo = `./Reporte_Solicitudes_${dayjs().format('YYYYMMDD_HHmm')}.xlsx`;
    await libro.xlsx.writeFile(rutaArchivo);

    console.log(`✅ Archivo Excel generado correctamente: ${rutaArchivo}`);
    return rutaArchivo;
  }

  async exportarReporte(fechaInicio: Date, fechaFin: Date) {
    const solicitudes = await this.obtenerIntervencionesPabellon(fechaInicio, fechaFin);
    const datosProcesados = await this.procesarIntervenciones(solicitudes);
    const rutaArchivo = await this.generarArchivoExcel(datosProcesados);
    console.log(`✅ Archivo Excel generado correctamente: ${rutaArchivo}`);
    return { datos: datosProcesados, rutaArchivo };
  }
}
