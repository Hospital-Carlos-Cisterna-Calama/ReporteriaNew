import { Table, Column, Model, DataType, AllowNull, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';

import SerProfesiona from './Profesional';
import  SerServicio  from './SerServicios';

@Table({
  tableName: 'AFC_Nomina',
  schema: 'dbo',
  timestamps: false,
})
export default class Nomina extends Model<Nomina> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare NOM_Folio: number;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare NOM_Uso: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare NOM_Fecha: Date;

  @ForeignKey(() => SerServicio)
  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare NOM_CodigServi: string;

  @BelongsTo(() => SerServicio, {
    foreignKey: 'NOM_CodigServi',
    targetKey: 'SER_SER_Codigo',
  })
  declare Servicio?: SerServicio;

  @ForeignKey(() => SerProfesiona)
  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare NOM_CodigProfe: string;

  @BelongsTo(() => SerProfesiona, {
    foreignKey: 'NOM_CodigProfe',
    targetKey: 'SER_PRO_Rut',
  })
  declare SerProfesiona?: SerProfesiona;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare NOM_Estado: string;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare NOM_CodigLugar: string;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare NOM_CodigEspec: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare NOM_TotalFichas: number;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare NOM_CodigUsuar: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare NOM_FechaGen: Date;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare NOM_Origen: number;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare Folio_Episodio: string;
}
