import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'TAB_UbicacionPiso',
  timestamps: false,
})
export class TabUbicacionPiso extends Model<TabUbicacionPiso> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(4)) // varchar(4)
  declare TAB_CodigoPiso: string;

  @AllowNull(false)
  @Column(DataType.STRING(40)) // varchar(40)
  declare TAB_DescripcionPiso: string;

  @AllowNull(true)
  @Column(DataType.STRING(4)) // varchar(4), puede ser null
  declare TAB_Edificio: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN) // bit
  declare FLD_Vigencia: boolean;
}
