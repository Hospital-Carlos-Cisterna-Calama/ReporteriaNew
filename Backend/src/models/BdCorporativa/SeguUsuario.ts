import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'Segu_Usuarios',
  timestamps: false,
})
export class SeguUsuario extends Model<SeguUsuario> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare Segu_Usr_Cuenta: string;

  @AllowNull(false)
  @Column(DataType.STRING(30))
  declare Segu_Usr_Nombre: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare Segu_Usr_ApellidoPaterno: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare Segu_Usr_ApellidoMaterno: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare Segu_Usr_RUT: string;

  @AllowNull(true)
  @Column(DataType.STRING(40))
  declare Segu_Usr_Descripcion: string;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare Segu_Usr_FuncionAdmnistr: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare Segu_Usr_Codigo: string;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare Segu_FLD_CCCODIGO: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare Segu_Vigente: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare ID_Establecimiento: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare Segu_Usr_CambioClave: Date;

  @AllowNull(true)
  @Column(DataType.STRING(14))
  declare Segu_Usr_Fono: string;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare Segu_Usr_Mail: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare Segu_Usr_CambioCodigo: Date;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare Segu_Usr_CodigoAnt: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare enfESI: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare Segu_Usr_FechaCreacion: Date;
}
