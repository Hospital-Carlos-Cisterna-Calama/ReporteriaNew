import { Component, signal, inject, OnInit, computed, HostListener, viewChild } from '@angular/core';
import { LucideAngularModule, Ambulance, Syringe, FileBarChart, Clock, Database, FileText, BedDouble, LucideIconData } from 'lucide-angular';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { EstadoVacioComponent, BannerInstruccionesComponent } from '@shared/components/ui';
import type { SidebarItem } from '@shared/components/sidebar/sidebar.component';
import type { EstadisticaReporte } from '@shared/components/ui/estado-vacio/estado-vacio.component';
import type { Especialidad, SubEspecialidad } from '../../interfaces';
import type { PpvServicio } from '../../interfaces/servicio.interface';
import type { FiltrosPpvReporte } from '@app/ppv/interfaces/filtro.interface';
import { FiltrosPpvReporteComponent } from '../../components/filtros-reporte/filtros-reporte.component';
import { CatalogosService } from '../../services/catalogos.service';

@Component({
  selector: 'app-ppv-page',
  imports: [
    SidebarComponent,
    LucideAngularModule,
    FiltrosPpvReporteComponent,
    EstadoVacioComponent,
    BannerInstruccionesComponent
  ],
  templateUrl: './ppv-page.component.html',
})
export class PpvPageComponent implements OnInit {
  private readonly catalogosService = inject(CatalogosService);
  private readonly BREAKPOINT_MOBILE = 768;

  readonly iconos: Record<string, LucideIconData> = { Ambulance, Syringe, FileBarChart, Clock, Database, FileText, BedDouble };

  readonly sidebarAbierto = signal(this.obtenerEstadoInicialSidebar());
  readonly cargandoReporte = signal(false);
  readonly reporteSeleccionado = signal<string | null>(null);

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
    console.log('Descargar reporte PPV:', this.reporteSeleccionado(), filtros);
    this.cargandoReporte.set(true);

    setTimeout(() => {
      this.cargandoReporte.set(false);
      alert(`Reporte "${this.reporteSeleccionado()}" generado exitosamente!`);
    }, 2000);
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
}
