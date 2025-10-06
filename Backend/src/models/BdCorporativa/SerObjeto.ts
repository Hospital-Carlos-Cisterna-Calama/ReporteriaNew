import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'SER_Objetos',
  timestamps: false,
})
export class SerObjeto extends Model<SerObjeto> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare SER_OBJ_Codigo: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  declare SER_OBJ_Descripcio: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare SER_OBJ_Vigencia: string;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare SER_OBJ_Estado: string;

  @AllowNull(false)
  @Column(DataType.CHAR(8))
  declare SER_OBJ_Ubicacion: string;

  @AllowNull(true)
  @Column(DataType.BLOB)
  declare SER_OBJ_TimeStamp: Buffer;

  @AllowNull(false)
  @Column(DataType.CHAR(4))
  declare SER_REC_Tipo: string;

  @AllowNull(false)
  @Column(DataType.CHAR(1))
  declare SER_OBJ_Sexo: string;

  @AllowNull(true)
  @Column(DataType.CHAR(10))
  declare SER_OBJ_NumPieza: string;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare SER_SER_Codigo: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare SER_OBJ_TipoCama: string;

  @AllowNull(true)
  @Column(DataType.CHAR(4))
  declare SER_OBJ_CausaNoDisp: string;

  @AllowNull(true)
  @Column(DataType.CHAR(8))
  declare SER_ESP_Codigo: string;

  @AllowNull(true)
  @Column(DataType.STRING(2))
  declare IND_CAM_SuperNum: string;

  @AllowNull(true)
  @Column(DataType.STRING(6))
  declare IND_CAM_Bloque: string;

  @AllowNull(true)
  @Column(DataType.STRING(6))
  declare IND_CAM_Tipo: string;

  @AllowNull(true)
  @Column(DataType.STRING(8))
  declare IND_CAM_Piso: string;

  @AllowNull(true)
  @Column(DataType.STRING(1))
  declare SER_OBJ_Ventilador: string;

  @AllowNull(true)
  @Column(DataType.STRING(1))
  declare SER_OBJ_Oxigeno: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare ID_Sala: number;
}
