import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import PpvServicios from './PpvServicios';

@Table({
  tableName: 'RPH',
  timestamps: false,
})
export default class Rph extends Model<Rph> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare RPH_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_PAC_Numero: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_edad: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_id_cama: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_cama: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_tipo_cama: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_diag: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_pcr: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_angiotac: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_sato2: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_med_vent: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_disp_vent: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_prono: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_dias_est: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_dias_vmi: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_estado_pac: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_rd: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_TRIAGE: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare RPH_fecha_reg: Date;

  @ForeignKey(() => PpvServicios)
  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare RPH_servicio: string;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare RPH_PAC_Numero_FK: string;

  // ==========================
  // RELACIONES
  // ==========================
  @BelongsTo(() => PpvServicios, { foreignKey: 'RPH_servicio', targetKey: 'ID', as: 'Servicio' })
  declare Servicio?: PpvServicios;
}
