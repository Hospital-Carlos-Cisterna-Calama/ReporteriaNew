import { Table, Column, Model, DataType, PrimaryKey, AllowNull, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
  tableName: 'Camas_Criticas',
  timestamps: false,
})
export default class CamasCritica extends Model<CamasCritica> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare pac_numero: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare rut_paciente: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare contacto_paciente: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare date_ingreso: Date;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare diagnostico_ingreso: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare apache: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare date_egreso: Date;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare diagnostico_egreso: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare destino_egreso: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare medico_responsable: string;

  @AllowNull(true)
  @Column(DataType.STRING(5))
  declare especialidad_medico: string;
  
  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare coronario: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare aisl: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare criterios_i: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare criterios_e: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare lpp: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare caidas: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare error_medico: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare unidad_id: number;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare created_by: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare updated_by: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare deleted_by: string;

  @AllowNull(true)
  @Column(DataType.STRING(1))
  declare estado: string;

}
