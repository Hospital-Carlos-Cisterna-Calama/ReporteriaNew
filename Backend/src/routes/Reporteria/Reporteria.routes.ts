import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateQuerySchema } from '../../middlewares/validation';
import { UrgenciaController } from '../../controller/Urgencia.controller';
import {
  reporteUrgenciaSchema,
  reporteUrgenciaDoceHorasSchema,
  reporteUrgeciaCatSchema,
  reporteUrgeciaHosSchema,
  reporteUrgIrasSchema,
} from '../../schemas/Reportes/validation-schemas';

const reporteriaRouter = Router();

// Reporte de Urgencias (con tipo: A/U/M)
reporteriaRouter.get('/infor', validateQuerySchema(reporteUrgenciaSchema), asyncHandler(UrgenciaController.reporteUrgencia));

// Reporte de Urgencias 12 Horas (solo fechas)
reporteriaRouter.get('/horas', validateQuerySchema(reporteUrgenciaDoceHorasSchema), asyncHandler(UrgenciaController.reporteUrgenciaDoceHoras));

// Reporte de Categorizaciones (solo fecha)
reporteriaRouter.get('/cat', validateQuerySchema(reporteUrgeciaCatSchema), asyncHandler(UrgenciaController.reporteUrgenciaCategorizaciones));

// Reporte de Urgencias Hospitalizado (con tipo: H/P)
reporteriaRouter.get('/hosp', validateQuerySchema(reporteUrgeciaHosSchema), asyncHandler(UrgenciaController.reporteUrgenciaHospitalizado));

// Reporte de IRAs (con tipo: M/U)
reporteriaRouter.get('/iras', validateQuerySchema(reporteUrgIrasSchema), asyncHandler(UrgenciaController.reporteIras));

export default reporteriaRouter;
