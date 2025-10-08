import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { LoggerService } from '@shared/services/logger.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ReporteUrgeciaHosQuery, ReporteUrgenciaDoceHorasQuery, ReporteUrgenciaQuery, ReporteUrgIrasQuery, ResporteUrgeciaCatQuery } from '../interfaces/dto.interface';

@Injectable({providedIn: 'root'})
export class UrgenciaService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

   private readonly API_REPORTES = `${environment.apiBaseUrl}/reporteria/urgencia`;

  /* ───────────────────────────
   * Helpers internos
   * ─────────────────────────── */

  /**
   * Convierte un objeto plano a HttpParams ignorando null/undefined.
   * Booleans se serializan como 'true' / 'false'.
   */
  private construirHttpParams(payload: Record<string, any>): HttpParams {
    let params = new HttpParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // Enviar booleanos como 'true'/'false' (Joi convert:true lo acepta)
      if (typeof value === 'boolean') {
        params = params.set(key, value ? 'true' : 'false');
        return;
      }

      // Enviar números/strings tal cual
      params = params.set(key, String(value));
    });
    return params;
  }


  generarReporteUrgencias(query: ReporteUrgenciaQuery): Observable<Blob> {
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_REPORTES}/infor`, { params, responseType: 'blob' })
    .pipe(
      tap(() => this.log('Reporte MQ (archivo) generado', query, '📄')),
      catchError(err => this.handleError(err, 'No se pudo generar el reporte de urgencias'))
    )
  }

  generarReporteUrgencias12Horas(query: ReporteUrgenciaDoceHorasQuery): Observable<Blob> {
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_REPORTES}/horas`, { params, responseType: 'blob' })
    .pipe(
      tap(() => this.log('Reporte 12 horas (archivo) generado', query, '📄')),
      catchError(err => this.handleError(err, 'No se pudo generar el reporte de urgencias últimas 12 horas'))
    )
  }

  generarReporteUrgenciaCetegorizaciones(query: ResporteUrgeciaCatQuery): Observable<Blob> {
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_REPORTES}/cat`, { params, responseType: 'blob' })
    .pipe(
      tap(() => this.log('Reporte categorizaciones (archivo) generado', query, '📄')),
      catchError(err => this.handleError(err, 'No se pudo generar el reporte de categorizaciones'))
    )
  }

  generarReporteUrgenciasHospitalizados(query: ReporteUrgeciaHosQuery): Observable<Blob> {
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_REPORTES}/hosp`, { params, responseType: 'blob' })
    .pipe(
      tap(() => this.log('Reporte urgencias hospitalizados (archivo) generado', query, '📄')),
      catchError(err => this.handleError(err, 'No se pudo generar el reporte de urgencias hospitalizados'))
    )
  }

  generarResporteIras(query: ReporteUrgIrasQuery): Observable<Blob> {
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_REPORTES}/iras`, { params, responseType: 'blob' })
    .pipe(
      tap(() => this.log('Reporte IRAS (archivo) generado', query, '📄')),
      catchError(err => this.handleError(err, 'No se pudo generar el reporte de IRAS'))
    )
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
