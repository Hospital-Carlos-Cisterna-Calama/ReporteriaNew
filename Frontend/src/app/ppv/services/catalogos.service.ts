import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, shareReplay, tap, throwError } from 'rxjs';
import { LoggerService } from '@shared/services/logger.service';
import { environment } from '@environments/environment';
import {
  Especialidad,
  SubEspecialidad,
  EspecialidadesResponse,
  SubEspecialidadesResponse
} from '../interfaces';
import { EspecialidadesMapper, ServiciosMapper } from '../mappers';
import { PpvServicio, PpvServicioResponse } from '../interfaces/servicio.interface';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  private readonly API_CATALOGOS = `${environment.apiBaseUrl}/catalogos`;

  // Cache para especialidades y servicios
  private especialidadesCache$?: Observable<Especialidad[]>;
  private serviciosCache$?: Observable<PpvServicio[]>;

  // ============================================================================
  // MÉTODOS PÚBLICOS DEL SERVICIO
  // ============================================================================

  /** Lista todas las especialidades disponibles (con caché) */
  listarEspecialidades(): Observable<Especialidad[]> {
    if (!this.especialidadesCache$) {
      this.especialidadesCache$ = this.http.get<EspecialidadesResponse>(`${this.API_CATALOGOS}/especialidades`).pipe(
        map(resp => EspecialidadesMapper.mapRestEspecialidadesToEspecialidades(resp)),
        tap(especialidades => this.log('Especialidades recibidas:', especialidades)),
        shareReplay(1),
        catchError(err => this.handleError(err, 'No se encontraron especialidades'))
      );
    }
    return this.especialidadesCache$;
  }

  /** Obtiene sub especialidades por especialidad */
  obtenerSubEspecialidades(especialidadId: string): Observable<SubEspecialidad[]> {
    return this.http.get<SubEspecialidadesResponse>(`${this.API_CATALOGOS}/especialidades/${especialidadId}/sub-especialidades`).pipe(
      map(resp => EspecialidadesMapper.mapRestSubEspecialidadesToSubEspecialidades(resp)),
      tap(subEspecialidades => this.log(`Sub especialidades recibidas para ${especialidadId}:`, subEspecialidades)),
      catchError(err => this.handleError(err, 'No se encontraron sub especialidades'))
    );
  }

  /** Lista todos los servicios disponibles (con caché) */
  obtenerServicios(): Observable<PpvServicio[]> {
    if (!this.serviciosCache$) {
      this.serviciosCache$ = this.http.get<PpvServicioResponse>(`${this.API_CATALOGOS}/servicios`).pipe(
        map(resp => ServiciosMapper.mapRestServiciosToServicios(resp)),
        map(servicios => ServiciosMapper.ordenarServiciosPorNombre(servicios)),
        tap(servicios => this.log('Servicios recibidos:', servicios)),
        shareReplay(1),
        catchError(err => this.handleError(err, 'No se encontraron servicios'))
      );
    }
    return this.serviciosCache$;
  }

  /** Limpia el caché de especialidades y servicios */
  limpiarCache(): void {
    this.especialidadesCache$ = undefined;
    this.serviciosCache$ = undefined;
    this.log('Caché de especialidades y servicios limpiado', undefined, '🧹');
  }

  // ============================================================================
  // MÉTODOS PRIVADOS PARA LOGGING Y MANEJO DE ERRORES
  // ============================================================================

  private log(message: string, data?: any, icon: string = '✅'): void {
    this.logger.info(message, data);
  }

  private handleError(error: any, defaultMessage: string, icon: string = '❌'): Observable<never> {
    let errorMessage = defaultMessage;

    if (error instanceof HttpErrorResponse) {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.logger.error(`Error HTTP (${error.status}): ${errorMessage}`, {
        url: error.url,
        detalles: error.error
      });
    } else {
      this.logger.error('Error inesperado', error);
    }

    return throwError(() => new Error(errorMessage));
  }
}
