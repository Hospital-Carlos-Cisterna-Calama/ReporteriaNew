import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/**
 * AppIconComponent
 * Icono unificado del sistema de Reportería: combina documentos con gráficos
 * representando la generación y análisis de reportes hospitalarios.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <div
      class="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white"
      [class.shadow]="shadow"
      [class]="'inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white ' + sizeClass + (shadow ? ' shadow' : '')"
      [attr.aria-label]="ariaLabel"
      role="img"
    >
      <!-- SVG accesible -->
      <svg
        class="w-[65%] h-[65%]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <!-- Documento base -->
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" class="opacity-90" />
        <polyline points="14 2 14 8 20 8" />
        <!-- Gráfico de barras/reportes -->
        <line x1="8" y1="18" x2="8" y2="14" stroke-width="2.2" />
        <line x1="12" y1="18" x2="12" y2="12" stroke-width="2.2" />
        <line x1="16" y1="18" x2="16" y2="15" stroke-width="2.2" />
      </svg>
    </div>
  `,

})
export class AppIconComponent {
  /** Tamaños soportados */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  /** Mostrar sombra externa */
  @Input() shadow = true;
  /** Etiqueta accesible opcional */
  @Input() ariaLabel = 'Icono Sistema de Reportería';

  get sizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-14 h-14';
      default:
        return 'w-10 h-10';
    }
  }
}
