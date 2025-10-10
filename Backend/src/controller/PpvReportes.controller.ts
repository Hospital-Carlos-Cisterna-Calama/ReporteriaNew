import { Request, Response } from 'express';
import { HospitalizacionesPorServicioService } from '../service/ppv/HospitalizacionesPorServicio.service';
import { IngresosEgresosService } from '../service/ppv/IngresosEgresos.service';
import { IntervencionPabellonService } from '../service/ppv/IntervencionPabellon.service';
import { IrGrdService } from '../service/ppv/IrGrd.service';
import { ListaEsperaGastroenterologiaService } from '../service/ppv/ListaEsperaGastroenterologia.service';
import { PacienteHospitalizadoService } from '../service/ppv/PacienteHospitalizado.service';
import { ProcedimientosRealizadosService } from '../service/ppv/ProcedimientosRealizados.service';

export class PpvReportesController {
  static async exportarHospitalizacionesPorServicios(req: Request, res: Response) {
    try {
      const servicios = req.query.servicios
        ? Array.isArray(req.query.servicios)
          ? req.query.servicios.map(Number)
          : String(req.query.servicios).split(',').map(Number)
        : [];

      const fechaInicio = String(req.query.fechaInicio);
      const fechaFin = String(req.query.fechaFin);

      if (!servicios.length) {
        return res.status(400).json({ message: 'Debe indicar al menos un servicio (servicios=1,2,3)' });
      }
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: 'Debe indicar fechaInicio y fechaFin' });
      }

      const servicio = new HospitalizacionesPorServicioService();
      await servicio.exportarReporte(servicios, fechaInicio, fechaFin, res);
    } catch (error) {
      console.error('❌ Error al exportar hospitalizaciones por servicio:', error);
      res.status(500).json({ message: 'Error al generar el reporte de hospitalizaciones por servicio' });
    }
  }

  static async exportarIngresosEgresos(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin, unidad, filtro } = req.body;
      const servicio = new IngresosEgresosService();
      await servicio.exportarReporte(res, unidad, fechaInicio, fechaFin, filtro);
    } catch (error) {
      console.error('❌ Error al exportar ingresos/egresos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de ingresos y egresos' });
    }
  }

  static async exportarIntervencionPabellon(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin } = req.query as any;

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          message: 'Debe indicar fechaInicio y fechaFin en la URL',
        });
      }
      const servicio = new IntervencionPabellonService();
      await servicio.exportarReporte(fechaInicio, fechaFin, res);
    } catch (error) {
      console.error('❌ Error al exportar Intervención Pabellón:', error);
      res.status(500).json({
        message: 'Error al generar el reporte de Intervención Pabellón',
      });
    }
  }

  static async exportarIrGrd(req: Request, res: Response) {
    try {
      const fechaInicio = req.query.fechaInicio?.toString() || req.body.fechaInicio;
      const fechaFin = req.query.fechaFin?.toString() || req.body.fechaFin;

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          message: 'Debe especificar "fechaInicio" y "fechaFin" como parámetros o en el cuerpo.',
        });
      }

      const servicio = new IrGrdService();
      await servicio.exportarTxt(res, fechaInicio, fechaFin);
    } catch (error) {
      console.error('❌ Error al exportar IR-GRD:', error);
      res.status(500).json({ message: 'Error al generar el reporte IR-GRD' });
    }
  }

  static async exportarListaEspera(req: Request, res: Response) {
    try {
      // TODO: Implementar servicio de lista de espera
      res.status(501).json({ message: 'Servicio de lista de espera en desarrollo' });

      const { fechaInicio, fechaFin, tipo_reporte } = req.body;
      const servicio = new ListaEsperaGastroenterologiaService();
      await servicio.exportarReporte(fechaInicio, fechaFin, tipo_reporte, res);
    } catch (error) {
      console.error('❌ Error al exportar lista de espera:', error);
      res.status(500).json({ message: 'Error al generar el reporte de lista de espera' });
    }
  }

  static async exportarPacientesHospitalizados(req: Request, res: Response) {
    try {
      const fechaInicio = req.query.fechaInicio?.toString();
      const fechaFin = req.query.fechaFin?.toString();

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: 'Debe indicar fechaInicio y fechaFin' });
      }

      const servicio = new PacienteHospitalizadoService();
      await servicio.exportarReporte(fechaInicio, fechaFin, res);
    } catch (error) {
      console.error('❌ Error al exportar pacientes hospitalizados:', error);
      res.status(500).json({ message: 'Error al generar el reporte de pacientes hospitalizados' });
    }
  }

  static async exportarProcedimientos(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin, selectEspec, PadreEsp } = req.query as any;

      console.log('📅 Inicio:', fechaInicio);
      console.log('📅 Fin:', fechaFin);
      console.log('👨‍⚕️ Especialidad:', selectEspec);
      console.log('🏥 PadreEsp:', PadreEsp);

      if (!fechaInicio || !fechaFin || !selectEspec) {
        return res.status(400).json({ message: 'Debe indicar fechaInicio, fechaFin y selectEspec.' });
      }

      const servicio = new ProcedimientosRealizadosService();
      await servicio.exportarReporte(res, fechaInicio, fechaFin, selectEspec, PadreEsp);
    } catch (error) {
      console.error('❌ Error al exportar procedimientos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de procedimientos.' });
    }
  }
}
