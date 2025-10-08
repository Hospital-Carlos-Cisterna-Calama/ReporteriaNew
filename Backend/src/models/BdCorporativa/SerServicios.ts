import { Table, Column, Model, DataType, AllowNull, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import SerEspeciali from './SerEspeciali';

@Table({
  tableName: 'SER_Servicios',
  schema: 'dbo',
  timestamps: false,
})
export default class SerServicio extends Model<SerServicio> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare SER_SER_Codigo: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare SER_SER_Descripcio: string;

  @ForeignKey(() => SerEspeciali)
  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare SER_SER_CodigEspec: string;

  @BelongsTo(() => SerEspeciali, {
    foreignKey: 'SER_SER_CodigEspec',
    targetKey: 'SER_ESP_Codigo',
  })
  declare SerEspeciali?: SerEspeciali;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare SER_SER_CodSubEspe: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare SER_SER_Vigencia: string;

  @AllowNull(true)
  @Column(DataType.STRING(30))
  declare SER_SER_Observacio: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare SER_SER_TimeStamp: Buffer;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare SER_SER_Soundex: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SER_SER_Dotacion: number;

  @AllowNull(true)
  @Column(DataType.CHAR(2))
  declare SER_SER_Realiza: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SER_SER_Intervalo: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SER_SER_Grupo: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SER_SER_NroPacientes: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SER_SER_NroControl: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SER_SER_NroNuevos: number;

  @AllowNull(true)
  @Column(DataType.CHAR(2))
  declare SER_SER_Ambito: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SER_SER_TiempoDifer: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SER_SER_TiempoAsignaHora: number;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare SER_SER_TipoHora: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare SER_SER_UsaFicha: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare SER_SER_UsaSesiones: string;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare SER_SER_Especialidad: string;

  @AllowNull(true)
  @Column(DataType.STRING(1))
  declare SER_SER_TipoPedAdulto: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SER_SER_Ifl: number;

  @AllowNull(true)
  @Column(DataType.STRING(6))
  declare SER_SER_Codigo_IEH: string;

  @AllowNull(true)
  @Column(DataType.STRING(1))
  declare SER_SER_Estado: string;

  @AllowNull(true)
  @Column(DataType.STRING(3))
  declare SER_ESP_Tipo: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare SERV: number;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare SER_ESP_PrestMinsal: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare SER_SER_Sinonimo: string;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  declare SER_EsComite: boolean;

  @AllowNull(true)
  @Column(DataType.STRING(5))
  declare SER_SER_NivelCuidado: string;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  declare SER_PermiteMultiplesCitas: boolean;
}
