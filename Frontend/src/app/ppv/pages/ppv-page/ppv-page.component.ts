import { Component, signal, inject, OnInit, computed } from '@angular/core';
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
import { EspecialidadService } from '../../services/especialidad.service';
import { Especialidad, SubEspecialidad } from '../../interfaces';

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
export class PpvPageComponent implements OnInit {
  private readonly especialidadService = inject(EspecialidadService);
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

  // Datos reales desde el servicio
  readonly especialidades = signal<Especialidad[]>([]);
  readonly subEspecialidades = signal<SubEspecialidad[]>([]);
  readonly cargandoEspecialidades = signal(false);

  // Señales computadas - se actualizan automáticamente
  readonly especialidadesParaFiltros = computed(() =>
    this.especialidades().map((esp, index) => ({
      id: index + 1,
      nombre: esp.nombre,
      codigo: esp.id.trim()
    }))
  );

  readonly subEspecialidadesParaFiltros = computed(() => {
    const subEspecialidades = this.subEspecialidades();
    return subEspecialidades.map((subEsp, index) => ({
      id: index + 1, // ID numérico para el componente de filtros
      nombre: subEsp.nombre,
      especialidadId: 1, // Siempre 1 porque solo mostramos las de la especialidad seleccionada
      codigo: subEsp.id // Usar el ID original (ej: 'D2801') como código
    }));
  });

  // Estadísticas del sistema
  readonly estadisticas = signal<EstadisticaReporte[]>([
    { etiqueta: 'Reportes Disponibles', valor: '5', icono: '📊' },
    { etiqueta: 'Última Actualización', valor: 'Hoy', icono: '🕐' },
    { etiqueta: 'Formatos', valor: 'Excel', icono: '📑' },
    { etiqueta: 'Estado', valor: 'Activo', icono: '✅' }
  ]);

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

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

  /**
   * Carga solo las especialidades inicialmente
   */
  private cargarEspecialidades(): void {
    this.cargandoEspecialidades.set(true);

    this.especialidadService.listarEspecialidades().subscribe({
      next: (especialidades) => {
        this.especialidades.set(especialidades);
        // Sub-especialidades se cargan dinámicamente, empezar con array vacío
        this.subEspecialidades.set([]);
        this.cargandoEspecialidades.set(false);

      },
      error: (error) => {
        console.error('❌ Error al cargar especialidades:', error);
        this.cargandoEspecialidades.set(false);
        // Mantener arrays vacíos en caso de error
        this.especialidades.set([]);
        this.subEspecialidades.set([]);
      }
    });
  }

  /**
   * Carga sub-especialidades cuando se selecciona una especialidad
   */
  private cargarSubEspecialidades(especialidadId: string): void {
    this.especialidadService.obtenerSubEspecialidades(especialidadId).subscribe({
      next: (data) => {
        this.subEspecialidades.set(data);
      },
      error: (error) => {
        console.error('❌ Error al cargar sub-especialidades:', error);
        this.subEspecialidades.set([]);
      }
    });
  }

  /**
   * Maneja el cambio de especialidad seleccionada
   */
  onEspecialidadChange(especialidadIndexId: number): void {
    if (especialidadIndexId > 0) {
      // Obtener la especialidad directamente por índice (ID numérico secuencial)
      const especialidad = this.especialidades()[especialidadIndexId - 1];

      if (especialidad) {
        this.cargarSubEspecialidades(especialidad.id.trim());
      }
    } else {
      // Limpiar sub-especialidades si no hay selección
      this.subEspecialidades.set([]);
    }
  }


}

