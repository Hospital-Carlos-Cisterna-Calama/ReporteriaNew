import {
  EspecialidadAmbulatoria,
  EspecialidadAmbulatoriaResponse
} from '../interfaces';

export class EspecialidadesAmbuMapper {

  static mapRestEspecialidadesAmbulatorias(response: EspecialidadAmbulatoriaResponse): EspecialidadAmbulatoria[] {
    if (!response.success || !response.data) {
      return [];
    }

    return response.data.map(especialidad => ({
      nombre: especialidad.SER_ESP_Descripcio,
      codigo: especialidad.SER_ESP_Codigo
    }));
  }

}
