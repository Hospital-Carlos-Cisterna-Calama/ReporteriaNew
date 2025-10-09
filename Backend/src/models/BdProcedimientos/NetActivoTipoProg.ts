import { Table, Column, Model, DataType, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'NET_ActivoTipoProg',
  schema: 'dbo',
  timestamps: false,
})
export default class NetActivoTipoProg extends Model<NetActivoTipoProg> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare PROC_COD_Activo: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PROC_TipoProg: number;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare PROC_Vigencia: string;
}