import { Component, signal } from '@angular/core';
import { LucideAngularModule, FileText, Filter, Download, HelpCircle, Calendar, Settings } from 'lucide-angular';

interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
  categoria: 'general' | 'reportes' | 'filtros';
}

interface PasoGuia {
  numero: number;
  titulo: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-ayuda-page',
  imports: [LucideAngularModule],
  templateUrl: './ayuda-page.component.html',
})
export class AyudaPageComponent {
  readonly iconos = { FileText, Filter, Download, HelpCircle, Calendar, Settings };

  readonly preguntaExpandida = signal<number | null>(null);

  readonly pasosGuia: PasoGuia[] = [
    { numero: 1, titulo: 'Selecciona un Módulo', descripcion: 'Elige entre PPV, Urgencias o Farmacia desde el menú superior', icono: '🏥' },
    { numero: 2, titulo: 'Elige un Reporte', descripcion: 'Selecciona el tipo de reporte que necesitas del menú lateral', icono: '📊' },
    { numero: 3, titulo: 'Configura Filtros', descripcion: 'Ajusta las fechas y parámetros según tus necesidades', icono: '⚙️' },
    { numero: 4, titulo: 'Descarga el Archivo', descripcion: 'Haz clic en "Descargar Reporte" para obtener tu Excel', icono: '📥' }
  ];


  readonly modulos = [
    { nombre: 'PPV', descripcion: 'Pabellón y Procedimientos', icono: '🏥', color: 'from-teal-500 to-cyan-500' },
    { nombre: 'Urgencias', descripcion: 'Atenciones de Urgencia', icono: '🚑', color: 'from-red-500 to-orange-500' },
    { nombre: 'Farmacia', descripcion: 'Gestión de Medicamentos', icono: '💊', color: 'from-purple-500 to-pink-500' }
  ];


}
