import { InferAttributes, InferCreationAttributes } from 'sequelize';

export interface contrareferenciaFilas {
    Especialidad: string;
    Nombre: string;
    Rut: string;
    Procedencia: string;
    Médico: string;
    Fecha_Citacion: Date;
    Fecha_Alta: Date;
    Diagnostico: string;
    Tipo_de_Contrareferencia: string;
}
