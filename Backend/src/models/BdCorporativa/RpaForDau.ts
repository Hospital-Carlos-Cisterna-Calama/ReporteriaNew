import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'RPA_ForDau',
  timestamps: false,
})
export default class RpaForDau extends Model<RpaForDau> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare RPA_FOR_NumerFormu: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare RPA_FOR_TipoFormu: string;

  @AllowNull(true)
  @Column(DataType.TINYINT)
  declare RPA_FDA_MotivConsu: number;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare RPA_FDA_EnferText: string;

  @AllowNull(true)
  @Column(DataType.STRING(15))
  declare RPA_FDA_MedioTrans: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FDA_NumerAmbu: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_TipoAtenc: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_MotConTipo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_MotConUbic: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_ColecIndiv: string;

  @AllowNull(true)
  @Column(DataType.STRING(30))
  declare RPA_FDA_Lugar: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Alcoholemia: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Pronostico: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_DestPaciente: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Estado: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Curacion: string;

  @AllowNull(true)
  @Column(DataType.STRING(200))
  declare RPA_FDA_Observacion: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare RPA_FDA_HoraIngreso: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare RPA_FDA_HoraAtencionMedico: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare RPA_FDA_HoraEgreso: Date;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FDA_TurnoProfe: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FDA_TurnoEnfer: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Glasgow: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FDA_ProfeTurno: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FDA_ProfeTrata: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FDA_DestiOtro: string;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare RPA_FDA_CompText: string;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare RPA_FDA_GlasTot: string;

  @AllowNull(true)
  @Column(DataType.STRING(250))
  declare RPA_FDA_Tratamiento: string;

  @AllowNull(true)
  @Column(DataType.STRING(240))
  declare RPA_FDA_HipotDiagn: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_EnferNotOblig: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_Control: string;

  @AllowNull(true)
  @Column(DataType.STRING(40))
  declare RPA_FDA_NombAcomp: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FDA_RutAcomp: string;

  @AllowNull(true)
  @Column(DataType.STRING(15))
  declare RPA_FDA_TelAcomp: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_ClaseAccidente: string;

  @AllowNull(true)
  @Column(DataType.STRING(200))
  declare RPA_FDA_LugarAcc: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare RPA_FDA_CantAtenc: number;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_Denuncia: string;

  @AllowNull(true)
  @Column(DataType.CHAR(10))
  declare RPA_FDA_No_Placa: string;

  @AllowNull(true)
  @Column(DataType.STRING(5))
  declare RPA_FDA_GradoAlco: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare RPA_FDA_SutuCara: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare RPA_FDA_SutuOtro: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_MotConEnfe: string;

  @AllowNull(true)
  @Column(DataType.CHAR(2))
  declare RPA_FDA_DetalleAcc: string;

  @AllowNull(true)
  @Column(DataType.STRING(4))
  declare RPA_FDA_EmergMed: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare RPA_FDA_CantImpDau: number;

  @AllowNull(true)
  @Column(DataType.CHAR(2))
  declare RPA_FDA_EstadoAtencion: string;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare RPA_FDA_UsuarioAtencion: string;

  @AllowNull(true)
  @Column(DataType.CHAR(20))
  declare RPA_FDA_PronostObs: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_Box: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FDA_ProfRespTrat: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_TipoUrgencia: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_MotCon1Real: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare RPA_FDA_MotCon2Real: string;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare RPA_FDA_EdadAtencion: number;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare RPA_FDA_Especialidad: string;

  @AllowNull(true)
  @Column(DataType.STRING(4))
  declare RPA_FDA_Hospitalizado: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Pertinente: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Categorizacion: string;

  @AllowNull(true)
  @Column(DataType.STRING(1))
  declare RPA_FOR_LlamadoBox: string;

  @AllowNull(true)
  @Column(DataType.CHAR(2))
  declare RPA_FOR_DauSinRut: string;

  @AllowNull(true)
  @Column(DataType.STRING(2500))
  declare RPA_FOR_MotivoSinRut: string;

  @AllowNull(true)
  @Column(DataType.STRING(250))
  declare RPA_FDA_RegistroEnfermeria: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare RPA_FDA_Anamnesis: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare RPA_FDA_ExamenFisico: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare RPA_FDA_Evolucion: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Caracterizacion: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_PatologiaGes: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare RPA_FDA_IndicacionesAlta: string;

  @AllowNull(true)
  @Column(DataType.STRING(250))
  declare RPA_FDA_RecetaMedicamentos: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Reposo: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_ControlPac: string;

  @AllowNull(true)
  @Column(DataType.STRING(5))
  declare RPA_FDA_ControlLugar: string;

  @AllowNull(true)
  @Column(DataType.STRING(30))
  declare RPA_FDA_ControlDetalle: string;

  @AllowNull(true)
  @Column(DataType.STRING(250))
  declare RPA_FDA_CategManual: string;

  @AllowNull(true)
  @Column(DataType.STRING(4))
  declare RPA_FDA_DestinoPacHosp: string;

  @AllowNull(true)
  @Column(DataType.STRING(15))
  declare RPA_FDA_RutMatrona: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare RPA_FDA_FechaCategorizacion: Date;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FDA_Turno: string;

  @AllowNull(true)
  @Column(DataType.STRING(11))
  declare DPA_FDA_CategorizadorIngreso: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FOR_Conciencia: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare RPA_FOR_Permeabilidad: string;

  @AllowNull(true)
  @Column(DataType.STRING(3))
  declare RPA_PatGes: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare RPA_FDA_FechaHosp: Date;

  @AllowNull(true)
  @Column(DataType.CHAR(10))
  declare RPA_FDA_UserIngresoBox: string;

  @AllowNull(true)
  @Column(DataType.CHAR(10))
  declare RPA_FDA_UserEgresoBox: string;

  @AllowNull(true)
  @Column(DataType.STRING(5))
  declare RPA_FOR_QTC: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare RPA_FDA_MedicoAlta: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare LPP: string;
}
