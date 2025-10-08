import { Request, Response, NextFunction } from 'express';
import { RpaFormularioService } from '../service/RpaFormulario.service';

const RpaFormulario = new RpaFormularioService();

export class RpaFormularioController {
  static async findReportUrgencias(req: Request, res: Response, next: NextFunction) {
    try {
      const fechaInicio = req.body.fechaInicio;
      const fechaTermino = req.body.fechaTermino;
      const box = req.body.box;
      const tipoFormu = req.body.tipoFormu;

      const results = await RpaFormulario.getInformeUrgencia(fechaInicio, fechaTermino, tipoFormu, box);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
