import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { aclGuard, authGuard } from './auth';
import { UnauthorizedPageComponent } from './shared/pages/unauthorized-page/unauthorized-page.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard, aclGuard],
    //  data: {
    //   roles: ['Admin', 'User'],
    //   profesiones: ['Médico', 'Enfermera'],
    //   servicios: ['Urgencia', 'Pabellón']
    // },
    data: { roles: ['Admin','Consultor','User']},
    component: HomePageComponent
  },
  {
    path: 'urgencia',
    canActivate: [authGuard, aclGuard],
    data: { roles: ['Admin','Consultor','User']},
    loadChildren: () => import('./urgencia/urgencia.routes').then(m => m.urgenciaRoutes),
  },
  {
    path: 'ppv',
    canActivate: [authGuard, aclGuard],
    data: { roles: ['Admin','Consultor','User']},
    loadChildren: () => import('./ppv/ppv.routes').then(m => m.ppvRoutes),
  },
  {
    path: 'farmacia',
    canActivate: [authGuard, aclGuard],
    data: { roles: ['Admin','Consultor','User']},
    loadChildren: () => import('./farmacia/farmacia.router').then(m => m.farmaciaRoutes),
  },
  {
    path: 'ayuda',
    canActivate: [authGuard, aclGuard],
    data: { roles: ['Admin','Consultor','User']},
    loadChildren: () => import('./ayuda/ayuda.routes').then(m => m.ayudaRoutes),
  },
      {
        path: 'errors/unauthorized',
        component: UnauthorizedPageComponent,
        data: { layout: { hideHeader: true, hideFooter: true } }
    },

  { path: '**', redirectTo: '' },
];
