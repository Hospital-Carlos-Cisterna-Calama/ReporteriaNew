import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateQuerySchema } from '../../middlewares/validation';
import { RpaFormularioController } from '../../controller/RpaFormulario.controllers';
import {
  reporteUrgenciaSchema,
  reporteUrgenciaDoceHorasSchema,
  reporteUrgeciaCatSchema,
  reporteUrgeciaHosSchema,
  reporteUrgIrasSchema
} from '../../schemas/Reportes/validation-schemas';

const reporteriaRouter = Router();

// Reporte de Urgencias (con tipo: A/U/M)
reporteriaRouter.get(
  '/infor',
  validateQuerySchema(reporteUrgenciaSchema),
  asyncHandler(RpaFormularioController.reporteUrgencia)
);

// Reporte de Urgencias 12 Horas (solo fechas)
reporteriaRouter.get(
  '/horas',
  validateQuerySchema(reporteUrgenciaDoceHorasSchema),
  asyncHandler(RpaFormularioController.reporteUrgenciaDoceHoras)
);

// Reporte de Categorizaciones (solo fecha)
reporteriaRouter.get(
  '/cat',
  validateQuerySchema(reporteUrgeciaCatSchema),
  asyncHandler(RpaFormularioController.reporteUrgenciaCategorizaciones)
);

// Reporte de Urgencias Hospitalizado (con tipo: H/P)
reporteriaRouter.get(
  '/hosp',
  validateQuerySchema(reporteUrgeciaHosSchema),
  asyncHandler(RpaFormularioController.reporteUrgenciaHospitalizado)
);

// Reporte de IRAs (con tipo: M/U)
reporteriaRouter.get(
  '/iras',
  validateQuerySchema(reporteUrgIrasSchema),
  asyncHandler(RpaFormularioController.reporteIras)
);



export default reporteriaRouter;
