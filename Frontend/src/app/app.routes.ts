import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { UrgenciaPageComponent } from './urgencia/pages/urgencia-page/urgencia-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'urgencia',
    component: UrgenciaPageComponent
  },
  // {
  //   path: 'farmacia',
  // },

  { path: '**', redirectTo: '' },
];
