import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'RPH_Especialidad',
  timestamps: false,
})
export class RphEspecialidad extends Model<RphEspecialidad> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare ID: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare ID_RPH: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare ID_Especiliadad: number;
}
