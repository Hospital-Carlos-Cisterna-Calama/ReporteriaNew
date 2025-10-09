/**
 * Interface para Especialidad
 */
export interface Especialidad {
  id: string;
  nombre: string;
  codigo: string;
}

/**
 * Interface para Sub Especialidad
 */
export interface SubEspecialidad {
  id: string; // Cambiado a string porque los IDs son alfanuméricos (ej: 'D2801')
  nombre: string;
  codigo: string;
  especialidadId: string;
}

/**
 * Response del backend para especialidades
 */
export interface EspecialidadesResponse {
  success: boolean;
  message: string;
  count: number;
  data: Especialidad[];
}

/**
 * Response del backend para sub especialidades
 */
export interface SubEspecialidadesResponse {
  success: boolean;
  message: string;
  count: number;
  data: SubEspecialidad[];
  especialidadId: string;
}

/**
 * Response del backend para especialidades completas
 */
export interface EspecialidadesCompletasResponse {
  success: boolean;
  message: string;
  data: {
    especialidades: Especialidad[];
    subEspecialidades: SubEspecialidad[];
    count: {
      especialidades: number;
      subEspecialidades: number;
    };
  };
}
