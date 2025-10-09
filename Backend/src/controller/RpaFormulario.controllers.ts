import { Request, Response, NextFunction } from 'express';
import { RpaFormularioService } from '../service/urgencias/RpaFormulario.service';
import {
  UrgenciaDoceHoraFila,
  InformeUrgenciaFila,
  UrgenciaIrasFila,
  UrgenciaHospPabllFila,
  UrgenciaCategorizacion,
} from '../interfaces/RpaFormularario.interface';
import ExcelJS from 'exceljs';
import { buildSheet, sendOneSheetStream, sendWorkbook } from '../utils/excel';
const RpaFormulario = new RpaFormularioService();

export class RpaFormularioController {
  static async reporteUrgencia(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaInicio, fechaTermino, tipo } = req.query as any;

      const results = await RpaFormulario.ObtenerUrgencia(fechaInicio, fechaTermino, tipo);

      await sendOneSheetStream<InformeUrgenciaFila>(
        res,
        `InformeUrgencia_${fechaInicio}_a_${fechaTermino}.xlsx`,
        'Informe Urgencia',
        [
          { header: 'Formulario', key: 'formulario' },
          { header: 'Tipo Folio', key: 'tipo_folio' },
          { header: 'Sector', key: 'Sector' },
          { header: 'Admisión', key: 'admision' },
          { header: 'Fecha Cat', key: 'FechaCat' },
          { header: 'Ingreso', key: 'FechaIngreso' },
          { header: 'Egreso', key: 'FechaEgreso' },
          { header: 'Rut Médico Ingreso', key: 'RutMedicoIngreso' },
          { header: 'Médico Ingreso', key: 'MedicoIngreso' },
          { header: 'Médico Alta (RUT)', key: 'RPA_FDA_MedicoAlta' },
          { header: 'Médico Alta (Nombre)', key: 'NomMedico' },
          { header: 'RUT Paciente', key: 'PAC_PAC_Rut' },
          { header: 'Paciente', key: 'paciente' },
          { header: 'Sexo', key: 'PAC_PAC_Sexo' },
          { header: 'Edad', key: 'edad' },
          { header: 'Fecha Nacimiento', key: 'PAC_PAC_FechaNacim' },
          { header: 'Categorización', key: 'categorizacion' },
          { header: 'Especialidad', key: 'esp' },
          { header: 'Diagnóstico', key: 'diag' },
          { header: 'Tratamiento', key: 'trat' },
          { header: 'Medio Traslado', key: 'MedioT' },
          { header: 'Dirección', key: 'Direccion' },
          { header: 'Previsión', key: 'prevision' },
          { header: 'Beneficio', key: 'Beneficio' },
          { header: 'Vigente', key: 'Vigente' },
          { header: 'Destino', key: 'Destino' },
        ],
        results,
        {
          dateKeys: ['admision', 'FechaCat', 'FechaIngreso', 'FechaEgreso', 'PAC_PAC_FechaNacim'],
          wrapKeys: ['diag', 'trat', 'Direccion', 'Beneficio', 'Destino', 'MedicoIngreso', 'NomMedico'],
          borders: true, // ⚠️ activa con cautela en datasets enormes
          // headerColorArgb: 'FF4F46E5',
          // columnWidths: { diag: 40, trat: 35, Direccion: 30 }, // opcional
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async reporteUrgenciaDoceHoras(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaInicio, fechaTermino } = req.query as any;

      const results = await RpaFormulario.ObtenerUrgenciaDoceHoras(fechaInicio, fechaTermino);

      const wb = new ExcelJS.Workbook();
      await buildSheet<UrgenciaDoceHoraFila>(
        wb,
        'Urgencia 12h',
        [
          { header: 'RUT', key: 'Rut' },
          { header: 'Nombre', key: 'Nombre' },
          { header: 'Edad', key: 'Edad' },
          { header: 'Sexo', key: 'Sexo' },
          { header: 'Previsión', key: 'Prevision' },
          { header: 'DAU', key: 'DAU' },
          { header: 'Ingreso Siclope', key: 'FechaIngresoSiclope' },
          { header: 'Servicio Ingreso', key: 'ServicioIngreso' },
          { header: 'Ingreso Helios', key: 'FechaIngresoHelios' },
          { header: 'Servicio Traslado', key: 'ServicioTraslado' },
          { header: 'Traslado Helios', key: 'FechaTrasladoHelios' },
          { header: 'Diferencia', key: 'DiferenciaTexto' },
          { header: 'Profesional', key: 'Profesional' },
          { header: 'RUT Profesional', key: 'RutProfesional' },
        ],
        results,
        {
          // estas fechas ya vienen en string "dd/mm/yyyy HH:mm:ss", no forzamos formateo
        }
      );

      await sendWorkbook(res, wb, `Urgencia12h_${fechaInicio}_a_${fechaTermino}.xlsx`);
    } catch (error) {
      next(error);
    }
  }

  static async reporteUrgenciaCategorizaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const { fecha } = req.query as any;
      const results = await RpaFormulario.ObtenerCategorizadores(fecha);

      await sendOneSheetStream<UrgenciaCategorizacion>(
        res,
        `Categorizaciones_${fecha}.xlsx`,
        'Categorizaciones',
        [
          { header: 'Piso', key: 'piso' },
          { header: 'Usuario', key: 'usuario' },
          { header: 'Categorizacion', key: 'cat' },
          { header: 'Nombre', key: 'nom' },
          { header: 'Sexo', key: 'sexo' },
          { header: 'Rut', key: 'rut' },
          { header: 'Fecha', key: 'fecha' },
          { header: 'Fecha', key: 'numpa' },
        ],
        results,
        {
          dateKeys: ['Piso', 'Usuario', 'Categorizacion', 'Nombre', 'Sexo', 'Rut', 'Fecha'],
          borders: true, // ⚠️ activa con cautela en datasets enormes
          // headerColorArgb: 'FF4F46E5',
          // columnWidths: { diag: 40, trat: 35, Direccion: 30 }, // opcional
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async reporteUrgenciaHospitalizado(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaInicio, fechaTermino, tipo } = req.query as any;

      const results = await RpaFormulario.ObtenerUrgenciaHospitalizado(fechaInicio, fechaTermino, tipo);

      const wb = new ExcelJS.Workbook();

      if (tipo === 'H') {
        // UrgenciaHospitalizadoFila
        await buildSheet<UrgenciaHospPabllFila>(
          wb,
          'Hospitalizados',
          [
            { header: 'RUT', key: 'rut' },
            { header: 'Paciente', key: 'paciente' },
            { header: 'Sexo', key: 'PAC_PAC_Sexo' },
            { header: 'Edad', key: 'edad' },
            { header: 'Previsión', key: 'prevision' },
            { header: 'Beneficio', key: 'Beneficio' },
            { header: 'N° Paciente', key: 'PAC_PAC_Numero' },
            { header: 'Fecha (Ingreso Urg.)', key: 'fecha' },
            { header: 'Egreso Urgencias', key: 'egreso_Urgencias' },
            { header: 'Ingreso Hospitalizado', key: 'Ingreso_Hospitalizado' },
            { header: 'Piso', key: 'TAB_DescripcionPiso' },
            { header: 'Diagnóstico', key: 'diag' },
          ],
          results as any,
          { dateKeys: ['fecha', 'Ingreso_Hospitalizado'] }
        );
      } else {
        // Pabellón
        await buildSheet<UrgenciaHospPabllFila>(
          wb,
          'Pabellón',
          [
            { header: 'RUT', key: 'rut' },
            { header: 'Paciente', key: 'paciente' },
            { header: 'Sexo', key: 'PAC_PAC_Sexo' },
            { header: 'Edad', key: 'edad' },
            { header: 'Previsión', key: 'prevision' },
            { header: 'Beneficio', key: 'Beneficio' },
            { header: 'Ingreso Urgencias', key: 'Ingreso_Urg' },
            { header: 'Egreso Urgencias', key: 'Egreso_Urg' },
            { header: 'Ingreso Pabellón', key: 'Ingreso_Pabe' },
            { header: 'Destino', key: 'destino' },
            { header: 'Diagnóstico', key: 'diag' },
          ],
          results as any,
          { dateKeys: ['Ingreso_Urg', 'Ingreso_Pabe'] }
        );
      }

      await sendWorkbook(res, wb, `Urg_${tipo === 'H' ? 'Hospitalizado' : 'Pabellon'}_${fechaInicio}_a_${fechaTermino}.xlsx`);
    } catch (error) {
      next(error);
    }
  }

  static async reporteIras(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaInicio, fechaTermino, tipo } = req.query as any;

      const results = await RpaFormulario.ObtenerInformeIras(fechaInicio, fechaTermino, tipo);

      const wb = new ExcelJS.Workbook();
      await buildSheet<UrgenciaIrasFila>(
        wb,
        'IRAS',
        [
          { header: 'Fecha Admisión', key: 'Fecha_Admision' },
          { header: 'RUT Paciente', key: 'Rut_Paciente' },
          { header: 'Nombre Paciente', key: 'Nombre_Paciente' },
          { header: 'Sexo', key: 'Sexo' },
          { header: 'Edad', key: 'Edad' },
          { header: 'Diagnóstico', key: 'Diagnostico' },
        ],
        results,
        { dateKeys: ['Fecha_Admision'] }
      );

      await sendWorkbook(res, wb, `IRAS_${tipo}_${fechaInicio}_a_${fechaTermino}.xlsx`);
    } catch (error) {
      next(error);
    }
  }
}
