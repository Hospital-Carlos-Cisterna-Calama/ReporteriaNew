import {
  Especialidad,
  SubEspecialidad,
  EspecialidadesResponse,
  SubEspecialidadesResponse,
  EspecialidadesCompletasResponse
} from '../interfaces';

/**
 * Mapper para transformar respuestas del backend de especialidades
 */
export class EspecialidadesMapper {

  /**
   * Mapea la respuesta de especialidades del backend a array de especialidades
   */
  static mapRestEspecialidadesToEspecialidades(response: EspecialidadesResponse): Especialidad[] {
    if (!response.success || !response.data) {
      return [];
    }

    return response.data.map(especialidad => ({
      id: especialidad.id,
      nombre: especialidad.nombre,
      codigo: especialidad.codigo
    }));
  }

  /**
   * Mapea la respuesta de sub especialidades del backend a array de sub especialidades
   */
  static mapRestSubEspecialidadesToSubEspecialidades(response: SubEspecialidadesResponse): SubEspecialidad[] {
    if (!response.success || !response.data) {
      return [];
    }

    return response.data.map(subEspecialidad => ({
      id: subEspecialidad.id,
      nombre: subEspecialidad.nombre,
      codigo: subEspecialidad.codigo,
      especialidadId: subEspecialidad.especialidadId
    }));
  }

  /**
   * Mapea la respuesta completa del backend
   */
  static mapRestEspecialidadesCompletas(response: EspecialidadesCompletasResponse): {
    especialidades: Especialidad[];
    subEspecialidades: SubEspecialidad[];
  } {
    if (!response.success || !response.data) {
      return {
        especialidades: [],
        subEspecialidades: []
      };
    }

    return {
      especialidades: response.data.especialidades.map(esp => ({
        id: esp.id,
        nombre: esp.nombre,
        codigo: esp.codigo
      })),
      subEspecialidades: response.data.subEspecialidades.map(subEsp => ({
        id: subEsp.id,
        nombre: subEsp.nombre,
        codigo: subEsp.codigo,
        especialidadId: subEsp.especialidadId
      }))
    };
  }
}
