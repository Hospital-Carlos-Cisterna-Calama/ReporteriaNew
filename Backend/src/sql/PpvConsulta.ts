import { QueryTypes } from 'sequelize';
import { sequelizePPV, sequelize } from '../config/initDatabase';

export async function HospitalizacionesPorServicio(servicios: number[], fechaInicio?: string, fechaFin?: string) {
  console.log('💬 Parámetros recibidos:', { servicios, fechaInicio, fechaFin });

  if (!fechaInicio || !fechaFin) {
    throw new Error('❌ Las fechas fechaInicio y fechaFin son requeridas');
  }

  const fechaIniSQL = fechaInicio.includes('T') ? fechaInicio.split('T')[0] : fechaInicio;
  const fechaFinSQL = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;

  const placeholders = servicios.map((_, i) => `:s${i}`).join(', ');

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
    WHERE rph.RPH_servicio IN (${placeholders})
      AND rph.RPH_fecha_reg BETWEEN :fechaInicio AND :fechaFin
    ORDER BY rph.RPH_cama ASC, rph.RPH_fecha_reg ASC;
  `;

  const replacements: Record<string, any> = {
    fechaInicio: fechaIniSQL,
    fechaFin: fechaFinSQL,
  };
  servicios.forEach((s, i) => (replacements[`s${i}`] = s));

  console.log('🧩 replacements:', replacements);

  return await sequelizePPV.query(query, {
    replacements,
    type: 'SELECT',
  });
}

export async function IngresosEgresos(unidadId: number, fechaInicio: string, fechaFin: string, filtro: 'ingreso' | 'egreso') {
  let query = `
    SELECT 
      RTRIM(LTRIM(p.PAC_PAC_Prevision)) AS previ,
      p.PAC_PAC_Nombre + ' ' + p.PAC_PAC_ApellPater + ' ' + p.PAC_PAC_ApellMater AS nombre_paciente,
      p.PAC_PAC_Sexo,
      CAST(DATEDIFF(DAY, p.PAC_PAC_FechaNacim, GETDATE()) / 365.25 AS INT) AS edad,
      p.PAC_PAC_Rut,
      p.PAC_PAC_TelefonoMovil + ' - ' + p.PAC_PAC_Fono AS fono,
      p.PAC_PAC_DireccionGralHabit + ' ' + p.PAC_PAC_NumerHabit AS direccion,
      cc.date_ingreso,
      cc.diagnostico_ingreso,
      cc.apache,
      cc.date_egreso,
      cc.destino_egreso,
      sp.SER_PRO_Nombres + ' ' + sp.SER_PRO_ApellPater + ' ' + sp.SER_PRO_ApellMater AS nombre_medico,
      sa.SER_SER_DescripcioIfl,
      cc.coronario,
      cc.aisl,
      cc.criterios_i,
      cc.criterios_e,
      cc.lpp,
      cc.caidas,
      cc.error_medico,
      cc.diagnostico_egreso
    FROM BD_PPV.dbo.Camas_Criticas AS cc
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.PAC_Paciente AS p
      ON p.PAC_PAC_Numero = cc.pac_numero
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.SER_Profesiona AS sp
      ON sp.SER_PRO_Rut = cc.medico_responsable
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.SER_ServiciosAuge AS sa
      ON sa.SER_SER_CodigoIfl = cc.especialidad_medico
    WHERE cc.unidad_id = :unidadId
      AND cc.estado = 0
  `;

  query +=
    filtro === 'ingreso'
      ? `AND cc.date_ingreso BETWEEN :fechaInicio AND :fechaFin ORDER BY cc.date_ingreso ASC;`
      : `AND cc.date_egreso BETWEEN :fechaInicio AND :fechaFin ORDER BY cc.date_egreso ASC;`;

  return await sequelizePPV.query(query, {
    replacements: {
      unidadId,
      fechaInicio: `${fechaInicio} 00:00:00`,
      fechaFin: `${fechaFin} 23:59:59`,
    },
    type: QueryTypes.SELECT,
  });
}

export async function IntervencionPabellon(fechaInicio: string, fechaFin: string) {
  const query = `
    SELECT 
      s.PAB_SOL_Numero AS Solicitud,
      p.PAC_PAC_Nombre + ' ' + p.PAC_PAC_ApellPater + ' ' + p.PAC_PAC_ApellMater AS NombrePaciente,
      p.PAC_PAC_Rut,
      c.PAC_CAR_NumerFicha AS Ficha,
      CAST(DATEDIFF(DAY, p.PAC_PAC_FechaNacim, GETDATE()) / 365.25 AS INT) AS Edad,
      LTRIM(RTRIM(p.PAC_PAC_Prevision)) AS previ,
      p.PAC_PAC_TipoBenef AS Tipo_Prev,
      s.PAB_SOL_FechaSolicit,
      LTRIM(RTRIM(s.SER_OBJ_Codigo)) AS OBJ_Codigo,
      s.PAB_SOL_HoraSolicit AS Hora_Ingreso,
      s.PAB_SOL_HoraSalida AS Hora_Salida,

      -- 🔹 Diferencias de tiempo (minutos y horas)
      CASE 
        WHEN s.PAB_SOL_HoraSalida IS NOT NULL THEN 
          DATEDIFF(MINUTE, s.PAB_SOL_HoraSolicit, s.PAB_SOL_HoraSalida)
        ELSE NULL
      END AS MINUTOS,
      CASE 
        WHEN s.PAB_SOL_HoraSalida IS NOT NULL THEN 
          CAST(DATEDIFF(MINUTE, s.PAB_SOL_HoraSolicit, s.PAB_SOL_HoraSalida) / 60.0 AS DECIMAL(10,2))
        ELSE NULL
      END AS HORA,

      (SELECT LTRIM(RTRIM(PRE_ARA_CodigPabel))
       FROM PRE_AranBase WHERE PRE_ARA_Codigo = s.INT_INT_Codigo) AS Codigo_Pabellon,
      LTRIM(RTRIM(s.INT_INT_Codigo)) AS Codigo_INT,
      pr.PRE_PRE_Descripcio AS Descripcion_Int,
      amb.TAB_Text AS Ambito,
      pri.TAB_Text AS Prioridad,
      CASE 
        WHEN pr.PRE_PRE_Tipo IN ('04','05','11','12','13','14','15','16','17','18','19','20','21','27')
          AND pr.PRE_PRE_SubTipo IN ('02','03','04','06','07','152')
        THEN 'CIRUGIA'
        ELSE 'PROCEDIMIENTO'
      END AS TipoProc,
      pa.PAB_EVE_DiagPostOper AS Diag_PostOperatorio,
      pa.PAB_EVE_OperRealizada AS Operacion_Realizada,
      e.SER_ESP_Descripcio AS Especialidad,
      ta.TAB_Text AS TipoAnestesia,

      -- 🔹 Tipo y Pabellón 
      s.SER_REC_Tipo AS Tipo,
      lug.SER_LUG_Descripcio AS Pabellon,

      -- 🔹 Médico Cirujano
      (SELECT TOP 1 sp.SER_PRO_Rut
       FROM BD_ENTI_CORPORATIVA.dbo.SER_Profesiona sp
       JOIN BD_ENTI_CORPORATIVA.dbo.PAB_EqMedico m ON m.SER_PRO_Rut = sp.SER_PRO_Rut
       WHERE m.PAB_SOL_Numero = s.PAB_SOL_Numero AND m.PAB_EQU_LaborProf = '0001') AS RutMedico,
      (SELECT TOP 1 sp.SER_PRO_Nombres + ' ' + sp.SER_PRO_ApellPater + ' ' + sp.SER_PRO_ApellMater
       FROM BD_ENTI_CORPORATIVA.dbo.SER_Profesiona sp
       JOIN BD_ENTI_CORPORATIVA.dbo.PAB_EqMedico m ON m.SER_PRO_Rut = sp.SER_PRO_Rut
       WHERE m.PAB_SOL_Numero = s.PAB_SOL_Numero AND m.PAB_EQU_LaborProf = '0001') AS NombreMedico,

      -- 🔹 Anestesista
      (SELECT TOP 1 sp.SER_PRO_Rut
       FROM BD_ENTI_CORPORATIVA.dbo.SER_Profesiona sp
       JOIN BD_ENTI_CORPORATIVA.dbo.PAB_EqMedico m ON m.SER_PRO_Rut = sp.SER_PRO_Rut
       WHERE m.PAB_SOL_Numero = s.PAB_SOL_Numero AND m.PAB_EQU_LaborProf = '0002') AS RutAnestesista,
      (SELECT TOP 1 sp.SER_PRO_Nombres + ' ' + sp.SER_PRO_ApellPater + ' ' + sp.SER_PRO_ApellMater
       FROM BD_ENTI_CORPORATIVA.dbo.SER_Profesiona sp
       JOIN BD_ENTI_CORPORATIVA.dbo.PAB_EqMedico m ON m.SER_PRO_Rut = sp.SER_PRO_Rut
       WHERE m.PAB_SOL_Numero = s.PAB_SOL_Numero AND m.PAB_EQU_LaborProf = '0002') AS NombreAnestesista,

      -- 🔹 Primer Ayudante
      (SELECT TOP 1 sp.SER_PRO_Rut
       FROM BD_ENTI_CORPORATIVA.dbo.SER_Profesiona sp
       JOIN BD_ENTI_CORPORATIVA.dbo.PAB_EqMedico m ON m.SER_PRO_Rut = sp.SER_PRO_Rut
       WHERE m.PAB_SOL_Numero = s.PAB_SOL_Numero AND m.PAB_EQU_LaborProf = '0003') AS RUT_PRIMER_AYUDANTE,
      (SELECT TOP 1 sp.SER_PRO_Nombres + ' ' + sp.SER_PRO_ApellPater + ' ' + sp.SER_PRO_ApellMater
       FROM BD_ENTI_CORPORATIVA.dbo.SER_Profesiona sp
       JOIN BD_ENTI_CORPORATIVA.dbo.PAB_EqMedico m ON m.SER_PRO_Rut = sp.SER_PRO_Rut
       WHERE m.PAB_SOL_Numero = s.PAB_SOL_Numero AND m.PAB_EQU_LaborProf = '0003') AS PRIMER_AYUDANTE

    FROM BD_ENTI_CORPORATIVA.dbo.PAB_Solicitud AS s
    JOIN BD_ENTI_CORPORATIVA.dbo.PAC_Paciente AS p
      ON p.PAC_PAC_Numero = s.PAC_PAC_Numero
    JOIN BD_ENTI_CORPORATIVA.dbo.PRE_Prestacion AS pr
      ON s.INT_INT_Codigo = pr.PRE_PRE_Codigo
    JOIN BD_ENTI_CORPORATIVA.dbo.SER_Especiali AS e
      ON s.PAB_SOL_Servicio = e.SER_ESP_Codigo
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.PAC_Carpeta AS c
      ON c.PAC_PAC_Numero = p.PAC_PAC_Numero
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.PAB_EvenIntr AS pa
      ON s.PAB_SOL_Numero = pa.PAB_SOL_Numero
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.TAB_Ambito AS amb
      ON s.PAB_SOL_Ambito = amb.TAB_Nemotecnico
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.TAB_PabPrio AS pri
      ON s.PAB_SOL_Prioridad = pri.TAB_Codigo
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.SER_Lugares AS lug
      ON s.SER_REC_Tipo = lug.SER_LUG_Codigo
    LEFT JOIN BD_ENTI_CORPORATIVA.dbo.TAB_TipoAnest AS ta
      ON s.PAB_SOL_TipoAnest = ta.TAB_Codigo
    WHERE s.PAB_SOL_Estado = 'R'
      AND s.PAB_SOL_FechaSolicit BETWEEN :fechaInicio AND :fechaFin
    ORDER BY s.PAB_SOL_Numero;
  `;

  return await sequelize.query(query, {
    replacements: { fechaInicio, fechaFin },
    type: QueryTypes.SELECT,
  });
}

export async function obtenerPatologiasPorSolicitud(numeroSolicitud: string) {
  const query = `
    SELECT PAB_PAT_Codigo, PAB_PAT_PatologiaAgr
    FROM BD_ENTI_CORPORATIVA.dbo.PAB_Patagreg
    WHERE PAB_SOL_Numero = :numeroSolicitud;
  `;

  return await sequelize.query(query, {
    replacements: { numeroSolicitud },
    type: QueryTypes.SELECT,
  });
}

export async function ListaEsperaGastroenterologia(fechaInicio: string, fechaFin: string, tipo_reporte: number) {
  const [dIni, mIni, yIni] = fechaInicio.split('/');
  const [dFin, mFin, yFin] = fechaFin.split('/');
  const fechaInicioISO = `${yIni}-${mIni}-${dIni}`;
  const fechaFinISO = `${yFin}-${mFin}-${dFin}`;

  let query = `
    SELECT
      ss = '03',
      SUBSTRING(p.PAC_PAC_Rut, 0, 9) AS RUN,
      SUBSTRING(p.PAC_PAC_Rut, 10, 11) AS DV,
      p.PAC_PAC_Nombre,
      p.PAC_PAC_ApellPater,
      p.PAC_PAC_ApellMater,
      CONVERT(VARCHAR, p.PAC_PAC_FechaNacim, 103) AS fecha_nac,
      CASE LTRIM(RTRIM(p.PAC_PAC_Sexo))
        WHEN 'M' THEN '1'
        WHEN 'F' THEN '2'
      END AS sexo,
      CASE LTRIM(RTRIM(p.PAC_PAC_Prevision))
        WHEN 'F' THEN '1'
        WHEN 'P' THEN '2'
        ELSE '3'
      END AS previ,
      tipo_prest = '3',
      presta_min = pr.prestacion,
      plano = '',
      extremidad = '',
      presta_est = CASE
        WHEN pr.prestacion = '18-01-001'
          THEN 'Gastroduodenoscopía (incluye esofagoscopía)'
        WHEN pr.prestacion = '18-01-006'
          THEN 'Colonoscopía larga incluye sigmoidoscopía y colonoscopía izquierdo'
        ELSE '-'
      END,
      CONVERT(VARCHAR, sp.fecha_solicitud, 103) AS f_entrada,
      estab_origen = sp.estaSolicitud,
      estab_dest = '103101',
      CONVERT(VARCHAR, pr.fecha_realizacion, 103) AS f_salida,
      c_salida = '',
      e_otor_at = '103101',
      presta_min_salida = pr.prestacion,
      LTRIM(RTRIM(p.PAC_PAC_Prais)) AS prais,
      region = p.PAC_PAC_CiudaHabit,
      comuna = sp.comuna,
      sospecha_diag = pr.diagnostico,
      confir_diag = '',
      ciudad = 'Calama',
      cond_ruralidad = '01',
      via_direccion = '09',
      nom_calle = '',
      num_direccion = '',
      resto_direccion = p.PAC_PAC_DireccionGralHabit,
      p.PAC_PAC_Fono AS fono_fijo,
      p.PAC_PAC_TelefonoMovil AS fono_movil,
      email = '',
      f_citacion = '',
      run_prof_sol = '',
      dv_prof_sol = '',
      run_prof_resol = '',
      dv_prof_resol = '',
      id_local = '',
      resultado = '',
      sigte_id = ''
    FROM BD_ENTI_CORPORATIVA..PAC_Paciente AS p,
         BD_PPV..Prestacion AS pr,
         BD_PPV..Solicitud_Prestacion AS sp
    WHERE 
      pr.id_solicitud = sp.id
      AND pr.vigencia = 0
      AND sp.vigencia = 0
      AND sp.estado = 1
      AND p.PAC_PAC_Rut = sp.rut_paciente
      AND pr.prestacion IN ('18-01-006', '18-01-001')
  `;

  if (tipo_reporte === 1) {
    query += ` AND pr.fecha_solicitud BETWEEN :fechaInicio AND :fechaFin`;
  } else {
    query += ` AND pr.fecha_realizacion BETWEEN :fechaInicio AND :fechaFin`;
  }

  query += ` ORDER BY pr.fecha_solicitud ASC;`;

  return await sequelizePPV.query(query, {
    replacements: {
      fechaInicio: fechaInicioISO,
      fechaFin: fechaFinISO,
    },
    type: QueryTypes.SELECT,
  });
}

export async function PacienteHospitalizado(fechaInicio: string, fechaFin: string) {
  const query = `
    SELECT DISTINCT
        pac.PAC_PAC_Rut AS rut,
        pac.PAC_PAC_Nombre + ' ' + pac.PAC_PAC_ApellPater + ' ' + pac.PAC_PAC_ApellMater AS nombre,
        CONVERT(VARCHAR(10), pac.PAC_PAC_FechaNacim, 103) AS fecha_nacimiento,
        DATEDIFF(YEAR, pac.PAC_PAC_FechaNacim, GETDATE()) AS edad,
        CONVERT(VARCHAR(10), nom.NOM_Fecha, 103) AS fecha_citacion,
        pac.PAC_PAC_Sexo AS sexo,
        pac.PAC_PAC_Prevision + ' - ' + pac.PAC_PAC_TipoBenef AS prev,
        nom.NOM_Folio AS folio,
        CASE WHEN (CAST(am.HCE_FechaAlta AS VARCHAR) != '') THEN 'SI' ELSE 'NO' END AS alta_siclope,
        nom.NOM_CodigProfe AS rut_prof,
        prof.SER_PRO_ApellPater + ' ' + prof.SER_PRO_ApellMater + ' ' + prof.SER_PRO_Nombres AS nombre_medico,
        esp.SER_ESP_Descripcio AS poli,
        ser.SER_SER_Descripcio AS esp,
        detnom.NOM_Pertinente AS pertinente,
        detnom.NOM_PertinenteTiempo AS pertinente_tiempo,
        CASE 
            WHEN detnom.NOM_EstadoConsulta = '01' THEN 'Se Presento'
            WHEN detnom.NOM_EstadoConsulta = '02' THEN 'No Se Presento'
            ELSE 'Rechazado'
        END AS asistencia,
        detnom.PCA_AGE_PacNueCont AS nuevo_nontrol,
        ISNULL(pro.SER_PRO_Codigo, '') AS cod_proc,
        ISNULL(pro.SER_PRO_Descripcio, '') AS Procedencia,
        ISNULL(der.SER_PRO_Establecimiento, '') AS cod_detproc,
        nom.NOM_Fecha AS fecha_cita,
        nom.NOM_CodigServi AS codigo_ser,
        '' AS pac_numero,
        his.HCE_Diagnostico AS diagnostico,
        et.TAB_Text AS etnia,
        nac.NAC_Descripcion AS nacionalidad,
        pac.PAC_PAC_PacTrans AS trans
    FROM AFC_Nomina AS nom
    LEFT JOIN AFC_DetNomina AS detnom ON nom.NOM_Folio = detnom.NOM_Folio
    LEFT JOIN PAC_Paciente AS pac ON detnom.NOM_NumerPacie = pac.PAC_PAC_Numero
    LEFT JOIN TAB_Etnia AS et ON pac.PAC_PAC_Etnia = et.TAB_Codigo
    LEFT JOIN TAB_Nacionalidad AS nac ON pac.NAC_Ide = nac.NAC_Ide
    LEFT JOIN SER_Servicios AS ser ON nom.NOM_CodigServi = ser.SER_SER_Codigo
    LEFT JOIN SER_Especiali AS esp ON ser.SER_SER_CodigEspec = esp.SER_ESP_Codigo
    LEFT JOIN PAC_PacientePercapita AS per ON pac.PAC_PAC_Numero = per.PAC_PAC_Numero
    LEFT JOIN SER_Procedencia AS pro ON per.PAC_PAC_Procedencia = pro.SER_PRO_Codigo
    LEFT JOIN SER_Derivador AS der 
        ON der.SER_DER_Codigo = per.PAC_PAC_DetProc
        AND pro.SER_PRO_Codigo = der.SER_PRO_Codigo
    LEFT JOIN BD_HCE.dbo.HCE_CitacionAgenda AS c
        ON pac.PAC_PAC_Numero = c.HCE_NumerPacie
        AND nom.NOM_Fecha = c.HCE_FechaCitac
        AND nom.NOM_CodigProfe = c.HCE_CodigProfe
        AND nom.NOM_CodigServi = c.HCE_CodigServi
        AND c.HCE_Periodo = YEAR(GETDATE())
    LEFT JOIN BD_HCE.dbo.HCE_HistorialFicha AS his
        ON c.HCE_IdHce = his.HCE_IdHce
        AND his.HCE_Periodo = YEAR(GETDATE())
    LEFT JOIN SER_Profesiona AS prof 
        ON nom.NOM_CodigProfe = prof.SER_PRO_Rut 
        AND prof.SER_PRO_Estado = '0001'
    LEFT JOIN BD_HCE.dbo.HCE_AltaMedica AS am 
        ON c.HCE_IdHce = am.HCE_IdHce 
        AND am.HCE_Periodo = YEAR(GETDATE())
    WHERE nom.NOM_Fecha BETWEEN :fechaInicio AND :fechaFin
  `;

  const results = await sequelize.query(query, {
    replacements: { fechaInicio, fechaFin },
    type: QueryTypes.SELECT,
  });

  return results;
}

export async function ProcedimientosRealizados(finic: string, ftermin: string, selectEspec: string, PadreEsp?: string) {
  const query = `
    SELECT
      c.ID_ListaEspera AS Folio,
      p.PAC_PAC_Nombre + ' ' + p.PAC_PAC_ApellPater + ' ' + p.PAC_PAC_ApellMater AS Nombre_Paciente,
      p.PAC_PAC_Rut AS RUT,
      (
        SELECT TOP 1 e.TAB_Text
        FROM BD_ENTI_CORPORATIVA.dbo.TAB_Etnia e
        JOIN BD_ENTI_CORPORATIVA.dbo.PAC_Paciente px ON px.PAC_PAC_Etnia = e.TAB_Codigo
        WHERE px.PAC_PAC_Numero = r.PAC_PAC_Numero
      ) AS Etnia,
      p.PAC_PAC_Sexo AS Sexo,
      CAST(DATEDIFF(DAY, p.PAC_PAC_FechaNacim, GETDATE()) / 365.25 AS INT) AS Edad,
      CASE p.PAC_PAC_Prevision
        WHEN 'F' THEN 'FONASA'
        WHEN 'P' THEN 'PARTICULAR'
        WHEN 'C' THEN 'CONVENIO'
        WHEN 'I' THEN 'ISAPRE'
        ELSE 'NO INFORMADA'
      END + ' ' + ISNULL(p.PAC_PAC_TipoBenef, '') AS Prevision,
      REPLACE(r.PROC_RC_TextoInforme, CHAR(10), ' - ') AS Informe,
      REPLACE(r.PROC_RC_TextoHallazgo, CHAR(10), ' - ') AS Hallazgo,
      REPLACE(r.PROC_RC_TextoConclusion, CHAR(10), ' - ') AS Conclusion,
      c.PROC_PER_Equip AS Especialidad
    FROM BD_PROCEDIMIENTOS.dbo.PROC_Citas AS c
    JOIN BD_PROCEDIMIENTOS.dbo.PROC_RegClinico AS r
      ON r.PROC_RC_Correla = c.ID_ListaEspera
    JOIN BD_ENTI_CORPORATIVA.dbo.PAC_Paciente AS p
      ON p.PAC_PAC_Numero = c.PAC_PAC_Numero
    WHERE c.PROC_CIT_Fecha BETWEEN :finic AND :ftermin
      AND c.PROC_PER_Equip = :selectEspec
    ${PadreEsp ? 'AND c.SER_ESP_Codigo = :PadreEsp' : ''}
    ORDER BY c.ID_ListaEspera
  `;

  const replacements: any = { finic, ftermin, selectEspec };
  if (PadreEsp) replacements.PadreEsp = PadreEsp;

  return sequelize.query(query, {
    replacements,
    type: QueryTypes.SELECT,
  });
}
