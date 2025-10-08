import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'urgencia',
    loadChildren: () => import('./urgencia/urgencia.routes').then(m => m.urgenciaRoutes),
  },
  {
    path: 'ppv',
    loadChildren: () => import('./ppv/ppv.routes').then(m => m.ppvRoutes),
  },
  // {
  //   path: 'farmacia',
  // },

  { path: '**', redirectTo: '' },
];
