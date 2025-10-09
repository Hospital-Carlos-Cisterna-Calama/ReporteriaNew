import { Table, Column, Model, DataType, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'TAB_Activos',
  schema: 'dbo',
  timestamps: false,
})
export default class TabActivos extends Model<TabActivos> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare TAB_Codigo: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare TAB_Descripcio: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare TAB_Vigencia: string;
}