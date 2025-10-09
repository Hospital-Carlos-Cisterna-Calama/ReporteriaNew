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
      const { fechaInicio, fechaFin, servicios } = req.body; 
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
      const { fechaInicio, fechaFin } = req.body;
      const servicio = new IntervencionPabellonService();
      const resultado = await servicio.exportarReporte(fechaInicio, fechaFin);
      res.json(resultado);
    } catch (error) {
      console.error('❌ Error al exportar intervenciones de pabellón:', error);
      res.status(500).json({ message: 'Error al generar el reporte de intervenciones de pabellón' });
    }
  }

  static async exportarIrGrd(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin } = req.body;
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
      
      // const { fechaInicio, fechaFin, tipo } = req.body;
      // const servicio = new ListaEsperaGastroenterologiaService();
      // await servicio.exportarReporte(fechaInicio, fechaFin, tipo, res);
    } catch (error) {
      console.error('❌ Error al exportar lista de espera:', error);
      res.status(500).json({ message: 'Error al generar el reporte de lista de espera' });
    }
  }

  static async exportarPacientesHospitalizados(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin, servicioId } = req.body;
      const servicio = new PacienteHospitalizadoService();
      await servicio.exportarReporte(fechaInicio, fechaFin, servicioId, res);
    } catch (error) {
      console.error('❌ Error al exportar pacientes hospitalizados:', error);
      res.status(500).json({ message: 'Error al generar el reporte de pacientes hospitalizados' });
    }
  }

  static async exportarProcedimientos(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin, especialidad } = req.body;
      const servicio = new ProcedimientosRealizadosService();
      await servicio.exportarReporte(fechaInicio, fechaFin, especialidad, res);
    } catch (error) {
      console.error('❌ Error al exportar procedimientos:', error);
      res.status(500).json({ message: 'Error al generar el reporte de procedimientos' });
    }
  }
}
