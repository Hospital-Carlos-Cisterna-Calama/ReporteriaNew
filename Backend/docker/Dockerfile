# ───── Stage build ───────────────────────────────────────────────
FROM node:22-slim AS build

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar TODAS las dependencias (incluidas dev) para el build
RUN pnpm install --frozen-lockfile --include-workspace-root

# Copiar código fuente
COPY . .

# Generar build usando el script definido en package.json
RUN pnpm run build

# Copiar templates si existen
RUN mkdir -p dist/template && cp -r src/template/* dist/template/ 2>/dev/null || true

# (Debug opcional: elimina después de verificar)
RUN echo "── LISTADO COMPLETO DE /app/dist:" && ls -R /app/dist | head

# ───── Stage production ─────────────────────────────────────────
FROM node:22-slim AS production

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar archivos de dependencias y build
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/dist /app/dist

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/index.js"]
