import { Component, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectorRangoFechasComponent, SelectorMesComponent } from '@shared/components/ui';
import type { RangoFechas, SeleccionMes } from '@shared/components/ui';

type TipoReporte = 'todos' | 'urgencias' | 'maternidad';
type TipoHospitalizacion = 'hospitalizado' | 'pabellon';

export interface FiltrosReporte {
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  mes?: number;
  anio?: number;
  tipoReporte?: TipoReporte;
  tipoHospitalizacion?: TipoHospitalizacion;
}

@Component({
  selector: 'app-filtros-reporte',
  imports: [FormsModule, SelectorRangoFechasComponent, SelectorMesComponent],
  templateUrl: './filtros-reporte.component.html'
})
export class FiltrosReporteComponent {
  readonly categoria = input<string>('Urgencias');
  readonly mostrarTipoReporte = input(true);
  readonly usarSelectorMes = input(false);
  readonly mostrarSelectorHospitalizacion = input(false);
  readonly cargando = input(false);

  readonly descargar = output<FiltrosReporte>();
  readonly limpiar = output<void>();

  readonly selectorFechas = viewChild(SelectorRangoFechasComponent);
  readonly selectorMes = viewChild(SelectorMesComponent);

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  mes: number | null = null;
  anio: number | null = null;
  tipoReporteSeleccionado: TipoReporte = 'todos';
  tipoHospitalizacionSeleccionado: TipoHospitalizacion = 'hospitalizado';

  alCambiarFecha(rango: RangoFechas): void {
    this.fechaInicio = rango.fechaInicio;
    this.fechaFin = rango.fechaFin;
  }

  alCambiarMes(seleccion: SeleccionMes): void {
    this.mes = seleccion.mes;
    this.anio = seleccion.anio;
  }

  alDescargar(): void {
    const filtros: FiltrosReporte = {};

    if (this.usarSelectorMes()) {
      filtros.mes = this.mes ?? undefined;
      filtros.anio = this.anio ?? undefined;
    } else {
      filtros.fechaInicio = this.fechaInicio;
      filtros.fechaFin = this.fechaFin;
    }

    if (this.mostrarTipoReporte()) {
      filtros.tipoReporte = this.tipoReporteSeleccionado;
    }

    if (this.mostrarSelectorHospitalizacion()) {
      filtros.tipoHospitalizacion = this.tipoHospitalizacionSeleccionado;
    }

    this.descargar.emit(filtros);
  }

  alLimpiar(): void {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.mes = null;
    this.anio = null;
    this.tipoReporteSeleccionado = 'todos';
    this.tipoHospitalizacionSeleccionado = 'hospitalizado';
    this.selectorFechas()?.limpiar();
    this.selectorMes()?.limpiar();
    this.limpiar.emit();
  }
}
