import { Router } from 'express';
import { SiclopeController } from '../../controller/Siclope.controller';
import { asyncHandler } from '../../utils';

const siclopeRouter = Router();

siclopeRouter.get('/nomina', asyncHandler(SiclopeController.reporteNominaPorFecha));
siclopeRouter.get('/exportar-contrareferencia', asyncHandler(SiclopeController.exportarContrareferencia));
siclopeRouter.get('/exportar-diagnosticos-realizados', asyncHandler(SiclopeController.exportarDiagnosticosRealizados));

export default siclopeRouter;
