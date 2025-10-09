import { Component, DestroyRef, inject, signal, HostListener } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { LucideAngularModule, FileText, Clock, Building, TrendingUp, LucideIconData } from 'lucide-angular';
import { SidebarComponent, SidebarItem } from '@shared/components/sidebar/sidebar.component';
import { ModalResultadoComponent, BannerInstruccionesComponent, type ConfiguracionModal, EstadoVacioComponent, type EstadisticaReporte} from '@shared/components/ui';
import type { ReporteUrgeciaHosQuery, ReporteUrgenciaDoceHorasQuery, ReporteUrgenciaQuery, ReporteUrgIrasQuery, ResporteUrgeciaCatQuery } from '../../interfaces/dto.interface';
import { FiltrosReporteComponent, type FiltrosReporte } from '../../components';
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
  private readonly BREAKPOINT_MOBILE = 768;

  readonly iconos: Record<string, LucideIconData> = { FileText, Clock, Building, TrendingUp };

  readonly sidebarAbierto = signal(this.obtenerEstadoInicialSidebar());
  readonly cargandoReporte = signal(false);
  readonly mostrarModal = signal(false);
  readonly reporteSeleccionado = signal<string | null>(null);

  readonly configuracionModal = signal<ConfiguracionModal>({
    tipo: 'info',
    titulo: '',
    mensaje: ''
  });

  readonly reportes = signal<SidebarItem[]>([
    { title: 'Urgencias', icon: 'FileText', description: 'Reporte general de atenciones de urgencia' },
    { title: 'Urgencias (12-Horas)', icon: 'Clock', description: 'Reporte de urgencias de las últimas 12 horas' },
    { title: 'Categorizaciones', icon: 'TrendingUp', description: 'Reporte de categorización de pacientes' },
    { title: 'Urgencias - Hospitalizado', icon: 'Building', description: 'Pacientes de urgencia hospitalizados' },
    { title: 'I.R.A.S', icon: 'FileText', description: 'Infecciones Respiratorias Agudas' }
  ]);

  readonly estadisticas = signal<EstadisticaReporte[]>([
    { etiqueta: 'Reportes Disponibles', valor: '5', icono: '📊' },
    { etiqueta: 'Última Actualización', valor: 'Hoy', icono: '🕐' },
    { etiqueta: 'Formatos', valor: 'Excel', icono: '📑' },
    { etiqueta: 'Estado', valor: 'Activo', icono: '✅' }
  ]);

  private obtenerEstadoInicialSidebar(): boolean {
    return typeof window !== 'undefined' && window.innerWidth >= this.BREAKPOINT_MOBILE;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const ancho = (event.target as Window).innerWidth;
    this.sidebarAbierto.set(ancho >= this.BREAKPOINT_MOBILE);
  }

  alternarSidebar(): void {
    this.sidebarAbierto.set(!this.sidebarAbierto());
  }

  seleccionarReporte(titulo: string): void {
    this.reporteSeleccionado.set(titulo);

    if (typeof window !== 'undefined' && window.innerWidth < this.BREAKPOINT_MOBILE) {
      this.sidebarAbierto.set(false);
    }
  }

  descargarReporte(filtros: FiltrosReporte): void {
    const reporte = this.reporteSeleccionado();
    if (!reporte) return;

    const generadores: Record<string, () => void> = {
      'Urgencias': () => this.generarReporteUrgencias(filtros),
      'Urgencias (12-Horas)': () => this.generarReporteUrgencias12Horas(filtros),
      'Categorizaciones': () => this.generarReporteCategorizaciones(filtros),
      'Urgencias - Hospitalizado': () => this.generarReporteUrgenciasHospitalizados(filtros),
      'I.R.A.S': () => this.generarReporteIras(filtros)
    };

    const generador = generadores[reporte];
    if (generador) {
      generador();
    } else {
      console.warn('Reporte no implementado:', reporte);
    }
  }

  limpiarFiltros(): void {
    console.log('Limpiando filtros');
  }

  private generarReporteUrgencias(filtros: FiltrosReporte): void {
    if (!this.validarFechas(filtros)) return;

    const tipoMap: Record<string, 'A' | 'U' | 'M'> = { todos: 'A', urgencias: 'U', maternidad: 'M' };
    const query: ReporteUrgenciaQuery = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaTermino: this.formatearFecha(filtros.fechaFin!),
      tipo: tipoMap[filtros.tipoReporte || 'todos'] || 'A'
    };

    this.ejecutarDescarga(
      this.urgenciaService.generarReporteUrgencias(query),
      `reporte-urgencias-${filtros.tipoReporte}-${query.fechaInicio}-${query.fechaTermino}.xlsx`,
      'Reporte de Urgencias generado correctamente'
    );
  }

  private generarReporteUrgencias12Horas(filtros: FiltrosReporte): void {
    if (!this.validarFechas(filtros)) return;

    const query: ReporteUrgenciaDoceHorasQuery = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaTermino: this.formatearFecha(filtros.fechaFin!)
    };

    this.ejecutarDescarga(
      this.urgenciaService.generarReporteUrgencias12Horas(query),
      `reporte-urgencias-12horas-${query.fechaInicio}-${query.fechaTermino}.xlsx`,
      'Reporte de Urgencias (12 Horas) generado correctamente'
    );
  }

  private generarReporteCategorizaciones(filtros: FiltrosReporte): void {
    if (!filtros.mes || !filtros.anio) {
      this.mostrarError('Debe seleccionar un mes y año');
      return;
    }

    const mes = String(filtros.mes).padStart(2, '0');
    const query: ResporteUrgeciaCatQuery = { fecha: `${filtros.anio}-${mes}` };

    this.ejecutarDescarga(
      this.urgenciaService.generarReporteUrgenciaCetegorizaciones(query),
      `reporte-categorizaciones-${this.obtenerNombreMes(filtros.mes)}-${filtros.anio}.xlsx`,
      'Reporte de Categorizaciones generado correctamente'
    );
  }

  private generarReporteUrgenciasHospitalizados(filtros: FiltrosReporte): void {
    if (!this.validarFechas(filtros)) return;

    const tipoMap: Record<string, 'H' | 'P'> = { hospitalizado: 'H', pabellon: 'P' };
    const query: ReporteUrgeciaHosQuery = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaTermino: this.formatearFecha(filtros.fechaFin!),
      tipo: tipoMap[filtros.tipoHospitalizacion || 'hospitalizado'] || 'H'
    };

    this.ejecutarDescarga(
      this.urgenciaService.generarReporteUrgenciasHospitalizados(query),
      `reporte-urgencias-${filtros.tipoHospitalizacion}-${query.fechaInicio}-${query.fechaTermino}.xlsx`,
      `Reporte de Urgencias - ${filtros.tipoHospitalizacion} generado correctamente`
    );
  }

  private generarReporteIras(filtros: FiltrosReporte): void {
    if (!this.validarFechas(filtros)) return;

    const tipoMap: Record<string, 'U' | 'M'> = { urgencias: 'U', maternidad: 'M' };
    const query: ReporteUrgIrasQuery = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaTermino: this.formatearFecha(filtros.fechaFin!),
      tipo: tipoMap[filtros.tipoReporte || 'urgencias'] || 'U'
    };

    this.ejecutarDescarga(
      this.urgenciaService.generarResporteIras(query),
      `reporte-iras-${filtros.tipoReporte}-${query.fechaInicio}-${query.fechaTermino}.xlsx`,
      'Reporte de I.R.A.S generado correctamente'
    );
  }

  private ejecutarDescarga(observable: any, nombreArchivo: string, mensajeExito: string): void {
    this.cargandoReporte.set(true);
    observable
      .pipe(
        finalize(() => this.cargandoReporte.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (blob: Blob) => {
          this.descargarBlob(blob, nombreArchivo);
          this.mostrarExito(mensajeExito);
        },
        error: (err: any) => this.mostrarError(err.message)
      });
  }

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
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return meses[mes - 1] || 'mes';
  }

  private descargarBlob(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private mostrarExito(mensaje: string): void {
    this.configuracionModal.set({
      tipo: 'exito',
      titulo: '¡Reporte Generado!',
      mensaje,
      textoBotonPrincipal: 'Aceptar',
      autoCerrarMs: 3000
    });
    this.mostrarModal.set(true);
  }

  private mostrarError(mensaje: string): void {
    this.configuracionModal.set({
      tipo: 'error',
      titulo: 'Error al Generar Reporte',
      mensaje,
      detalles: 'Por favor, verifica los filtros seleccionados e intenta nuevamente.',
      textoBotonPrincipal: 'Entendido'
    });
    this.mostrarModal.set(true);
  }
}
