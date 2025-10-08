import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'HCE_EvolucionHospitalizacion',
  timestamps: false,
})
export default class EvolucionHospitalizacion extends Model<EvolucionHospitalizacion> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare HCE_Id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare HCE_Periodo: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  declare HCE_PAC_Numero: number;

  @AllowNull(true)
  @Column(DataType.STRING(12))
  declare HCE_SER_Codigo: string;

  @AllowNull(true)
  @Column(DataType.STRING(13))
  declare SER_PRO_Rut: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare HCE_Fecha_Solicitud: Date;

  @AllowNull(false)
  @Column(DataType.STRING(1))
  declare HCE_Ambito: string;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare SER_OBJ_NumPieza: string;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare ATC_EST_CamaActua: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  declare ATC_EST_Numero: number;

  @AllowNull(false)
  @Column(DataType.BLOB) // varbinary(max)
  declare HCE_text1: Buffer;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare HCE_Vigencia: boolean;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare HCE_Especialidad: string;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare HCE_ServicioAmbulatorio: string;

  @AllowNull(true)
  @Column(DataType.TEXT) // varchar(max)
  declare HCE_Diagnostico: string;
}
