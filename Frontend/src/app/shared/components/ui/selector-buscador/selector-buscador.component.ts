import { Component, input, output, signal, computed, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface OpcionSelector {
  id: string | number;
  nombre: string;
}

@Component({
  selector: 'app-selector-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selector-buscador.component.html'
})
export class SelectorBuscadorComponent {
  // Inputs
  opciones = input.required<OpcionSelector[]>();
  placeholder = input<string>('Selecciona una opción');
  label = input<string>('');
  valorSeleccionado = input<string | number | null>(null);
  deshabilitado = input<boolean>(false);

  // Outputs
  cambioSeleccion = output<string | number | null>();

  // Estado interno
  abierto = signal(false);
  terminoBusqueda = signal('');
  opcionResaltada = signal(0);
  inputBusqueda = viewChild<ElementRef<HTMLInputElement>>('inputBusqueda');

  // Opciones filtradas
  opcionesFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    if (!termino) return this.opciones();

    return this.opciones().filter(opcion =>
      opcion.nombre.toLowerCase().includes(termino)
    );
  });

  // Opción seleccionada actual
  opcionActual = computed(() => {
    const valor = this.valorSeleccionado();
    if (!valor) return null;
    return this.opciones().find(op => op.id === valor) || null;
  });

  // Texto a mostrar
  textoMostrado = computed(() => {
    return this.opcionActual()?.nombre || this.placeholder();
  });

  constructor() {
    // Efecto para enfocar el input cuando se abre el dropdown
    effect(() => {
      if (this.abierto()) {
        setTimeout(() => {
          this.inputBusqueda()?.nativeElement.focus();
        }, 100);
      }
    });
  }

  alternarDropdown() {
    if (this.deshabilitado()) return;
    this.abierto.set(!this.abierto());
    if (this.abierto()) {
      this.terminoBusqueda.set('');
      this.opcionResaltada.set(0);
    }
  }

  cerrarDropdown() {
    this.abierto.set(false);
    this.terminoBusqueda.set('');
  }

  seleccionarOpcion(opcion: OpcionSelector | null) {
    this.cambioSeleccion.emit(opcion?.id || null);
    this.cerrarDropdown();
  }

  alPresionarTecla(event: KeyboardEvent) {
    const opciones = this.opcionesFiltradas();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.opcionResaltada.update(i => Math.min(i + 1, opciones.length - 1));
        this.scrollToOpcion();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.opcionResaltada.update(i => Math.max(i - 1, 0));
        this.scrollToOpcion();
        break;

      case 'Enter':
        event.preventDefault();
        if (opciones.length > 0) {
          this.seleccionarOpcion(opciones[this.opcionResaltada()]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.cerrarDropdown();
        break;
    }
  }

  resaltarOpcion(index: number) {
    this.opcionResaltada.set(index);
  }

  private scrollToOpcion() {
    setTimeout(() => {
      const elemento = document.getElementById(`opcion-${this.opcionResaltada()}`);
      if (elemento) {
        elemento.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  alCambiarBusqueda() {
    this.opcionResaltada.set(0);
  }

  limpiarBusqueda() {
    this.terminoBusqueda.set('');
    this.opcionResaltada.set(0);
  }
}
