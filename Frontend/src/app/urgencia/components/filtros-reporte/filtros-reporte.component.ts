import { Component, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectorRangoFechasComponent, type RangoFechas } from '../selector-rango-fechas/selector-rango-fechas.component';

export interface FiltrosReporte {
  fechaInicio: Date | null;
  fechaFin: Date | null;
  servicio: string;
}

/**
 * Componente de formulario de filtros para reportes
 */
@Component({
  selector: 'app-filtros-reporte',
  standalone: true,
  imports: [FormsModule, SelectorRangoFechasComponent],
  template: `
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 backdrop-blur-sm">
      <!-- Header de la Sección -->
      <div class="mb-8 pb-6 border-b border-gray-100">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              <ng-content select="[titulo]"></ng-content>
            </h2>
            <p class="text-gray-600 flex items-center gap-2">
              <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Configura los parámetros para generar tu reporte personalizado
            </p>
          </div>
          <div class="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-semibold border border-teal-200">
            {{ categoria() }}
          </div>
        </div>
      </div>

      <!-- Formulario de Filtros -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          Filtros de Búsqueda
        </h3>

        <!-- Selector de Rango de Fechas con Material -->
        <div class="mb-6">
          <app-selector-rango-fechas
            (cambioFecha)="alCambiarFecha($event)"
          />
        </div>

        <!-- Servicio -->
        <div class="space-y-2 group">
          <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Servicio
          </label>
          <div class="relative">
            <select
              [(ngModel)]="servicioSeleccionado"
              class="w-full pl-12 pr-10 py-3.5 text-base font-medium
                     border-2 border-gray-300 rounded-xl
                     bg-white
                     text-gray-900
                     focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500
                     hover:border-teal-400
                     transition-all duration-200
                     shadow-sm hover:shadow-lg
                     cursor-pointer
                     appearance-none"
            >
              <option value="">Todos los servicios</option>
              <option value="urgencia">Urgencia</option>
              <option value="upc">UPC</option>
              <option value="hospitalizacion">Hospitalización</option>
            </select>
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg class="w-5 h-5 text-teal-600 group-hover:text-teal-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex gap-4 pt-6 border-t border-gray-100">
        <button
          (click)="alDescargar()"
          class="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Descargar Reporte
        </button>
        <button
          (click)="alLimpiar()"
          class="px-8 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Limpiar
        </button>
      </div>
    </div>
  `
})
export class FiltrosReporteComponent {
  readonly categoria = input<string>('Urgencias');

  readonly descargar = output<FiltrosReporte>();
  readonly limpiar = output<void>();

  readonly selectorFechas = viewChild(SelectorRangoFechasComponent);

  // Filtros
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  servicioSeleccionado = '';

  alCambiarFecha(rango: RangoFechas) {
    this.fechaInicio = rango.fechaInicio;
    this.fechaFin = rango.fechaFin;
  }

  alDescargar() {
    this.descargar.emit({
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      servicio: this.servicioSeleccionado
    });
  }

  alLimpiar() {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.servicioSeleccionado = '';
    this.selectorFechas()?.limpiar();
    this.limpiar.emit();
  }
}
