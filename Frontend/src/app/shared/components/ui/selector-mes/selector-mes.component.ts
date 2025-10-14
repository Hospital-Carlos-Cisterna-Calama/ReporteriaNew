import { Component, output, signal, OnInit } from '@angular/core';
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
  templateUrl: './selector-mes.component.html'
})
export class SelectorMesComponent implements OnInit {
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

  ngOnInit() {
    // Emitir valores iniciales al cargar el componente
    this.alCambiar();
  }

  alCambiar() {
    this.cambioMes.emit({
      mes: this.mesSeleccionado,
      anio: this.anioSeleccionado
    });
  }

  limpiar() {
    this.mesSeleccionado = new Date().getMonth() + 1;
    this.anioSeleccionado = new Date().getFullYear();
    this.alCambiar(); // Emitir también al limpiar
  }
}
