# ───── Stage build ───────────────────────────────────────────────
FROM node:22-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build                                    # genera dist/
RUN mkdir -p dist/template && cp -r src/template/* dist/template/

# (Debug opcional: elimina después de verificar)
RUN echo "── LISTADO COMPLETO DE /app/dist:" && ls -R /app/dist | head

# ───── Stage production ─────────────────────────────────────────
FROM node:22-slim AS production
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist /app/dist

RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/index.js"]
