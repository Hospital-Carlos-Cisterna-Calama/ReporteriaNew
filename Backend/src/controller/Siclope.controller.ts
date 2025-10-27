import { Request, Response } from 'express';
import { SiclopeService } from '../service/siclope/Siclope.service';

export class SiclopeController {
  static async exportarContrareferencia(req: Request, res: Response) {
    const { fechaIni, fechaTermino } = req.query;
    const service = new SiclopeService();
    return await service.ObtenerListadoContrareferencia(String(fechaIni), String(fechaTermino), res);
  }

  static async reporteNominaPorFecha(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaTermino, rut } = req.query as any;

      const servicio = new SiclopeService();
      await servicio.ObtenerNominaPorFecha(fechaInicio, fechaTermino, rut, res);
    } catch (error) {
      console.error('[reporteNominaPorFecha] Error:', error);
      return res.status(500).json({ mensaje: 'No se pudo generar el reporte', detalle: (error as Error).message });
    }
  }
  static async exportarDiagnosticosRealizados(req: Request, res: Response) {
    const { fechaIni, fechaTermino, especialidad } = req.query;
    const service = new SiclopeService();
    return await service.ObtenerDiagnosticosRealizados(String(fechaIni), String(fechaTermino), String(especialidad), res);
  }
}
