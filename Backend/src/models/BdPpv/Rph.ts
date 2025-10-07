import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'RPH',
  timestamps: false,
})
export class Rph extends Model<Rph> {
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

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_servicio: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_usuario_reg: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare RPH_usuario_upd: string;
}
