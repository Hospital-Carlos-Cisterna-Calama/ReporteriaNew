/**
 * Interface para Especialidad Médica
 */
export interface Especialidad {
  id: string;
  nombre: string;
  codigo: string;
}

/**
 * Interface para Sub Especialidad (Equipamiento Médico)
 */
export interface SubEspecialidad {
  id: number;
  nombre: string;
  codigo: string;
  especialidadId: string;
}

/**
 * Interface para respuesta del endpoint de especialidades
 */
export interface EspecialidadResponse {
  success: boolean;
  message: string;
  count: number;
  data: Especialidad[];
}

/**
 * Interface para respuesta del endpoint de sub-especialidades
 */
export interface SubEspecialidadResponse {
  success: boolean;
  message: string;
  count: number;
  data: SubEspecialidad[];
  especialidadId: string;
}



/**
 * Interface para estadísticas de especialidades
 */
export interface EstadisticasEspecialidades {
  totalEspecialidades: number;
  totalSubEspecialidades: number;
  especialidadesConSubEspecialidades: number;
}