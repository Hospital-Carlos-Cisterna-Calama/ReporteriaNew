import { Component, signal } from '@angular/core';
import {
  LucideAngularModule,
  Ambulance,
  Syringe,
  FileBarChart,
  Clock,
  Database,
  FileText,
  BedDouble,
  LucideIconData
} from 'lucide-angular';
import { SidebarComponent, type SidebarItem } from '../../../shared/components/sidebar/sidebar.component';
import { FiltrosReporteComponent, type FiltrosReporte } from '../../../urgencia/components/filtros-reporte/filtros-reporte.component';
import { EstadisticaReporte, EstadoVacioComponent } from '../../../urgencia/components/estado-vacio/estado-vacio.component';
import { BannerInstruccionesComponent } from '../../../shared/components/ui';

@Component({
  selector: 'app-ppv-page',
  standalone: true,
  imports: [
    SidebarComponent,
    LucideAngularModule,
    FiltrosReporteComponent,
    EstadoVacioComponent,
    BannerInstruccionesComponent
  ],
  templateUrl: './ppv-page.component.html',
})
export class PpvPageComponent {
  // Iconos de Lucide
  readonly iconos: Record<string, LucideIconData> = {
    Ambulance,
    Syringe,
    FileBarChart,
    Clock,
    Database,
    FileText,
    BedDouble
  };

  // Señales reactivas
  reporteSeleccionado = signal<string | null>(null);
  cargandoReporte = signal(false);

  // Lista de reportes PPV
  reportes = signal<SidebarItem[]>([
    {
      title: 'Intervenciones Pabellón',
      icon: 'Ambulance',
      description: 'Reporte de intervenciones en pabellón'
    },
    {
      title: 'Procedimientos',
      icon: 'Syringe',
      description: 'Reporte de procedimientos médicos'
    },
    {
      title: 'IR-GRD',
      icon: 'FileBarChart',
      description: 'Informe de grupos relacionados de diagnóstico'
    },
    {
      title: 'Lista de Espera',
      icon: 'Clock',
      description: 'Gestión de lista de espera quirúrgica'
    },
    {
      title: 'Base Consultas',
      icon: 'Database',
      description: 'Base de datos de consultas médicas'
    },
    {
      title: 'RPHs',
      icon: 'FileText',
      description: 'Registro de prestaciones hospitalarias'
    },
    {
      title: 'Camas Críticas',
      icon: 'BedDouble',
      description: 'Gestión de camas en unidades críticas'
    }
  ]);

  // Datos mock de Especialidades (para lo visual)
  readonly especialidades = signal([
    { id: 1, nombre: 'Cardiología' },
    { id: 2, nombre: 'Cirugía General' },
    { id: 3, nombre: 'Traumatología' },
    { id: 4, nombre: 'Neurología' },
    { id: 5, nombre: 'Pediatría' },
    { id: 6, nombre: 'Ginecología' },
    { id: 7, nombre: 'Oftalmología' },
    { id: 8, nombre: 'Otorrinolaringología' },
    { id: 9, nombre: 'Urología' },
    { id: 10, nombre: 'Dermatología' }
  ]);

  // Datos mock de Sub Especialidades (para lo visual)
  readonly subEspecialidades = signal([
    { id: 1, nombre: 'Cardiología Intervencionista', especialidadId: 1 },
    { id: 2, nombre: 'Electrofisiología', especialidadId: 1 },
    { id: 3, nombre: 'Cirugía Laparoscópica', especialidadId: 2 },
    { id: 4, nombre: 'Cirugía Bariátrica', especialidadId: 2 },
    { id: 5, nombre: 'Cirugía de Columna', especialidadId: 3 },
    { id: 6, nombre: 'Artroplastia', especialidadId: 3 },
    { id: 7, nombre: 'Neurocirugía', especialidadId: 4 },
    { id: 8, nombre: 'Neurología Pediátrica', especialidadId: 4 },
    { id: 9, nombre: 'Neonatología', especialidadId: 5 },
    { id: 10, nombre: 'Pediatría Crítica', especialidadId: 5 },
    { id: 11, nombre: 'Obstetricia', especialidadId: 6 },
    { id: 12, nombre: 'Ginecología Oncológica', especialidadId: 6 },
    { id: 13, nombre: 'Retina y Vítreo', especialidadId: 7 },
    { id: 14, nombre: 'Glaucoma', especialidadId: 7 },
    { id: 15, nombre: 'Cirugía de Cabeza y Cuello', especialidadId: 8 },
    { id: 16, nombre: 'Otología', especialidadId: 8 },
    { id: 17, nombre: 'Urología Pediátrica', especialidadId: 9 },
    { id: 18, nombre: 'Oncología Urológica', especialidadId: 9 },
    { id: 19, nombre: 'Dermatología Estética', especialidadId: 10 },
    { id: 20, nombre: 'Dermatología Oncológica', especialidadId: 10 }
  ]);

    // Estadísticas del sistema
  readonly estadisticas = signal<EstadisticaReporte[]>([
      { etiqueta: 'Reportes Disponibles', valor: '5', icono: '📊' },
      { etiqueta: 'Última Actualización', valor: 'Hoy', icono: '🕐' },
      { etiqueta: 'Formatos', valor: 'Excel', icono: '📑' },
      { etiqueta: 'Estado', valor: 'Activo', icono: '✅' }
 ]);

  seleccionarReporte(reporteTitle: string) {
    this.reporteSeleccionado.set(reporteTitle);
  }

  descargarReporte(filtros: FiltrosReporte) {
    console.log('Descargar reporte PPV:', this.reporteSeleccionado(), filtros);
    this.cargandoReporte.set(true);

    // Simulación de descarga
    setTimeout(() => {
      this.cargandoReporte.set(false);
      alert(`Reporte "${this.reporteSeleccionado()}" generado exitosamente!`);
    }, 2000);
  }

  limpiarFiltros() {
    console.log('Limpiar filtros PPV');
  }

  // Determinar si el reporte actual necesita selectores de especialidad
  get mostrarSelectorEspecialidad(): boolean {
    return this.reporteSeleccionado() === 'Procedimientos';
  }
}

