import { Router } from 'express';
import { PpvReportesController } from '../../controller/PpvReportes.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateSchema } from '../../middlewares/validation';

import {
  hospitalizacionesPorServicioSchema,
  ingresosEgresosSchema,
  intervencionPabellonSchema,
  irGrdSchema,
  listaEsperaSchema,
  procedimientosSchema,
  pacientesHospitalizadosSchema,
} from '../../schemas/Reportes/validation-schemas';

const ppvRouter = Router();

ppvRouter.get('/hospitalizaciones', asyncHandler(PpvReportesController.exportarHospitalizacionesPorServicios));

ppvRouter.get('/ingresosEgresos', validateSchema(ingresosEgresosSchema), asyncHandler(PpvReportesController.exportarIngresosEgresos));

ppvRouter.get('/pabellon', validateSchema(intervencionPabellonSchema), asyncHandler(PpvReportesController.exportarIntervencionPabellon));

ppvRouter.get('/irGrd', asyncHandler(PpvReportesController.exportarIrGrd));

ppvRouter.get('/listaEspera', validateSchema(listaEsperaSchema), asyncHandler(PpvReportesController.exportarListaEspera));

 ppvRouter.get('/pacientesHospitalizados', validateSchema(pacientesHospitalizadosSchema), asyncHandler(PpvReportesController.exportarPacientesHospitalizados));

ppvRouter.get('/procedimientos', asyncHandler(PpvReportesController.exportarProcedimientos));

export default ppvRouter;
  