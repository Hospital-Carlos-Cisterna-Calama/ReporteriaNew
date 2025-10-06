import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'MC_TAB_Salas',
  timestamps: false,
})
export class McTabSala extends Model<McTabSala> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare ID_Sala: number;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare SAL_NumPieza: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare SAL_TipoPieza: string;

  @AllowNull(true)
  @Column(DataType.STRING(6))
  declare IND_CAM_Tipo: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare SAL_Sexo: string;

  @AllowNull(true)
  @Column(DataType.CHAR(200))
  declare SAL_Descripcion: string;

  @AllowNull(true)
  @Column(DataType.STRING(4))
  declare TAB_CodigoPiso: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare SER_Vigencia: boolean;

  @AllowNull(true)
  @Column(DataType.STRING(4))
  declare TAB_Codigo: string;
}
