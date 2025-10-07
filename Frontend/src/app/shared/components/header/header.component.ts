import {  Component, HostListener, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AppIconComponent } from "../ui/app-icon/app-icon.component";
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AppIconComponent,LucideAngularModule],
  templateUrl: './header.component.html',

})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  // #region State
  mobileOpen = false;
  scrolled = false;
  // #endregion

  // #region User Data
  readonly userData = computed(() => {
    const access = this.authService.accessData();
    return access ? {
      name: access.nombre_completo || access.username || 'Usuario',
      role: access.rol || 'Sin rol',
      profession: access.profesion || '',
      service: access.servicio || '',
      username: access.username || ''
    } : null;
  });

  readonly isLoggedIn = this.authService.isLoggedIn;
  // #endregion

  // #region Handlers
  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile() {
    this.mobileOpen = false;
  }
  // #endregion

  // #region Host listeners
  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 10;
  }

  @HostListener('window:resize')
  onResize() {
    // Cerrar menú móvil al cambiar a desktop
    if (window.innerWidth >= 1024) {
      this.mobileOpen = false;
    }
  }
  // #endregion
}
