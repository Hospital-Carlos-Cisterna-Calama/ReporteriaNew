import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { LucideAngularModule, Menu } from 'lucide-angular';

/**
 * Componente reutilizable para mostrar un banner de instrucciones
 * con gradiente personalizable y diseño responsive
 */
@Component({
  selector: 'app-banner-instrucciones',
  standalone: true,
  imports: [NgClass, LucideAngularModule],
  templateUrl: './banner-instrucciones.component.html',
})
export class BannerInstruccionesComponent {
  readonly titulo = input<string>('Sistema de Reportería');
  readonly descripcion = input<string>('Selecciona un reporte del menú lateral para comenzar');
  readonly colorGradient = input<'teal' | 'blue' | 'purple' | 'green'>('teal');
  readonly mostrarBotonMenu = input<boolean>(false);
  readonly sidebarAbierto = input<boolean>(true);

  // Outputs
  readonly toggleSidebar = output<void>();

  // Iconos
  readonly MenuIcon = Menu;

  onToggleMenu() {
    this.toggleSidebar.emit();
  }
}
