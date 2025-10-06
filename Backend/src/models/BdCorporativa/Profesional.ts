import { Table, Column, Model, DataType, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'SER_Profesiona',
  timestamps: false,
})
export class SerProfesiona extends Model<SerProfesiona> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare SER_PRO_Rut: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare SER_PRO_Tipo: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare SER_PRO_ApellPater: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare SER_PRO_ApellMater: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  declare SER_PRO_Nombres: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare SER_PRO_Estado: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  declare SER_PRO_Direccion: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare SER_PRO_Telefono: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  declare SER_PRO_Observacio: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare SER_PRO_TimeStamp: Buffer | null;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare SER_PRO_Soundex: string;

  @AllowNull(true)
  @Column(DataType.TINYINT)
  declare SER_PRO_TipoReceta: number | null;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare SER_PRO_Procedencia: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare Farmacia: string | null;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare SER_PRO_Agenda: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(40))
  declare SER_PRO_NomSocial: string | null;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare SER_PRO_EsSocial: string | null;
}
