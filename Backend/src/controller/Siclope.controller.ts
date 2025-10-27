import { Request, Response } from 'express';
import { SiclopeService } from '../service/siclope/Siclope.service';

export class SiclopeController {
  static async exportarContrareferencia(req: Request, res: Response) {
    const { fechaInicio, fechaFin } = req.query;
    const service = new SiclopeService();
    return await service.ObtenerListadoContrareferencia(String(fechaInicio), String(fechaFin), res);
  }

  static async reporteNominaPorFecha(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin, rut } = req.query as any;

      const servicio = new SiclopeService();
      await servicio.ObtenerNominaPorFecha(fechaInicio, fechaFin, rut, res);
    } catch (error) {
      console.error('[reporteNominaPorFecha] Error:', error);
      return res.status(500).json({ mensaje: 'No se pudo generar el reporte', detalle: (error as Error).message });
    }
  }
}
