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

export interface UrgenciaDoceHoraFila {
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

export interface InformeUrgenciaFila {
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
// reporteria.types.ts
export interface UrgenciaIrasFila {
  Fecha_Admision: string; // datetime como string (formateo lo haces arriba)
  Rut_Paciente: string;
  Nombre_Paciente: string;
  Sexo: 'M' | 'F' | string;
  Edad: number;
  Diagnostico: string | null; // normalizado (sin tilde)
}

export interface UrgenciaBaseFila {
  diag: string | null; // STUFF(...), puede venir vacío
  rut: string; // PAC_PAC_Rut
  paciente: string; // Nombre + Apellidos
  PAC_PAC_Sexo: string; // 'M' | 'F' | otros
  edad: number | null; // CAST(DATEDIFF(...) AS INT)
  prevision: Prevision; // case F/P/C/else
  Beneficio: string | null; // PAC_PAC_TipoBenef
}
export interface UrgenciaPabellonFila extends UrgenciaBaseFila {
  Ingreso_Urg: Date | string; // f.RPA_FOR_FechaDigit (datetime)
  Egreso_Urg: string | null; // d.RPA_FDA_HoraEgreso (suele ser varchar/hora)
  Ingreso_Pabe: Date | string; // e.ATC_EST_FechaHospi (datetime)
  destino: 'Pabellon'; // literal del SELECT
}
export interface UrgenciaHospitalizadoFila extends UrgenciaBaseFila {
  PAC_PAC_Numero: number; // clave paciente
  fecha: Date | string; // f.RPA_FOR_FechaDigit (alias fecha)
  egreso_Urgencias: string | null; // d.RPA_FDA_HoraEgreso
  Ingreso_Hospitalizado: Date | string; // e.ATC_EST_FechaHospi
  TAB_DescripcionPiso: string | null; // u.TAB_DescripcionPiso
}

export interface UrgenciaCategorizacion {
  piso: string; // Descripción del piso (ej: Urgencia Adulto)
  usuario: string; // Usuario que digitó la categorización
  cat: string; // Código o letra de categorización (ej: C, B, etc.)
  nom: string; // Nombre completo del paciente
  sexo: 'Masculino' | 'Femenino'; // Sexo en formato legible
  rut: string; // RUT del paciente
  fecha: string; // Fecha y hora de digitación (ISO string o Date si lo manejas como objeto)
  numpa: string; // Fecha y hora de digitación (ISO string o Date si lo manejas como objeto)
}

export type Prevision = 'Fonasa' | 'Particular' | 'Convenio' | 'No Informado';
// Unión para el método
export type UrgenciaHospPabllFila = UrgenciaPabellonRow | UrgenciaHospitalizadoRow;

export type IRpaFormularioCreationAttributes = IRpaFormularioAttributes;
