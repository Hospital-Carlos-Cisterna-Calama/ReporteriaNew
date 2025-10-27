/** Marca de vigencia. Ajusta según tu dato real ('S'/'N' o '1'/'0'). */
export type VigenteFlag = 'S' | 'N' | '1' | '0';

// Interface para la respuesta real del backend
export interface PpvServicioBackend {
  id: number;
  serv: string;
}

// Interface para uso en el frontend (después del mapeo)
export interface PpvServicio {
  id: string;
  nombre: string;
  codigo?: string;
}

export interface PpvServicioResponse {
  success: boolean;
  message: string;
  count: number;
  data: PpvServicioBackend[];
}
