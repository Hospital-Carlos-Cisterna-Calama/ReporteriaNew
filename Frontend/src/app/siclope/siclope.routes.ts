import { Routes } from '@angular/router';
import { SiclopePageComponent } from './pages/siclope-page.component/siclope-page.component';

export const siclopeRoutes: Routes = [
  {
    path: '',
    component: SiclopePageComponent,
    children: [
      {
        path: '**',
        redirectTo: '',
      }
    ]

  }
]
