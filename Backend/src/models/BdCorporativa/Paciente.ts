import { Table, Column, Model, DataType, PrimaryKey, AllowNull, HasMany } from 'sequelize-typescript';

@Table({
  tableName: 'PAC_Paciente',
  timestamps: false,
})
export default class Paciente extends Model<Paciente> {
  @PrimaryKey
  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare PAC_PAC_Numero: number;

  @AllowNull(false)
  @Column(DataType.CHAR(10))
  declare PAC_PAC_Rut: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_ApellPater: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_ApellMater: string;

  @AllowNull(false)
  @Column(DataType.CHAR(40))
  declare PAC_PAC_Nombre: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAC_PAC_FechaNacim: Date;

  @AllowNull(false)
  @Column(DataType.CHAR(40))
  declare PAC_PAC_CalleHabit: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_NumerHabit: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_DeparHabit: string;

  @AllowNull(false)
  @Column(DataType.CHAR(30))
  declare PAC_PAC_PoblaHabit: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_ComunHabit: string;

  @AllowNull(false)
  @Column(DataType.CHAR(30))
  declare PAC_PAC_CiudaHabit: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_RegioHabit: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_CalleTempo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_NumerTempo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_DeparTempo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(30))
  declare PAC_PAC_PoblaTempo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_ComunTempo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_CiudaTempo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_RegioTempo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_Fono: string;

  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare PAC_PAC_Sexo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_Profesion: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAC_PAC_Religion: string;

  @AllowNull(false)
  @Column(DataType.CHAR(30))
  declare PAC_PAC_Ocupacion: string;

  @AllowNull(false)
  @Column(DataType.CHAR(10))
  declare PAC_PAC_EstadCivil: string;

  @AllowNull(false)
  @Column(DataType.DATE(10))
  declare PAC_PAC_FechaIngre: Date;

  @AllowNull(false)
  @Column(DataType.CHAR(15))
  declare PAC_PAC_Origen: string;

  @AllowNull(true)
  @Column(DataType.DATE())
  declare PAC_PAC_FechaModif: Date;

  @AllowNull(true)
  @Column(DataType.DATE())
  declare PAC_PAC_FechaFallec: Date;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_Prevision: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_Codigo: string;

  @AllowNull(false)
  @Column(DataType.BLOB)
  declare PAC_PAC_TimeStamp: Buffer;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_Soundex: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PAC_PAC_TipoBenef: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare PAC_PAC_FechaUaten: Date;

  @AllowNull(false)
  @Column(DataType.TINYINT)
  declare PAC_PAC_Clasificado: number;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_ClaseCodigo: string;

  @AllowNull(false)
  @Column(DataType.TINYINT)
  declare PAC_PAC_Cotizante: number;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare PAC_PAC_FonoTempo: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare PAC_PAC_DireccionGralHabit: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare PAC_PAC_CodigUsuar: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAC_PAC_CodigInsti: string;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare PAC_PAC_NumeroRayos: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare PAC_PAC_FechaVenci: Date;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare PAC_PAC_CorrAutori: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare PAC_PAC_NroPasaporte: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare PAC_PAC_TelefonoMovil: string;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare PAC_PAC_Sector: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare PAC_PAC_Etnia: string;

  @AllowNull(true)
  @Column(DataType.STRING())
  declare PAC_PAC_FonoNumerico: string;

  @AllowNull(true)
  @Column(DataType.STRING())
  declare PAC_PAC_TelefonoMovilNumerico: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAC_PAC_Prais: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAC_PAC_Ruralidad: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAC_PAC_ClaseVia: number;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare PAC_PAC_CIUcodigo: string;

  @AllowNull(false)
  @Column(DataType.STRING(35))
  declare PAC_PAC_CorreoCuerpo: string;

  @AllowNull(false)
  @Column(DataType.STRING(25))
  declare PAC_PAC_CorreoExtension: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAC_PAC_Nacionalidad: string;

  @AllowNull(false)
  @Column(DataType.STRING(4))
  declare PAC_PAC_MotPacSinRut: string;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare NAC_Ide: number;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare PAC_PAC_NivelInstruccion: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare PAC_PAC_ActivoInactivo: string;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  declare PAC_PAC_PacTrans: boolean;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  declare PAC_PAC_FichaPasiva: boolean;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  declare PAC_PAC_RutProvisorio: boolean;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAC_PAC_IdentidadGenero: number;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare created_by: string;
}
