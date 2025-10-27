/**
 * Interface para Especialidad Médica
 */
export interface Especialidad {
  id: string;
  nombre: string;
  codigo: string;
}

export interface EspecialidadAmbulatoria {
  SER_ESP_Codigo: string;
  SER_ESP_Descripcio: string;
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


/** Marca de vigencia. Ajusta según tu dato real ('S'/'N' o '1'/'0'). */
export type VigenteFlag = 'S' | 'N' | '1' | '0';

/** Atributos completos tal como existen en la fila de la BD. */
export interface PpvServicio {
  /** PK. En BD siempre existe; al crear desde app puede omitirse si es IDENTITY. */
  ID: number;

  /** Nombre del servicio (CHAR(200)) */
  Servicio: string;

  /** Indicador de vigencia (CHAR(1)) */
  Vigente: VigenteFlag | string;

  /** Código relacional del servicio (CHAR(50)) */
  Cod_Rel_Servicio: string;

  /** Ámbito (nullable) */
  Ambito_Id: number | null;
}

export interface PpvServicioResponse {
  success: boolean;
  message: string;
  count: number;
  data: PpvServicio[];
}

