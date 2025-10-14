import { Request, Response } from 'express';
import { UrgenciaService } from '../service/urgencias/Urgencia.service';
const UrgenciaServices = new UrgenciaService();

export class UrgenciaController {
  static async reporteUrgencia(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaTermino, tipo } = req.query as any;

      if (!fechaInicio || !fechaTermino || !tipo) {
        return res.status(400).json({ message: 'Debe indicar fechaInicio, fechaFin y tipo' });
      }
      const registros = await UrgenciaServices.ObtenerUrgencia(fechaInicio, fechaTermino, tipo, res);

      if (!registros) {
        console.error(`❌ No se encontró registros `);
        return res.status(404).json({ message: `No se encontró registros. Verifique el nombre del servicio.` });
      }
    } catch (error) {
      console.error('❌ Error al exportar ingresos/egresos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de ingresos y egresos' });
    }
  }

  static async reporteUrgenciaDoceHoras(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaTermino } = req.query as any;

      if (!fechaInicio || !fechaTermino) {
        return res.status(400).json({ message: 'Debe indicar fechaInicio, fechaFin' });
      }
      const registros = await UrgenciaServices.ObtenerUrgenciaDoceHoras(fechaInicio, fechaTermino, res);

      if (!registros) {
        console.error(`❌ No se encontró registros `);
        return res.status(404).json({ message: `No se encontró registros. Verifique el nombre del servicio.` });
      }
    } catch (error) {
      console.error('❌ Error al exportar ingresos/egresos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de ingresos y egresos' });
    }
  }

  static async reporteUrgenciaCategorizaciones(req: Request, res: Response) {
    try {
      const { fecha } = req.query as any;

      if (!fecha) {
        return res.status(400).json({ message: 'Debe indicar fecha' });
      }
      const registros = await UrgenciaServices.ObtenerCategorizadores(fecha, res);

      if (!registros) {
        console.error(`❌ No se encontró registros `);
        return res.status(404).json({ message: `No se encontró registros. Verifique el nombre del servicio.` });
      }
    } catch (error) {
      console.error('❌ Error al exportar ingresos/egresos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de ingresos y egresos' });
    }
  }

  static async reporteUrgenciaHospitalizado(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaTermino, tipo } = req.query as any;

      if (!fechaInicio || !fechaTermino || !tipo) {
        return res.status(400).json({ message: 'Debe indicar fechaInicio, fechaFin y tipo' });
      }
      const registros = await UrgenciaServices.ObtenerUrgenciaHospitalizado(fechaInicio, fechaTermino, tipo, res);

      if (!registros) {
        console.error(`❌ No se encontró registros `);
        return res.status(404).json({ message: `No se encontró registros. Verifique el nombre del servicio.` });
      }
    } catch (error) {
      console.error('❌ Error al exportar ingresos/egresos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de ingresos y egresos' });
    }
  }

  static async reporteIras(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaTermino, tipo } = req.query as any;

      if (!fechaInicio || !fechaTermino || !tipo) {
        return res.status(400).json({ message: 'Debe indicar fechaInicio, fechaFin y tipo' });
      }
      const registros = await UrgenciaServices.ObtenerInformeIras(fechaInicio, fechaTermino, tipo, res);

      if (!registros) {
        console.error(`❌ No se encontró registros `);
        return res.status(404).json({ message: `No se encontró registros. Verifique el nombre del servicio.` });
      }
    } catch (error) {
      console.error('❌ Error al exportar ingresos/egresos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de ingresos y egresos' });
    }
  }
}
