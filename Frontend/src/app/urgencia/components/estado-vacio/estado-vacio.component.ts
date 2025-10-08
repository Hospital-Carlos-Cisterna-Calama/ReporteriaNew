import { Component, input } from '@angular/core';

export interface EstadisticaReporte {
  etiqueta: string;
  valor: string | number;
  icono?: string;
}

/**
 * Componente para mostrar estado vacío con estadísticas opcionales
 */
@Component({
  selector: 'app-estado-vacio',
  standalone: true,
  template: `
    <div class="text-center py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <!-- Icono Principal -->
      <div class="mb-6 sm:mb-8 flex justify-center">
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 blur-2xl sm:blur-3xl opacity-20 animate-pulse"></div>
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl sm:rounded-3xl flex items-center justify-center border-2 border-teal-100">
            @if (icono()) {
              <div class="text-4xl sm:text-5xl md:text-6xl">{{ icono() }}</div>
            } @else {
              <svg class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            }
          </div>
        </div>
      </div>

      <!-- Título y Descripción -->
      <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{{ titulo() }}</h3>
      <p class="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-6 sm:mb-8 px-4">{{ descripcion() }}</p>

      <!-- Estadísticas Opcionales -->
      @if (estadisticas() && estadisticas().length > 0) {
        <div class="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <h4 class="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 sm:mb-6">
            Información del Sistema
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            @for (estadistica of estadisticas(); track estadistica.etiqueta) {
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                @if (estadistica.icono) {
                  <div class="text-2xl sm:text-3xl mb-2 sm:mb-3">{{ estadistica.icono }}</div>
                }
                <div class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {{ estadistica.valor }}
                </div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">{{ estadistica.etiqueta }}</div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Contenido Adicional Proyectado -->
      <div class="mt-6 sm:mt-8">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class EstadoVacioComponent {
  readonly icono = input<string>();
  readonly titulo = input<string>('No hay datos disponibles');
  readonly descripcion = input<string>('Selecciona un reporte del menú lateral para comenzar a generar informes.');
  readonly estadisticas = input<EstadisticaReporte[]>([]);
}
