# 🐳 Frontend Docker Setup

Scripts y archivos de configuración para containerización del Frontend Angular.

## 📁 Archivos incluidos

- **`Dockerfile`**: Multi-stage build optimizado (Node.js build + Nginx production)
- **`nginx.conf`**: Configuración Nginx optimizada para SPA Angular
- **`.dockerignore`**: Exclusiones para optimizar contexto de build
- **`build.sh`**: Script de build automatizado
- **`run.sh`**: Script para ejecutar el contenedor

## 🏗️ Build de la imagen

```bash
# Desde el directorio raíz del Frontend
docker build -f docker/Dockerfile -t turnos-frontend:latest .

# O usando el script
cd docker && ./build.sh
```

## 🚀 Ejecutar contenedor

```bash
# Ejecutar en puerto 80
docker run -p 80:80 --name turnos-frontend turnos-frontend:latest

# O usando el script
cd docker && ./run.sh
```

## ⚙️ Configuración

### Environment Variables

Para diferentes entornos, puedes crear archivos de configuración específicos:

```bash
# Desarrollo
docker run -p 3000:80 -e ENV=development turnos-frontend:latest

# Producción  
docker run -p 80:80 -e ENV=production turnos-frontend:latest
```

### Nginx Proxy (Opcional)

Si necesitas hacer proxy al backend, descomenta las líneas en `nginx.conf`:

```nginx
location /api/ {
    proxy_pass http://backend:3000/api/;
    # ... resto de configuración
}
```

## 🔧 Optimizaciones incluidas

- ✅ Multi-stage build (Node build + Nginx serve)
- ✅ Gzip compression
- ✅ Cache headers optimizados
- ✅ Security headers
- ✅ Health check endpoint
- ✅ Rate limiting
- ✅ Non-root user
- ✅ Angular routing fallback

## 📊 Tamaño de imagen

- **Build stage**: ~500MB (solo para build, se descarta)
- **Production image**: ~25-30MB (nginx + assets)

## 🔍 Health Check

La imagen incluye un health check automático:

```bash
# Verificar estado del contenedor
docker ps --format "table {{.Names}}\t{{.Status}}"

# Logs de health check
docker logs turnos-frontend
```

## 🛠️ Desarrollo local

Para desarrollo, sigue usando `ng serve`. Docker es para producción/staging:

```bash
# Desarrollo
npm start

# Build local
npm run build

# Test de producción con Docker
docker build -f docker/Dockerfile -t turnos-frontend:test .
docker run -p 8080:80 turnos-frontend:test
```
