export const environment = {
  production: false,
  // Nombre del sistema
  systemName: 'TURNOS',
  // Backend local en desarrollo
  apiBaseUrl: 'http://127.0.0.1:3002/api',
  // API externa de login / validación de acceso
  loginApiUrl: 'http://127.0.0.1:8000',
  appVersion: 'dev',
  // Valores operativos (poner valores reales si ya existen en otro lugar)
  pacienteSelectionTtlMs: 30 * 60 * 1000, // 30 min
  pacienteSelectionStorageKey: 'turnos.paciente.seleccion',
  catalogoWarmup: true,
  apiRequestTimeoutMs: 15_000,
  registrarAccessGraceMs: 5 * 60 * 1000,
};
