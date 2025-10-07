import { Request, Response, NextFunction } from 'express';
import { RpaFormularioService } from '../service/RpaFormulario.service';

const RpaFormulario = new RpaFormularioService();

export class RpaFormularioController {
  static async reporteUrgencia(req: Request, res: Response, next: NextFunction) {
    try {
      const fechaInicio = req.body.fechaInicio;
      const fechaTermino = req.body.fechaTermino;
      const box = req.body.box;

      const results = await RpaFormulario.ObtenerUrgencia(fechaInicio, fechaTermino, box);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  static async reporteUrgenciaDoceHoras(req: Request, res: Response, next: NextFunction) {
    try {
      const fechaInicio = req.body.fechaInicio;
      const fechaTermino = req.body.fechaTermino;

      const results = await RpaFormulario.ObtenerUrgenciaDoceHoras(fechaInicio, fechaTermino);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  static async reporteUrgenciaCategorizaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const fecha = req.body.fechaInicio;
      const results = await RpaFormulario.ObtenerCategorizadores(fecha);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  static async reporteUrgenciaHospitalizado(req: Request, res: Response, next: NextFunction) {
    try {
      const fechaInicio = req.body.fechaInicio;
      const fechaTermino = req.body.fechaTermino;
      const box = req.body.box;

      const results = await RpaFormulario.ObtenerUrgenciaHospitalizado(fechaInicio, fechaTermino, box);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  static async reporteIras(req: Request, res: Response, next: NextFunction) {
    try {
      const fechaInicio = req.body.fechaInicio;
      const fechaTermino = req.body.fechaTermino;
      const box = req.body.box;

      const results = await RpaFormulario.ObtenerInformeIras(fechaInicio, fechaTermino, box);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
