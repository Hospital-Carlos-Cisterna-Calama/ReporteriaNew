import Paciente from './BdCorporativa/Paciente';
import Solicitud from './BdCorporativa/Solicitud';

export function asociaciones() {
  Solicitud.belongsTo(Paciente, { foreignKey: 'PAC_PAC_Numero', targetKey: 'PAC_PAC_Numero', as: 'paciente' });

  Paciente.hasMany(Solicitud, { foreignKey: 'PAC_PAC_Numero', sourceKey: 'PAC_PAC_Numero', as: 'solicitudes' });

}
