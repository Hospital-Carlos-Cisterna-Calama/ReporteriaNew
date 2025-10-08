import { Table, Column, Model, DataType, PrimaryKey, AllowNull, AutoIncrement } from 'sequelize-typescript';

@Table({
  tableName: 'Donaciones',
  timestamps: false,
})
export default class Donaciones extends Model<Donaciones> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare rut_paciente: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare ficha_paciente: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare diagnostico_ingreso: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare unidad_responsable: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare notificacion: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare notificacion_hra: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare glasgow: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare estado: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare notificacion_nombre: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare diagnostico_egreso: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare observacion: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare creador: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fecha_creacion: Date;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare actualiza: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fecha_actualizacion: Date;
}
