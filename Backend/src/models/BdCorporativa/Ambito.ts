import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';


@Table({
  tableName: 'TAB_Ambito',
  timestamps: false,
})
export default class Ambito extends Model<Ambito> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare TAB_Codigo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(15))
  declare TAB_Text: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare TAB_Nemotecnico: string;

  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare INTGR_HCE: string;
}
