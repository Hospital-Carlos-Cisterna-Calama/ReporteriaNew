import { Response, Request } from 'express';
import { SiclopeService } from '../service/siclope/Siclope.service';
export class SiclopeController {

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

}