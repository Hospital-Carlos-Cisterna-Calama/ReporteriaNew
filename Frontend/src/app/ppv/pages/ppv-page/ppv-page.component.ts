import { Component, signal, inject, OnInit, computed, HostListener, viewChild, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { LucideAngularModule, Ambulance, Syringe, FileBarChart, Clock, Database, FileText, BedDouble, LucideIconData } from 'lucide-angular';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { EstadoVacioComponent, BannerInstruccionesComponent, ModalResultadoComponent, type ConfiguracionModal } from '@shared/components/ui';
import type { SidebarItem } from '@shared/components/sidebar/sidebar.component';
import type { EstadisticaReporte } from '@shared/components/ui/estado-vacio/estado-vacio.component';
import type { Especialidad, SubEspecialidad } from '../../interfaces';
import type { PpvServicio } from '../../interfaces/servicio.interface';
import type { FiltrosPpvReporte } from '@app/ppv/interfaces/filtro.interface';
import { FiltrosPpvReporteComponent } from '../../components/filtros-reporte/filtros-reporte.component';
import { CatalogosService } from '../../services/catalogos.service';
import { PpvService } from '../../services/ppv.service';

@Component({
  selector: 'app-ppv-page',
  imports: [
    SidebarComponent,
    LucideAngularModule,
    FiltrosPpvReporteComponent,
    EstadoVacioComponent,
    BannerInstruccionesComponent,
    ModalResultadoComponent
  ],
  templateUrl: './ppv-page.component.html',
})
export class PpvPageComponent implements OnInit {
  private readonly catalogosService = inject(CatalogosService);
  private readonly ppvService = inject(PpvService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly BREAKPOINT_MOBILE = 768;

  readonly iconos: Record<string, LucideIconData> = { Ambulance, Syringe, FileBarChart, Clock, Database, FileText, BedDouble };

  readonly sidebarAbierto = signal(this.obtenerEstadoInicialSidebar());
  readonly cargandoReporte = signal(false);
  readonly reporteSeleccionado = signal<string | null>(null);
  readonly mostrarModal = signal(false);

  readonly configuracionModal = signal<ConfiguracionModal>({
    tipo: 'info',
    titulo: '',
    mensaje: '',
  });

  readonly especialidades = signal<Especialidad[]>([]);
  readonly subEspecialidades = signal<SubEspecialidad[]>([]);
  readonly servicios = signal<PpvServicio[]>([]);
  readonly cargandoEspecialidades = signal(false);
  readonly cargandoServicios = signal(false);

  readonly filtrosComponent = viewChild<FiltrosPpvReporteComponent>('filtrosReporte');

  readonly reportes = signal<SidebarItem[]>([
    { title: 'Intervenciones Pabellón', icon: 'Ambulance', description: 'Reporte de intervenciones en pabellón' },
    { title: 'Procedimientos', icon: 'Syringe', description: 'Reporte de procedimientos médicos' },
    { title: 'IR-GRD', icon: 'FileBarChart', description: 'Informe de grupos relacionados de diagnóstico' },
    { title: 'Lista de Espera', icon: 'Clock', description: 'Gestión de lista de espera quirúrgica' },
    { title: 'Base Consultas', icon: 'Database', description: 'Base de datos de consultas médicas' },
    { title: 'RPHs', icon: 'FileText', description: 'Registro de prestaciones hospitalarias' },
    { title: 'Camas Críticas', icon: 'BedDouble', description: 'Gestión de camas en unidades críticas' }
  ]);

  readonly estadisticas = signal<EstadisticaReporte[]>([
    { etiqueta: 'Reportes Disponibles', valor: '7', icono: '📊' },
    { etiqueta: 'Última Actualización', valor: 'Hoy', icono: '🕐' },
    { etiqueta: 'Formatos', valor: 'Excel', icono: '📑' },
    { etiqueta: 'Estado', valor: 'Activo', icono: '✅' }
  ]);

  readonly especialidadesParaFiltros = computed(() =>
    this.especialidades().map((esp, index) => ({
      id: index + 1,
      nombre: esp.nombre,
      codigo: esp.id.trim()
    }))
  );

  readonly subEspecialidadesParaFiltros = computed(() =>
    this.subEspecialidades().map((subEsp, index) => ({
      id: index + 1,
      nombre: subEsp.nombre,
      especialidadId: 1,
      codigo: subEsp.id
    }))
  );

  get mostrarSelectorEspecialidad(): boolean {
    return this.reporteSeleccionado() === 'Procedimientos';
  }

  get mostrarSelectorSolicitudRealizacion(): boolean {
    const reporte = this.reporteSeleccionado();
    return reporte === 'Lista de Espera' || reporte === 'Camas Críticas';
  }

  get mostrarSelectorServicios(): boolean {
    return this.reporteSeleccionado() === 'RPHs';
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

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

  seleccionarReporte(reporteTitle: string): void {
    this.reporteSeleccionado.set(reporteTitle);

    if (reporteTitle === 'RPHs') {
      this.seleccionarTodosLosServicios();
    }

    if (typeof window !== 'undefined' && window.innerWidth < this.BREAKPOINT_MOBILE) {
      this.sidebarAbierto.set(false);
    }
  }

  descargarReporte(filtros: FiltrosPpvReporte): void {
    const reporte = this.reporteSeleccionado();
    if (!reporte) return;

    const generadores: Record<string, () => void> = {
      'Intervenciones Pabellón': () => this.generarReportePabellon(filtros),
      'Procedimientos': () => this.generarReporteProcedimientos(filtros),
      'IR-GRD': () => this.generarReporteIrGrd(filtros),
      'Lista de Espera': () => this.generarReporteListaEspera(filtros),
      'Base Consultas': () => this.generarReporteBaseConsultas(filtros),
      'RPHs': () => this.generarReporteRphs(filtros),
      'Camas Críticas': () => this.generarReporteCamasCriticas(filtros),
    };

    const generador = generadores[reporte];
    if (generador) {
      generador();
    } else {
      console.warn('Reporte no implementado:', reporte);
    }
  }

  limpiarFiltros(): void {
    console.log('Limpiar filtros PPV');
  }

  private cargarDatosIniciales(): void {
    this.cargarEspecialidades();
    this.cargarServicios();
  }

  private cargarEspecialidades(): void {
    this.cargandoEspecialidades.set(true);

    this.catalogosService.listarEspecialidades().subscribe({
      next: (especialidades) => {
        this.especialidades.set(especialidades);
        this.subEspecialidades.set([]);
        this.cargandoEspecialidades.set(false);
      },
      error: (error) => {
        console.error('❌ Error al cargar especialidades:', error);
        this.especialidades.set([]);
        this.subEspecialidades.set([]);
        this.cargandoEspecialidades.set(false);
      }
    });
  }

  private cargarServicios(): void {
    this.cargandoServicios.set(true);

    this.catalogosService.obtenerServicios().subscribe({
      next: (servicios) => {
        this.servicios.set(servicios);
        this.cargandoServicios.set(false);
      },
      error: (error) => {
        console.error('❌ Error al cargar servicios:', error);
        this.servicios.set([]);
        this.cargandoServicios.set(false);
      }
    });
  }

  private cargarSubEspecialidades(especialidadId: string): void {
    this.catalogosService.obtenerSubEspecialidades(especialidadId).subscribe({
      next: (subEspecialidades) => {
        this.subEspecialidades.set(subEspecialidades);
      },
      error: (error) => {
        console.error('❌ Error al cargar sub-especialidades:', error);
        this.subEspecialidades.set([]);
      }
    });
  }

  onEspecialidadChange(especialidadIndexId: number): void {
    if (especialidadIndexId > 0) {
      const especialidad = this.especialidades()[especialidadIndexId - 1];
      if (especialidad) {
        this.cargarSubEspecialidades(especialidad.id.trim());
      }
    } else {
      this.subEspecialidades.set([]);
    }
  }

  private seleccionarTodosLosServicios(): void {
    setTimeout(() => {
      const filtros = this.filtrosComponent();
      filtros?.seleccionarTodosServicios();
    }, 0);
  }

  // ============================================================================
  // GENERADORES DE REPORTES
  // ============================================================================

  private generarReportePabellon(filtros: FiltrosPpvReporte): void {
    if (!this.validarFechas(filtros)) return;

    const query = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaFin: this.formatearFecha(filtros.fechaFin!),
    };

    this.ejecutarDescarga(
      this.ppvService.generarReportePpvPabellon(query),
      `reporte-pabellon-${query.fechaInicio}-${query.fechaFin}.xlsx`,
      'Reporte de Intervenciones de Pabellón generado correctamente'
    );
  }

  private generarReporteProcedimientos(filtros: FiltrosPpvReporte): void {
    if (!this.validarFechas(filtros)) return;

    // Obtener códigos de especialidad y subespecialidad seleccionadas
    let especialidadCodigo: string | undefined;
    let subEspecialidadCodigo: string | undefined;

    if (filtros.especialidadId && filtros.especialidadId > 0) {
      const especialidad = this.especialidades()[filtros.especialidadId - 1];
      especialidadCodigo = especialidad?.id.trim();
    }

    if (filtros.subEspecialidadId && filtros.subEspecialidadId > 0) {
      const subEspecialidad = this.subEspecialidades()[filtros.subEspecialidadId - 1];
      subEspecialidadCodigo = subEspecialidad?.id;
    }

    const query = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaFin: this.formatearFecha(filtros.fechaFin!),
      ...(subEspecialidadCodigo && { selectEspec: subEspecialidadCodigo }),
      ...(especialidadCodigo && { PadreEsp: especialidadCodigo }),
    };

    this.ejecutarDescarga(
      this.ppvService.generarReportePpvProcedimientos(query),
      `reporte-procedimientos-${query.fechaInicio}-${query.fechaFin}.xlsx`,
      'Reporte de Procedimientos generado correctamente'
    );
  }

  private generarReporteIrGrd(filtros: FiltrosPpvReporte): void {
    if (!this.validarFechas(filtros)) return;

    const query = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaFin: this.formatearFecha(filtros.fechaFin!),
    };

    this.ejecutarDescarga(
      this.ppvService.generarReportePpvIrGrd(query),
      `reporte-ir-grd-${query.fechaInicio}-${query.fechaFin}.txt`,
      'Reporte IR-GRD generado correctamente'
    );
  }

  private generarReporteListaEspera(filtros: FiltrosPpvReporte): void {
    if (!this.validarFechas(filtros)) return;

    const query = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaFin: this.formatearFecha(filtros.fechaFin!),
    };

    this.ejecutarDescarga(
      this.ppvService.generarReportePpvListaEspera(query),
      `reporte-lista-espera-${query.fechaInicio}-${query.fechaFin}.xlsx`,
      'Reporte de Lista de Espera generado correctamente'
    );
  }

  private generarReporteBaseConsultas(filtros: FiltrosPpvReporte): void {
    if (!this.validarFechas(filtros)) return;

    const query = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaFin: this.formatearFecha(filtros.fechaFin!),
    };

    this.ejecutarDescarga(
      this.ppvService.generarReportePpvPacHospitalizado(query),
      `reporte-base-consultas-${query.fechaInicio}-${query.fechaFin}.xlsx`,
      'Reporte de Base de Consultas generado correctamente'
    );
  }

  private generarReporteRphs(filtros: FiltrosPpvReporte): void {
    if (!this.validarFechas(filtros)) return;

    if (!filtros.serviciosSeleccionados || filtros.serviciosSeleccionados.length === 0) {
      this.mostrarError('Debe seleccionar al menos un servicio');
      return;
    }

    const query = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaFin: this.formatearFecha(filtros.fechaFin!),
      servicios: filtros.serviciosSeleccionados.map(Number),
    };

    this.ejecutarDescarga(
      this.ppvService.generarReportePpvHospitalizacion(query),
      `reporte-rphs-${query.fechaInicio}-${query.fechaFin}.xlsx`,
      'Reporte de RPHs generado correctamente'
    );
  }

  private generarReporteCamasCriticas(filtros: FiltrosPpvReporte): void {
    if (!this.validarFechas(filtros)) return;

    const query = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaFin: this.formatearFecha(filtros.fechaFin!),
      unidad: 1, // TODO: Obtener de filtros si es necesario
      filtro: 'ingreso' as const,
    };

    this.ejecutarDescarga(
      this.ppvService.generarReportePpvIngEgr(query),
      `reporte-camas-criticas-${query.fechaInicio}-${query.fechaFin}.xlsx`,
      'Reporte de Camas Críticas generado correctamente'
    );
  }

  // ============================================================================
  // MÉTODOS DE UTILIDAD
  // ============================================================================

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
        error: (err: any) => this.mostrarError(err.message),
      });
  }

  private validarFechas(filtros: FiltrosPpvReporte): boolean {
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
      autoCerrarMs: 3000,
    });
    this.mostrarModal.set(true);
  }

  private mostrarError(mensaje: string): void {
    this.configuracionModal.set({
      tipo: 'error',
      titulo: 'Error al Generar Reporte',
      mensaje,
      detalles: 'Por favor, verifica los filtros seleccionados e intenta nuevamente.',
      textoBotonPrincipal: 'Entendido',
    });
    this.mostrarModal.set(true);
  }
}
