export const ROLES = {
  ADMIN: 'Admin',
  CONSULTOR: 'Consultor',
  USER: 'User'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const REPORTES_ACCESS_ROLES: Role[] = [ROLES.ADMIN, ROLES.CONSULTOR];
export const TURNOS_ACCESS_ROLES: Role[] = [ROLES.ADMIN, ROLES.CONSULTOR, ROLES.USER];
