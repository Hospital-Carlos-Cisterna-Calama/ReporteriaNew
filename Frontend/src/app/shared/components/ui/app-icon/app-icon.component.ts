import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/**
 * AppIconComponent
 * Icono unificado del sistema Turnos Médicos: combina un calendario simplificado
 * con una cruz médica al centro representando la gestión y entrega de turnos.
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
        class="w-[60%] h-[60%]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <!-- Calendario base -->
        <rect x="3" y="5" width="18" height="16" rx="2" ry="2" class="opacity-90" />
        <line x1="16" y1="3" x2="16" y2="7" />
        <line x1="8" y1="3" x2="8" y2="7" />
        <line x1="3" y1="11" x2="21" y2="11" />
        <!-- Cruz médica estilizada (entrega / asistencia) -->
        <path d="M12 14v-2m0 0v-2m0 2h2m-2 0h-2" stroke-width="2.4" />
      </svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIconComponent {
  /** Tamaños soportados */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  /** Mostrar sombra externa */
  @Input() shadow = true;
  /** Etiqueta accesible opcional */
  @Input() ariaLabel = 'Icono Turnos Médicos';

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
