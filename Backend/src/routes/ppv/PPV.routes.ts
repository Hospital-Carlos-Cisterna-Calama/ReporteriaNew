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
  pacientesHospitalizadosSchema,
  procedimientosSchema,
} from '../../schemas/Reportes/validation-schemas';

const ppvRouter = Router();

ppvRouter.post('/hospitalizaciones',validateSchema(hospitalizacionesPorServicioSchema),asyncHandler(PpvReportesController.exportarHospitalizacionesPorServicios));

ppvRouter.post('/ingresosEgresos', validateSchema(ingresosEgresosSchema), asyncHandler(PpvReportesController.exportarIngresosEgresos));

ppvRouter.post('/pabellon', validateSchema(intervencionPabellonSchema), asyncHandler(PpvReportesController.exportarIntervencionPabellon));

ppvRouter.post('/irGrd', validateSchema(irGrdSchema), asyncHandler(PpvReportesController.exportarIrGrd));

ppvRouter.post('/listaEspera', validateSchema(listaEsperaSchema), asyncHandler(PpvReportesController.exportarListaEspera));

ppvRouter.post('/pacientesHospitalizados', validateSchema(pacientesHospitalizadosSchema), asyncHandler(PpvReportesController.exportarPacientesHospitalizados));

ppvRouter.post('/procedimientos', validateSchema(procedimientosSchema), asyncHandler(PpvReportesController.exportarProcedimientos));

export default ppvRouter;
