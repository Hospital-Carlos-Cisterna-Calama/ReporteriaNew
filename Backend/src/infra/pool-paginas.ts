import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';

export interface OpcionesPoolPaginas {
  maxPaginas: number;          // límite de concurrencia (p.ej. 4–8)
  argumentos?: string[];       // flags de lanzamiento de Chrome
  rutaEjecutable?: string;     // opcional (no necesario con tu imagen)
  reciclarCada?: number;       // reciclar página tras N usos (p.ej. 80–150)
  tiempoEsperaMs?: number;     // timeout esperando una página libre
}

type EntradaPool = {
  pagina: Page;
  usos: number;
  ocupada: boolean;
};

export class PoolPaginas {
  private navegador: Browser | null = null;
  private pool: EntradaPool[] = [];
  private colaEsperando: Array<(p: Page) => void> = [];
  private opciones: OpcionesPoolPaginas;
  private inicializando = false;

  constructor(opciones: Partial<OpcionesPoolPaginas> = {}) {
    this.opciones = {
      maxPaginas: opciones.maxPaginas ?? 6,
      argumentos: opciones.argumentos ?? [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=medium',
      ],
      rutaEjecutable: opciones.rutaEjecutable,
      reciclarCada: opciones.reciclarCada ?? 100,
      tiempoEsperaMs: opciones.tiempoEsperaMs ?? 30_000,
    };
  }

  private async asegurarNavegador(): Promise<void> {
    if (this.navegador || this.inicializando) return;
    this.inicializando = true;

    const opciones: LaunchOptions = {
      headless: true,
      args: this.opciones.argumentos,
      executablePath: this.opciones.rutaEjecutable,
    };

    this.navegador = await puppeteer.launch(opciones);
    this.inicializando = false;

    // Pre-crear páginas
    await Promise.all(
      Array.from({ length: this.opciones.maxPaginas }).map(async () => {
        const pagina = await this.navegador!.newPage();
        this.pool.push({ pagina, usos: 0, ocupada: false });
      }),
    );

    // Cierre ordenado del navegador/pool
    const cerrar = () => { this.cerrar().catch(() => {}); };
    process.once('beforeExit', cerrar);
    process.once('SIGINT', cerrar);
    process.once('SIGTERM', cerrar);
  }

  async prestarPagina(): Promise<Page> {
    await this.asegurarNavegador();

    // Intento inmediato
    const libre = this.pool.find(p => !p.ocupada);
    if (libre) {
      libre.ocupada = true;
      return libre.pagina;
    }

    // Esperar (cola)
    const { tiempoEsperaMs } = this.opciones;
    return await new Promise<Page>((resolve, reject) => {
      const timer = setTimeout(() => {
        const idx = this.colaEsperando.indexOf(resolve);
        if (idx >= 0) this.colaEsperando.splice(idx, 1);
        reject(new Error('Tiempo de espera agotado al solicitar una página del pool'));
      }, tiempoEsperaMs);

      this.colaEsperando.push((p: Page) => {
        clearTimeout(timer);
        resolve(p);
      });
    });
  }

  async devolverPagina(pagina: Page): Promise<void> {
    const entrada = this.pool.find(e => e.pagina === pagina);

    // Si no pertenece al pool (raro), ciérrala por seguridad
    if (!entrada) {
      try { await pagina.close(); } catch {}
      return;
    }

    entrada.usos += 1;

    // Reciclaje por umbral de usos
    const umbral = this.opciones.reciclarCada ?? 100;
    if (entrada.usos >= umbral) {
      try { await entrada.pagina.close(); } catch {}
      const nueva = await this.navegador!.newPage();
      entrada.pagina = nueva;
      entrada.usos = 0;
    }

    // Liberar y despachar a pendientes
    entrada.ocupada = false;
    const siguiente = this.colaEsperando.shift();
    if (siguiente) {
      entrada.ocupada = true;
      siguiente(entrada.pagina);
    }
  }

  async cerrar(): Promise<void> {
    // Vaciar cola de espera con error explícito
    while (this.colaEsperando.length) {
      const next = this.colaEsperando.shift();
      if (next) {
        // Forzamos un error entregando una página cerrada
        try { next((null as unknown) as Page); } catch {}
      }
    }

    // Cerrar páginas
    for (const e of this.pool) {
      try { await e.pagina.close(); } catch {}
    }
    this.pool = [];

    // Cerrar navegador
    if (this.navegador) {
      try { await this.navegador.close(); } catch {}
      this.navegador = null;
    }
  }
}
