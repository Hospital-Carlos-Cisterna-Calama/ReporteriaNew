import puppeteer from 'puppeteer';

/**
 * Servicio para generación de PDFs usando Puppeteer.
 * Contiene métodos reutilizables para generar PDFs desde HTML.
 */
export class PdfService {

  /**
   * Genera un PDF a partir de contenido HTML.
   * @param html - string con el HTML completo a renderizar
   * @returns Buffer con el contenido del PDF
   */
  async generatePdfFromHtml(html: string): Promise<Buffer> {
    let browser: puppeteer.Browser | null = null;
    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      // Asegurar que las reglas @media print se apliquen
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.emulateMediaType('print');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '16mm', bottom: '16mm', left: '12mm', right: '12mm' },
      });

      return pdfBuffer;
    } catch (err) {
      console.error('[PdfService] Error generating PDF:', err);
      throw err;
    } finally {
      if (browser) {
        try { await browser.close(); } catch (e) { /* ignore */ }
      }
    }
  }

  /**
   * Genera un PDF de ejemplo (plantilla simple) y devuelve el Buffer.
   * Puedes usar este método para probar la integración rápidamente.
   */
  async generateSamplePdf(): Promise<Buffer> {
    const sampleHtml = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Reporte de ejemplo</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #222 }
          header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px }
          .logo { width: 72px; height: 72px; background: #004a9f; color: #fff; display:flex; align-items:center; justify-content:center; font-weight:700 }
          h1 { font-size: 16px; margin: 0 }
          .meta { font-size: 11px; color: #444 }
          table { width: 100%; border-collapse: collapse; margin-top: 12px }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left }
          th { background: #f3f3f3 }
          footer { position: fixed; bottom: 8mm; left: 12mm; right: 12mm; font-size: 10px; color: #666 }
          @media print {
            footer { position: fixed }
          }
        </style>
      </head>
      <body>
        <header>
          <div class="logo">MIN</div>
          <div>
            <h1>NÓMINAS POR FECHA Y PROFESIONAL (Ejemplo)</h1>
            <div class="meta">Periodo: 01/09/2025 - 23/10/2025 &nbsp; | &nbsp; Hospital Dr. Carlos Cisterna Calama</div>
          </div>
        </header>

        <section>
          <table>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Rut</th>
                <th>Ficha</th>
                <th>Diagnóstico</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>11:20</td>
                <td>GUADARSAMIENTO MARIA</td>
                <td>08171262-K</td>
                <td>279.321</td>
                <td>POLI DIABETES</td>
              </tr>
              <tr>
                <td>11:40</td>
                <td>MANQUEZ FUENTES FREDY RICA</td>
                <td>16566341-1</td>
                <td>100.632</td>
                <td>POLI DIABETES</td>
              </tr>
              <tr>
                <td>12:00</td>
                <td>LAGOS HERNANDEZ ESTER</td>
                <td>13313761-0</td>
                <td>86.630</td>
                <td>POLI DIABETES</td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer>Generado por Reportería - Ejemplo (no oficial)</footer>
      </body>
      </html>
    `;

    return this.generatePdfFromHtml(sampleHtml);
  }
}

export const pdfService = new PdfService();

