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
    // Si no hay restricciones, permitir acceso inmediato
    if (!data.roles && !data.profesiones && !data.servicios) {
      return true;
    }

    const hasValidRole = !data.roles || data.roles.includes(accessData.rol);
    const hasValidProfession = !data.profesiones || data.profesiones.includes(accessData.profesion);
    const hasValidService = !data.servicios || data.servicios.includes(accessData.servicio);
    return hasValidRole && hasValidProfession && hasValidService;
  };

  const denyAccessUnauthorized = (): boolean => {
    router.navigate(['/errors/unauthorized']);
    return false;
  };

  const denyAccessForbidden = (): boolean => {
    router.navigate(['/errors/forbidden']);
    return false;
  };

  // Si ya hay accessData, evaluar inmediatamente
  const currentAccess = auth.accessData();
  if (currentAccess) {
    return checkPermissions(currentAccess) || denyAccessForbidden();
  }

  // Si no hay accessData, validar de forma asíncrona
  return auth.ensureAccess$(environment.loginApiUrl, environment.systemName).pipe(
    map(hasValidAccess => {
      // Usuario NO tiene acceso al sistema (401)
      if (!hasValidAccess) return denyAccessUnauthorized();

      const accessData = auth.accessData();
      if (!accessData) return denyAccessUnauthorized();

      // Usuario tiene acceso pero no cumple roles/profesiones/servicios (403)
      return checkPermissions(accessData) || denyAccessForbidden();
    })
  );
};
