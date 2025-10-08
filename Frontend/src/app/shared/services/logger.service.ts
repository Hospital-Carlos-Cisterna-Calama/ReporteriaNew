import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly enabled = !environment.production;

  info(message: string, data?: any): void {
    if (this.enabled && data !== undefined) {
      console.log(`ℹ️ ${message}`, data);
    } else if (this.enabled) {
      console.log(`ℹ️ ${message}`);
    }
  }

  success(message: string, data?: any): void {
    if (this.enabled && data !== undefined) {
      console.log(`✅ ${message}`, data);
    } else if (this.enabled) {
      console.log(`✅ ${message}`);
    }
  }

  warn(message: string, data?: any): void {
    if (this.enabled && data !== undefined) {
      console.warn(`⚠️ ${message}`, data);
    } else if (this.enabled) {
      console.warn(`⚠️ ${message}`);
    }
  }

  error(message: string, error?: any): void {
    if (this.enabled && error !== undefined) {
      console.error(`❌ ${message}`, error);
    } else if (this.enabled) {
      console.error(`❌ ${message}`);
    }
    // En producción: aquí podrías enviar a un servicio de monitoreo (Sentry, LogRocket, etc.)
  }

  debug(message: string, data?: any): void {
    if (this.enabled && data !== undefined) {
      console.debug(`🔍 ${message}`, data);
    } else if (this.enabled) {
      console.debug(`🔍 ${message}`);
    }
  }
}
