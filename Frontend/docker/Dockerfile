# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🏗️  FRONTEND DOCKERFILE - Angular 20 + Tailwind CSS + pnpm
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Descripción: Multi-stage build optimizado para producción
# - Stage 1: Build Angular app con todas las dependencias usando pnpm
# - Stage 2: Servir con nginx optimizado para SPA
# Comandos disponibles:
#   • build:prod (producción optimizada)
#   • build:devdist (desarrollo optimizado)
#   • build:analyze (análisis de bundles)
# Autor: Sistema TurnosNew
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Argumento para elegir el comando de build (por defecto producción)
ARG BUILD_COMMAND=build:prod

# ───── Stage 1: Build Angular Application ──────────────────────────────────────
FROM node:22-alpine AS build

# Metadata de la imagen
LABEL maintainer="TurnosNew Team"
LABEL description="Frontend Angular 20 para Sistema de Turnos Hospitalarios"
LABEL version="1.0.0"

# Establecer directorio de trabajo
WORKDIR /app

# Instalar pnpm globalmente (más rápido que npm)
RUN npm install -g pnpm@latest

# Optimización de capas: copiar package files primero para aprovechar cache de Docker
COPY package*.json pnpm-lock.yaml ./

# Instalar dependencias (usar pnpm para mejor performance)
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build usando el comando especificado (por defecto build:prod)
RUN echo "🚀 Ejecutando: pnpm run build:prod" && \
    pnpm run build:prod && \
    echo "✅ Build completado."

# Verificar que el build fue exitoso
RUN echo "🔍 Verificando estructura final:" && \
    echo "📂 Contenido del directorio raíz:" && ls -la . && \
    echo "" && \
    echo "📂 Estructura completa de dist:" && \
    (ls -laR dist/ || echo "❌ dist no existe") && \
    echo "" && \
    echo "📂 Buscando index.html:" && \
    (find . -name "index.html" || echo "❌ No se encontró index.html") && \
    echo "" && \
    echo "📦 Verificación completada"

# ───── Stage 2: Production Nginx Server ────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Instalar dependencias adicionales si es necesario
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

# Copiar archivos built desde la stage anterior (Angular genera en dist/Frontend/browser con F mayúscula)
COPY --from=build /app/dist/Frontend/browser /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY --from=build /app/docker/nginx.conf /etc/nginx/nginx.conf

# Configurar permisos básicos
RUN chmod -R 755 /usr/share/nginx/html

# Health check para monitoreo
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
