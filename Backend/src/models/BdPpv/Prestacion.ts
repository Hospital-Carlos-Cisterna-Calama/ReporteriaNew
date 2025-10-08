import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'Prestacion',
  timestamps: false,
})
export default class Prestacion extends Model<Prestacion> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare id_solicitud: number;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare rut_paciente: string;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare ficha_paciente: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fecha_solicitud: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fecha_realizacion: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fecha_digitacion: Date;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare diagnostico: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare grupo_prestacion: string;

  @AllowNull(false)
  @Column(DataType.CHAR(9))
  declare prestacion: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare biopsia: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare unidad_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare created_by: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare updated_by: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare deleted_by: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare vigencia: string;
}
