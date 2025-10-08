import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'Solicitud_Prestacion',
  timestamps: false,
})
export default class SolicitudPrestacion extends Model<SolicitudPrestacion> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare rut_paciente: string;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare ficha_paciente: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare comuna: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare SSSolicitud: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare estaSolicitud: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare espeSolicitud: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare estaDerivacion: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare espeDerivacion: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare tipoConsulta: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare otro: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare diagnostico: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare profesional: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare created_by: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare created_at: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fecha_solicitud: Date;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare updated_by: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare deleted_by: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare vigencia: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare estado: string;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare reporte: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAC_PAC_Numero: number;
}
