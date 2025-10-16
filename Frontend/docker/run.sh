#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🚀 RUN SCRIPT - Frontend Docker Container
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
IMAGE_NAME="turnos-frontend"
CONTAINER_NAME="turnos-frontend-container"
PORT=${1:-"3000"}
TAG=${2:-"latest"}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE} 🚀 Starting Frontend Container${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}📋 Container Information:${NC}"
echo -e "   Image: ${IMAGE_NAME}:${TAG}"
echo -e "   Container: ${CONTAINER_NAME}"
echo -e "   Port: ${PORT}:80"
echo ""

# Verificar si Docker está disponible
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker not found. Please install Docker first.${NC}"
    exit 1
fi

# Verificar si la imagen existe
if ! docker image inspect "${IMAGE_NAME}:${TAG}" &> /dev/null; then
    echo -e "${RED}❌ Error: Image ${IMAGE_NAME}:${TAG} not found.${NC}"
    echo -e "${YELLOW}💡 Build it first with: ./build.sh${NC}"
    exit 1
fi

# Detener y remover contenedor existente si existe
if docker container inspect "${CONTAINER_NAME}" &> /dev/null; then
    echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
    docker stop "${CONTAINER_NAME}" > /dev/null
    docker rm "${CONTAINER_NAME}" > /dev/null
fi

echo -e "${BLUE}🚀 Starting new container...${NC}"

# Ejecutar el contenedor
docker run -d \
    --name "${CONTAINER_NAME}" \
    --publish "${PORT}:80" \
    --restart unless-stopped \
    --health-cmd="curl -f http://localhost/health || exit 1" \
    --health-interval=30s \
    --health-timeout=3s \
    --health-retries=3 \
    "${IMAGE_NAME}:${TAG}"

# Verificar que el contenedor se inició correctamente
sleep 2

if docker container inspect "${CONTAINER_NAME}" --format '{{.State.Status}}' | grep -q "running"; then
    echo ""
    echo -e "${GREEN}✅ Container started successfully!${NC}"
    echo ""
    echo -e "${YELLOW}🌐 Access URLs:${NC}"
    echo -e "   Local:   ${GREEN}http://localhost:${PORT}${NC}"
    echo -e "   Health:  ${GREEN}http://localhost:${PORT}/health${NC}"
    echo ""
    echo -e "${YELLOW}📊 Container Status:${NC}"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

    echo ""
    echo -e "${YELLOW}🔧 Useful Commands:${NC}"
    echo -e "   Logs:    ${GREEN}docker logs ${CONTAINER_NAME}${NC}"
    echo -e "   Follow:  ${GREEN}docker logs -f ${CONTAINER_NAME}${NC}"
    echo -e "   Stop:    ${GREEN}docker stop ${CONTAINER_NAME}${NC}"
    echo -e "   Shell:   ${GREEN}docker exec -it ${CONTAINER_NAME} sh${NC}"

else
    echo -e "${RED}❌ Container failed to start!${NC}"
    echo -e "${YELLOW}📋 Container logs:${NC}"
    docker logs "${CONTAINER_NAME}"
    exit 1
fi
