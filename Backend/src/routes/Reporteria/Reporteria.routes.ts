import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateSchema } from '../../middlewares/validation';
import { ValidarDataUrgenciaSchema, ValidarFechaUrgenciaSchema } from '../../schemas/Reportes/validation-schemas';
import { RpaFormularioController } from '../../controller/RpaFormulario.controllers';

const reporteriaRouter = Router();

reporteriaRouter.post('/infor', asyncHandler(RpaFormularioController.reporteUrgencia));
reporteriaRouter.post('/horas', asyncHandler(RpaFormularioController.reporteUrgenciaDoceHoras));
reporteriaRouter.post('/cat', asyncHandler(RpaFormularioController.reporteUrgenciaCategorizaciones));
reporteriaRouter.post('/hosp', asyncHandler(RpaFormularioController.reporteUrgenciaHospitalizado));
reporteriaRouter.post('/iras', asyncHandler(RpaFormularioController.reporteIras));

export default reporteriaRouter;
