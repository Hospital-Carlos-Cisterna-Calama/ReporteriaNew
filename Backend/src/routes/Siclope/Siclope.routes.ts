import { Router } from 'express';
import { SiclopeController } from '../../controller/Siclope.controller';
import { asyncHandler } from '../../utils';

const siclopeRouter = Router();

siclopeRouter.get('/nomina', asyncHandler(SiclopeController.reporteNominaPorFecha));

export default siclopeRouter;
