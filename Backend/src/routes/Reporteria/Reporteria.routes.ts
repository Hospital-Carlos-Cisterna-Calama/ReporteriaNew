import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateSchema } from '../../middlewares/validation';
import { getReporteUrgenciaSchema } from '../../schemas/Reportes/validation-schemas';
import { RpaFormularioController } from '../../controller/RpaFormulario.controllers';

const reporteriaRouter = Router();

/* ---------- CRUD ---------- */
reporteriaRouter.post('/urgencias', validateSchema(getReporteUrgenciaSchema), asyncHandler(RpaFormularioController.findReportUrgencias));

export default reporteriaRouter;
