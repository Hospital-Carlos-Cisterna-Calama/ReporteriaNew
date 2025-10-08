import { QueryTypes } from 'sequelize';
import { sequelizePPV } from '../config/initDatabase';

export async function HospitalizacionesPorServicio(servicios: number[], fechaInicio: string, fechaFin: string) {
  const query = `
    SELECT 
      rph.RPH_cama AS RPH_cama,
      rph.RPH_tipo_cama AS RPH_tipo_cama,
      pac.PAC_PAC_Rut AS PAC_PAC_Rut,
      pac.PAC_PAC_Nombre + ' ' + pac.PAC_PAC_ApellPater + ' ' + pac.PAC_PAC_ApellMater AS nombre_paciente,
      rph.RPH_diag AS RPH_diag,
      rph.RPH_pcr AS RPH_pcr,
      rph.RPH_angiotac AS RPH_angiotac,
      rph.RPH_sato2 AS RPH_sato2,
      rph.RPH_med_vent AS RPH_med_vent,
      rph.RPH_disp_vent AS RPH_disp_vent,
      rph.RPH_prono AS RPH_prono,
      rph.RPH_dias_est AS RPH_dias_est,
      rph.RPH_dias_vmi AS RPH_dias_vmi,
      rph.RPH_estado_pac AS RPH_estado_pac,
      rph.RPH_rd AS RPH_rd,
      rph.RPH_TRIAGE AS RPH_TRIAGE,
      CONVERT(VARCHAR, rph.RPH_fecha_reg, 113) AS RPH_fecha_reg,
      ppvserv.servicio AS servicio
    FROM BD_PPV.dbo.RPH AS rph
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.PAC_Paciente AS pac
      ON rph.RPH_PAC_Numero = pac.PAC_PAC_Numero
    LEFT JOIN BD_PPV.dbo.PPV_Servicios AS ppvserv
      ON rph.RPH_servicio = ppvserv.ID
    WHERE rph.RPH_servicio IN (:servicios)
      AND rph.RPH_fecha_reg BETWEEN :fechaInicio AND :fechaFin
    ORDER BY rph.RPH_cama ASC, rph.RPH_fecha_reg ASC
  `;

  const resultados = await sequelizePPV.query(query, {
    replacements: {
      servicios,
      fechaInicio: `${fechaInicio} 00:00:00.000`,
      fechaFin: `${fechaFin} 23:59:59.999`,
    },
    type: QueryTypes.SELECT,
  });

  return resultados;
}

export async function IngresosEgresos() {}

export async function IntervencionPabellon() {}

export async function IrGrd() {}

export async function ListaEsperaGastroenterologia() {}

export async function PacienteHospitalizado() {}

export async function ProcedimientosRealizados() {}
