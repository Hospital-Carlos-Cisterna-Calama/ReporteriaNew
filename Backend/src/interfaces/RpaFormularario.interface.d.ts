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

export type IRpaFormularioCreationAttributes = IRpaFormularioAttributes;
