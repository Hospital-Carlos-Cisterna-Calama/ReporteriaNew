import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'PPV_Codigo',
  timestamps: false,
})
export class PpvCodigo extends Model<PpvCodigo> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare ID: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare id_PPV: number;

  @AllowNull(false)
  @Column(DataType.CHAR(10))
  declare Codigo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare estado: string;
}
