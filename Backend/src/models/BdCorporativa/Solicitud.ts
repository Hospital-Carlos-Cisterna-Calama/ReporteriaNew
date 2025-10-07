import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'PAB_Solicitud',
  timestamps: false,
})
export class Solicitud extends Model<Solicitud> {
  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare PAC_PAC_Numero: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare PAB_SOL_Numero: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare INT_INT_Codigo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare SER_REC_Tipo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare SER_OBJ_Codigo: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAB_SOL_FechaSolicit: Date;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  declare PAB_SOL_HoraSolicit: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAB_SOL_FechaInterv: Date;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  declare PAB_SOL_HoraInterv: string;

  @AllowNull(true)
  @Column(DataType.SMALLINT)
  declare PAB_SOL_Duracion: number;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare PAB_SOL_Unidad: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PAB_SOL_Estado: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PAB_SOL_Prioridad: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAB_SOL_Servicio: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAB_SOL_UnidSangre: number;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAB_SOL_Hemoderv: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare PAB_SOL_TipoAnest: string;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  declare PAB_SOL_Biopsia: boolean;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare PAB_SOL_Observacio: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAB_SOL_FechaRegis: Date;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare PAB_SOL_UsuarDigit: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare PAB_SOL_TimeStamp: Buffer;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare ATC_EST_Numero: number;

  @AllowNull(false)
  @Column(DataType.STRING(4))
  declare PAB_SOL_EstPreop: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAB_SOL_SecTabla: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAB_SOL_IntRealizada: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAB_SOL_Septica: number;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAB_SOL_ServDest: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAB_SOL_UnidDest: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  declare PAB_SOL_TipoInterv: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  declare PAB_SOL_Intervencion: string;

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  declare PAB_SOL_CiruVisi: string;

  @AllowNull(false)
  @Column(DataType.STRING(4))
  declare PAB_SOL_Ambito: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAB_SOL_SerPapa: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PAB_SOL_Compleja: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare PAB_SOL_TipoCiru: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare PAB_SOL_PiezaBiopsia: string;

  @AllowNull(true)
  @Column(DataType.TINYINT)
  declare PAB_SOL_BiopsiaSiNo: number;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAB_SOL_AutorizaHora: string;

  @AllowNull(false)
  @Column(DataType.STRING(250))
  declare PAB_SOL_OtraInterv: string;

  @AllowNull(false)
  @Column(DataType.STRING(250))
  declare PAB_SOL_OtraObserv: string;

  @AllowNull(true)
  @Column(DataType.SMALLINT)
  declare PAB_SOL_Proced: number;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAB_SOL_FechaInd: Date;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare PAB_Sinonimo: string;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  declare PAB_SOL_DiagC10: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare PAB_SOL_ComServ: string;

  @AllowNull(false)
  @Column(DataType.STRING(4))
  declare PAB_SOL_TipoReci: string;

  @AllowNull(false)
  @Column(DataType.STRING(6))
  declare PAB_SOL_DeriReci: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAB_SOL_CirHorario: string;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  declare PAB_SOL_HoraSalida: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare PAB_SOL_Plan: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAB_SOL_RegHospi: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAB_SOL_TurnoUrg: string;

  @AllowNull(true)
  @Column(DataType.SMALLINT)
  declare GrabaPYXIS: number;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  declare ProtocolGrabado: boolean;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare INT_INT_Programada: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare INT_INT_CodPPV: string;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  declare PAB_SOL_Reoperacion: boolean;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAB_SOL_Tipo_Reoperacion: number;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare NumSolIntervPrevia: string;

  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare PRE_Plano: string;

  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare PRE_Extremidad: string;

  @AllowNull(true)
  @Column(DataType.SMALLINT)
  declare PAB_Auge: number;

  @AllowNull(true)
  @Column(DataType.BIGINT)
  declare PAB_ID_ListaEspera: number;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  declare PAB_SOL_DiagC10_2: string;

  @AllowNull(true)
  @Column(DataType.SMALLINT)
  declare PAB_ONCO: number;
}
