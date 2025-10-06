import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'TAB_TipoAnest',
  timestamps: false,
})
export class TipoAnest extends Model<TipoAnest> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare TAB_Codigo: string;

  @AllowNull(false)
  @Column(DataType.STRING(30))
  declare TAB_Text: string;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare TAB_Vigencia: string;
}
