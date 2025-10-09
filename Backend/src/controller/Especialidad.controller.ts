import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { EspecialidadService } from '../service/ppv/especialidad.service';
import type { 
  EspecialidadResponse, 
  SubEspecialidadResponse
} from '../interfaces/Especialidad.interface';

// Instancia del servicio
const especialidadService = new EspecialidadService();

/**
 * Obtener todas las especialidades activas
 * Equivalente a: api/servP del sistema legacy
 * 
 * @route GET /especialidades
 */
export const obtenerEspecialidades = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const busqueda = typeof q === 'string' ? q : undefined;
  
  try {
    const especialidades = await especialidadService.obtenerEspecialidades(busqueda);

    const response: EspecialidadResponse = {
      success: true,
      message: 'Especialidades obtenidas exitosamente',
      count: especialidades.length,
      data: especialidades,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    throw new AppError('Error interno del servidor al obtener especialidades', 500);
  }
});

/**
 * Obtener sub especialidades (equipamientos) por especialidad
 * Equivalente a: api/servH?id=[codigo_especialidad] del sistema legacy
 * 
 * @route GET /especialidades/:especialidadId/sub-especialidades
 */
export const obtenerSubEspecialidades = asyncHandler(async (req: Request, res: Response) => {
  const { especialidadId } = req.params;
  const { q } = req.query;
  const busqueda = typeof q === 'string' ? q : undefined;

  if (!especialidadId) {
    throw new AppError('El ID de especialidad es requerido', 400);
  }

  try {
    // Validar que la especialidad existe
    const especialidadExiste = await especialidadService.validarEspecialidad(especialidadId);
    if (!especialidadExiste) {
      throw new AppError(`Especialidad con ID ${especialidadId} no encontrada`, 404);
    }

    const subEspecialidades = await especialidadService.obtenerSubEspecialidadesPorEspecialidad(
      especialidadId, 
      busqueda
    );

    const response: SubEspecialidadResponse = {
      success: true,
      message: `Sub especialidades obtenidas exitosamente para especialidad ${especialidadId}`,
      count: subEspecialidades.length,
      data: subEspecialidades,
      especialidadId,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(`Error al obtener sub-especialidades para ${especialidadId}:`, error);
    throw new AppError('Error interno del servidor al obtener sub especialidades', 500);
  }
});

