import { PpvServicio, PpvServicioResponse } from '../interfaces/servicio.interface';

/**
 * Mapper para transformar respuestas del backend de servicios PPV
 */
export class ServiciosMapper {

  /**
   * Mapea la respuesta de servicios del backend a array de servicios PPV
   */
  static mapRestServiciosToServicios(response: PpvServicioResponse): PpvServicio[] {
    if (!response.success || !response.data) {
      return [];
    }

    return response.data
      .filter(servicio => servicio && servicio.id && servicio.serv) // Filtrar servicios válidos usando 'serv'
      .map(servicio => ({
        id: servicio.id.toString(), // Convertir ID numérico a string
        nombre: servicio.serv || 'Sin nombre', // Mapear 'serv' a 'nombre'
        codigo: `SRV-${servicio.id}` // Generar código basado en ID
      }));
  }

  /**
   * Ordena servicios por nombre de forma segura
   */
  static ordenarServiciosPorNombre(servicios: PpvServicio[]): PpvServicio[] {
    return [...servicios].sort((a, b) => {
      const nombreA = a.nombre || '';
      const nombreB = b.nombre || '';
      return nombreA.localeCompare(nombreB);
    });
  }
}
