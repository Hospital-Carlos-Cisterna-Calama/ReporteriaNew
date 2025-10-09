import { Routes } from '@angular/router';
import { AyudaPageComponent } from './pages/ayuda-page/ayuda-page.component';

export const ayudaRoutes: Routes = [
{
    path: '',
  component: AyudaPageComponent,
    children: [
     {
        path: '**',
        redirectTo: '',
      },
    ]
  }
]
