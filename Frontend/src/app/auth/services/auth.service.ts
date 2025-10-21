import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { AccessData, JwtPayload } from '@auth/models/auth.interfaces';
import { decodeJwtPayload } from '@auth/utils/jwt.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  // Signals
  private readonly tokenSig = signal<string | null>(null);
  private readonly accessDataSig = signal<AccessData | null>(null);
  private readonly userIdSig = signal<number | null>(null);
  private readonly expSig = signal<number | null>(null);
  private readonly loadingSig = signal<boolean>(false);
  private readonly validatedSig = signal<boolean>(false);

  // Cache
  private cookieToken: string | null | undefined = undefined;
  private accessRequest$: Observable<boolean> | null = null;
  private lastAccessCheck: number = 0;
  private readonly REVALIDATE_INTERVAL = 5 * 60 * 1000; // 5 minutos

  // Computed properties
  readonly isLoading = computed(() => this.loadingSig());
  readonly isLoggedIn = computed(() => !!this.tokenSig() && !!this.accessDataSig());
  readonly accessData = computed(() => this.accessDataSig());
  readonly userId = computed(() => this.userIdSig());
  readonly hasTriedValidation = computed(() => this.validatedSig());

  initFromCookie(cookieName = 'auth_token'): void {
    // Cache de lectura de cookie
    if (this.cookieToken === undefined) {
      this.cookieToken = this.readCookie(cookieName);
    }

    const token = this.cookieToken;
    if (!token) return;

    // Si ya tenemos el token cargado, no hacer nada
    if (this.tokenSig() === token) return;

    const payload = decodeJwtPayload<JwtPayload>(token);
    if (!payload?.sub) return;

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      this.clear();
      return;
    }

    this.tokenSig.set(token);
    this.userIdSig.set(Number(payload.sub));
    this.expSig.set(payload.exp || null);
    this.scheduleExpiryCheck();
  }

  getToken(): string | null {
    return this.tokenSig();
  }

  clear(): void {
    this.tokenSig.set(null);
    this.accessDataSig.set(null);
    this.userIdSig.set(null);
    this.expSig.set(null);
    this.cookieToken = null;
    this.accessRequest$ = null;
    this.lastAccessCheck = 0;
  }

  private readCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  private scheduleExpiryCheck(): void {
    const exp = this.expSig();
    if (!exp) return;

    const ms = exp * 1000 - Date.now();
    if (ms <= 0) {
      this.clear();
      return;
    }

    setTimeout(() => this.clear(), ms);
  }

  /**
   * Asegura que hay accessData válido. Si no, intenta validación remota.
   * Retorna Observable<boolean> que emite true si hay acceso válido.
   */
  ensureAccess$(apiLoginBase: string, sistema: string): Observable<boolean> {
    const now = Date.now();
    const shouldRevalidate = now - this.lastAccessCheck > this.REVALIDATE_INTERVAL;

    // Ya tenemos datos en cache Y no ha pasado el tiempo de revalidación
    if (this.accessDataSig() && !shouldRevalidate) {
      return of(true);
    }

    if (!this.tokenSig()) {
      return of(false);
    }

    // Si ya hay una petición en curso, reutilizarla
    if (this.accessRequest$) {
      return this.accessRequest$;
    }

    this.loadingSig.set(true);

    this.accessRequest$ = this.http.post<AccessData>(`${apiLoginBase}/api/usuario/hasaccess`, {
      id: this.userIdSig(),
      sistema
    }).pipe(
      map(data => {
        if (data?.has_access) {
          this.accessDataSig.set(data);
          this.lastAccessCheck = Date.now(); // Registrar última validación
          return true;
        }
        this.clear();
        return false;
      }),
      catchError(() => {
        this.clear();
        return of(false);
      }),
      tap(() => {
        this.loadingSig.set(false);
        this.validatedSig.set(true);
        this.accessRequest$ = null; // Limpiar cache después de completar
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.accessRequest$;
  }
}
