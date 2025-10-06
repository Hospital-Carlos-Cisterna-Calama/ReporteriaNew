import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { RpaFormularioService } from '../service/RpaFormulario.service';

const RpaFormulario = new RpaFormularioService();

export class RpaFormularioController {
  static async findReportUrgencias(req: Request, res: Response, next: NextFunction) {
    try {
      const fechaInicioStr = req.params.fechaInicio;
      const fechaTerminoStr = req.params.fechaTermino;
      const tipoFormulario = req.params.tipoFormulario;

      const fechaInicio = new Date(fechaInicioStr);
      const fechaTermino = new Date(fechaTerminoStr);

      const results = await RpaFormulario.getInformeUrgencia(fechaInicio, fechaTermino, tipoFormulario, 'M');
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
