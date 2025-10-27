import { Component, input, output, viewChild, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SelectorRangoFechasComponent,
  SelectorMesComponent,
  SelectorBuscadorComponent,
  type OpcionSelector,
} from '@shared/components/ui';
import type { RangoFechas, SeleccionMes } from '@shared/components/ui';

export interface EspecialidadOption { codigo: string | string; nombre: string; }

export interface FiltrosSiclopeReporte {
  fechaInicio?: Date;
  fechaFin?: Date;
  mes?: number;
  anio?: number;
  especialidadCode?: string ;
}

@Component({
  selector: 'app-filtros-siclope-reporte',
  standalone: true,
  imports: [FormsModule, SelectorRangoFechasComponent, SelectorMesComponent, SelectorBuscadorComponent],
  templateUrl: './filtros-reporte.component.html',
})
export class FiltrosSiclopeReporteComponent {
  readonly categoria = input('SICLOPE');
  readonly usarSelectorMes = input(false);
  readonly cargando = input(false);

  // Especialidad (solo Diagnóstico)
  readonly mostrarSelectorEspecialidad = input(false);
  readonly especialidades = input<EspecialidadOption[]>([]);

  readonly descargar = output<FiltrosSiclopeReporte>();
  readonly limpiar = output<void>();

  readonly selectorFechas = viewChild(SelectorRangoFechasComponent);
  readonly selectorMes = viewChild(SelectorMesComponent);

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  mes: number | null = null;
  anio: number | null = null;

  idEspecialidadSeleccionada:  string | null = null;

  // Mapea a las opciones que espera el SelectorBuscador
  readonly especialidadesOpciones = computed<OpcionSelector[]>(() =>
    (this.especialidades() ?? []).map(esp => ({ id: String(esp.codigo), nombre: esp.nombre }))
  );

  alCambiarFecha(rango: RangoFechas): void {
    this.fechaInicio = rango.fechaInicio;
    this.fechaFin = rango.fechaFin;
  }

  alCambiarMes(seleccion: SeleccionMes): void {
    this.mes = seleccion.mes;
    this.anio = seleccion.anio;
  }

  // Evento del SelectorBuscador
  alCambiarEspecialidad(valor: string | number | null): void {
    this.idEspecialidadSeleccionada = valor != null ? String(valor) : null;
  }

  alDescargar(): void {
    const filtros: FiltrosSiclopeReporte = {};

    if (this.usarSelectorMes()) {
      filtros.mes = this.mes ?? undefined;
      filtros.anio = this.anio ?? undefined;
    } else {
      filtros.fechaInicio = this.fechaInicio ?? undefined;
      filtros.fechaFin = this.fechaFin ?? undefined;
    }

    if (this.mostrarSelectorEspecialidad() && this.idEspecialidadSeleccionada != null) {
      filtros.especialidadCode = this.idEspecialidadSeleccionada;
    }

    this.descargar.emit(filtros);
  }

  alLimpiar(): void {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.mes = null;
    this.anio = null;
    this.idEspecialidadSeleccionada = null;

    this.selectorFechas()?.limpiar();
    this.selectorMes()?.limpiar();

    this.limpiar.emit();
  }
}
