export interface ReporteNominaSiclopeQuery {
  fechaInicio: string;      // 'YYYY-MM-DD'
  fechaFin: string;     // 'YYYY-MM-DD'
  rut: string | null;  // opcional
}

export interface ReporteContraReferenciaSiclopeQuery {
  fechaInicio: string;      // 'YYYY-MM-DD'
  fechaFin: string;  // 'YYYY-MM-DD'
}

export interface ReporteDiagnosticoSiclopeQuery {
  fechaInicio: string;      // 'YYYY-MM-DD'
  fechaFin: string;  // 'YYYY-MM-DD'
  especialidadCode: string | null; // opcional
}
