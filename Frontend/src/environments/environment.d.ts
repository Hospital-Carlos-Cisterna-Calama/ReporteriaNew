// Tipado centralizado para asegurar consistencia entre environment.ts y environment.prod.ts
export interface AppEnvironment {
  production: boolean;
  apiBaseUrl: string;
  /** API base para autenticación/login externo (emisión/validación de token) */
  loginApiUrl: string;
  /** Nombre del sistema mostrado y enviado a validaciones */
  systemName: string;
  pacienteSelectionTtlMs: number;
  pacienteSelectionStorageKey: string;
  catalogoWarmup: boolean;
  apiRequestTimeoutMs: number;
  appVersion: string;
  registrarAccessGraceMs: number;

}

// Declaración global para intellisense si se importa dinámicamente
declare const environment: AppEnvironment;
export {};
