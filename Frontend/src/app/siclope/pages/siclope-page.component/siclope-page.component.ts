import { Component, signal, computed, HostListener } from '@angular/core';
import { LucideAngularModule, FileText, ArrowLeftRight, Activity } from 'lucide-angular';
import type { LucideIconData } from 'lucide-angular';

import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { EstadoVacioComponent, BannerInstruccionesComponent } from '@shared/components/ui';
import type { SidebarItem } from '@shared/components/sidebar/sidebar.component';
import type { EstadisticaReporte } from '@shared/components/ui/estado-vacio/estado-vacio.component';

// Si ya tienes un componente de filtros para Siclope, úsalo aquí
import { FiltrosSiclopeReporteComponent } from '../../components/';
import type { FiltrosSiclopeReporte } from '../../interfaces/filtro.interface';

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
export class SiclopePageComponent {
  private readonly BREAKPOINT_MOBILE = 768;

  // Mapa de iconos (puedes ajustar por los que prefieras de Lucide)
  readonly iconos: Record<string, LucideIconData> = {
    FileText,          // Nómina
    ArrowLeftRight,    // Contra Referencia
    Activity           // Diagnóstico
  };

  readonly sidebarAbierto = signal(this.obtenerEstadoInicialSidebar());
  readonly cargandoReporte = signal(false);
  readonly reporteSeleccionado = signal<string | null>(null);

  readonly reportes = signal<SidebarItem[]>([
    { title: 'Nómina',            icon: 'FileText',       description: 'Listados y nóminas de pacientes/procesos' },
    { title: 'Contra Referencia', icon: 'ArrowLeftRight', description: 'Gestión de contra referencias' },
    { title: 'Diagnóstico',       icon: 'Activity',       description: 'Indicadores y diagnósticos clínicos' },
  ]);

  readonly estadisticas = signal<EstadisticaReporte[]>([
    { etiqueta: 'Módulos',              valor: '3',     icono: '📊' },
    { etiqueta: 'Última Actualización', valor: 'Hoy',   icono: '🕐' },
    { etiqueta: 'Formatos',             valor: 'Excel', icono: '📑' },
    { etiqueta: 'Estado',               valor: 'Activo',icono: '✅' }
  ]);

  readonly reporteActual = computed(() => {
    const seleccionado = this.reporteSeleccionado();
    return this.reportes().find(r => r.title === seleccionado);
  });

  readonly iconoReporteActual = computed(() => {
    const reporte = this.reporteActual();
    return reporte ? this.iconos[reporte.icon] : this.iconos['FileText'];
  });

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
