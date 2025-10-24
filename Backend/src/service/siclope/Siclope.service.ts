import { QueryTypes } from 'sequelize';
import { sequelize } from '../../config/initDatabase';
import { Response } from 'express';

export class SiclopeService {

    async ObtenerNominaPorFecha(fechaIni: string, fechaTermino: string,  rut: string, res: Response) {


    }

    async ObtenerListadoContrareferencia(fechaIni: string, fechaTermino: string, res: Response) {

    }

    async ObtenerDiagnosticosRealizados(fechaIni: string, fechaTermino: string, especialidad: string, res: Response) {

    }
}