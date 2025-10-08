import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { LucideAngularModule, FileText, Clock, Building, TrendingUp, LucideIconData } from 'lucide-angular';
import { SidebarComponent, SidebarItem } from '../../../shared/components/sidebar/sidebar.component';
import { ModalResultadoComponent, BannerInstruccionesComponent, type ConfiguracionModal } from '../../../shared/components/ui';
import type { ReporteUrgeciaHosQuery, ReporteUrgenciaDoceHorasQuery, ReporteUrgenciaQuery, ReporteUrgIrasQuery, ResporteUrgeciaCatQuery } from '../../interfaces/dto.interface';

import {
  FiltrosReporteComponent,
  EstadoVacioComponent,
  type FiltrosReporte,
  type EstadisticaReporte
} from '../../components';
import { UrgenciaService } from '@app/urgencia/services/urgencia.service';

@Component({
  selector: 'app-urgencia-page',
  imports: [
    SidebarComponent,
    LucideAngularModule,
    FiltrosReporteComponent,
    EstadoVacioComponent,
    ModalResultadoComponent,
    BannerInstruccionesComponent
  ],
  templateUrl: './urgencia-page.component.html',
})
export class UrgenciaPageComponent {
  private readonly urgenciaService = inject(UrgenciaService);
  private readonly destroyRef = inject(DestroyRef);

  // Iconos
  readonly iconos: Record<string, LucideIconData> = {
    FileText,
    Clock,
    Building,
    TrendingUp
  };

  // Estado del sidebar
  sidebarAbierto = signal(true);

  // Estado de carga y modal
  cargandoReporte = signal(false);
  mostrarModal = signal(false);
  configuracionModal = signal<ConfiguracionModal>({
    tipo: 'info',
    titulo: '',
    mensaje: ''
  });

  // Opciones de reportes
  readonly reportes = signal<SidebarItem[]>([
    {
      title: 'Urgencias',
      icon: 'FileText',
      description: 'Reporte general de atenciones de urgencia'
    },
    {
      title: 'Urgencias (12-Horas)',
      icon: 'Clock',
      description: 'Reporte de urgencias de las últimas 12 horas'
    },
    {
      title: 'Categorizaciones',
      icon: 'TrendingUp',
      description: 'Reporte de categorización de pacientes'
    },
    {
      title: 'Urgencias - Hospitalizado',
      icon: 'Building',
      description: 'Pacientes de urgencia hospitalizados'
    },
    {
      title: 'I.R.A.S',
      icon: 'FileText',
      description: 'Infecciones Respiratorias Agudas'
    }
  ]);

  // Reporte seleccionado
  reporteSeleccionado = signal<string | null>(null);

  // Estadísticas del sistema
  readonly estadisticas = signal<EstadisticaReporte[]>([
    { etiqueta: 'Reportes Disponibles', valor: '5', icono: '📊' },
    { etiqueta: 'Última Actualización', valor: 'Hoy', icono: '🕐' },
    { etiqueta: 'Formatos', valor: 'Excel', icono: '📑' },
    { etiqueta: 'Estado', valor: 'Activo', icono: '✅' }
  ]);

  alternarSidebar() {
    this.sidebarAbierto.set(!this.sidebarAbierto());
  }

  seleccionarReporte(titulo: string) {
    this.reporteSeleccionado.set(titulo);
  }

  descargarReporte(filtros: FiltrosReporte) {
    const reporte = this.reporteSeleccionado();
    if (!reporte) return;

    switch (reporte) {
      case 'Urgencias':
        this.generarReporteUrgencias(filtros);
        break;
      case 'Urgencias (12-Horas)':
        this.generarReporteUrgencias12Horas(filtros);
        break;
      case 'Categorizaciones':
        this.generarReporteCategorizaciones(filtros);
        break;
      case 'Urgencias - Hospitalizado':
        this.generarReporteUrgenciasHospitalizados(filtros);
        break;
      case 'I.R.A.S':
        this.generarReporteIras(filtros);
        break;
      default:
        console.warn('Reporte no implementado:', reporte);
    }
  }

  limpiarFiltros() {
    console.log('Limpiando filtros');
  }

  // ============================================================================
  // GENERADORES DE REPORTES
  // ============================================================================

  private generarReporteUrgencias(filtros: FiltrosReporte) {
    if (!this.validarFechas(filtros)) return;

    // Mapear 'todos' | 'urgencias' | 'maternidad' a 'A' | 'U' | 'M'
    const tipoMap: { [key: string]: 'A' | 'U' | 'M' } = {
      'todos': 'A',
      'urgencias': 'U',
      'maternidad': 'M'
    };

    const query: ReporteUrgenciaQuery = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaTermino: this.formatearFecha(filtros.fechaFin!),
      tipo: tipoMap[filtros.tipoReporte || 'todos'] || 'A'
    };

    this.cargandoReporte.set(true);
    this.urgenciaService.generarReporteUrgencias(query)
      .pipe(
        finalize(() => this.cargandoReporte.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (blob) => {
          const nombre = `reporte-urgencias-${filtros.tipoReporte}-${query.fechaInicio}-${query.fechaTermino}.xlsx`;
          this.descargarBlob(blob, nombre);
          this.mostrarExito('Reporte de Urgencias generado correctamente');
        },
        error: (err) => this.mostrarError(err.message)
      });
  }

  private generarReporteUrgencias12Horas(filtros: FiltrosReporte) {
    if (!this.validarFechas(filtros)) return;

    const query: ReporteUrgenciaDoceHorasQuery = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaTermino: this.formatearFecha(filtros.fechaFin!)
    };

    this.cargandoReporte.set(true);
    this.urgenciaService.generarReporteUrgencias12Horas(query)
      .pipe(
        finalize(() => this.cargandoReporte.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (blob) => {
          const nombre = `reporte-urgencias-12horas-${query.fechaInicio}-${query.fechaTermino}.xlsx`;
          this.descargarBlob(blob, nombre);
          this.mostrarExito('Reporte de Urgencias (12 Horas) generado correctamente');
        },
        error: (err) => this.mostrarError(err.message)
      });
  }

  private generarReporteCategorizaciones(filtros: FiltrosReporte) {
    if (!filtros.mes || !filtros.anio) {
      this.mostrarError('Debe seleccionar un mes y año');
      return;
    }

    // ResporteUrgeciaCatQuery espera formato YYYY-MM
    const mes = String(filtros.mes).padStart(2, '0');
    const anio = String(filtros.anio);
    const fechaFormateada = `${anio}-${mes}`;

    const query: ResporteUrgeciaCatQuery = {
      fecha: fechaFormateada
    };

    this.cargandoReporte.set(true);
    this.urgenciaService.generarReporteUrgenciaCetegorizaciones(query)
      .pipe(
        finalize(() => this.cargandoReporte.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (blob) => {
          const nombreMes = this.obtenerNombreMes(filtros.mes!);
          const nombre = `reporte-categorizaciones-${nombreMes}-${filtros.anio}.xlsx`;
          this.descargarBlob(blob, nombre);
          this.mostrarExito('Reporte de Categorizaciones generado correctamente');
        },
        error: (err) => this.mostrarError(err.message)
      });
  }

  private generarReporteUrgenciasHospitalizados(filtros: FiltrosReporte) {
    if (!this.validarFechas(filtros)) return;

    // Mapear 'hospitalizado' | 'pabellon' a 'H' | 'P'
    const tipoMap: { [key: string]: 'H' | 'P' } = {
      'hospitalizado': 'H',
      'pabellon': 'P'
    };

    const query: ReporteUrgeciaHosQuery = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaTermino: this.formatearFecha(filtros.fechaFin!),
      tipo: tipoMap[filtros.tipoHospitalizacion || 'hospitalizado'] || 'H'
    };

    this.cargandoReporte.set(true);
    this.urgenciaService.generarReporteUrgenciasHospitalizados(query)
      .pipe(
        finalize(() => this.cargandoReporte.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (blob) => {
          const nombre = `reporte-urgencias-${filtros.tipoHospitalizacion}-${query.fechaInicio}-${query.fechaTermino}.xlsx`;
          this.descargarBlob(blob, nombre);
          this.mostrarExito(`Reporte de Urgencias - ${filtros.tipoHospitalizacion} generado correctamente`);
        },
        error: (err) => this.mostrarError(err.message)
      });
  }

  private generarReporteIras(filtros: FiltrosReporte) {
    if (!this.validarFechas(filtros)) return;

    // Mapear 'urgencias' | 'maternidad' a 'U' | 'M' (solo estos 2 tipos para IRAs)
    const tipoMap: { [key: string]: 'U' | 'M' } = {
      'urgencias': 'U',
      'maternidad': 'M'
    };

    const query: ReporteUrgIrasQuery = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaTermino: this.formatearFecha(filtros.fechaFin!),
      tipo: tipoMap[filtros.tipoReporte || 'urgencias'] || 'U'
    };

    this.cargandoReporte.set(true);
    this.urgenciaService.generarResporteIras(query)
      .pipe(
        finalize(() => this.cargandoReporte.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (blob) => {
          const nombre = `reporte-iras-${filtros.tipoReporte}-${query.fechaInicio}-${query.fechaTermino}.xlsx`;
          this.descargarBlob(blob, nombre);
          this.mostrarExito('Reporte de I.R.A.S generado correctamente');
        },
        error: (err) => this.mostrarError(err.message)
      });
  }

  // ============================================================================
  // MÉTODOS AUXILIARES
  // ============================================================================

  private validarFechas(filtros: FiltrosReporte): boolean {
    if (!filtros.fechaInicio || !filtros.fechaFin) {
      this.mostrarError('Debe seleccionar una fecha de inicio y una fecha de término');
      return false;
    }
    return true;
  }

  private formatearFecha(fecha: Date): string {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  private obtenerNombreMes(mes: number): string {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return meses[mes - 1] || 'mes';
  }

  private descargarBlob(blob: Blob, nombreArchivo: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private mostrarExito(mensaje: string) {
    this.configuracionModal.set({
      tipo: 'exito',
      titulo: '¡Reporte Generado!',
      mensaje: mensaje,
      textoBotonPrincipal: 'Aceptar',
      autoCerrarMs: 3000
    });
    this.mostrarModal.set(true);
  }

  private mostrarError(mensaje: string) {
    this.configuracionModal.set({
      tipo: 'error',
      titulo: 'Error al Generar Reporte',
      mensaje: mensaje,
      detalles: 'Por favor, verifica los filtros seleccionados e intenta nuevamente.',
      textoBotonPrincipal: 'Entendido'
    });
    this.mostrarModal.set(true);
  }


}
