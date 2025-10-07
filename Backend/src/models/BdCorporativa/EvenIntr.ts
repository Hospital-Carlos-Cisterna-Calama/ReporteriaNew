import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'PAB_EvenIntr',
  timestamps: false,
})
export class EventIntr extends Model<EventIntr> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(10))
  declare PAB_SOL_Numero: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAB_EVE_FechaEvento: Date;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare PAB_EVE_UsuarDigit: string;

  @AllowNull(false)
  @Column(DataType.STRING(8000))
  declare PAB_EVE_MotIntraop: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare PAB_EVE_TimeStamp: Buffer;

  @AllowNull(false)
  @Column(DataType.STRING(4000))
  declare PAB_EVE_DiagPostOper: string;

  @AllowNull(false)
  @Column(DataType.STRING(4000))
  declare PAB_EVE_PreparPreOper: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare PAB_EVE_RiesgoOper: string;

  @AllowNull(false)
  @Column(DataType.STRING(1500))
  declare PAB_EVE_OperRealizada: string;

  @AllowNull(false)
  @Column(DataType.STRING(4))
  declare PAB_EVE_Cec: string;

  @AllowNull(false)
  @Column(DataType.STRING(4))
  declare PAB_EVE_Clamp: string;

  @AllowNull(false)
  @Column(DataType.STRING(4))
  declare PAB_EVE_NCec: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAB_EVE_Recuento: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare PAB_TipoHerida: number;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAB_EVE_Licitacion: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAB_EVE_ListaEspera: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAB_BIT_Instrumental: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAB_BIT_Cortopunzante: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PAB_BIT_Urgencias: string;
}
