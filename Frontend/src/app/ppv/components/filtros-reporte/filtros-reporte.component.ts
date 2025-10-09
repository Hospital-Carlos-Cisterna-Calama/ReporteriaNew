import { Component, input, output, viewChild, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectorRangoFechasComponent, SelectorMesComponent } from '@shared/components/ui';
import type { RangoFechas, SeleccionMes } from '@shared/components/ui';
import type { ItemCatalogo, SubEspecialidadItem, ItemServicio, FiltrosPpvReporte, TipoFecha } from '../../interfaces/filtro.interface';

@Component({
  selector: 'app-filtros-ppv-reporte',
  imports: [FormsModule, SelectorRangoFechasComponent, SelectorMesComponent],
  templateUrl: './filtros-reporte.component.html'
})
export class FiltrosPpvReporteComponent {
  readonly categoria = input('PPV');
  readonly usarSelectorMes = input(false);
  readonly mostrarSelectorEspecialidad = input(false);
  readonly mostrarSelectorSolicitudRealizacion = input(false);
  readonly mostrarSelectorServicios = input(false);
  readonly especialidades = input<ItemCatalogo[]>([]);
  readonly subEspecialidades = input<SubEspecialidadItem[]>([]);
  readonly servicios = input<ItemServicio[]>([]);
  readonly cargando = input(false);

  readonly descargar = output<FiltrosPpvReporte>();
  readonly limpiar = output<void>();
  readonly especialidadChange = output<number>();

  readonly selectorFechas = viewChild(SelectorRangoFechasComponent);
  readonly selectorMes = viewChild(SelectorMesComponent);

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  mes: number | null = null;
  anio: number | null = null;

  readonly especialidadSeleccionada = signal<number | null>(null);
  subEspecialidadSeleccionada: number | null = null;

  tipoFechaSeleccionado: TipoFecha = 'solicitud';

  readonly serviciosSeleccionados = signal<string[]>([]);

  readonly subEspecialidadesFiltradas = computed(() =>
    this.especialidadSeleccionada() ? this.subEspecialidades() : []
  );

  alCambiarFecha(rango: RangoFechas): void {
    this.fechaInicio = rango.fechaInicio;
    this.fechaFin = rango.fechaFin;
  }

  alCambiarMes(seleccion: SeleccionMes): void {
    this.mes = seleccion.mes;
    this.anio = seleccion.anio;
  }

  alCambiarEspecialidad(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nuevaEspecialidad = select.value ? Number(select.value) : null;

    this.especialidadSeleccionada.set(nuevaEspecialidad);
    this.subEspecialidadSeleccionada = null;
    this.especialidadChange.emit(nuevaEspecialidad ?? 0);
  }

  alCambiarSubEspecialidad(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.subEspecialidadSeleccionada = select.value ? Number(select.value) : null;
  }

  alCambiarServicio(servicioId: string, seleccionado: boolean): void {
    const serviciosActuales = this.serviciosSeleccionados();

    if (seleccionado) {
      if (!serviciosActuales.includes(servicioId)) {
        this.serviciosSeleccionados.set([...serviciosActuales, servicioId]);
      }
    } else {
      this.serviciosSeleccionados.set(serviciosActuales.filter(id => id !== servicioId));
    }
  }

  esServicioSeleccionado(servicioId: string): boolean {
    return this.serviciosSeleccionados().includes(servicioId);
  }

  seleccionarTodosServicios(): void {
    const todosLosIds = this.servicios().map(servicio => servicio.id);
    this.serviciosSeleccionados.set(todosLosIds);
  }

  limpiarServicios(): void {
    this.serviciosSeleccionados.set([]);
  }

  alDescargar(): void {
    const filtros: FiltrosPpvReporte = {};

    if (this.usarSelectorMes()) {
      filtros.mes = this.mes ?? undefined;
      filtros.anio = this.anio ?? undefined;
    } else {
      filtros.fechaInicio = this.fechaInicio;
      filtros.fechaFin = this.fechaFin;
    }

    if (this.mostrarSelectorEspecialidad()) {
      filtros.especialidadId = this.especialidadSeleccionada();
      filtros.subEspecialidadId = this.subEspecialidadSeleccionada;
    }

    if (this.mostrarSelectorSolicitudRealizacion()) {
      filtros.tipoFecha = this.tipoFechaSeleccionado;
    }

    if (this.mostrarSelectorServicios()) {
      filtros.serviciosSeleccionados = this.serviciosSeleccionados();
    }

    this.descargar.emit(filtros);
  }

  alLimpiar(): void {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.mes = null;
    this.anio = null;

    this.especialidadSeleccionada.set(null);
    this.subEspecialidadSeleccionada = null;

    this.tipoFechaSeleccionado = 'solicitud';

    this.serviciosSeleccionados.set([]);

    this.selectorFechas()?.limpiar();
    this.selectorMes()?.limpiar();

    this.limpiar.emit();
  }
}
