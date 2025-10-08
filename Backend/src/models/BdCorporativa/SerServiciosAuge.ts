import { Table, Column, Model, DataType, PrimaryKey, AllowNull, HasMany } from 'sequelize-typescript';

@Table({
  tableName: 'SER_ServiciosAuge',
  schema: 'dbo',
  timestamps: false,
})
export default class SerServicioAuge extends Model<SerServicioAuge> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare SER_SER_CodigoIfl: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare SER_SER_DescripcioIfl: string;

  @AllowNull(true)
  @Column(DataType.CHAR(30))
  declare SER_SER_UnidadIfl: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare SER_SER_AmbitoIfl: string;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare SER_SER_Especialidad: string;
}
