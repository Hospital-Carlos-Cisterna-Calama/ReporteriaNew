import { Request, Response, NextFunction } from 'express';
import { RpaFormularioService } from '../service/RpaFormulario.service';
import { InformeUrgenciaRow, UrgenciaDoceHoraFila, UrgenciaHospOrPabFila, UrgenciaIrasFila } from '../interfaces/RpaFormularario.interface';
import ExcelJS from 'exceljs';
import { buildSheet, sendWorkbook } from '../utils/excel';
const RpaFormulario = new RpaFormularioService();

// Utilidad: detectar si el usuario pidió Excel
function wantsXlsx(req: Request) {
  return req.query.xlsx === '1' || req.body?.xlsx === true || req.headers.accept?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

export class RpaFormularioController {
  static async reporteUrgencia(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaInicio, fechaTermino, box } = req.body;

      const results = await RpaFormulario.ObtenerUrgencia(fechaInicio, fechaTermino, box);
      if (!wantsXlsx(req)) return res.json(results);

      const wb = new ExcelJS.Workbook();
      await buildSheet<InformeUrgenciaRow>(
        wb,
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
        }
      );

      await sendWorkbook(res, wb, `InformeUrgencia_${fechaInicio}_a_${fechaTermino}.xlsx`);
    } catch (error) {
      next(error);
    }
  }

  static async reporteUrgenciaDoceHoras(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaInicio, fechaTermino } = req.body;

      const results = await RpaFormulario.ObtenerUrgenciaDoceHoras(fechaInicio, fechaTermino);
      if (!wantsXlsx(req)) return res.json(results);

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
      const { fecha } = req.body;
      const results = await RpaFormulario.ObtenerCategorizadores(fecha);
      if (!wantsXlsx(req)) return res.json(results);

      const wb = new ExcelJS.Workbook();
      // Reutilizo columnas de 12h porque dijiste que devuelve UrgenciaDoceHoraFila
      await buildSheet<UrgenciaDoceHoraFila>(
        wb,
        'Categorizaciones',
        [
          { header: 'RUT', key: 'Rut' },
          { header: 'Nombre', key: 'Nombre' },
          { header: 'Edad', key: 'Edad' },
          { header: 'Sexo', key: 'Sexo' },
          { header: 'Previsión', key: 'Prevision' },
          { header: 'DAU', key: 'DAU' },
          { header: 'Ingreso Siclope', key: 'FechaIngresoSiclope' },
          { header: 'Servicio Ingreso', key: 'ServicioIngreso' },
          { header: 'Profesional', key: 'Profesional' },
          { header: 'RUT Profesional', key: 'RutProfesional' },
        ],
        results
      );

      await sendWorkbook(res, wb, `Categorizaciones_${fecha}.xlsx`);
    } catch (error) {
      next(error);
    }
  }

  static async reporteUrgenciaHospitalizado(req: Request, res: Response, next: NextFunction) {
    try {
      const fechaInicio = req.body.fechaInicio;
      const fechaTermino = req.body.fechaTermino;
      const tipo = req.body.box;

      const results = await RpaFormulario.ObtenerUrgenciaHospitalizado(fechaInicio, fechaTermino, tipo);
      if (!wantsXlsx(req)) return res.json(results);

      const wb = new ExcelJS.Workbook();

      if (tipo === 'H') {
        // UrgenciaHospitalizadoFila
        await buildSheet<UrgenciaHospOrPabFila>(
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
        await buildSheet<UrgenciaHospOrPabFila>(
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
      const fechaInicio = req.body.fechaInicio;
      const fechaTermino = req.body.fechaTermino;
      const tipo = req.body.box;

      const results = await RpaFormulario.ObtenerInformeIras(fechaInicio, fechaTermino, tipo);
      if (!wantsXlsx(req)) return res.json(results);

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
