import { Table, Column, Model, DataType, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'SER_Especiali',
  timestamps: false,
})
export default class SerEspeciali extends Model<SerEspeciali> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare SER_ESP_Codigo: string;

  @AllowNull(true)
  @Column(DataType.STRING(40))
  declare SER_ESP_Descripcio: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare SER_ESP_Vigencia: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare SER_ESP_TimeStamp: Buffer;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare SER_ESP_Soundex: string;

  @AllowNull(true)
  @Column(DataType.STRING(6))
  declare SER_ESP_Codigo_IEH: string;

  @AllowNull(true)
  @Column(DataType.STRING(9))
  declare SER_SER_PrestMinsal: string;

  @AllowNull(true)
  @Column(DataType.STRING(3))
  declare SER_ESP_Deis_2010: string;

  @AllowNull(true)
  @Column(DataType.STRING(5))
  declare SER_ESP_NivelCuidado: string;

  @AllowNull(true)
  @Column(DataType.STRING(5))
  declare SER_PAB_Codigo: string;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare SER_PAB_Descripcio: string;
}
