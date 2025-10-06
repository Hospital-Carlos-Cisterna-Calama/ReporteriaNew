import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'TAB_TratamientosFav',
  timestamps: false,
})
export class TabTratamientosFav extends Model<TabTratamientosFav> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare URG_TO_CodigTO: number;

  @AllowNull(false)
  @Column(DataType.STRING(250))
  declare URG_TO_Descripcio: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare URG_TO_Vigencia: string;
}
