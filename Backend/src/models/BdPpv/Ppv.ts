import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'PPV',
  timestamps: false,
})
export class Ppv extends Model<Ppv> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare ID: number;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare Nombre: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare ID_TipoCobro: number;

  @AllowNull(true)
  @Column(DataType.STRING(5))
  declare Padre: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare Valor: number;

  @AllowNull(true)
  @Column(DataType.STRING(1))
  declare Vigencia: string;
}
