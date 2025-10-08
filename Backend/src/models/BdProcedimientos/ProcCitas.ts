import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
  tableName: 'PROC_Citas',
  timestamps: false,
})
export default class ProcCitas extends Model<ProcCitas> {
  @PrimaryKey
  @Column(DataType.STRING)
  PROC_PER_Id!: string;

  @Column(DataType.CHAR(8))
  SER_ESP_Codigo!: string;

  @Column(DataType.STRING)
  PROC_PER_Equip!: string;

  @Column(DataType.DATE)
  PROC_CIT_Fecha!: Date;

  @Column(DataType.CHAR(5))
  PROC_CIT_Hora!: string;

  @Column(DataType.INTEGER)
  PROC_CIT_CorrCupo!: number;

  @Column(DataType.CHAR(1))
  PROC_CIT_Bloqueado!: string;

  @Column(DataType.STRING)
  PROC_CIT_SobreCupo!: string;

  @Column(DataType.STRING)
  ID_ListaEspera!: string;

  @Column(DataType.FLOAT)
  PAC_PAC_Numero!: number;

  @Column(DataType.STRING)
  PROC_CIT_Ambito!: string;

  @Column(DataType.STRING)
  PROC_CIT_TipoDerivador!: string;

  @Column(DataType.STRING)
  PROC_CIT_Derivador!: string;

  @Column(DataType.STRING)
  PROC_CIT_EstadoAsistencia!: string;

  @Column(DataType.TEXT)
  PROC_Observacion!: string;

  @Column(DataType.STRING)
  PROC_Prestacion!: string;
}
