import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * Componente reutilizable para mostrar un banner de instrucciones
 * con gradiente personalizable y diseño responsive
 */
@Component({
  selector: 'app-banner-instrucciones',
  standalone: true,
  imports: [NgClass],
  templateUrl: './banner-instrucciones.component.html',
})
export class BannerInstruccionesComponent {
  readonly titulo = input<string>('Sistema de Reportería');
  readonly descripcion = input<string>('Selecciona un reporte del menú lateral para comenzar');
  readonly colorGradient = input<'teal' | 'blue' | 'purple' | 'green'>('teal');
}
