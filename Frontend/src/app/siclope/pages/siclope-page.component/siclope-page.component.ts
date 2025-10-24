import { Component, signal, computed, HostListener, inject, OnInit } from '@angular/core';
import { LucideAngularModule, FileText, ArrowLeftRight, Activity, type LucideIconData } from 'lucide-angular';

import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { EstadoVacioComponent, BannerInstruccionesComponent } from '@shared/components/ui';
import type { SidebarItem } from '@shared/components/sidebar/sidebar.component';
import type { EstadisticaReporte } from '@shared/components/ui/estado-vacio/estado-vacio.component';

import { FiltrosSiclopeReporteComponent } from '../../components';
import type { FiltrosSiclopeReporte } from '../../interfaces/filtro.interface';

// 👇 usa el mismo servicio que en PPV (ajusta el path si es otro)
import { CatalogosService } from '@app/ppv/services/catalogos.service';

type Especialidad = { id: string; nombre: string };

@Component({
  selector: 'app-siclope-page',
  standalone: true,
  imports: [
    SidebarComponent,
    LucideAngularModule,
    FiltrosSiclopeReporteComponent,
    EstadoVacioComponent,
    BannerInstruccionesComponent
  ],
  templateUrl: './siclope-page.component.html',
})
export class SiclopePageComponent implements OnInit {
  private readonly BREAKPOINT_MOBILE = 768;
  private readonly catalogosService = inject(CatalogosService);

  // Iconos
  readonly iconos: Record<string, LucideIconData> = {
    FileText,          // Nómina
    ArrowLeftRight,    // Contra Referencia
    Activity           // Diagnóstico
  };

  // Estado UI
  readonly sidebarAbierto = signal(this.obtenerEstadoInicialSidebar());
  readonly cargandoReporte = signal(false);
  readonly reporteSeleccionado = signal<string | null>(null);

  // Catálogos (como en PPV)
  readonly cargandoEspecialidades = signal(false);
  readonly especialidades = signal<Especialidad[]>([]);

  // Sidebar
  readonly reportes = signal<SidebarItem[]>([
    { title: 'Nómina',            icon: 'FileText',       description: 'Listados y nóminas de pacientes/procesos' },
    { title: 'Contra Referencia', icon: 'ArrowLeftRight', description: 'Gestión de contra referencias' },
    { title: 'Diagnóstico', icon: 'Activity', description: 'Indicadores y diagnósticos clínicos' },
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
    this.catalogosService.listarEspecialidades().subscribe({
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
    console.log('Descargar reporte SICLOPE:', this.reporteSeleccionado(), filtros);
    this.cargandoReporte.set(true);

    setTimeout(() => {
      this.cargandoReporte.set(false);
      alert(`Reporte "${this.reporteSeleccionado()}" generado exitosamente!`);
    }, 2000);
  }

  limpiarFiltros(): void {
    console.log('Limpiar filtros SICLOPE');
  }
}
