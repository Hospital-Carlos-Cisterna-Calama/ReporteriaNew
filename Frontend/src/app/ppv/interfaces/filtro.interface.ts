// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

/** Tipo de fecha para reportes que lo requieren */
export type TipoFecha = 'solicitud' | 'realizacion';

/** Estructura de datos para catálogos de filtros */
export interface ItemCatalogo {
  id: number;
  nombre: string;
  codigo?: string;
}

export interface ItemServicio {
  id: string;
  nombre: string;
  codigo?: string;
}

export interface SubEspecialidadItem extends ItemCatalogo {
  especialidadId: number;
}

/**
 * Filtros aplicables a los reportes PPV
 * Estructura flexible que se adapta según el tipo de reporte
 */
export interface FiltrosPpvReporte {
  /** Fecha de inicio del rango (formato rango de fechas) */
  fechaInicio?: Date | null;
  /** Fecha de fin del rango (formato rango de fechas) */
  fechaFin?: Date | null;
  /** Mes seleccionado (formato mes/año) */
  mes?: number;
  /** Año seleccionado (formato mes/año) */
  anio?: number;
  /** ID de la especialidad médica seleccionada */
  especialidadId?: number | null;
  /** ID de la sub-especialidad seleccionada */
  subEspecialidadId?: number | null;
  /** Tipo de fecha: solicitud o realización */
  tipoFecha?: TipoFecha;
  /** IDs de servicios seleccionados (para reportes multi-servicio) */
  serviciosSeleccionados?: string[];
}
