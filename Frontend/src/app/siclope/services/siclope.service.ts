import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggerService } from '@app/shared/services/logger.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ReporteContraReferenciaSiclopeQuery, ReporteDiagnosticoSiclopeQuery, ReporteNominaSiclopeQuery } from '../interfaces/dto.interface';
import { catchError, mapTo, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SiclopeService {

  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  private readonly API_SICLOPE = `${environment.apiBaseUrl}/siclope`;


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


  generarReporteNominaSiclope(query: ReporteNominaSiclopeQuery): Observable<Blob> {
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_SICLOPE}/nomina`, { params, responseType: 'blob' })
    .pipe(
      tap(() => this.log('Reporte Siclope Nómina (archivo) generado', query, '📄')),
      catchError((err) => this.handleError(err, 'No se pudo generar el reporte de Siclope nómina'))
    )
  }

  generarReporteContraReferenciaSiclope(query: ReporteContraReferenciaSiclopeQuery): Observable<Blob> {
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_SICLOPE}/exportar-contrareferencia`, { params, responseType: 'blob' })
    .pipe(
      tap(() => this.log('Reporte Siclope Contrareferencia (archivo) generado', query, '📄')),
      catchError((err) => this.handleError(err, 'No se pudo generar el reporte de Siclope contrareferencia'))
    )
  }

   generarReporteDiagnosticoSiclope(query: ReporteDiagnosticoSiclopeQuery): Observable<Blob> {
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_SICLOPE}/exportar-diagnosticos-realizados`, { params, responseType: 'blob' })
    .pipe(
      tap(() => this.log('Reporte Siclope Diagnóstico (archivo) generado', query, '📄')),
      catchError((err) => this.handleError(err, 'No se pudo generar el reporte de Siclope diagnóstico'))
    );
  }


  descargarPDF(query: ReporteNominaSiclopeQuery): Observable<void> {
		return this.generarReporteNominaSiclope(query).pipe(
			tap((blob) => {
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `Nomina_${query.rut}.pdf`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
			}),
			mapTo(void 0)
		);
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
        detalles: error.error,
      });
    } else {
      this.logger.error('Error inesperado', error);
    }

    return throwError(() => new Error(errorMessage));
  }
}
