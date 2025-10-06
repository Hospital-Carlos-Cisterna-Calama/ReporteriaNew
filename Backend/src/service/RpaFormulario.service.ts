import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/databaseEnti';
import { log } from 'console';

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

export class RpaFormularioService {
  private toSqlDate121(dateLike: string, endOfDay = false): string {
    // Espera 'YYYY-MM-DD' o 'YYYY-MM-DD HH:mm:ss[.fff]'
    // Si viene solo la fecha, agrega hora inicio / fin.
    const hasTime = /\d{2}:\d{2}/.test(dateLike);
    if (hasTime) return dateLike.replace('T', ' '); // por si viniera con 'T'
    // armamos HH:mm:ss.mmm fijos
    return endOfDay ? `${dateLike} 23:59:59.997` : `${dateLike} 00:00:00.000`;
  }

  async getInformeUrgencia(fechaInicio: string, fechaFin: string, tipoFormu: String, box: 'M' | 'U' | string): Promise<InformeUrgenciaRow[]> {
    const fechaInicio121 = this.toSqlDate121(fechaInicio, false);
    const fechaFin121 = this.toSqlDate121(fechaFin, true);

    log(fechaInicio121, fechaFin121, tipoFormu, box);
    const sql = `EXEC REPORTERIA_GetInformeUrgencia @FechaInicio= :fechaInicio, @FechaFin= :fechaFin,@tipoFormu= :tipoFormu,@box= :box`;
    const rows = await sequelize.query<InformeUrgenciaRow>(sql, {
      type: QueryTypes.SELECT,
      replacements: { fechaInicio: fechaInicio121, fechaFin: fechaFin121, tipoFormu: tipoFormu, box },
    });
    return rows;
  }
}
