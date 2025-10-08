import { Component, output, signal } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface RangoFechas {
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

/**
 * Componente de selector de rango de fechas usando Angular Material
 */
@Component({
  selector: 'app-selector-rango-fechas',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Fecha Inicio -->
      <div class="group">
        <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Fecha Inicio
        </label>
        <mat-form-field
          class="w-full custom-datepicker"
          appearance="outline"
          [formGroup]="rangoFechas"
        >
          <input
            matInput
            [matDatepicker]="pickerInicio"
            formControlName="fechaInicio"
            placeholder="Selecciona fecha de inicio"
            (dateChange)="alCambiarFecha()"
            class="cursor-pointer"
            readonly
          >
          <mat-datepicker-toggle matIconSuffix [for]="pickerInicio">
            <mat-icon matDatepickerToggleIcon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </mat-icon>
          </mat-datepicker-toggle>
          <mat-datepicker #pickerInicio xPosition="end"></mat-datepicker>
        </mat-form-field>
      </div>

      <!-- Fecha Fin -->
      <div class="group">
        <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Fecha Fin
        </label>
        <mat-form-field
          class="w-full custom-datepicker"
          appearance="outline"
          [formGroup]="rangoFechas"
        >
          <input
            matInput
            [matDatepicker]="pickerFin"
            formControlName="fechaFin"
            placeholder="Selecciona fecha de fin"
            [min]="rangoFechas.value.fechaInicio"
            (dateChange)="alCambiarFecha()"
            class="cursor-pointer"
            readonly
          >
          <mat-datepicker-toggle matIconSuffix [for]="pickerFin">
            <mat-icon matDatepickerToggleIcon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </mat-icon>
          </mat-datepicker-toggle>
          <mat-datepicker #pickerFin xPosition="end"></mat-datepicker>
        </mat-form-field>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .custom-datepicker {
      /* Contenedor principal del input */
      .mdc-text-field {
        background-color: white !important;
        border-radius: 12px !important;
        height: 56px !important;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
      }

      .mdc-text-field:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        transform: translateY(-1px);
      }

      /* Bordes del outline */
      .mdc-notched-outline__leading,
      .mdc-notched-outline__notch,
      .mdc-notched-outline__trailing {
        border-color: #d1d5db !important;
        border-width: 2px !important;
      }

      .mdc-notched-outline__leading {
        border-radius: 12px 0 0 12px !important;
        width: 48px !important;
      }

      .mdc-notched-outline__trailing {
        border-radius: 0 12px 12px 0 !important;
      }

      /* Hover state */
      .mdc-text-field:hover .mdc-notched-outline__leading,
      .mdc-text-field:hover .mdc-notched-outline__notch,
      .mdc-text-field:hover .mdc-notched-outline__trailing {
        border-color: #2dd4bf !important;
      }

      /* Focus state */
      .mdc-text-field--focused .mdc-notched-outline__leading,
      .mdc-text-field--focused .mdc-notched-outline__notch,
      .mdc-text-field--focused .mdc-notched-outline__trailing {
        border-color: #0d9488 !important;
        border-width: 2px !important;
      }

      /* Input text */
      .mat-mdc-input-element {
        font-weight: 500 !important;
        color: #111827 !important;
        font-size: 1rem !important;
        padding-left: 48px !important;
        padding-right: 48px !important;
        cursor: pointer !important;
        caret-color: transparent !important;
      }

      /* Placeholder */
      .mat-mdc-input-element::placeholder {
        color: #9ca3af !important;
        opacity: 1 !important;
      }

      /* Ocultar label flotante */
      .mdc-floating-label {
        display: none !important;
      }

      /* Icono del calendario a la izquierda */
      .mat-datepicker-toggle {
        position: absolute !important;
        left: 8px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        z-index: 2 !important;
      }

      .mat-datepicker-toggle button {
        color: #0d9488 !important;
        width: 32px !important;
        height: 32px !important;
      }

      .mat-datepicker-toggle svg {
        width: 20px !important;
        height: 20px !important;
      }

      /* Ajustar padding del contenedor */
      .mat-mdc-form-field-infix {
        padding-top: 16px !important;
        padding-bottom: 16px !important;
        min-height: auto !important;
      }

      .mat-mdc-text-field-wrapper {
        padding: 0 !important;
      }

      /* Remover hint wrapper */
      .mat-mdc-form-field-subscript-wrapper {
        display: none !important;
      }
    }
  `]
})
export class SelectorRangoFechasComponent {
  readonly cambioFecha = output<RangoFechas>();

  rangoFechas = new FormGroup({
    fechaInicio: new FormControl<Date | null>(null),
    fechaFin: new FormControl<Date | null>(null)
  });

  alCambiarFecha() {
    const rango = this.rangoFechas.value;
    this.cambioFecha.emit({
      fechaInicio: rango.fechaInicio ?? null,
      fechaFin: rango.fechaFin ?? null
    });
  }

  limpiar() {
    this.rangoFechas.reset();
    this.alCambiarFecha();
  }
}
