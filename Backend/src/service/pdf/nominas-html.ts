/* eslint-disable @typescript-eslint/no-explicit-any */

/* ===================== Tipos ===================== */

export interface FilaNomina {
  nomina: number;
  fechaCita: string;        // Normalizada (YYYY-MM-DD o DD/MM/YYYY)
  lugar: string;
  especialidad: string;
  profesional: string;
  hora: string;

  apPaterno: string;
  apMaterno: string;
  nombres: string;
  rut: string;
  ficha: number | string;

  prevision: string;        // 'F','P', etc.
  tramo: string;            // 'A'...'D'
  prevValor?: number;

  edad?: number;
  nc: 'N' | 'C' | string;   // Nuevo/Control
  referencia?: string;
  procedencia?: string;

  gesPNoP?: 'Si' | 'No' | 'N/A' | string;
  estado?: string;          // S/N/01/02 → se normaliza al mostrar
  diagnostico?: string;
  fechaAlta?: string;
}

export interface GrupoNomina {
  encabezado: {
    nomina: number;
    fechaCita: string;      // normalizada
    lugar: string;
    especialidad: string;
    profesional: string;
    horaInicio: string;     // min(hora)
    pacientesCitados: number;
    periodo: { desde: string; hasta: string };
    hospital: string;
    fechaImpresion?: string;
    horaImpresion?: string;
  };
  filas: FilaNomina[];
}

/* ===================== Helpers base ===================== */

const str = (v: unknown) => (v ?? '').toString().trim();
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

/** Formato miles chileno (249.457) */
export function formatoMilesCL(n?: number): string {
  if (n == null) return '';
  return n.toLocaleString('es-CL');
}

/** Normaliza entrada de fecha para evitar problemas de TZ:
 *  - Date => toISOString().slice(0,10) (YYYY-MM-DD en UTC, sin desfase)
 *  - 'YYYY-MM-DDTHH...' => toma YYYY-MM-DD
 *  - 'DD/MM/YYYY' => deja igual
 *  - otro => toString()
 */
function normalizaFechaEntrada(v: any): string {
  if (v instanceof Date) {
    return v.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  }
  const s = (v ?? '').toString().trim();
  const mISO = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (mISO) return mISO[1];
  const mCL = s.match(/^(\d{2}\/\d{2}\/\d{4})/);
  if (mCL) return mCL[1];
  return s;
}

/** Convierte “S/N/01/02…” a chips “Se Presentó/No se presentó” */
function textoEstadoFlexible(v?: string): string {
  const s = (v ?? '').toString().trim().toUpperCase();
  if (['S','SI','1','01','P','PRESENTE'].includes(s)) return 'Se Presentó';
  if (['N','NO','0','02','2','NP','AUSENTE'].includes(s)) return 'No se presentó';
  return v || '';
}

/** Formatea fecha normalizada a “Lunes 20/10/2025”
 *  - Acepta 'YYYY-MM-DD' (preferido) o 'DD/MM/YYYY'
 *  - Calcula el día de la semana en UTC (sin desfases)
 */
export function formatearFechaCitaES(fechaNorm: string): string {
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  // YYYY-MM-DD
  const mISO = fechaNorm.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (mISO) {
    const y = Number(mISO[1]), mo = Number(mISO[2]), d = Number(mISO[3]);
    const dt = new Date(Date.UTC(y, mo - 1, d));
    const dow = dias[dt.getUTCDay()];
    const dd = String(d).padStart(2, '0');
    const mm = String(mo).padStart(2, '0');
    return `${dow} ${dd}/${mm}/${y}`;
  }

  // DD/MM/YYYY
  const mCL = fechaNorm.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (mCL) {
    const d = Number(mCL[1]), mo = Number(mCL[2]), y = Number(mCL[3]);
    const dt = new Date(Date.UTC(y, mo - 1, d));
    const dow = dias[dt.getUTCDay()];
    const dd = String(d).padStart(2, '0');
    const mm = String(mo).padStart(2, '0');
    return `${dow} ${dd}/${mm}/${y}`;
  }

  // fallback
  return fechaNorm;
}

/* ===================== Mapeos ===================== */

/** Mapper por NOMBRES (alineado a tus columnas) */
export function mapDesdeNombres(f: any): FilaNomina {
  // ¡Clave! Normalizamos para no perder el día por TZ:
  const fechaCita = normalizaFechaEntrada(
    f.fechaNomina ?? f.FechaNomina ?? f.fecha ?? f.Fecha
  );

  return {
    nomina: Number(f.NOM_Folio ?? f.Nom_Folio ?? f.Nomina ?? f.nomina),
    fechaCita,
    lugar: str(f.nomlugar ?? f.NomLugar ?? f.Lugar),
    especialidad: str(f.nomservi ?? f.NomServi ?? f.Especialidad),
    profesional: str(f.nomprofe ?? f.NomProfe ?? f.Profesional),

    hora: str(f.PCA_AGE_HoraCitac ?? f.hora ?? f.Hora),

    apPaterno: str(f.PAC_PAC_ApellPater ?? f.ApPaterno),
    apMaterno: str(f.PAC_PAC_ApellMater ?? f.ApMaterno),
    nombres: str(f.PAC_PAC_Nombre ?? f.Nombres),
    rut: str(f.PAC_PAC_Rut ?? f.Rut),
    ficha: str(f.PAC_CAR_NumerFicha ?? f.Ficha),

    prevision: str(f.prevision ?? f.Prevision),
    tramo: str(f.tipobenef ?? f.TipoBenef),

    edad: num(f.edad ?? f.Edad),
    nc: str(f.PCA_AGE_PacNueCont ?? f.NC ?? f.Nc),
    referencia: str(f.procedencia ?? f.Referencia) || 'Sin Información',
    procedencia: str(f.procedencia2 ?? f.Procedencia) || 'Sin Información',

    gesPNoP: str(f.NOM_Pertinente ?? f.Pertinente),
    estado: str(f.NOM_EstadoConsulta ?? f.EstadoConsulta ?? f.Estado),
    diagnostico: str(f.HCE_Descrip ?? f.Diagnostico),
    fechaAlta: str(f.HCE_FechaAlta ?? f.FechaAlta),
  };
}

/** (Disponible) Mapper por índices si alguna vez lo necesitas */
export function mapDesdeIndices(f: any): FilaNomina {
  return {
    nomina: Number(f[12]),
    fechaCita: normalizaFechaEntrada(f[31]),
    lugar: str(f[13]),
    especialidad: str(f[14]),
    profesional: str(f[15]),
    hora: str(f[7]),
    apPaterno: str(f[3]),
    apMaterno: str(f[4]),
    nombres: str(f[5]),
    rut: str(f[1]),
    ficha: str(f[2]),
    prevision: str(f[16]).trim(),
    tramo: str(f[17]).trim(),
    prevValor: num(f[19]),
    edad: num(f[18]),
    nc: str(f[6]) as 'N' | 'C' | string,
    referencia: str(f[9]) || 'Sin Información',
    procedencia: str(f[26]) || 'Sin Información',
    gesPNoP: str(f[23]),
    estado: str(f[10]),
    diagnostico: str(f[20]),
    fechaAlta: '',
  };
}

/* ===================== Agrupación ===================== */

export function agruparNominas(
  filas: FilaNomina[],
  meta: { periodo: { desde: string; hasta: string }; hospital: string; fechaImpresion?: string; horaImpresion?: string }
): GrupoNomina[] {
  const clave = (f: FilaNomina) => `${f.nomina}|${f.fechaCita}|${f.lugar}|${f.especialidad}|${f.profesional}`;
  const mapa = new Map<string, FilaNomina[]>();

  for (const f of filas) {
    const k = clave(f);
    const arr = mapa.get(k) ?? [];
    arr.push(f);
    mapa.set(k, arr);
  }

  const grupos: GrupoNomina[] = [];
  for (const [k, arr] of mapa.entries()) {
    arr.sort((a, b) => a.hora.localeCompare(b.hora));
    const [nomina, fechaCita, lugar, especialidad, profesional] = k.split('|');
    const horaInicio = arr.length ? arr[0].hora : '';
    grupos.push({
      encabezado: {
        nomina: Number(nomina),
        fechaCita,
        lugar,
        especialidad,
        profesional,
        horaInicio,
        pacientesCitados: arr.length,
        periodo: meta.periodo,
        hospital: meta.hospital,
        fechaImpresion: meta.fechaImpresion,
        horaImpresion: meta.horaImpresion,
      },
      filas: arr,
    });
  }

  grupos.sort((a, b) =>
    (a.encabezado.fechaCita + a.encabezado.horaInicio).localeCompare(b.encabezado.fechaCita + b.encabezado.horaInicio)
  );

  return grupos;
}

/* ===================== HTML (Legal landscape, con logos) ===================== */

export function generarHTMLNominas(grupos: GrupoNomina[]): string {
  const css = `
<style>
  :root{
    --bg:#ffffff; --ink:#111827; --muted:#6b7280; --border:#e5e7eb; --head:#f3f4f6;
    --brand:#0ea5e9; --brand-ink:#075985; --zebra:#fafafa;
    --ok-bg:#05966910; --ok-ink:#065f46; --ok-bd:#10b98155;
    --no-bg:#dc262610; --no-ink:#991b1b; --no-bd:#ef444455;
    --n-bg:#9a341210; --n-ink:#9a3412; --n-bd:#f59e0b55;
    --c-bg:#3730a310; --c-ink:#3730a3; --c-bd:#6366f155;
    --ges-bg:#155e7510; --ges-ink:#0f766e; --ges-bd:#14b8a655;
  }

  @page{ size: Legal landscape; margin: 8mm; }
  html, body { background: var(--bg); color: var(--ink); font: 11.4px/1.34 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
  .page{ width: 98%; margin: 0 auto; position: relative; }

  .marca-agua{
    position: fixed;
    bottom: 10mm; left: 10mm;
    width: 220px; opacity: .08; filter: grayscale(25%);
    z-index: 0; pointer-events: none;
  }

  .header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; border:1px solid var(--border); border-radius:10px; overflow:hidden; background:#fff; }
  .header .brand{ display:flex; align-items:center; gap:12px; padding:10px 12px; }
  .header img.minsal{ height:60px; width:auto; object-fit:contain; display:block; }
  .header .main{ padding:6px 0; }
  .header h1{ font-size:18px; margin:0 0 6px 0; color:var(--brand-ink); letter-spacing:.2px; }
  .meta{ display:flex; flex-wrap:wrap; gap:6px 18px; color:var(--muted); font-size:11px; }
  .meta b{ color:var(--ink); margin-right:4px; }
  .ref{ text-align:right; padding:10px 14px; min-width:240px; border-left:1px solid var(--border); color:var(--muted); font-size:11px; }

  .block{ border:1px solid var(--border); border-radius:10px; padding:10px; margin-top:10px; background:#fff; }
  .grid6{ display:grid; grid-template-columns:repeat(6, minmax(0,1fr)); gap:8px; font-size:11px; }
  .kv{ display:flex; gap:6px; border-bottom:1px dashed #e6e6e6; padding-bottom:2px; }
  .kv label{ color:var(--muted); min-width:max-content; }

  .table-wrap{ margin-top:8px; border:1px solid var(--border); border-radius:10px; overflow:hidden; background:#fff; }
  table{ width:100%; border-collapse:separate; border-spacing:0; table-layout:fixed; }
  thead th{ background: var(--head); color:#111827; font-weight:700; border-bottom:1px solid var(--border); padding:4px 6px; white-space:nowrap; }
  tbody td{ padding:5px 6px; border-bottom:1px solid var(--border); }
  tbody tr:nth-child(odd){ background: var(--zebra); }

  th, td{ vertical-align: middle; }
  td.col-dx{ vertical-align: top; }
  .num{ text-align:right; }
  .cen{ text-align:center; }
  .mono{ font-variant-numeric: tabular-nums; letter-spacing:.1px; font-size: 11px; }
  td.col-rut, td.col-ficha, td.col-prev, td.col-edad { text-align:center; }

  /* Anchuras: Diagnóstico y Paciente absorben resto */
  .c-hora{ width:44px; } .c-pac{ width:auto; } .c-rut{ width:80px; } .c-ficha{ width:52px; }
  .c-prev{ width:58px; } .c-edad{ width:40px; } .c-nc{ width:34px; }
  .c-ref{ width:105px; } .c-proc{ width:120px; }
  .c-ges{ width:44px; } .c-estado{ width:56px; } .c-dx{ width:auto; } .c-alta{ width:72px; }

  td.col-pac{ padding-right: 16px; }
  td.col-dx{ line-height:1.25; hyphens:auto; word-break:break-word; overflow-wrap:anywhere; }

  .chip{ display:inline-block; padding:0 6px; border-radius:999px; font-size:9.8px; line-height:1.22; border:1px solid var(--border); }
  .chip-n{ background:var(--n-bg);  color:var(--n-ink);  border-color:var(--n-bd); }
  .chip-c{ background:var(--c-bg);  color:var(--c-ink);  border-color:var(--c-bd); }
  .chip-ges{ background:var(--ges-bg); color:var(--ges-ink); border-color:var(--ges-bd); }
  .flag{ display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:6px; border:1px solid; font-size:11px; font-weight:700; }
  .ok { background:var(--ok-bg); color:var(--ok-ink); border-color:var(--ok-bd); }
  .nok{ background:var(--no-bg); color:var(--no-ink); border-color:var(--no-bd); }

  .hoja{ page-break-after: always; }
  .hoja:last-of-type{ page-break-after: auto; }
</style>`;

  const filasTabla = (g: GrupoNomina) => g.filas.map(f => {
    const prevCol = f.prevValor != null && !Number.isNaN(f.prevValor)
      ? formatoMilesCL(f.prevValor)
      : `${(f.prevision || '').trim()} ${(f.tramo || '').trim()}`.trim();

    const nc = (f.nc || '').toUpperCase() === 'N'
      ? `<span class="chip chip-n">N</span>`
      : `<span class="chip chip-c">C</span>`;

    const v = (f.estado ?? '').toString().trim().toUpperCase();
    const ok = ['S','SI','1','01','P','PRESENTE'].includes(v);
    const no = ['N','NO','0','02','2','NP','AUSENTE'].includes(v);
    const estadoView = ok ? `<span class="flag ok">✓</span>`
                    : no ? `<span class="flag nok">✗</span>`
                    : (f.estado ? `<span class="chip">${textoEstadoFlexible(f.estado)}</span>` : '');

    const ges = f.gesPNoP ? `<span class="chip chip-ges">${f.gesPNoP}</span>` : '';

    return `
      <tr>
        <td class="col-hora cen">${f.hora}</td>
        <td class="col-pac">${f.apPaterno} ${f.apMaterno} ${f.nombres}</td>
        <td class="col-rut mono">${f.rut}</td>
        <td class="col-ficha mono">${f.ficha ?? ''}</td>
        <td class="col-prev mono">${prevCol}</td>
        <td class="col-edad mono">${f.edad ?? ''}</td>
        <td class="col-nc cen">${nc}</td>
        <td class="col-ref">${f.referencia ?? ''}</td>
        <td class="col-proc">${f.procedencia ?? ''}</td>
        <td class="col-ges cen">${ges}</td>
        <td class="col-estado cen">${estadoView}</td>
        <td class="col-dx">${f.diagnostico ?? ''}</td>
        <td class="col-alta cen">${f.fechaAlta ?? ''}</td>
      </tr>
    `;
  }).join('');

  const bloques = grupos.map(g => `
  <section class="hoja">
    <div class="page">
      <img class="marca-agua" src="images/hcc.jpg" alt="HCC" />

      <div class="header">
        <div class="brand">
          <img class="minsal" src="images/Logo_del_MINSAL_Chile.png" alt="MINSAL" />
          <div class="main">
            <h1>NÓMINAS POR FECHA Y PROFESIONAL</h1>
            <div class="meta">
              <div><b>Profesional:</b> ${g.encabezado.profesional}</div>
              <div><b>Periodo:</b> ${g.encabezado.periodo.desde} – ${g.encabezado.periodo.hasta}</div>
              <div><b>Hospital:</b> ${g.encabezado.hospital}</div>
            </div>
          </div>
        </div>
        <div class="ref">
          <div>SICLOPE · RPT_ConsultaNominas.rpt</div>
          <div>${g.encabezado.fechaImpresion ?? ''} ${g.encabezado.horaImpresion ?? ''}</div>
        </div>
      </div>

      <div class="block">
        <div class="grid6">
          <div class="kv"><label>Nómina:</label><div>${g.encabezado.nomina}</div></div>
          <div class="kv"><label>Fecha Citación:</label><div>${formatearFechaCitaES(g.encabezado.fechaCita)}</div></div>
          <div class="kv"><label>Lugar:</label><div>${g.encabezado.lugar}</div></div>
          <div class="kv"><label>Especialidad:</label><div>${g.encabezado.especialidad}</div></div>
          <div class="kv"><label>Hora Inicio:</label><div>${g.encabezado.horaInicio}</div></div>
          <div class="kv"><label>Citados:</label><div>${g.encabezado.pacientesCitados}</div></div>
        </div>

        <div class="table-wrap">
          <table>
            <colgroup>
              <col class="c-hora"/>
              <col class="c-pac"/>
              <col class="c-rut"/>
              <col class="c-ficha"/>
              <col class="c-prev"/>
              <col class="c-edad"/>
              <col class="c-nc"/>
              <col class="c-ref"/>
              <col class="c-proc"/>
              <col class="c-ges"/>
              <col class="c-estado"/>
              <col class="c-dx"/>
              <col class="c-alta"/>
            </colgroup>
            <thead>
              <tr>
                <th class="col-hora">Hora</th>
                <th>Paciente</th>
                <th class="col-rut">Rut</th>
                <th class="col-ficha">Ficha</th>
                <th class="col-prev">Prev.</th>
                <th class="col-edad">Edad</th>
                <th class="col-nc">N/C</th>
                <th class="col-ref">Referencia</th>
                <th class="col-proc">Procedencia</th>
                <th class="col-ges">GES</th>
                <th class="col-estado">Estado</th>
                <th class="col-dx">Diagnóstico</th>
                <th class="col-alta">F. Alta</th>
              </tr>
            </thead>
            <tbody>
              ${filasTabla(g)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
  `).join('');

  return `
  <!doctype html>
  <html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Nóminas por fecha y profesional</title>
    ${css}
  </head>
  <body>
    ${bloques}
  </body>
  </html>`;
}
