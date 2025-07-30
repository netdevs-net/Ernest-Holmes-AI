#!/bin/bash

# Docker Secrets Setup Script for HolmesGPT
# This script helps set up Docker secrets for the remote deployment

echo "🔐 Setting up Docker Secrets for HolmesGPT"
echo "=========================================="

# Check if Docker Swarm is initialized
if ! docker info | grep -q "Swarm: active"; then
    echo "🐝 Initializing Docker Swarm..."
    docker swarm init
    echo "✅ Docker Swarm initialized"
else
    echo "✅ Docker Swarm is already active"
fi

# Check if .env file exists
if [ -f ".env" ]; then
    echo "📄 Found .env file, reading API key..."
    source .env
    API_KEY="$ANTHROPIC_API_KEY"
else
    echo "⚠️  No .env file found"
    echo "Please enter your Anthropic API key:"
    read -s API_KEY
fi

# Validate API key
if [ -z "$API_KEY" ] || [ "$API_KEY" = "your-anthropic-api-key-here" ]; then
    echo "❌ Invalid API key. Please check your .env file or enter a valid API key."
    exit 1
fi

# Remove existing secret if it exists
if docker secret ls | grep -q "anthropic_api_key"; then
    echo "🗑️  Removing existing secret..."
    docker secret rm anthropic_api_key
fi

# Create the secret
echo "🔑 Creating Docker secret 'anthropic_api_key'..."
echo "$API_KEY" | docker secret create anthropic_api_key -

if [ $? -eq 0 ]; then
    echo "✅ Docker secret 'anthropic_api_key' created successfully"
    echo ""
    echo "🚀 Now you can deploy the service with:"
    echo "docker service create \\"
    echo "  --name holmes-gpt \\"
    echo "  --secret anthropic_api_key \\"
    echo "  --publish 3000:3000 \\"
    echo "  ghcr.io/webdevs-net/holmes-gpt:latest"
    echo ""
    echo "📋 Or update existing service with:"
    echo "docker service update --image ghcr.io/webdevs-net/holmes-gpt:latest holmes-gpt"
else
    echo "❌ Failed to create Docker secret"
    exit 1
fi

echo ""
echo "🔍 To verify the secret was created:"
echo "docker secret ls"
echo ""
echo "🔍 To inspect the secret:"
echo "docker secret inspect anthropic_api_key" 