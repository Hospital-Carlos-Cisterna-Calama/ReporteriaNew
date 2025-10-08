import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Activity, ClipboardList, Pill, FileText, BarChart3, TrendingUp, Users, Clock, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  // Iconos
  readonly icons: Record<string, LucideIconData> = {
    Activity,
    ClipboardList,
    Pill,
    FileText,
    BarChart3,
    TrendingUp,
    Users,
    Clock
  };

  // Secciones principales
  readonly sections = signal([
    {
      title: 'Urgencia',
      description: 'Reportes y estadísticas de atenciones de urgencia',
      icon: 'Activity',
      route: '/urgencia',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'PPV',
      description: 'Procedimientos y reportes de pabellon',
      icon: 'ClipboardList',
      route: '/ppv',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Farmacia',
      description: 'Control de medicamentos y dispensación',
      icon: 'Pill',
      route: '/farmacia',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Reportes',
      description: 'Generación y consulta de reportes generales',
      icon: 'FileText',
      route: '/reportes',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ]);

  // Estadísticas de ejemplo
  readonly stats = signal([
    { label: 'Reportes Generados', value: '1,234', icon: 'BarChart3' },
    { label: 'Atenciones del Mes', value: '5,678', icon: 'TrendingUp' },
    { label: 'Usuarios Activos', value: '42', icon: 'Users' },
    { label: 'Tiempo Promedio', value: '2.5min', icon: 'Clock' }
  ]);
}
