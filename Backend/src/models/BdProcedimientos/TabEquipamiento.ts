import { Table, Column, Model, DataType, AllowNull, PrimaryKey } from 'sequelize-typescript';

/**
 * Modelo para la tabla TAB_Equipamiento
 * Basado en el legacy que usa las columnas reales de la BD
 */
@Table({
  tableName: 'TAB_Equipamiento',
  schema: 'dbo',
  timestamps: false,
})
export default class TabEquipamiento extends Model<TabEquipamiento> {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'TAB_Codigo'
  })
  declare TAB_Codigo: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'TAB_Descripcion'
  })
  declare TAB_Descripcion: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'SER_ESP_Codigo'
  })
  declare SER_ESP_Codigo: string;

  @AllowNull(false)
  @Column({
    type: DataType.CHAR,
    field: 'TAB_Vigencia'
  })
  declare TAB_Vigencia: string;
}