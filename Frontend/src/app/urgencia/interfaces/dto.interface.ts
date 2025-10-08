type ReporteTipo = 'A' | 'U' | 'M';

type ResporteHosTipo = 'H' | 'P';

type ReporteIrasTipo = 'M' | 'U';

export interface ReporteUrgenciaQuery {
  fechaInicio: string;
  fechaTermino: string;
  tipo: ReporteTipo;
}

export interface ReporteUrgenciaDoceHorasQuery {
  fechaInicio: string;
  fechaTermino: string;
}

export interface ResporteUrgeciaCatQuery {
  fecha: string;
}

export interface ReporteUrgeciaHosQuery {
  fechaInicio: string;
  fechaTermino: string;
  tipo: ResporteHosTipo;
}

export interface ReporteUrgIrasQuery {
  fechaInicio: string;
  fechaTermino: string;
  tipo: ReporteIrasTipo;
}
