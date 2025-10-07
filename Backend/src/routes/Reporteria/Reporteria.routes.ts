import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateSchema } from '../../middlewares/validation';
import { ValidarDataUrgenciaSchema, ValidarFechaUrgenciaSchema } from '../../schemas/Reportes/validation-schemas';
import { RpaFormularioController } from '../../controller/RpaFormulario.controllers';

const reporteriaRouter = Router();

/* ---------- CRUD ---------- */
reporteriaRouter.post('/urgencias-infor', validateSchema(ValidarDataUrgenciaSchema), asyncHandler(RpaFormularioController.reporteUrgencia));
reporteriaRouter.post('/urgencias-horas', validateSchema(ValidarDataUrgenciaSchema), asyncHandler(RpaFormularioController.reporteUrgenciaDoceHoras));
reporteriaRouter.post('/urgencias-cat', validateSchema(ValidarFechaUrgenciaSchema), asyncHandler(RpaFormularioController.reporteUrgenciaCategorizaciones));
reporteriaRouter.post('/urgencias-hosp', validateSchema(ValidarDataUrgenciaSchema), asyncHandler(RpaFormularioController.reporteUrgenciaHospitalizado));
reporteriaRouter.post('/urgencias-iras', validateSchema(ValidarDataUrgenciaSchema), asyncHandler(RpaFormularioController.reporteIras));
export default reporteriaRouter;
