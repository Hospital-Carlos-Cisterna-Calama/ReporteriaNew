import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'SER_Especiali',
  timestamps: false,
})
export class Ambito extends Model<Ambito> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare SER_ESP_Codigo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(40))
  declare SER_ESP_Descripcio: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare SER_ESP_Vigencia: string;

  @AllowNull(false)
  @Column(DataType.BLOB)
  declare SER_ESP_TimeStamp: Buffer;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare SER_ESP_Soundex: string;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare SER_ESP_Codigo_IEH: string;

  @AllowNull(false)
  @Column(DataType.STRING(9))
  declare SER_SER_PrestMinsal: string;

  @AllowNull(false)
  @Column(DataType.STRING(3))
  declare SER_ESP_Deis_2010: string;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  declare SER_ESP_NivelCuidado: string;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  declare SER_PAB_Codigo: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare SER_PAB_Descripcio: string;
}
