import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TipoMensaje = 'exito' | 'error' | 'advertencia' | 'info';

export interface ConfiguracionModal {
  tipo: TipoMensaje;
  titulo: string;
  mensaje: string;
  detalles?: string;
  mostrarBotonCerrar?: boolean;
  textoBotonPrincipal?: string;
  textoBotonSecundario?: string;
  autoCerrarMs?: number;
}

/**
 * Componente modal reutilizable para mostrar resultados de operaciones
 * Soporta 4 tipos: éxito, error, advertencia e info
 *
 * @example
 * ```typescript
 * // En el componente padre
 * mostrarModal = signal(false);
 * configuracion = signal<ConfiguracionModal>({
 *   tipo: 'exito',
 *   titulo: 'Reporte Generado',
 *   mensaje: 'El reporte se descargó correctamente',
 *   autoCerrarMs: 3000
 * });
 *
 * mostrarExito() {
 *   this.configuracion.set({ ... });
 *   this.mostrarModal.set(true);
 * }
 * ```
 *
 * ```html
 * <app-modal-resultado
 *   [visible]="mostrarModal()"
 *   [config]="configuracion()"
 *   (cerrar)="mostrarModal.set(false)"
 *   (confirmar)="manejarConfirmacion()"
 * />
 * ```
 */
@Component({
  selector: 'app-modal-resultado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-resultado.component.html',
  styles: [`
    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }

    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin-slow {
      animation: spin 2s linear infinite;
    }
  `]
})
export class ModalResultadoComponent {
  // ============================================================================
  // INPUTS
  // ============================================================================
  visible = input<boolean>(false);
  config = input.required<ConfiguracionModal>();

  // ============================================================================
  // OUTPUTS
  // ============================================================================
  cerrar = output<void>();
  confirmar = output<void>();
  cancelar = output<void>();

  // ============================================================================
  // STATE
  // ============================================================================
  private timerAutoCierre?: ReturnType<typeof setTimeout>;

  // ============================================================================
  // LIFECYCLE
  // ============================================================================
  ngOnChanges() {
    if (this.visible() && this.config().autoCerrarMs) {
      this.iniciarAutoCierre();
    } else {
      this.cancelarAutoCierre();
    }
  }

  ngOnDestroy() {
    this.cancelarAutoCierre();
  }

  // ============================================================================
  // MÉTODOS PÚBLICOS
  // ============================================================================
  cerrarModal() {
    this.cancelarAutoCierre();
    this.cerrar.emit();
  }

  confirmarAccion() {
    this.cancelarAutoCierre();
    this.confirmar.emit();
    this.cerrar.emit();
  }

  cancelarAccion() {
    this.cancelarAutoCierre();
    this.cancelar.emit();
    this.cerrar.emit();
  }

  // ============================================================================
  // GETTERS PARA ESTILOS DINÁMICOS
  // ============================================================================
  obtenerEstiloIcono(): string {
    const estilos: Record<TipoMensaje, string> = {
      exito: 'bg-green-100 text-green-600',
      error: 'bg-red-100 text-red-600',
      advertencia: 'bg-yellow-100 text-yellow-600',
      info: 'bg-blue-100 text-blue-600'
    };
    return estilos[this.config().tipo];
  }

  obtenerEstiloBoton(): string {
    const estilos: Record<TipoMensaje, string> = {
      exito: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      advertencia: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    };
    return estilos[this.config().tipo];
  }

  // ============================================================================
  // MÉTODOS PRIVADOS
  // ============================================================================
  private iniciarAutoCierre() {
    this.cancelarAutoCierre();
    const ms = this.config().autoCerrarMs;
    if (ms && ms > 0) {
      this.timerAutoCierre = setTimeout(() => this.cerrarModal(), ms);
    }
  }

  private cancelarAutoCierre() {
    if (this.timerAutoCierre) {
      clearTimeout(this.timerAutoCierre);
      this.timerAutoCierre = undefined;
    }
  }
}
