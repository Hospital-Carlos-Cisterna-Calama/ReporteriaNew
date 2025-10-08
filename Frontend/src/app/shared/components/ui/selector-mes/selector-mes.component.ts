import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SeleccionMes {
  mes: number;
  anio: number;
}

/**
 * Componente para seleccionar mes y año
 */
@Component({
  selector: 'app-selector-mes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-2">
      <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        Seleccionar Mes
      </label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Selector de Mes -->
        <div class="relative group">
          <select
            [(ngModel)]="mesSeleccionado"
            (ngModelChange)="alCambiar()"
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
            <option [value]="1">Enero</option>
            <option [value]="2">Febrero</option>
            <option [value]="3">Marzo</option>
            <option [value]="4">Abril</option>
            <option [value]="5">Mayo</option>
            <option [value]="6">Junio</option>
            <option [value]="7">Julio</option>
            <option [value]="8">Agosto</option>
            <option [value]="9">Septiembre</option>
            <option [value]="10">Octubre</option>
            <option [value]="11">Noviembre</option>
            <option [value]="12">Diciembre</option>
          </select>
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg class="w-5 h-5 text-teal-600 group-hover:text-teal-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        <!-- Selector de Año -->
        <div class="relative group">
          <select
            [(ngModel)]="anioSeleccionado"
            (ngModelChange)="alCambiar()"
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
            @for (anio of aniosDisponibles(); track anio) {
              <option [value]="anio">{{ anio }}</option>
            }
          </select>
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg class="w-5 h-5 text-teal-600 group-hover:text-teal-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
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
  `
})
export class SelectorMesComponent {
  readonly cambioMes = output<SeleccionMes>();

  mesSeleccionado = new Date().getMonth() + 1; // 1-12
  anioSeleccionado = new Date().getFullYear();

  // Generar años disponibles (últimos 5 años + año actual + próximos 2 años)
  readonly aniosDisponibles = signal<number[]>(
    Array.from(
      { length: 8 },
      (_, i) => new Date().getFullYear() - 5 + i
    )
  );

  alCambiar() {
    this.cambioMes.emit({
      mes: this.mesSeleccionado,
      anio: this.anioSeleccionado
    });
  }

  limpiar() {
    this.mesSeleccionado = new Date().getMonth() + 1;
    this.anioSeleccionado = new Date().getFullYear();
  }
}
