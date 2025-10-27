// src/servicios/opodf.service.ts
import puppeteer, { PDFOptions } from 'puppeteer';
import { PoolPaginas } from '../../infra/pool-paginas';

// Utilidades del generador HTML de nóminas
import {
  mapDesdeNombres,
  agruparNominas,
  generarHTMLNominas,
  FilaNomina,
} from './nominas-html';

import path from 'path';
import { pathToFileURL } from 'url';
import fs from 'fs';

export class ErrorServicioPdf extends Error {
  constructor(mensaje: string, public causa?: unknown) {
    super(mensaje);
    this.name = 'ErrorServicioPdf';
  }
}

export interface OpcionesConstruccionPdf {
  html?: string;
  url?: string;
  opcionesPdf?: PDFOptions;
  emularMedio?: 'print' | 'screen';
  esperarHasta?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  tiempoEsperaMs?: number;
  baseURL?: string; // Debe terminar con '/'
  cabecerasHttpExtra?: Record<string, string>;
  abortarMedios?: boolean;
  logsDetallados?: boolean;
}

// Pool global (ajusta según recursos)
const pool = new PoolPaginas({ maxPaginas: 6, reciclarCada: 80 });

/** Inserta <base href="..."> en el HTML si no existe. */
function inyectarBaseEnHtml(html: string, baseHref: string): string {
  if (!baseHref) return html;
  if (/<base\s+href=/i.test(html)) return html;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (m) => `${m}\n<base href="${baseHref}">`);
  }
  if (/<!doctype/i.test(html)) {
    return html.replace(/<html[^>]*>/i, (m) => `${m}\n<head><base href="${baseHref}"></head>`);
  }
  return `<head><base href="${baseHref}"></head>${html}`;
}

/** Devuelve un data URL (base64) de un archivo local. */
function archivoADataUrl(ruta: string): string | null {
  try {
    const bin = fs.readFileSync(ruta);
    const ext = path.extname(ruta).toLowerCase();
    const mime =
      ext === '.png' ? 'image/png' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.gif' ? 'image/gif' :
      'application/octet-stream';
    return `data:${mime};base64,${bin.toString('base64')}`;
  } catch {
    return null;
  }
}

/** Reemplaza las rutas de imágenes conocidas por data URLs dentro del HTML. */
function incrustarImagenes(html: string, publicDir: string, logs = false): string {
  // Rutas "lógicas" que usa tu HTML
  const minsalRel = 'images/Logo_del_MINSAL_Chile.png';
  const hccRel    = 'images/hcc.jpg';

  const minsalAbs = path.join(publicDir, minsalRel);
  const hccAbs    = path.join(publicDir, hccRel);

  const minsalData = archivoADataUrl(minsalAbs);
  const hccData    = archivoADataUrl(hccAbs);

  if (logs) {
    console.log('[PDF] Embed MINSAL from:', minsalAbs, Boolean(minsalData));
    console.log('[PDF] Embed HCC    from:', hccAbs, Boolean(hccData));
  }

  let out = html;

  if (minsalData) {
    // Reemplaza cualquier variante de comillas
    out = out.replace(/src=["']images\/Logo_del_MINSAL_Chile\.png["']/gi, `src="${minsalData}"`);
  }
  if (hccData) {
    out = out.replace(/src=["']images\/hcc\.jpg["']/gi, `src="${hccData}"`);
  }

  return out;
}

export class ServicioPdf {
  /** Core: Genera un PDF desde HTML o URL reusando páginas del pool */
  async generar(opciones: OpcionesConstruccionPdf): Promise<Buffer> {
    if (!opciones.html && !opciones.url) {
      throw new ErrorServicioPdf('Debes proveer "html" o "url".');
    }

    const pagina = await pool.prestarPagina();
    try {
      if (opciones.cabecerasHttpExtra) {
        await pagina.setExtraHTTPHeaders(opciones.cabecerasHttpExtra);
      }

      if (opciones.abortarMedios) {
        await pagina.setRequestInterception(true);
        pagina.on('request', (req) => {
          const tipo = req.resourceType();
          if (tipo === 'image' || tipo === 'media' || tipo === 'font') return req.abort();
          req.continue();
        });
      }

      const esperarHasta = opciones.esperarHasta ?? 'networkidle0';
      const tiempoEsperaMs = opciones.tiempoEsperaMs ?? 30_000;

      if (opciones.html) {
        // Inyecta <base> ANTES de setContent
        const htmlConBase = opciones.baseURL
          ? inyectarBaseEnHtml(opciones.html, opciones.baseURL)
          : opciones.html;

        await pagina.setContent(htmlConBase, { waitUntil: esperarHasta, timeout: tiempoEsperaMs });

        // Esperar que todas las imágenes estén completas
        try {
          await pagina.waitForFunction(
            () => Array.from(document.images).every((img) => img.complete),
            { timeout: 8000 }
          );
        } catch { /* noop */ }

        if (opciones.logsDetallados) {
          const rutas = await pagina.evaluate(() =>
            Array.from(document.images).map((img) => ({ src: img.src, complete: img.complete }))
          );
          console.log('[PDF imágenes]', rutas);
        }
      } else if (opciones.url) {
        await pagina.goto(opciones.url, { waitUntil: esperarHasta, timeout: tiempoEsperaMs });
        try {
          await pagina.waitForFunction(
            () => Array.from(document.images).every((img) => img.complete),
            { timeout: 8000 }
          );
        } catch { /* noop */ }
      }

      await pagina.emulateMediaType(opciones.emularMedio ?? 'print');

      const opcionesPdf: PDFOptions = {
        format: 'A4',
        landscape: true,           // horizontal por defecto
        printBackground: true,
        preferCSSPageSize: true,   // respeta @page del CSS
        margin: { top: '12mm', bottom: '10mm', left: '10mm', right: '10mm' },
        ...(opciones.opcionesPdf ?? {}),
      };

      const bytes = await pagina.pdf(opcionesPdf);
      const buffer: Buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
      return buffer;
    } catch (err) {
      throw new ErrorServicioPdf('Error generando el PDF', err);
    } finally {
      if (pagina.listenerCount('request') > 0) {
        pagina.removeAllListeners('request');
        try { await pagina.setRequestInterception(false); } catch {}
      }
      await pool.devolverPagina(pagina);
    }
  }

  /** Atajo: HTML directo */
  async generarDesdeHtml(html: string, opciones?: Omit<OpcionesConstruccionPdf, 'html' | 'url'>): Promise<Buffer> {
    return this.generar({ html, ...(opciones ?? {}) });
  }

  /** Atajo: URL */
  async generarDesdeUrl(url: string, opciones?: Omit<OpcionesConstruccionPdf, 'html' | 'url'>): Promise<Buffer> {
    return this.generar({ url, ...(opciones ?? {}) });
  }

  /** Genera PDF de NÓMINAS usando el HTML a medida (nominas-html.ts) */
  async generarNominasDesdeResultados(
    resultados: any[],
    meta: {
      periodo: { desde: string; hasta: string };
      hospital: string;
      fechaImpresion?: string;
      horaImpresion?: string;
    },
    opcionesPdf?: PDFOptions
  ): Promise<Buffer> {
    const filas: FilaNomina[] = (resultados ?? []).map(mapDesdeNombres);
    const grupos = agruparNominas(filas, meta);
    let html = generarHTMLNominas(grupos);

    // ✅ Base URL DEBE apuntar a /public
    const publicDir = path.resolve(process.cwd(), 'public');
    const baseURL = pathToFileURL(publicDir + path.sep).href;
    console.log('Base URL for PDF generation:', baseURL);

    // ✅ Embebe las imágenes como data URL (a prueba de file://)
    html = incrustarImagenes(html, publicDir, /*logs*/ false);

    return this.generarDesdeHtml(html, {
      emularMedio: 'print',
      baseURL,                 // lo mantenemos por si hay otros recursos relativos
      logsDetallados: false,   // pon true si quieres ver el listado de <img>
      tiempoEsperaMs: 600000, // 10 minutos
      opcionesPdf: {
        format: 'Legal',
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        scale: 0.92,
        margin: { top: '8mm', bottom: '8mm', left: '8mm', right: '8mm' },
        ...(opcionesPdf ?? {}),
      },
    });
  }
}

export const servicioPdf = new ServicioPdf();
