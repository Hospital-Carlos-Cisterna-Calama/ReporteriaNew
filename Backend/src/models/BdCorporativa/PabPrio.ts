import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'TAB_PabPrio',
  timestamps: false,
})
export class Pabprio extends Model<Pabprio> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare TAB_Codigo: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare TAB_Text: string;
}
