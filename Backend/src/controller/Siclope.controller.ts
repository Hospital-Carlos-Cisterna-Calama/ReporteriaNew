import { Request, Response } from 'express';
import { SiclopeService } from '../service/siclope/Siclope.service';

export class SiclopeController {
  static async exportarContrareferencia(req: Request, res: Response) {
    const { fechaIni, fechaTermino } = req.query;
    const service = new SiclopeService();
    return await service.ObtenerListadoContrareferencia(String(fechaIni), String(fechaTermino), res);
  }
}
