import {
  InformeUrgenciaFila,
  UrgenciaCategorizacion,
  UrgenciaDoceHoraFila,
  UrgenciaHospPabllFila,
  UrgenciaIrasFila,
  contrareferenciaFilas,
} from '../interfaces';

export function anchoCabecera(informe: string) {
  switch (informe) {
    case 'Urgencia':
      return [13, 10, 15, 13, 13, 13, 13, 13, 30, 13, 30, 13, 30, 5, 5, 15, 13, 60, 60, 17, 26, 15, 15, 10, 17];
    case 'DoceHoras':
      return [10, 30, 15, 20, 10, 8, 20, 60, 60, 60, 20, 25]; //FALTA
    case 'IRAS':
      return [10, 30, 15, 20, 10, 8, 20, 60, 60, 60, 20, 25]; //FALTA
    case 'Pabellón':
      return [10, 30, 15, 20, 10, 8, 20, 60, 60, 60, 20, 25]; //FALTA
    case 'Hospitalizado':
      return [10, 30, 15, 20, 10, 8, 20, 60, 60, 60, 20, 25]; //FALTA
    case 'Categorizaciones':
      return [10, 30, 15, 20, 10, 8, 20, 60, 60, 60, 20, 25]; //FALTA
  }
}

export function procesarUrgencia(dau: InformeUrgenciaFila[]) {
  return dau.map((h: InformeUrgenciaFila) => ({
    Formulario: h.formulario ?? '',
    Tipo_Folio: h.tipo_folio ?? '',
    Sector: h.Sector ?? '',
    Fecha_Admisión: h.admision ?? '',
    Fecha_Cat: h.FechaCat ?? '',
    Fecha_Ingreso: h.FechaIngreso ?? '',
    Fecha_Egreso: h.FechaEgreso ?? '',
    Rut_Médico_Ingreso: h.RutMedicoIngreso ?? '',
    Médico_Ingreso: h.MedicoIngreso ?? '',
    Médico_Alta_RUT: h.RPA_FDA_MedicoAlta ?? '',
    Médico_Alta_Nombre: h.NomMedico ?? '',
    RUT_Paciente: h.PAC_PAC_Rut ?? '',
    Nombre_Paciente: h.paciente ?? '',
    Sexo: h.PAC_PAC_Sexo ?? '',
    Edad: h.edad ?? '',
    Categorización: h.categorizacion ?? '',
    Especialidad: h.esp ?? '',
    Diagnóstico: h.diag ?? '',
    Tratamiento: h.trat ?? '',
    Medio_Traslado: h.MedioT ?? '',
    Dirección_Paciente: h.Direccion ?? '',
    Previsión_Paciente: h.prevision ?? '',
    Beneficio_Paciente: h.Beneficio ?? '',
    Vigente: h.Vigente ?? '',
    Destino: h.Destino ?? '',
  }));
}

export function procesarDoceHoras(dau: any[]) {
  return dau.map((h: any) => ({
    Rut: h.rut ?? '',
    Nombre: h.nombre ?? '',
    Edad: h.edad ?? '',
    Sexo: h.sexo ?? '',
    Prevision: h.prevision ?? '',
    DAU: h.dau ?? '',
    Fecha_Ingreso_Siclope: h.fecha_ingreso_siclope ?? '',
    Servicio_Ingreso: h.servicio_ingreso ?? '',
    Fecha_Ingreso_Helios: h.fecha_ingreso_helios ?? '',
    Servicio_Traslado: h.servicio_traslado ?? '',
    Fecha_Traslado_Helios: h.fecha_traslado_helios ?? '',
    Diferencia_Texto: h.diferencia_ingreso_indicacion_siclope ?? '',
    Profesional: h.nombre_profesional ?? '',
    Rut_Profesional: h.rut_profesional ?? '',
  }));
}

export function procesarCategorizadores(dau: UrgenciaCategorizacion[]) {
  return dau.map((h: UrgenciaCategorizacion) => ({
    DAU: h.numpa ?? '',
    Piso: h.piso ?? '',
    Usuario: h.usuario ?? '',
    Categorizacion: h.cat ?? '',
    Nombre: h.nom ?? '',
    Sexo: h.sexo ?? '',
    Rut: h.rut ?? '',
    Fecha: h.fecha ?? '',
  }));
}

export function procesarHospitalizado(dau: UrgenciaHospPabllFila[]) {
  return dau.map((h: UrgenciaHospPabllFila) => ({
    Ingreso_Urgencias: h.fecha ?? '',
    Egreso_Urgencias: h.egreso_Urgencias ?? '',
    Ingreso_Hospitalizado: h.Ingreso_Hospitalizado ?? '',
    Diagnóstico: h.diag ?? '',
    RUT: h.rut ?? '',
    Nombre_Paciente: h.paciente ?? '',
    Sexo: h.PAC_PAC_Sexo ?? '',
    Edad: h.edad ?? '',
    Previsión: h.prevision ?? '',
    Beneficio: h.Beneficio ?? '',
    Piso: h.TAB_DescripcionPiso ?? '',
  }));
}

export function procesarPabellon(dau: UrgenciaHospPabllFila[]) {
  return dau.map((h: UrgenciaHospPabllFila) => ({
    RUT: h.rut ?? '',
    Nombre_Paciente: h.paciente ?? '',
    Sexo: h.PAC_PAC_Sexo ?? '',
    Edad: h.edad ?? '',
    Previsión: h.prevision ?? '',
    Beneficio: h.Beneficio ?? '',
    Ingreso_Urgencias: h.Ingreso_Urg ?? '',
    Egreso_Urgencias: h.Egreso_Urg ?? '',
    Ingreso_Pabellón: h.Ingreso_Pabe ?? '',
    Destino: h.destino ?? '',
    Diagnóstico: h.diag ?? '',
  }));
}

export function procesarIras(dau: UrgenciaIrasFila[]) {
  return dau.map((h: UrgenciaIrasFila) => ({
    Fecha_Admisión: h.Fecha_Admision ?? '',
    RUT_Paciente: h.Rut_Paciente ?? '',
    Nombre_Paciente: h.Nombre_Paciente ?? '',
    Sexo: h.Sexo ?? '',
    Edad: h.Edad ?? '',
    Diagnóstico: h.Diagnostico ?? '',
  }));
}

export function procesarContrareferencia(contrareferencia: contrareferenciaFilas[]) {
  return contrareferencia.map((h: any) => ({
    Especialidad: h.Especialidad ?? h.especialidad ?? h.ESPECIALIDAD ?? h.SER_SER_Descripcio ?? 'SIN ESPECIALIDAD',
    Nombre: h.Nombre ?? h.nombre ?? h.NOMBRE ?? '',
    Rut: h.Rut ?? h.rut ?? h.RUT ?? h.PAC_PAC_Rut ?? 'SIN RUT',
    Procedencia: h.Procedencia ?? h.procedencia ?? h.PROCEDENCIA ?? '',
    Medico: h.Médico ?? h.Medico ?? h.medico ?? h.MEDICO ?? '',
    Fecha_Citacion: h.Fecha_Citacion ?? h.fecha_citacion ?? h.FechaCitacion ?? h.FECHA_CITACION ?? '',
    Fecha_Alta: h.Fecha_Alta ?? h.fecha_alta ?? h.FechaAlta ?? h.FECHA_ALTA ?? '',
    Diagnostico: h.Diagnostico ?? h.diagnostico ?? h.DIAGNOSTICO ?? '',
    Tipo_de_Contrareferencia:
      h.Tipo_de_Contrareferencia ?? h.ContraReferencia ?? h.tipo_de_contrareferencia ?? h.TipoContrareferencia ?? h.TIPO_DE_CONTRAREFERENCIA ?? 'SIN TIPO',
  }));
}

export function procesarResumenPorServicio(resumen: any[]) {
  return resumen.map((h: any) => ({
    Especialidad: h.Especialidad ?? '',
    ConsultaNueva: h.ConsultaNueva ?? '',
    ConsultaAlta: h.ConsultaAlta ?? '',
  }));
}

export function procesarDiagnosticosRealizados(diagnosticos: any[]) {
  return diagnosticos.map((h: any) => ({
    Medico_Rut: h.Medico_Rut ?? '',
    Medico_Nombre: h.Medico_Nombre ?? '',
    Policlínico: h.Policlinico ?? '',
    Fecha_Citacion: h.Fecha_Citacion ?? '',
    Paciente_Rut: h.Paciente_Rut ?? '',
    Paciente_Nombre: h.Paciente_Nombre ?? '',
    Edad: h.Edad ?? '',
    Sexo: h.Sexo ?? '',
    Nacionalidad: h.Nacionalidad ?? '',
    Comuna: h.Comuna ?? '',
    Direccion: h.Direccion ?? '',
    Diagnostico: h.Diagnostico ?? '',
    Atencion_Presencial: h.Atencion_Presencial ?? '',
  }));
}
