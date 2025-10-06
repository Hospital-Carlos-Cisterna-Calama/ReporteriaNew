import { Table, Column, Model, DataType, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'URG_Registro',
  timestamps: false, // La tabla ya trae UpdatedAt propia y no sigue el convenio de Sequelize
})
export class UrgRegistro extends Model<UrgRegistro> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare URG_REG_NumerFormu: string;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare URG_REG_Corr: number;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  declare URG_REG_CodReg: string | null;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare URG_REG_FechaDigit: Date;

  @AllowNull(false)
  @Column(DataType.STRING(8))
  declare URG_REG_HoraDigit: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare URG_REG_TipoReg: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare URG_REG_CodigUsuar: string;

  @AllowNull(true)
  @Column(DataType.STRING(1))
  declare URG_REG_Realizado: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare URG_REG_CodUserRealiza: string | null;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare Fld_NroReceta: number | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare Fld_msje: string | null;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare UpdatedAt: Date | null;
}
