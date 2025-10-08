import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'PRE_Prestacion',
  timestamps: false,
})
export default class PrePrestacion extends Model<PrePrestacion> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PRE_PRE_Codigo: string;

  @AllowNull(false)
  @Column(DataType.STRING(540))
  declare PRE_PRE_Descripcio: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare PRE_PRE_Tipo: string;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  declare PRE_PRE_Compuesta: boolean;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PRE_PRE_Vigencia: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PRE_PRE_RecarNoctu: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PRE_PRE_CargoPacie: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PRE_PRE_ValorVaria: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PRE_PRE_Cobra: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PRE_PRE_SubTipo: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare PRE_PRE_TimeStamp: Buffer;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare PRE_PRE_Soundex: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PRE_PRE_FichPac: string;

  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare PRE_PRE_Realiza: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PRE_PRE_Tiempo: number;

  @AllowNull(false)
  @Column(DataType.CHAR(12))
  declare PRE_PRE_ItemPresu: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare PRE_PRE_Equipo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare PRE_PAB_Codigo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PRE_PRE_Grupo: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare PRE_Lateralidad: string;

  @AllowNull(false)
  @Column(DataType.STRING(15))
  declare COD_DEIS_ESPECIALIDAD: string;
}
