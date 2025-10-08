import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@auth/services/auth.service';
import { environment } from '@environments/environment';
import { AclData } from '@auth/models/auth.interfaces';

export const aclGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> | boolean => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const data = route.data as AclData;

  const checkPermissions = (accessData: any): boolean => {
    const hasValidRole = !data.roles || data.roles.includes(accessData.rol);
    const hasValidProfession = !data.profesiones || data.profesiones.includes(accessData.profesion);
    return hasValidRole && hasValidProfession;
  };

  const denyAccess = (): boolean => {
    router.navigate(['/errors/unauthorized']);
    return false;
  };

  // Si ya hay accessData, evaluar inmediatamente
  const currentAccess = auth.accessData();
  if (currentAccess) {
    return checkPermissions(currentAccess) || denyAccess();
  }

  // Si no hay accessData, validar de forma asíncrona
  return auth.ensureAccess$(environment.loginApiUrl, environment.systemName).pipe(
    map(hasValidAccess => {
      if (!hasValidAccess) return denyAccess();

      const accessData = auth.accessData();
      if (!accessData) return denyAccess();

      return checkPermissions(accessData) || denyAccess();
    })
  );
};
