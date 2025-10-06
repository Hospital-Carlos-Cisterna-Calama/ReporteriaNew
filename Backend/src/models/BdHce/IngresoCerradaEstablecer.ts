import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'HCE_IngresoCerradaEstablecer',
  timestamps: false,
})
export class IngresoCerradaEstablecer extends Model<IngresoCerradaEstablecer> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare numeroPaciente: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare numeroEstadia: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare numeroTraslado: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare fechaIngreso: Date;

  @AllowNull(false)
  @Column(DataType.STRING(15))
  declare usuario: string;

  @AllowNull(false)
  @Column(DataType.TEXT) // nvarchar(max)
  declare antecedentes: string;

  @AllowNull(false)
  @Column(DataType.TEXT) // nvarchar(max)
  declare anamnesis: string;

  @AllowNull(false)
  @Column(DataType.TEXT) // nvarchar(max)
  declare examenFisico: string;

  @AllowNull(false)
  @Column(DataType.TEXT) // nvarchar(max)
  declare diagnostico: string;

  @AllowNull(false)
  @Column(DataType.TEXT) // nvarchar(max)
  declare planTerapeutic: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN) // bit
  declare esGes: boolean;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare tipoGes: number;

  @AllowNull(true)
  @Column(DataType.STRING(6))
  declare CIE10: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fechaEdicion: Date;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare usuarioEdicion2: string;
}
