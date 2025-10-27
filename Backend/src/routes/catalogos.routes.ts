import { Router } from 'express';
import { 
  obtenerEspecialidadAmbulatoria,
  obtenerEspecialidades, 
  obtenerPpvServicios, 
  obtenerSubEspecialidades
} from '../controller/Catalogo.controller';
import { validateParamSchema } from '../middlewares/validation';
import { subEspecialidadesSchema } from '../schemas/Reportes/validation-schemas';

const catalogosRouter = Router();

/**
 * @route GET /api/reporteria/especialidades
 * @desc Obtener todas las especialidades activas
 * @access Public
 */
catalogosRouter.get('/especialidades', obtenerEspecialidades);

/**
 * @route GET /api/reporteria/especialidades/:especialidadId/sub-especialidades
 * @desc Obtener sub especialidades por especialidad
 * @access Public
 */
catalogosRouter.get('/especialidades/:especialidadId/sub-especialidades', validateParamSchema(subEspecialidadesSchema), obtenerSubEspecialidades);


catalogosRouter.get('/servicios', obtenerPpvServicios);

catalogosRouter.get('/especialidades-ambulatorias', obtenerEspecialidadAmbulatoria);

export default catalogosRouter;