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

ppvRouter.get('/hospitalizaciones', validateSchema(hospitalizacionesPorServicioSchema), asyncHandler(PpvReportesController.exportarHospitalizacionesPorServicios));

ppvRouter.get('/ingresosEgresos', validateSchema(ingresosEgresosSchema), asyncHandler(PpvReportesController.exportarIngresosEgresos));

ppvRouter.get('/pabellon', validateSchema(intervencionPabellonSchema), asyncHandler(PpvReportesController.exportarIntervencionPabellon));

ppvRouter.get('/irGrd', validateSchema(irGrdSchema), asyncHandler(PpvReportesController.exportarIrGrd));

 ppvRouter.get('/listaEspera', validateSchema(listaEsperaSchema), asyncHandler(PpvReportesController.exportarListaEspera));

 ppvRouter.get('/pacientesHospitalizados', validateSchema(pacientesHospitalizadosSchema), asyncHandler(PpvReportesController.exportarPacientesHospitalizados));

ppvRouter.get('/procedimientos', validateSchema(procedimientosSchema), asyncHandler(PpvReportesController.exportarProcedimientos));



export default ppvRouter;
  