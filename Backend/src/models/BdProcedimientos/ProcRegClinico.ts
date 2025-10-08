import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import ProcCitas from './ProcCitas';

@Table({
  tableName: 'PROC_RegClinico',
  schema: 'dbo',
  timestamps: false,
})
export default class ProcRegClinico extends Model {
  @Column(DataType.FLOAT)
  PAC_PAC_Numero!: number | null;

  @ForeignKey(() => ProcCitas)
  @Column(DataType.STRING(20))
  PROC_RC_Correla!: string;

  @Column(DataType.TEXT)
  PROC_RC_TextoInforme!: string;

  @Column(DataType.TEXT)
  PROC_RC_TextoHallazgo!: string;

  @Column(DataType.TEXT)
  PROC_RC_TextoConclusion!: string;

  @Column(DataType.DATE)
  PROC_RC_FechaDig!: Date | null;

  @Column(DataType.STRING(12))
  PROC_RC_UsuarioDig!: string;

  @Column(DataType.STRING(13))
  PROC_RC_ProRut!: string;

  // Relaciones
  @BelongsTo(() => ProcCitas, 'PROC_RC_Correla')
  cita!: ProcCitas;
}
