import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'IngresoPpv',
  timestamps: false,
})
export default class IngresoPpv extends Model<IngresoPpv> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare ID: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare id_PPV: number;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare rut_paciente: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fechaInicio: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fechaTermino: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fechaDigit: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare unidad_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare created_by: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare updated_by: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare deleted_by: string;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare ficha_paciente: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare vigencia: string;

  @AllowNull(true)
  @Column(DataType.STRING(1))
  declare estado: string;
}
