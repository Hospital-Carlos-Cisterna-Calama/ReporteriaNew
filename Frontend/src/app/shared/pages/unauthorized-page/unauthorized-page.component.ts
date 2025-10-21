import { Component, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-unauthorized-page',
  standalone: true,
  template: `
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-700 transform"
         [class.opacity-0]="!visible()" [class.translate-y-8]="!visible()" [class.opacity-100]="visible()" [class.translate-y-0]="visible()">
      <div class="relative">
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-teal-500 to-yellow-500"></div>
        <div class="pt-8 pb-6 px-6 sm:px-8">
          <div class="flex flex-col items-center">
            <div class="bg-red-100 p-4 rounded-full mb-5 transition-transform duration-500 hover:scale-110">
              <span class="text-red-500 text-4xl">�️</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2 text-center">Sistema No Asignado</h1>
            <div class="h-1 w-20 bg-teal-600 my-4"></div>
            <p class="text-gray-600 text-center mb-6 text-sm leading-relaxed">
              No tienes asignado acceso a este sistema. Si crees que deberías tener acceso, por favor contacta con el administrador para solicitar los permisos necesarios.
            </p>
            <a [href]="redirectUrl"
               class="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg w-full mb-4">
              <span class="text-sm font-medium">Redirigir a Panel de Usuario</span>
            </a>
            <div class="text-sm text-gray-500 mt-2">
              Redirección automática en <span class="font-medium text-teal-600">{{ countdown() }}</span> segundos
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>Código de error: <span class="font-mono">ERR_SYSTEM_NOT_ASSIGNED</span></p>
            <a href="mailto:soporte@hospitalcalama.cl" class="text-teal-600 hover:underline flex items-center gap-1">
              <span class="text-[11px]">Contactar soporte</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-700 delay-300 transform"
         [class.opacity-0]="!visible()" [class.translate-y-8]="!visible()" [class.opacity-100]="visible()" [class.translate-y-0]="visible()">
      <div class="p-5">
        <h3 class="text-sm font-medium text-gray-700 mb-2">¿Por qué estoy viendo esto?</h3>
        <p class="text-xs text-gray-600">Esta página aparece cuando intentas acceder a un sistema para el cual no tienes asignación. Tu usuario no está registrado como usuario autorizado para este sistema específico.</p>
        <button (click)="reload()" class="mt-4 inline-flex items-center text-[11px] text-teal-600 hover:underline">Reintentar validación</button>
      </div>
    </div>
  </div>
  `
})
export class UnauthorizedPageComponent {
  readonly redirectUrl = environment.loginApiUrl;
  countdown = signal(15);
  visible = signal(false);
  private intervalId: any;

  constructor(){
    // delay para animación
    setTimeout(()=> this.visible.set(true), 30);
    this.intervalId = setInterval(()=> {
      const v = this.countdown();
      if(v <= 1){
        clearInterval(this.intervalId);
        window.location.href = this.redirectUrl;
      } else {
        this.countdown.set(v - 1);
      }
    }, 1000);
  }

  reload(){ window.location.reload(); }
}
