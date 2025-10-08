import { Component, signal } from '@angular/core';
import { LucideAngularModule, FileText, Clock, Building, TrendingUp, LucideIconData } from 'lucide-angular';
import { SidebarComponent, SidebarItem } from '../../../shared/components/sidebar/sidebar.component';
import {

  FiltrosReporteComponent,
  EstadoVacioComponent,
  type FiltrosReporte,
  type EstadisticaReporte
} from '../../components';

@Component({
  selector: 'app-urgencia-page',
  imports: [
    SidebarComponent,
    LucideAngularModule,
    FiltrosReporteComponent,
    EstadoVacioComponent
  ],
  templateUrl: './urgencia-page.component.html',
})
export class UrgenciaPageComponent {
  // Iconos
  readonly iconos: Record<string, LucideIconData> = {
    FileText,
    Clock,
    Building,
    TrendingUp
  };

  // Estado del sidebar
  sidebarAbierto = signal(true);

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
    console.log('Descargando reporte con filtros:', filtros);
    // Aquí iría la lógica para descargar el reporte
  }

  limpiarFiltros() {
    console.log('Limpiando filtros');
  }
}
