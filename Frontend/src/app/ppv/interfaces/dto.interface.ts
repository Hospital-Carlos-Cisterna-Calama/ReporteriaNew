type ResportesPPVEgrIngrTypo = 'ingreso' | 'egreso';

export interface ReportePpvHosQuery {
  fechaInicio: string;
  fechaFin: string;
  servicios: number[];
}


export interface ReportePpvIngEgrQuery {
  fechaInicio: string;
  fechaFin: string;
  unidad: string;
  filtro: ResportesPPVEgrIngrTypo;

}
export interface ReportePpvListaEsperaQuery {
  fechaInicio: string;
  fechaFin: string;
  tipo: number;
}

export interface ReportePpvPabellonQuery {
  fechaInicio: string;
  fechaFin: string;
}

export interface ReportePpvIrGrdQuery {
  fechaInicio: string;
  fechaFin: string;
}

export interface ReportePpvPacHospQuery {
  fechaInicio: string;
  fechaFin: string;
}

export interface ReportePpvProcedimientosQuery {
  fechaInicio: string;
  fechaFin: string;
  selectEspec?: string;
  PadreEsp?: string;
}
