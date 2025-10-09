import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'TAB_DiagnosticosFav',
  timestamps: false,
})
export default class TabDiagnosticosFav extends Model<TabDiagnosticosFav> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare URG_DG_CodigDG: number;

  @AllowNull(false)
  @Column(DataType.STRING(250))
  declare URG_DG_Descripcio: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare URG_DG_Vigencia: string;
}
