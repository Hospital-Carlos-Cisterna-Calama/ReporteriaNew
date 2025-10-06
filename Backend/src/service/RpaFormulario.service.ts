import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/databaseEnti'

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
  x.setHours(23, 59, 59, 997);
  return x;
}

export class RpaFormularioService {
  async getInformeUrgencia(fechaInicio: Date,fechaFin: Date,tipoFormu: string,box: 'M' | 'U' | string ): Promise<InformeUrgenciaRow[]> {

    const fIni = atStartOfDay(fechaInicio);
    const fFin = atEndOfDay(fechaFin);
    const sql = `EXEC [BD_ENTI_CORPORATIVA].dbo.REPORTERIA_GetInformeUrgencia @FechaInicio= :fechaInicio, @FechaFin= :fechaFin,@tipoFormu= :tipoFormu,@box= :box`;
    const rows = await sequelize.query<InformeUrgenciaRow>(sql, {type: QueryTypes.SELECT,replacements:{fechaInicio: fIni ,fechaFin: fFin ,tipoFormu , box}});
    return rows;

  }
}
