import { Routes } from '@angular/router';
import { PpvPageComponent } from './pages/ppv-page/ppv-page.component';


export const ppvRoutes: Routes = [
{
    path: '',
  component: PpvPageComponent,
    children: [
     {
        path: '**',
        redirectTo: '',
      },
    ]
  }
]
