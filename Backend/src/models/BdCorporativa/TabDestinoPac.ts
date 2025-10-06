import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'TAB_DestinoPac',
  timestamps: false,
})
export class TabDestinoPac extends Model<TabDestinoPac> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare TAB_Codigo: number;

  @AllowNull(false)
  @Column(DataType.STRING(30))
  declare TAB_Text: string;

  @AllowNull(true)
  @Column(DataType.CHAR(1))
  declare TAB_Vigencia: string;
}
