import { Routes } from '@angular/router';
import { UrgenciaPageComponent } from './pages/urgencia-page/urgencia-page.component';

export const urgenciaRoutes: Routes = [
  {
    path: '',
  component: UrgenciaPageComponent,
    children: [
     {
        path: '**',
        redirectTo: '',
      },
    ]
  }
]
