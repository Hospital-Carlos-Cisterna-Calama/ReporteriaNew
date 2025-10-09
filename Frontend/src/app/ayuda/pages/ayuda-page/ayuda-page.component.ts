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

  readonly preguntas: PreguntaFrecuente[] = [
    {
      pregunta: '¿Cómo genero un reporte?',
      respuesta: 'Selecciona el módulo deseado (PPV, Urgencias o Farmacia), elige un tipo de reporte del menú lateral, configura los filtros de fecha y haz clic en "Descargar Reporte".',
      categoria: 'general'
    },
    {
      pregunta: '¿En qué formato se descargan los reportes?',
      respuesta: 'Todos los reportes se descargan en formato Excel (.xlsx), listos para ser abiertos con Microsoft Excel, Google Sheets o LibreOffice Calc.',
      categoria: 'reportes'
    },
    {
      pregunta: '¿Puedo filtrar por rango de fechas?',
      respuesta: 'Sí, la mayoría de reportes permiten seleccionar un rango de fechas personalizado. Algunos reportes específicos pueden requerir selección por mes y año.',
      categoria: 'filtros'
    },
    {
      pregunta: '¿Qué reportes están disponibles en PPV?',
      respuesta: 'PPV ofrece 7 reportes: Intervenciones Pabellón, Procedimientos, IR-GRD, Lista de Espera, Base Consultas, RPHs y Camas Críticas.',
      categoria: 'reportes'
    },
    {
      pregunta: '¿Cómo funcionan las sub-especialidades en Procedimientos?',
      respuesta: 'Primero selecciona una especialidad, luego el sistema cargará automáticamente las sub-especialidades disponibles para esa especialidad.',
      categoria: 'filtros'
    },
    {
      pregunta: '¿Puedo seleccionar múltiples servicios en RPHs?',
      respuesta: 'Sí, en el reporte de RPHs puedes seleccionar uno o varios servicios. Por defecto, todos los servicios están seleccionados.',
      categoria: 'filtros'
    }
  ];

  readonly modulos = [
    { nombre: 'PPV', descripcion: 'Pabellón y Procedimientos', icono: '🏥', color: 'from-teal-500 to-cyan-500' },
    { nombre: 'Urgencias', descripcion: 'Atenciones de Urgencia', icono: '🚑', color: 'from-red-500 to-orange-500' },
    { nombre: 'Farmacia', descripcion: 'Gestión de Medicamentos', icono: '💊', color: 'from-purple-500 to-pink-500' }
  ];

  alternarPregunta(index: number): void {
    this.preguntaExpandida.set(this.preguntaExpandida() === index ? null : index);
  }

  esPreguntaExpandida(index: number): boolean {
    return this.preguntaExpandida() === index;
  }
}
