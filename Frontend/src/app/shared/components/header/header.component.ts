import {  Component, HostListener, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Home, Activity, Pill, FileText, HelpCircle, UserRound, Menu, X, ClipboardList, LogOut, Eye } from 'lucide-angular';
import { AppIconComponent } from "../ui/app-icon/app-icon.component";
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AppIconComponent, LucideAngularModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  // Iconos de Lucide
  readonly icons = {
    Home,
    Activity,
    Pill,
    FileText,
    HelpCircle,
    UserRound,
    Menu,
    X,
    ClipboardList,
    LogOut,
    Eye
  };

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

  logout() {
    // Limpiar datos de autenticación
    this.authService.clear();
    // Redirigir a la página de login
    window.location.href = environment.loginApiUrl;
  }
  // #endregion

  // #region Host listeners
  private scrollTimeout?: number;
  private resizeTimeout?: number;

  @HostListener('window:scroll')
  onScroll() {
    // Throttle scroll events para mejor rendimiento
    if (this.scrollTimeout) return;

    this.scrollTimeout = window.setTimeout(() => {
      this.scrolled = window.scrollY > 10;
      this.scrollTimeout = undefined;
    }, 50);
  }

  @HostListener('window:resize')
  onResize() {
    // Debounce resize events para mejor rendimiento
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = window.setTimeout(() => {
      // Cerrar menú móvil al cambiar a desktop
      if (window.innerWidth >= 1024 && this.mobileOpen) {
        this.mobileOpen = false;
      }
    }, 150);
  }
  // #endregion
}
