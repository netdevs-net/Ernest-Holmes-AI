#!/bin/bash

# Build and Push Script for HolmesGPT Docker Image
# This script builds the Docker image and pushes it to ghcr.io/webdevs-net/holmes-gpt

set -e

# Configuration
REGISTRY="ghcr.io"
IMAGE_NAME="webdevs-net/holmes-gpt"
FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}"

echo "🐳 Building and pushing HolmesGPT Docker image"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if user is logged in to ghcr.io (optional check)
echo "🔐 Checking authentication to GitHub Container Registry..."
if docker pull ghcr.io/webdevs-net/holmes-gpt:latest > /dev/null 2>&1; then
    echo "✅ Authentication successful"
else
    echo "⚠️  Authentication check failed, but proceeding with build..."
    echo "   If push fails, ensure you're logged in with: docker login ghcr.io"
fi

# Build the image
echo "🔨 Building Docker image..."
docker build -t "${FULL_IMAGE_NAME}:latest" .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Docker build failed"
    exit 1
fi

# Tag with current timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
docker tag "${FULL_IMAGE_NAME}:latest" "${FULL_IMAGE_NAME}:${TIMESTAMP}"

# Push both latest and timestamped versions
echo "📤 Pushing Docker image to ghcr.io..."
docker push "${FULL_IMAGE_NAME}:latest"
docker push "${FULL_IMAGE_NAME}:${TIMESTAMP}"

if [ $? -eq 0 ]; then
    echo "✅ Docker image pushed successfully"
    echo ""
    echo "📋 Image details:"
    echo "   Latest: ${FULL_IMAGE_NAME}:latest"
    echo "   Timestamped: ${FULL_IMAGE_NAME}:${TIMESTAMP}"
    echo ""
    echo "🚀 You can now pull the image with:"
    echo "   docker pull ${FULL_IMAGE_NAME}:latest"
    echo ""
    echo "🔍 View the image on GitHub:"
    echo "   https://github.com/webdevs-net/holmes-gpt/packages"
else
    echo "❌ Docker push failed"
    exit 1
fi 