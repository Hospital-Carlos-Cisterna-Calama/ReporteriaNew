export const environment = {
  production: true,
  systemName: 'Reporteria New',
  apiBaseUrl: 'http://api-report.hospitalcalama.cl/api',
  loginApiUrl: 'http://login.hospitalcalama.cl', // Ajusta a la ruta real del servicio de autenticación en producción
  appVersion: '1.0.0',
  pacienteSelectionTtlMs: 30 * 60 * 1000,
  pacienteSelectionStorageKey: 'turnos.paciente.seleccion',
  catalogoWarmup: true,
  apiRequestTimeoutMs: 300_000, // 5 minutos para reportes pesados
  registrarAccessGraceMs: 5 * 60 * 1000
};
