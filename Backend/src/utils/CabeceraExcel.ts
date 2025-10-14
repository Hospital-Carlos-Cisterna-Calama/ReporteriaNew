import { InformeUrgenciaFila, UrgenciaCategorizacion, UrgenciaDoceHoraFila, UrgenciaHospPabllFila, UrgenciaIrasFila } from '../interfaces';

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
export function procesarDoceHoras(dau: UrgenciaDoceHoraFila[]) {
  return dau.map((h: UrgenciaDoceHoraFila) => ({
    Rut: h.Rut ?? '',
    Nombre: h.Nombre ?? '',
    Edad: h.Edad ?? '',
    Sexo: h.Sexo ?? '',
    Prevision: h.Prevision ?? '',
    DAU: h.DAU ?? '',
    Fecha_Ingreso_Siclope: h.FechaIngresoSiclope ?? '',
    Servicio_Ingreso: h.ServicioIngreso ?? '',
    Fecha_Ingreso_Helios: h.FechaIngresoHelios ?? '',
    Servicio_Traslado: h.ServicioTraslado ?? '',
    Fecha_Traslado_Helios: h.FechaTrasladoHelios ?? '',
    Diferencia_Texto: h.DiferenciaTexto ?? '',
    Profesional: h.Profesional ?? '',
    Rut_Profesional: h.RutProfesional ?? '',
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
