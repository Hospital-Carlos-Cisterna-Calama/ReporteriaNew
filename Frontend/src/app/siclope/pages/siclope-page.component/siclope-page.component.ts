import { Component, signal, computed, HostListener, inject, OnInit, DestroyRef } from '@angular/core';
import { LucideAngularModule, FileText, ArrowLeftRight, Activity, type LucideIconData } from 'lucide-angular';

import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { EstadoVacioComponent, BannerInstruccionesComponent, ConfiguracionModal, ModalResultadoComponent } from '@shared/components/ui';
import type { SidebarItem } from '@shared/components/sidebar/sidebar.component';
import type { EstadisticaReporte } from '@shared/components/ui/estado-vacio/estado-vacio.component';

import { FiltrosSiclopeReporteComponent } from '../../components';
import type { FiltrosSiclopeReporte } from '../../interfaces/filtro.interface';

// 👇 usa el mismo servicio que en PPV (ajusta el path si es otro)
import { CatalogosService } from '@app/shared/services/catalogos.service';
import { SiclopeService } from '@app/siclope/services/siclope.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/auth';

type Especialidad = { id: string; nombre: string };

@Component({
  selector: 'app-siclope-page',
  standalone: true,
  imports: [
    SidebarComponent,
    LucideAngularModule,
    FiltrosSiclopeReporteComponent,
    EstadoVacioComponent,
    BannerInstruccionesComponent,
    ModalResultadoComponent
],
  templateUrl: './siclope-page.component.html',
})
export class SiclopePageComponent implements OnInit {
  private readonly BREAKPOINT_MOBILE = 768;
  private readonly catalogosService = inject(CatalogosService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly siclopeService = inject(SiclopeService);
  private readonly authService = inject(AuthService);

  // Iconos
  readonly iconos: Record<string, LucideIconData> = {
    FileText,          // Nomina
    ArrowLeftRight,    // Contra Referencia
    Activity           // Diagnóstico
  };

  // Estado UI
  readonly sidebarAbierto = signal(this.obtenerEstadoInicialSidebar());
  readonly cargandoReporte = signal(false);
  readonly reporteSeleccionado = signal<string | null>(null);
  readonly mostrarModal = signal(false);

  readonly configuracionModal = signal<ConfiguracionModal>({
    tipo: 'info',
    titulo: '',
    mensaje: '',
  });

  // Catálogos (como en PPV)
  readonly cargandoEspecialidades = signal(false);
  readonly especialidades = signal<Especialidad[]>([]);

  // Sidebar
  readonly reportes = signal<SidebarItem[]>([
    { title: 'Nomina',icon: 'FileText',description: 'Listados y nominas de pacientes/procesos' },
    { title: 'Contra Referencia',icon: 'ArrowLeftRight',description: 'Gestión de contra referencias' },
    { title: 'Diagnóstico',icon: 'Activity',description: 'Indicadores y diagnósticos clínicos' },
  ]);

  readonly estadisticas = signal<EstadisticaReporte[]>([
    { etiqueta: 'Módulos', valor: '3', icono: '📊' },
    { etiqueta: 'Última Actualización', valor: 'Hoy', icono: '🕐' },
    { etiqueta: 'Formatos', valor: 'Excel', icono: '📑' },
    { etiqueta: 'Estado', valor: 'Activo', icono: '✅' }
  ]);

  // Computeds
  readonly reporteActual = computed(() => {
    const seleccionado = this.reporteSeleccionado();
    return this.reportes().find(r => r.title === seleccionado);
  });

  readonly iconoReporteActual = computed(() => {
    const reporte = this.reporteActual();
    return reporte ? this.iconos[reporte.icon] : this.iconos['FileText'];
  });

  readonly especialidadesParaFiltros = computed(() =>
    this.especialidades().map((esp, index) => ({
      id: index + 1,           // índice 1-based para correlacionar selección -> código real
      nombre: esp.nombre,
      codigo: esp.id?.trim?.() ?? esp.id,
    }))
  );

  // Mostrar selector solo en Diagnóstico
  get mostrarSelectorEspecialidad(): boolean {
    return this.reporteSeleccionado() === 'Diagnóstico';
  }

  // Ciclo de vida
  ngOnInit(): void {
    this.cargarEspecialidades(); // carga inicial, queda listo para Diagnóstico
  }

  private cargarEspecialidades(): void {
    this.cargandoEspecialidades.set(true);
    this.catalogosService.obtenerEspecialidadAmbulatoria().subscribe({
      next: (especialidades) => {
        // adapta al tipo local si tu servicio trae otro shape
        this.especialidades.set(
          especialidades.map((e: any) => ({ id: (e.id ?? e.codigo ?? '').toString(), nombre: e.nombre }))
        );
        this.cargandoEspecialidades.set(false);
      },
      error: (error) => {
        console.error('❌ Error al cargar especialidades (SICLOPE):', error);
        this.especialidades.set([]);
        this.cargandoEspecialidades.set(false);
      },
    });
  }

  // Responsivo
  private obtenerEstadoInicialSidebar(): boolean {
    return typeof window !== 'undefined' && window.innerWidth >= this.BREAKPOINT_MOBILE;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const ancho = (event.target as Window).innerWidth;
    this.sidebarAbierto.set(ancho >= this.BREAKPOINT_MOBILE);
  }

  // Acciones
  alternarSidebar(): void {
    this.sidebarAbierto.set(!this.sidebarAbierto());
  }

  seleccionarReporte(titulo: string): void {
    this.reporteSeleccionado.set(titulo);
    if (typeof window !== 'undefined' && window.innerWidth < this.BREAKPOINT_MOBILE) {
      this.sidebarAbierto.set(false);
    }
  }

  descargarReporte(filtros: FiltrosSiclopeReporte): void {
    const reporte = this.reporteSeleccionado();
    if (!reporte) return;

    const generadores: Record<string, () => void> = {
      'Nomina': () => this.generarReporteNomina(filtros),
      'Contra Referencia': () => this.generarReporteContraReferencia(filtros)
    }

    const generador = generadores[reporte];
    if (generador) {
      generador();
    } else {
      console.warn('Reporte no implementado:', reporte);
    }
  }

  limpiarFiltros(): void {
    console.log('Limpiar filtros SICLOPE');
  }

  // ============================================================================
  // GENERADORES DE REPORTES
  // ============================================================================

  generarReporteNomina(filtros: FiltrosSiclopeReporte): void {
    if(!this.validarFechas(filtros)) return;
    const accessData = this.authService.accessData();
    const rut = accessData?.rut || '';

    const query = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaFin: this.formatearFecha(filtros.fechaFin!),
      rut: rut
    }

    this.ejecutarDescarga(
      this.siclopeService.generarReporteNominaSiclope(query),
      `Nomina-${query.rut}-${query.fechaInicio}-${query.fechaFin}.pdf`,
      'Reporte de Nomina por Profesional generada con exito'

    )
  }

  generarReporteContraReferencia(filtros: FiltrosSiclopeReporte): void {
    if(!this.validarFechas(filtros)) return;

    const query = {
      fechaInicio: this.formatearFecha(filtros.fechaInicio!),
      fechaFin: this.formatearFecha(filtros.fechaFin!),
    }

    this.ejecutarDescarga(
      this.siclopeService.generarReporteContraReferenciaSiclope(query),
      `Contra_Referencia-${query.fechaInicio}-${query.fechaFin}.xlsx`,
      'Reporte de Contra Referencia generada con exito'
    )

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
          // Detecta PDF vacío por status 204 (Angular HttpClient lo entrega como Blob con size 0)
          if (blob.size === 0) {
            this.mostrarError('No existen nóminas para el rango de` fechas seleccionados.');
            return;
          }
          this.descargarBlob(blob, nombreArchivo);
          this.mostrarExito(mensajeExito);
        },
        error: (err: any) => this.mostrarError(err.message),
      });
  }

  private validarFechas(filtros: FiltrosSiclopeReporte): boolean {
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
