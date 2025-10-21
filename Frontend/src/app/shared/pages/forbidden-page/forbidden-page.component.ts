import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  template: `
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-700 transform"
         [class.opacity-0]="!visible()" [class.translate-y-8]="!visible()" [class.opacity-100]="visible()" [class.translate-y-0]="visible()">
      <div class="relative">
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
        <div class="pt-8 pb-6 px-6 sm:px-8">
          <div class="flex flex-col items-center">
            <div class="bg-amber-100 p-4 rounded-full mb-5 transition-transform duration-500 hover:scale-110">
              <span class="text-amber-600 text-4xl">🔐</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2 text-center">Acceso Restringido</h1>
            <div class="h-1 w-20 bg-amber-600 my-4"></div>
            <p class="text-gray-600 text-center mb-6 text-sm leading-relaxed">
              Tu rol o permisos actuales no son suficientes para acceder a esta sección. Si necesitas acceso, por favor contacta con el administrador del sistema.
            </p>
            <button (click)="goHome()"
               class="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg w-full mb-4">
              <span class="text-sm font-medium">Volver al Inicio</span>
            </button>
            <div class="text-sm text-gray-500 mt-2">
              Redirección automática en <span class="font-medium text-amber-600">{{ countdown() }}</span> segundos
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>Código de error: <span class="font-mono">ERR_INSUFFICIENT_PERMISSIONS</span></p>
            <a href="mailto:soporte@hospitalcalama.cl" class="text-amber-600 hover:underline flex items-center gap-1">
              <span class="text-[11px]">Solicitar acceso</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-700 delay-300 transform"
         [class.opacity-0]="!visible()" [class.translate-y-8]="!visible()" [class.opacity-100]="visible()" [class.translate-y-0]="visible()">
      <div class="p-5">
        <h3 class="text-sm font-medium text-gray-700 mb-2">¿Por qué estoy viendo esto?</h3>
        <p class="text-xs text-gray-600 mb-3">
          Tienes acceso al sistema, pero esta sección específica requiere un rol, profesión o servicio diferente al que tienes asignado actualmente.
        </p>
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
          <p class="text-amber-800 font-medium mb-1">Información técnica:</p>
          <p class="text-amber-700">La ruta que intentaste acceder tiene restricciones de permisos que tu cuenta no cumple.</p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ForbiddenPageComponent {
  private readonly router = Router;
  countdown = signal(10);
  visible = signal(false);
  private intervalId: any;

  constructor(private routerInstance: Router) {
    // delay para animación
    setTimeout(() => this.visible.set(true), 30);
    this.intervalId = setInterval(() => {
      const v = this.countdown();
      if (v <= 1) {
        clearInterval(this.intervalId);
        this.goHome();
      } else {
        this.countdown.set(v - 1);
      }
    }, 1000);
  }

  goHome() {
    clearInterval(this.intervalId);
    this.routerInstance.navigate(['/']);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
