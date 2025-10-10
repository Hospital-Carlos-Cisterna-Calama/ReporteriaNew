import ExcelJS from 'exceljs';
import { Response } from 'express';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'dayjs/locale/es';
import { IntervencionPabellon, obtenerPatologiasPorSolicitud } from '../../sql/PpvConsulta';
import { convertirFecha } from '../../utils/helperRPA';

dayjs.extend(weekOfYear);

export class IntervencionPabellonService {
  async exportarReporte(fechaInicio: string, fechaFin: string, res: Response) {
    // Convertir fechas DD/MM/YYYY a YYYY-MM-DD directamente
    const inicioStr = convertirFecha(fechaInicio, false).split(' ')[0]; // Solo la fecha, sin hora
    const finStr = convertirFecha(fechaFin, true).split(' ')[0]; // Solo la fecha, sin hora

    const registros: any[] = await IntervencionPabellon(inicioStr, finStr);
    const dataFinal: any[] = [];

    for (const r of registros) {
      const patologias = await obtenerPatologiasPorSolicitud(r.Solicitud);
      r['Otra Patologia'] = patologias.map((p: any) => `${p.PAB_PAT_Codigo}: ${p.PAB_PAT_PatologiaAgr}`).join(' | ') || '';

      const mapaPrev: any = { F: 'FONASA', C: 'CONVENIO', P: 'PARTICULAR', I: 'ISAPRE' };
      r.Prevision = mapaPrev[r.previ?.trim()] || r.previ || 'NO INFORMADA';

      const fecha = dayjs(r.PAB_SOL_FechaSolicit).locale('es');
      r.Semana_Año = fecha.week();
      r.Semana_Mes = fecha.week() - fecha.startOf('month').week() + 1;
      r.DIA = fecha.format('DD');
      r.Nombre_Dia = fecha.format('dddd').replace(/\b\w/g, l => l.toUpperCase());
      r.MES = fecha.format('MMMM').replace(/\b\w/g, l => l.toUpperCase());
      r.AÑO = fecha.format('YYYY');

      const normalizeTime = (h: any) => {
        if (!h) return '-';
        const val = h.toString().trim();
        const match = val.match(/^(\d{2}):(\d{2})/);
        return match ? `${match[1]}:${match[2]}` : '-';
      };
      r.Hora_Ingreso = normalizeTime(r.Hora_Ingreso);
      r.Hora_Salida = normalizeTime(r.Hora_Salida);

      if (r.Hora_Ingreso !== '-' && r.Hora_Salida !== '-') {
        const parseTime = (t: string) => {
          const [hh, mm] = t.split(':');
          return { hours: parseInt(hh), minutes: parseInt(mm) };
        };

        const start = parseTime(r.Hora_Ingreso);
        const end = parseTime(r.Hora_Salida); 

        let totalMinutos = end.hours * 60 + end.minutes - (start.hours * 60 + start.minutes);
        if (totalMinutos < 0) totalMinutos += 1440;

        r.MINUTOS = totalMinutos;
        r.HORA = (totalMinutos / 60).toFixed(2);
      } else {
        r.MINUTOS = '-';
        r.HORA = '-';
      }

      dataFinal.push({
        Solicitud: r.Solicitud,
        NombrePaciente: r.NombrePaciente,
        Rut: r.PAC_PAC_Rut,
        Ficha: r.Ficha,
        Edad: r.Edad,
        Prevision: r.Prevision,
        Tipo_Prev: r.Tipo_Prev,
        Fecha_Solicit: r.PAB_SOL_FechaSolicit ? dayjs(r.PAB_SOL_FechaSolicit).format('YYYY-MM-DD') : '',
        OBJ_Codigo: r.OBJ_Codigo,
        Semana_Año: r.Semana_Año,
        Semana_Mes: r.Semana_Mes,
        DIA: r.DIA,
        Nombre_Dia: r.Nombre_Dia,
        MES: r.MES,
        AÑO: r.AÑO,
        Hora_Ingreso: r.Hora_Ingreso,
        Hora_Salida: r.Hora_Salida,
        MINUTOS: r.MINUTOS,
        HORA: r.HORA,
        Codigo_Pabellon: r.Codigo_Pabellon,
        Codigo_INT: r.Codigo_INT,
        Descripcion_Int: r.Descripcion_Int,
        Ambito: r.Ambito,
        Prioridad: r.Prioridad,
        'CIRUGIA/PROC': r.TipoProc,
        'Diag. Post Operatorio': r.Diag_PostOperatorio,
        'Operación Realizada': r.Operacion_Realizada,
        Especialidad: r.Especialidad,
        RutMedico: r.RutMedico,
        NombreMedico: r.NombreMedico,
        RutAnestesista: r.RutAnestesista,
        NombreAnestesista: r.NombreAnestesista,
        TipoAnestesia: r.TipoAnestesia,
        RUT_PRIMER_AYUDANTE: r.RUT_PRIMER_AYUDANTE,
        PRIMER_AYUDANTE: r.PRIMER_AYUDANTE,
        Tipo: r.Tipo,
        Pabellon: r.Pabellon,
        'Otra Patologia': r['Otra Patologia'],
      });
    }

    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Intervención Pabellón');

    const encabezados = Object.keys(dataFinal[0]);
    hoja.addRow(encabezados);

    const headerRow = hoja.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D9488' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    // Agregar datos en lotes para mejor rendimiento
    const batchSize = 1000;
    for (let i = 0; i < dataFinal.length; i += batchSize) {
      const batch = dataFinal.slice(i, i + batchSize);
      batch.forEach(fila => hoja.addRow(Object.values(fila)));
    }

    // Aplicar bordes solo al encabezado
    headerRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });

    // Ajustar anchos de columna de forma simple
    hoja.columns.forEach(col => (col.width = 20));

    hoja.autoFilter = {
      from: 'A1',
      to: hoja.getRow(1).getCell(encabezados.length).address,
    };

    const nombreArchivo = `Intervencion_Pabellon_${dayjs(fechaInicio, 'DD/MM/YYYY').format('YYYYMMDD')}_${dayjs(fechaFin, 'DD/MM/YYYY').format('YYYYMMDD')}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Length', buffer.byteLength);
    return res.send(buffer);
  }
}
