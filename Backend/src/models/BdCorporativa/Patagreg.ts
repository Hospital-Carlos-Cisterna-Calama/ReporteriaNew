import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'PAB_Patagreg',
  timestamps: false,
})
export default class Patagreg extends Model<Patagreg> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(10))
  declare PAB_SOL_Numero: string;

  @AllowNull(false)
  @Column(DataType.CHAR(200))
  declare PAB_PAT_PatologiaAgr: string;

  @AllowNull(true)
  @Column(DataType.DATE())
  declare PAB_PAT_FechaRegis: Date;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare PAB_PAT_Codigo: string;

  @AllowNull(true)
  @Column(DataType.INTEGER())
  declare ID: number;
}
