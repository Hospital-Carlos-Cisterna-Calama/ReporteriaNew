import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'PPV_Servicios',
  timestamps: false,
})
export default class PpvServicios extends Model<PpvServicios> {
  @PrimaryKey
  @AllowNull(true)
  @Column(DataType.INTEGER())
  declare ID: number;

  @AllowNull(false)
  @Column(DataType.CHAR(200))
  declare Servicio: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare Vigente: string;

  @AllowNull(false)
  @Column(DataType.CHAR(50))
  declare Cod_Rel_Servicio: string;

  @AllowNull(true)
  @Column(DataType.INTEGER())
  declare Ambito_Id: number;
}
