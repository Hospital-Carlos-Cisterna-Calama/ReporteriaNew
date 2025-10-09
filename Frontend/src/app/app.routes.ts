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
  {
    path: 'farmacia',
    loadChildren: () => import('./farmacia/farmacia.router').then(m => m.farmaciaRoutes),
  },
  {
    path: 'ayuda',
    loadChildren: () => import('./ayuda/ayuda.routes').then(m => m.ayudaRoutes),
  },

  { path: '**', redirectTo: '' },
];
