import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'RPA_Formulario',
  timestamps: false,
})
export class RpaFormulario extends Model<RpaFormulario> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare RPA_FOR_TipoFormu: string;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare RPA_FOR_NumerFormu: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare RPA_FOR_FechaDigit: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare RPA_FOR_FechaSolic: Date;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FOR_TipoPacie: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare RPA_FOR_ProceServi: string;

  @AllowNull(false)
  @Column(DataType.STRING(11))
  declare RPA_FOR_ProceEspec: string;

  @AllowNull(false)
  @Column(DataType.CHAR(10))
  declare RPA_FOR_CodigRecep: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare RPA_FOR_Vigencia: string;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare RPA_FOR_FolioRefer: number;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  declare RPA_FOR_Observacio: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare RPA_FOR_FechaTrasp: Date;

  @AllowNull(true)
  @Column(DataType.STRING(3))
  declare RPA_FOR_Sala: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare RPA_FOR_TimeStamp: Buffer;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  declare PAC_PAC_Numero: number;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare RPA_FOR_ProceDeriv: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FOR_ProfDeriv: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare RPA_FOR_TipoProc: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare SER_PRO_Codigo: string;

  @AllowNull(true)
  @Column(DataType.TINYINT)
  declare RPA_FOR_TipoRecet: number;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare RPA_FOR_CenResDeriv: string;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare RPA_FOR_CenResProce: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare RPA_FOR_SAO: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FOR_TipoPrograma: string;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare RPA_FOR_ComSegurosCodigo: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare RPA_FOR_CiruAmbulatoria: string;
}
