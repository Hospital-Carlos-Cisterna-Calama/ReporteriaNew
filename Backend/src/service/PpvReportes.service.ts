export class PpvReportesService {
  async reporteIntervencionPabellon(fechaInicio: string, fechaFin: string) {
    return `Reporte de intervención en pabellón desde ${fechaInicio} hasta ${fechaFin}`;
  }

  async reporteProcedimientos(fechaInicio: string, fechaFin: string) {
    return `Reporte de procedimientos desde ${fechaInicio} hasta ${fechaFin}`;
  }

  async reporteIrGrd(fechaInicio: string, fechaFin: string) {
    return `Reporte de IR GRD desde ${fechaInicio} hasta ${fechaFin}`;
  }

  async reporteListaEsperaGastroenterologia(fechaInicio: string, fechaFin: string) {
    return `Reporte de lista de espera en gastroenterología desde ${fechaInicio} hasta ${fechaFin}`;
  }

  async reportePacienteHospitalizado(fechaInicio: string, fechaFin: string) {
    return `Reporte de pacientes hospitalizados desde ${fechaInicio} hasta ${fechaFin}`;
  }

  async reporteHospitalizacionesPorServicio(fechaInicio: string, fechaFin: string) {
    return `Reporte de hospitalizaciones por servicio desde ${fechaInicio} hasta ${fechaFin}`;
  }

  async reporteIngresosEgresos(fechaInicio: string, fechaFin: string) {
    return `Reporte de ingresos y egresos desde ${fechaInicio} hasta ${fechaFin}`;
  }
}
