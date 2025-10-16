#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🏗️ BUILD SCRIPT - Frontend Docker Image
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
TAG=${1:-"latest"}
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE} 🏗️  Building Frontend Docker Image${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}📋 Build Information:${NC}"
echo -e "   Image: ${IMAGE_NAME}:${TAG}"
echo -e "   Date:  ${BUILD_DATE}"
echo -e "   Context: $(pwd)/../"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "../package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the docker/ directory${NC}"
    exit 1
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker not found. Please install Docker first.${NC}"
    exit 1
fi

# Determinar comando de build según el tag
BUILD_COMMAND="build:prod"
case "${TAG}" in
    "dev"|"development")
        BUILD_COMMAND="build:devdist"
        ;;
    "analyze")
        BUILD_COMMAND="build:analyze"
        ;;
    *)
        BUILD_COMMAND="build:prod"
        ;;
esac

echo -e "${BLUE}🔧 Building image with command: pnpm run ${BUILD_COMMAND}${NC}"

# Build de la imagen
docker build \
    --file ./Dockerfile \
    --tag "${IMAGE_NAME}:${TAG}" \
    --tag "${IMAGE_NAME}:latest" \
    --build-arg BUILD_DATE="${BUILD_DATE}" \
    --build-arg BUILD_COMMAND="${BUILD_COMMAND}" \
    --progress=plain \
    ..

# Verificar que el build fue exitoso
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📊 Image Information:${NC}"
    docker images "${IMAGE_NAME}:${TAG}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

    echo ""
    echo -e "${YELLOW}🚀 To run the container:${NC}"
    echo -e "   ${GREEN}docker run -p 80:80 --name turnos-frontend-container ${IMAGE_NAME}:${TAG}${NC}"
    echo ""
    echo -e "${YELLOW}🔍 To inspect the image:${NC}"
    echo -e "   ${GREEN}docker run --rm -it --entrypoint sh ${IMAGE_NAME}:${TAG}${NC}"

else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
