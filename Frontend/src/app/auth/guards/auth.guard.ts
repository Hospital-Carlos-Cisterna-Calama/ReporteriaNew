import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Solo llamar initFromCookie si no hay token
  const token = auth.getToken();

  if (!token) {
    auth.initFromCookie();

    // Verificar nuevamente después de init
    if (!auth.getToken()) {
      router.navigate(['/errors/unauthorized']);
      return false;
    }
  }

  return true;
};
