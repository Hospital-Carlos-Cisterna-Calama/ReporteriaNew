import { Component, signal, computed, HostListener } from '@angular/core';
import { LucideAngularModule, FileText, Package, Shield } from 'lucide-angular';
import type { LucideIconData } from 'lucide-angular';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { EstadoVacioComponent, BannerInstruccionesComponent } from '@shared/components/ui';
import type { SidebarItem } from '@shared/components/sidebar/sidebar.component';
import type { EstadisticaReporte } from '@shared/components/ui/estado-vacio/estado-vacio.component';
import { FiltrosFarmaciaReporteComponent } from '../../components';
import type { FiltrosFarmaciaReporte } from '../../components';

@Component({
  selector: 'app-farmacia-page',
  imports: [
    SidebarComponent,
    LucideAngularModule,
    FiltrosFarmaciaReporteComponent,
    EstadoVacioComponent,
    BannerInstruccionesComponent
  ],
  templateUrl: './farmacia-page.component.html',
})
export class FarmaciaPageComponent {
  private readonly BREAKPOINT_MOBILE = 768;

  readonly iconos: Record<string, LucideIconData> = { FileText, Package, Shield };

  readonly sidebarAbierto = signal(this.obtenerEstadoInicialSidebar());
  readonly cargandoReporte = signal(false);
  readonly reporteSeleccionado = signal<string | null>(null);

  readonly reportes = signal<SidebarItem[]>([
    { title: 'General', icon: 'FileText', description: 'Reporte general de farmacia' },
    { title: 'UNACES', icon: 'Package', description: 'Unidades de Acceso al Consumo Especializado' },
    { title: 'GES', icon: 'Shield', description: 'Garantías Explícitas en Salud' }
  ]);

  readonly estadisticas = signal<EstadisticaReporte[]>([
    { etiqueta: 'Reportes Disponibles', valor: '3', icono: '📊' },
    { etiqueta: 'Última Actualización', valor: 'Hoy', icono: '🕐' },
    { etiqueta: 'Formatos', valor: 'Excel', icono: '📑' },
    { etiqueta: 'Estado', valor: 'Activo', icono: '✅' }
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

  descargarReporte(filtros: FiltrosFarmaciaReporte): void {
    console.log('Descargar reporte Farmacia:', this.reporteSeleccionado(), filtros);
    this.cargandoReporte.set(true);

    setTimeout(() => {
      this.cargandoReporte.set(false);
      alert(`Reporte "${this.reporteSeleccionado()}" generado exitosamente!`);
    }, 2000);
  }

  limpiarFiltros(): void {
    console.log('Limpiar filtros Farmacia');
  }
}
