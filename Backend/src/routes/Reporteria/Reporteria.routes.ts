import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateSchema } from '../../middlewares/validation';
import { ValidarDataUrgenciaSchema, ValidarFechaUrgenciaSchema } from '../../schemas/Reportes/validation-schemas';
import { RpaFormularioController } from '../../controller/RpaFormulario.controllers';

const reporteriaRouter = Router();

reporteriaRouter.get('/infor/:fechaInicio/:fechaTermino/:box', asyncHandler(RpaFormularioController.reporteUrgencia));
reporteriaRouter.get('/horas/:fechaInicio/:fechaTermino', asyncHandler(RpaFormularioController.reporteUrgenciaDoceHoras));
reporteriaRouter.get('/cat/:fecha', asyncHandler(RpaFormularioController.reporteUrgenciaCategorizaciones));
reporteriaRouter.get('/hosp/:fechaInicio/:fechaTermino/:box', asyncHandler(RpaFormularioController.reporteUrgenciaHospitalizado));
reporteriaRouter.get('/iras/:fechaInicio/:fechaTermino/:box', asyncHandler(RpaFormularioController.reporteIras));

export default reporteriaRouter;
