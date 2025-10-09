import { Component, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectorRangoFechasComponent, SelectorMesComponent } from '@shared/components/ui';
import type { RangoFechas, SeleccionMes } from '@shared/components/ui';
import type { FiltrosFarmaciaReporte } from '../../interfaces/filtro.interface';

@Component({
  selector: 'app-filtros-farmacia-reporte',
  imports: [FormsModule, SelectorRangoFechasComponent, SelectorMesComponent],
  templateUrl: './filtros-reporte.component.html'
})
export class FiltrosFarmaciaReporteComponent {
  readonly categoria = input('Farmacia');
  readonly usarSelectorMes = input(false);
  readonly cargando = input(false);

  readonly descargar = output<FiltrosFarmaciaReporte>();
  readonly limpiar = output<void>();

  readonly selectorFechas = viewChild(SelectorRangoFechasComponent);
  readonly selectorMes = viewChild(SelectorMesComponent);

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  mes: number | null = null;
  anio: number | null = null;

  alCambiarFecha(rango: RangoFechas): void {
    this.fechaInicio = rango.fechaInicio;
    this.fechaFin = rango.fechaFin;
  }

  alCambiarMes(seleccion: SeleccionMes): void {
    this.mes = seleccion.mes;
    this.anio = seleccion.anio;
  }

  alDescargar(): void {
    const filtros: FiltrosFarmaciaReporte = {};

    if (this.usarSelectorMes()) {
      filtros.mes = this.mes ?? undefined;
      filtros.anio = this.anio ?? undefined;
    } else {
      filtros.fechaInicio = this.fechaInicio;
      filtros.fechaFin = this.fechaFin;
    }

    this.descargar.emit(filtros);
  }

  alLimpiar(): void {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.mes = null;
    this.anio = null;

    this.selectorFechas()?.limpiar();
    this.selectorMes()?.limpiar();

    this.limpiar.emit();
  }
}
