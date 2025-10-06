import { FindOptions, Op } from 'sequelize';
// src/services/rpa-formulario.service.ts
import { QueryTypes } from 'sequelize';
import { sequelize } from '../db/sequelize'; // ajusta la ruta a tu instancia

export interface InformeUrgenciaRow {
  formulario: string;
  tipo_folio: 'Maternal' | 'Urgencias';
  Sector: string;
  admision: Date;
  FechaCat: Date | null;
  FechaIngreso: Date | null;
  FechaEgreso: Date | null;
  RutMedicoIngreso: string | null;
  MedicoIngreso: string | null;
  RPA_FDA_MedicoAlta: string | null;
  NomMedico: string | null;
  PAC_PAC_Rut: string;
  paciente: string;
  PAC_PAC_Sexo: string;
  edad: number | null;
  PAC_PAC_FechaNacim: Date | null;
  categorizacion: string | null;
  esp: string | null;
  diag: string | null;
  trat: string | null;
  MedioT: string | null;
  Direccion: string | null;
  prevision: 'Fonasa' | 'Particular' | 'Convenio' | 'No Informado';
  Beneficio: string;
  Vigente: string;
  Destino: string | null;
}

function atStartOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function atEndOfDay(d: Date) {
  const x = new Date(d);
  // Para compatibilidad con SQL Server DATETIME, usar ~.997ms
  x.setHours(23, 59, 59, 997);
  return x;
}

export class RpaFormularioService {
  /**
   * Llama al SP REPORTERIA_GetInformeUrgencia en SQL Server.
   * Ejemplo SQL: EXEC [BD_ENTI_CORPORATIVA].dbo.REPORTERIA_GetInformeUrgencia @FechaInicio, @FechaFin, @tipoFormu, @box
   */
  async getInformeUrgencia(
    fechaInicio: Date,
    fechaFin: Date,
    tipoFormu: string, // p.ej. '04'
    box: 'M' | 'U' | string // 'M' maternal, 'U' urgencias, u otro para ambos
  ): Promise<InformeUrgenciaRow[]> {
    // Normaliza el rango diario completo
    const fIni = atStartOfDay(fechaInicio);
    const fFin = atEndOfDay(fechaFin);

    // IMPORTANTE: si tu conexión NO apunta por defecto a BD_ENTI_CORPORATIVA,
    // prefija siempre con [BD_ENTI_CORPORATIVA].dbo
    const sql = `
      EXEC [BD_ENTI_CORPORATIVA].dbo.REPORTERIA_GetInformeUrgencia
        @FechaInicio = :fechaInicio,
        @FechaFin    = :fechaFin,
        @tipoFormu   = :tipoFormu,
        @box         = :box
    `;

    const rows = await sequelize.query<InformeUrgenciaRow>(sql, {
      type: QueryTypes.SELECT,
      // Sequelize (mssql) envía Date como parámetro -> SQL DATETIME/DATETIME2
      replacements: {
        fechaInicio: fIni,
        fechaFin: fFin,
        tipoFormu,
        box,
      },
      // logging: console.log,
    });

    return rows;
  }
}
