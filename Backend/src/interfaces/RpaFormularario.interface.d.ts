import { InferAttributes, InferCreationAttributes } from 'sequelize';

export interface IRpaFormularioAttributes {
  RPA_FOR_TipoFormu: string;
  RPA_FOR_NumerFormu: string;
  RPA_FOR_FechaDigit: Date;
  RPA_FOR_FechaSolic: Date;
  RPA_FOR_TipoPacie?: string | null;
  RPA_FOR_ProceServi: string;
  RPA_FOR_ProceEspec: string;
  RPA_FOR_CodigRecep: string;
  RPA_FOR_Vigencia: string;
  RPA_FOR_FolioRefer?: number | null;
  RPA_FOR_Observacio: string;
  RPA_FOR_FechaTrasp: Date;
  RPA_FOR_Sala?: string | null;
  RPA_FOR_TimeStamp?: Buffer | null;
  PAC_PAC_Numero: number;
  RPA_FOR_ProceDeriv?: string | null;
  RPA_FOR_ProfDeriv?: string | null;
  RPA_FOR_TipoProc: string;
  SER_PRO_Codigo?: string | null;
  RPA_FOR_TipoRecet?: number | null;
  RPA_FOR_CenResDeriv?: string | null;
  RPA_FOR_CenResProce?: string | null;
  RPA_FOR_SAO?: string | null;
  RPA_FOR_TipoPrograma?: string | null;
  RPA_FOR_ComSegurosCodigo?: string | null;
  RPA_FOR_CiruAmbulatoria?: string | null;
}

export interface UrgDoceHorasRow {
  RPA_FOR_NumerFormu: string | null;
  fecha_digitacion_urg: string | null;
  pacnum: number;
  PAC_PAC_Rut: string | null;
  nombre: string | null;
  sexo: string | null;
  prevision: string | null;
  fechnacim: string | null;
  TAB_DescripcionPiso: string | null;
  Traslado: string | null;
  fecha_hospi: string | null;
  fecha_alta: string | null;
  Categorizacion: string | null;
  hora_salida_urg: string | null;
  fecha_siclope_ingreso: string | null;
  nombre_profesional: string | null;
  rut_profesional: string | null;
}

export interface ResultadoFila {
  Rut: string | null;
  Nombre: string | null;
  Edad: number | null;
  Sexo: string | null;
  Prevision: string | null;
  DAU: string | null;
  FechaIngresoSiclope: string | null; // dd/mm/yyyy HH:mm:ss
  ServicioIngreso: string | null;
  FechaIngresoHelios: string | null; // dd/mm/yyyy HH:mm:ss
  ServicioTraslado: string | null;
  FechaTrasladoHelios: string | null; // dd/mm/yyyy HH:mm:ss
  DiferenciaTexto: string | null; // "X horas, Y minutos." | mensajes
  Profesional: string | null;
  RutProfesional: string | null;
  // opcionales si quieres depurar:
  // fecha_siclople_evolucion?: string | null;
}

export interface InformeUrgenciaRow {
  formulario: string;
  tipo_folio: 'Maternal' | 'Urgencias';
  Sector: string;
  admision: Date;
  FechaCat: Date | null;
  FechaIngreso: Date | null;
  FechaEgreso: Date | null;
  RutMedicoIngreso: string | null;
  MedicoIngreso: string | null;
  RPA_FDA_MedicoAlta: string | null;
  NomMedico: string | null;
  PAC_PAC_Rut: string;
  paciente: string;
  PAC_PAC_Sexo: string;
  edad: number | null;
  PAC_PAC_FechaNacim: Date | null;
  categorizacion: string | null;
  esp: string | null;
  diag: string | null;
  trat: string | null;
  MedioT: string | null;
  Direccion: string | null;
  prevision: 'Fonasa' | 'Particular' | 'Convenio' | 'No Informado';
  Beneficio: string;
  Vigente: string;
  Destino: string | null;
}

export type IRpaFormularioCreationAttributes = IRpaFormularioAttributes;
