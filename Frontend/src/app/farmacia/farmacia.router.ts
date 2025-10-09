import { Routes } from '@angular/router';
import { FarmaciaPageComponent } from './pages/farmacia-page/farmacia-page.component';

export const farmaciaRoutes: Routes = [
{
    path: '',
  component: FarmaciaPageComponent,
    children: [
     {
        path: '**',
        redirectTo: '',
      },
    ]
  }
]
