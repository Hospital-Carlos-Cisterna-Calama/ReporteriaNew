import { Component, output, ElementRef, viewChild, AfterViewInit, OnDestroy } from '@angular/core';
import flatpickr from 'flatpickr';
import type { Instance } from 'flatpickr/dist/types/instance';
import type { CustomLocale } from 'flatpickr/dist/types/locale';

// Configuración manual de localización para evitar warning de CommonJS
const Spanish: CustomLocale = {
  weekdays: {
    shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  },
  months: {
    shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  },
  firstDayOfWeek: 1,
  rangeSeparator: ' a ',
  weekAbbreviation: 'Sem',
  scrollTitle: 'Desplazar para aumentar',
  toggleTitle: 'Hacer clic para cambiar',
};

export interface RangoFechas {
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

@Component({
  selector: 'app-selector-rango-fechas',
  standalone: true,
  imports: [],
  templateUrl: './selector-rango-fechas.component.html',
  styles: [`
    :host ::ng-deep {
      .flatpickr-calendar {
        border-radius: 0.75rem !important;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important;
        border: 2px solid #14b8a6 !important;
      }

      .flatpickr-months {
        background: linear-gradient(to right, #0d9488, #14b8a6) !important;
        border-radius: 0.625rem 0.625rem 0 0 !important;
      }

      .flatpickr-month,
      .flatpickr-current-month,
      .flatpickr-current-month input.cur-year {
        color: white !important;
        font-weight: 600 !important;
      }

      .flatpickr-monthDropdown-months {
        background: white !important;
        color: #0d9488 !important;
        font-weight: 600 !important;
      }

      .flatpickr-prev-month svg,
      .flatpickr-next-month svg {
        fill: white !important;
      }

      .flatpickr-prev-month:hover svg,
      .flatpickr-next-month:hover svg {
        fill: #ccfbf1 !important;
      }

      .flatpickr-weekdays {
        background: #f0fdfa !important;
      }

      .flatpickr-weekday {
        color: #0d9488 !important;
        font-weight: 600 !important;
      }

      .flatpickr-day {
        color: #374151 !important;
        border-radius: 0.5rem !important;
        font-weight: 500 !important;
      }

      .flatpickr-day:hover {
        background: #ccfbf1 !important;
        border-color: #14b8a6 !important;
        color: #0d9488 !important;
      }

      .flatpickr-day.today {
        border-color: #14b8a6 !important;
        color: #0d9488 !important;
        font-weight: 700 !important;
      }

      .flatpickr-day.selected,
      .flatpickr-day.startRange,
      .flatpickr-day.endRange {
        background: #0d9488 !important;
        border-color: #0d9488 !important;
        color: white !important;
      }

      .flatpickr-day.inRange {
        background: #ccfbf1 !important;
        border-color: #99f6e4 !important;
        color: #0d9488 !important;
        box-shadow: none !important;
      }
    }
  `]
})
export class SelectorRangoFechasComponent implements AfterViewInit, OnDestroy {
  readonly cambioFecha = output<RangoFechas>();

  readonly inputInicio = viewChild<ElementRef<HTMLInputElement>>('inputInicio');
  readonly inputFin = viewChild<ElementRef<HTMLInputElement>>('inputFin');

  private flatpickrInstanceInicio?: Instance;
  private flatpickrInstanceFin?: Instance;

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  ngAfterViewInit() {
    this.inicializarFlatpickr();
  }

  ngOnDestroy() {
    this.flatpickrInstanceInicio?.destroy();
    this.flatpickrInstanceFin?.destroy();
  }

  private inicializarFlatpickr() {
    const inputInicioEl = this.inputInicio()?.nativeElement;
    const inputFinEl = this.inputFin()?.nativeElement;

    if (!inputInicioEl || !inputFinEl) return;

    // Configurar Flatpickr para Fecha Inicio
    this.flatpickrInstanceInicio = flatpickr(inputInicioEl, {
      locale: Spanish,
      dateFormat: 'd/m/Y',
      allowInput: false,
      onChange: (selectedDates) => {
        this.fechaInicio = selectedDates[0] || null;

        // Actualizar el min del input fin
        if (this.flatpickrInstanceFin && this.fechaInicio) {
          this.flatpickrInstanceFin.set('minDate', this.fechaInicio);
        }

        this.emitirCambio();
      }
    });

    // Configurar Flatpickr para Fecha Fin
    this.flatpickrInstanceFin = flatpickr(inputFinEl, {
      locale: Spanish,
      dateFormat: 'd/m/Y',
      allowInput: false,
      minDate: this.fechaInicio || undefined,
      onChange: (selectedDates) => {
        this.fechaFin = selectedDates[0] || null;
        this.emitirCambio();
      }
    });
  }

  private emitirCambio() {
    this.cambioFecha.emit({
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    });
  }

  limpiar() {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.flatpickrInstanceInicio?.clear();
    this.flatpickrInstanceFin?.clear();
    this.emitirCambio();
  }
}
