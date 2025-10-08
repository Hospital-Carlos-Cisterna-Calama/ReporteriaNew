import { Component, input } from '@angular/core';

/**
 * Componente de encabezado reutilizable para páginas
 */
@Component({
  selector: 'app-encabezado-pagina',
  standalone: true,
  template: `
    <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
      <div class="px-8 py-5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">
              {{ titulo() }}
            </h1>
            <p class="text-sm text-gray-600">
              {{ subtitulo() }}
            </p>
          </div>
          <ng-content select="[acciones]"></ng-content>
        </div>
      </div>
    </header>
  `
})
export class EncabezadoPaginaComponent {
  readonly titulo = input.required<string>();
  readonly subtitulo = input.required<string>();
}
