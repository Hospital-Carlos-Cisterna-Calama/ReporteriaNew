import { Router } from 'express';
import { 
  obtenerEspecialidades, 
  obtenerSubEspecialidades
} from '../../controller/Especialidad.controller';
import { validateParamSchema } from '../../middlewares/validation';
import { subEspecialidadesSchema } from '../../schemas/Reportes/validation-schemas';

const especialidadRouter = Router();

/**
 * @route GET /api/reporteria/especialidades
 * @desc Obtener todas las especialidades activas
 * @access Public
 */
especialidadRouter.get('/', obtenerEspecialidades);

/**
 * @route GET /api/reporteria/especialidades/:especialidadId/sub-especialidades
 * @desc Obtener sub especialidades por especialidad
 * @access Public
 */
especialidadRouter.get('/:especialidadId/sub-especialidades', validateParamSchema(subEspecialidadesSchema), obtenerSubEspecialidades);

export default especialidadRouter ;