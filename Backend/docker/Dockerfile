# ───── Stage build ───────────────────────────────────────────────
FROM node:22-slim AS build
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# Copiar archivos de dependencias (pnpm usa pnpm-lock.yaml)
COPY package*.json pnpm-lock.yaml ./

# Instalar dependencias con pnpm (sin frozen-lockfile para resolver incompatibilidades)
RUN pnpm install

COPY . .

# Build del proyecto con debug
RUN echo "🔍 Listando archivos src:" && \
    ls -la src/ && \
    echo "📋 Verificando tsconfig.json:" && \
    cat tsconfig.json && \
    echo "🚀 Ejecutando build:" && \
    pnpm run build

# Copiar templates si existen
RUN mkdir -p dist/reportTemplates && \
    if [ -d "src/reportTemplates" ]; then \
        cp -r src/reportTemplates/* dist/reportTemplates/; \
    fi

# Debug opcional
RUN echo "── LISTADO COMPLETO DE /app/dist:" && ls -R /app/dist | head -20

# ───── Stage production ─────────────────────────────────────────
# Usamos la imagen oficial de Puppeteer que ya trae Chromium y dependencias del sistema
FROM ghcr.io/puppeteer/puppeteer:latest AS production
WORKDIR /app

# Nota: Permitimos que Puppeteer maneje la instalación del navegador en postinstall
# (no configuramos PUPPETEER_SKIP_CHROMIUM_DOWNLOAD ni PUPPETEER_EXECUTABLE_PATH)
USER root

# Copiar archivos de dependencias y código compilado
COPY --from=build /app/package*.json /app/pnpm-lock.yaml ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Usar pnpm en producción (Corepack) y permitir postinstall (Puppeteer descarga Chrome si es necesario)
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --frozen-lockfile

# Instalar el navegador en la imagen (evita depender de descargas en runtime)
ENV PUPPETEER_PRODUCT=chrome
RUN npx puppeteer browsers install chrome

# Limpieza básica sin tocar la caché de Puppeteer (necesaria para el navegador)
RUN rm -rf /root/.npm /root/.pnpm-store /home/pptruser/.npm /home/pptruser/.pnpm-store || true

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=80

# Exponer puerto 80
EXPOSE 80

# Health check simplificado (sin curl) - apunta a /healthz expuesto por la app
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:80/healthz', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Ejecutar como root para poder bindear al puerto 80
USER root

# Comando de inicio
CMD ["node", "dist/index.js"]
