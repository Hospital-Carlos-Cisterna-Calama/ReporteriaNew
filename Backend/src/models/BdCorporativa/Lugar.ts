import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'SER_Lugares',
  timestamps: false,
})
export class Lugar extends Model<Lugar> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare SER_LUG_Codigo: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  declare SER_LUG_Descripcio: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  declare SER_REC_Descripcio: string;

  @AllowNull(false)
  @Column(DataType.STRING(30))
  declare SER_LUG_Ubicacion: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare SER_LUG_TimeStamp: Buffer;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare SER_LUG_SubCodig: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare SER_LUG_Vigencia: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare SER_LUG_TipoLugar: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare SER_SER_Ambito: string;

  @AllowNull(true)
  @Column(DataType.SMALLINT)
  declare GrabaPYXIS: number;
}
