import { allow } from 'joi';
import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'PAC_Carpeta',
  timestamps: false,
})
export default class Carpeta extends Model<Carpeta> {
  @PrimaryKey
  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare PAC_CAR_NumerFicha: number;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  declare PAC_CAR_Ubicacion: string;

  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare PAC_CAR_EstadoCarpe: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare PAC_CAR_TimeStamp: Buffer;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare PAC_PAC_Numero: number;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAC_CAR_FechaCrea: Date;

  @AllowNull(false)
  @Column(DataType.CHAR(6))
  declare PAC_CAR_Servicio: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  declare PAC_CAR_Usuario: string;

  @AllowNull(false)
  @Column(DataType.CHAR(6))
  declare PAC_CAR_FormaCarpe: string;

  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare PAC_CAR_Copia: string;

  @AllowNull(false)
  @Column(DataType.CHAR(2))
  declare PAC_CAR_Extraviada: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAC_CAR_FechaExtra: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAC_CAR_FechaPasiva: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare PAC_CAR_FechaCopia: Date;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare PAC_CAR_FichaAnt: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare PAC_CAR_ServiSalud: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare PAC_CAR_Consultorio: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAC_CAR_NumerUltCop: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare PAC_CAR_CopiasVig: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare Fld_CopiasImpresa: number;

  @AllowNull(false)
  @Column(DataType.STRING(2))
  declare PAC_CAR_CodBarraImp: string;
}
