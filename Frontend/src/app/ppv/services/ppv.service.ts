import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { LoggerService } from '@shared/services/logger.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ReportePpvHosQuery, ReportePpvIngEgrQuery, ReportePpvIrGrdQuery, ReportePpvListaEsperaQuery, ReportePpvPabellonQuery, ReportePpvPacHospQuery, ReportePpvProcedimientosQuery } from '../interfaces/dto.interface';

@Injectable({providedIn: 'root'})
export class PpvService {
    private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  private readonly API_PPV = `${environment.apiBaseUrl}/ppv`;

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

  generarReportePpvHospitalizacion(query: ReportePpvHosQuery): Observable<Blob> {
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_PPV}/hospitalizaciones`, { params, responseType: 'blob' })
      .pipe(
        tap(() => this.log('Reporte PPV Hospitalizaciones (archivo) generado', query, '📄')),
        catchError((err) => this.handleError(err, 'No se pudo generar el reporte de PPV hospitalizaciones'))
      );
  }

  generarReportePpvIngEgr(query: ReportePpvIngEgrQuery): Observable<Blob>{
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_PPV}/ingresosEgresos`, { params, responseType: 'blob' })
      .pipe(
        tap(() => this.log('Reporte PPV Ingresos/Egresos (archivo) generado', query, '📄')),
        catchError((err) => this.handleError(err, 'No se pudo generar el reporte de PPV ingresos/egresos'))
      );
  }

  generarReportePpvListaEspera(query: ReportePpvListaEsperaQuery): Observable<Blob>{
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_PPV}/listaEspera`, { params, responseType: 'blob' })
      .pipe(
        tap(() => this.log('Reporte PPV Lista de Espera (archivo) generado', query, '📄')),
        catchError((err) => this.handleError(err, 'No se pudo generar el reporte de PPV lista de espera'))
      );
  }

  generarReportePpvPabellon(query: ReportePpvPabellonQuery): Observable<Blob>{
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_PPV}/pabellon`, { params, responseType: 'blob' })
      .pipe(
        tap(() => this.log('Reporte PPV Pabellón (archivo) generado', query, '📄')),
        catchError((err) => this.handleError(err, 'No se pudo generar el reporte de PPV pabellón'))
      );
  }

  generarReportePpvIrGrd(query: ReportePpvIrGrdQuery): Observable<Blob>{
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_PPV}/irGrd`, { params, responseType: 'blob' })
      .pipe(
        tap(() => this.log('Reporte PPV IR/GRD (archivo) generado', query, '📄')),
        catchError((err) => this.handleError(err, 'No se pudo generar el reporte de PPV IR/GRD'))
      );
  }

  generarReportePpvPacHospitalizado(query: ReportePpvPacHospQuery): Observable<Blob>{
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_PPV}/pacientesHospitalizados`, { params, responseType: 'blob' })
      .pipe(
        tap(() => this.log('Reporte PPV Pacientes Hospitalizados (archivo) generado', query, '📄')),
        catchError((err) => this.handleError(err, 'No se pudo generar el reporte de PPV pacientes hospitalizados'))
      );
  }

  generarReportePpvProcedimientos(query: ReportePpvProcedimientosQuery): Observable<Blob>{
    const params = this.construirHttpParams(query);
    return this.http.get(`${this.API_PPV}/procedimientos`, { params, responseType: 'blob' })
      .pipe(
        tap(() => this.log('Reporte PPV Procedimientos (archivo) generado', query, '📄')),
        catchError((err) => this.handleError(err, 'No se pudo generar el reporte de PPV procedimientos'))
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
