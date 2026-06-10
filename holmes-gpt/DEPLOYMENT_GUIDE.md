# HolmesGPT Deployment Guide

## Overview

This guide explains how to deploy HolmesGPT to your remote server with proper Docker secrets configuration.

## Prerequisites

- Docker installed on remote server
- Access to GitHub Container Registry (ghcr.io/netdevs-net/holmes-gpt)
- Anthropic API key

## Docker Secrets Configuration

### What are Docker Secrets?

Docker secrets are encrypted files that contain sensitive data (like API keys) and are mounted into containers at runtime. They are more secure than environment variables because:

- They are encrypted at rest
- They are only accessible to services that explicitly request them
- They are not visible in container inspection or logs

### Current Setup

The application is configured to read the Anthropic API key from:

1. **Docker Secret** (primary): `/run/secrets/anthropic_api_key`
2. **Environment Variable** (fallback): `ANTHROPIC_API_KEY`

## Deployment Steps

### Step 1: Set Up Docker Secrets (Local/Remote)

#### Option A: Using the Setup Script

```bash
# Make sure you're in the holmes-gpt directory
cd holmes-gpt

# Run the setup script
./setup-docker-secrets.sh
```

#### Option B: Manual Setup

```bash
# Initialize Docker Swarm (if not already done)
docker swarm init

# Create the secret (replace YOUR_API_KEY with your actual key)
echo "YOUR_API_KEY" | docker secret create anthropic_api_key -

# Verify the secret was created
docker secret ls
```

### Step 2: Deploy the Service

#### For New Deployment:

```bash
docker service create \
  --name holmes-gpt \
  --secret anthropic_api_key \
  --publish 3000:3000 \
  --replicas 1 \
  ghcr.io/netdevs-net/holmes-gpt:latest
```

#### For Existing Service Update:

```bash
# Pull the latest image
docker pull ghcr.io/netdevs-net/holmes-gpt:latest

# Update the service
docker service update --image ghcr.io/netdevs-net/holmes-gpt:latest holmes-gpt
```

### Step 3: Verify Deployment

```bash
# Check service status
docker service ls

# Check service logs
docker service logs holmes-gpt

# Check if the secret is properly mounted
docker exec -it $(docker ps -q --filter "name=holmes-gpt") ls -la /run/secrets/
```

## Troubleshooting

### Common Issues

#### 1. 500 Error on /api/chat

**Symptoms:** Browser shows "Failed to load resource: the server responded with a status of 500 () api/chat"

**Causes:**

- Missing or invalid API key
- Docker secret not properly mounted
- Service not updated with latest image

**Solutions:**

```bash
# Check if secret exists
docker secret ls

# Check service logs for API errors
docker service logs holmes-gpt

# Verify the secret is mounted
docker exec -it $(docker ps -q --filter "name=holmes-gpt") cat /run/secrets/anthropic_api_key

# Update service with latest image
docker service update --image ghcr.io/netdevs-net/holmes-gpt:latest holmes-gpt
```

#### 2. Service Won't Start

**Symptoms:** Service shows "Rejected" or "Failed" status

**Solutions:**

```bash
# Check service details
docker service ps holmes-gpt

# Check for resource constraints
docker system df

# Restart the service
docker service update --force holmes-gpt
```

#### 3. API Key Not Found

**Symptoms:** Logs show "Docker secret not found, using environment variable"

**Solutions:**

```bash
# Recreate the secret
docker secret rm anthropic_api_key
echo "YOUR_API_KEY" | docker secret create anthropic_api_key -

# Update the service to use the new secret
docker service update --secret-add anthropic_api_key holmes-gpt
```

## Security Best Practices

### 1. API Key Management

- Never commit API keys to version control
- Use Docker secrets instead of environment variables
- Rotate API keys regularly
- Use least-privilege access for API keys

### 2. Container Security

- Run containers as non-root user (already configured)
- Keep base images updated
- Scan images for vulnerabilities
- Use multi-stage builds (already implemented)

### 3. Network Security

- Use reverse proxy (nginx/traefik) for SSL termination
- Restrict container network access
- Use internal networks for service communication

## Monitoring and Logs

### View Service Logs

```bash
# Real-time logs
docker service logs -f holmes-gpt

# Last 100 lines
docker service logs --tail 100 holmes-gpt

# Logs with timestamps
docker service logs -t holmes-gpt
```

### Monitor Service Health

```bash
# Service status
docker service ls

# Service details
docker service inspect holmes-gpt

# Resource usage
docker stats
```

## Environment Variables

The application supports these environment variables as fallbacks:

| Variable            | Description                  | Default      |
| ------------------- | ---------------------------- | ------------ |
| `ANTHROPIC_API_KEY` | Anthropic API key (fallback) | None         |
| `NODE_ENV`          | Node environment             | `production` |
| `PORT`              | Application port             | `3000`       |

## API Endpoints

| Endpoint         | Method | Description           |
| ---------------- | ------ | --------------------- |
| `/api/chat`      | POST   | Main chat API with AI |
| `/api/questions` | GET    | Get question history  |
| `/api/quotes`    | GET    | Get Holmes quotes     |
| `/api/stats`     | GET    | Get usage statistics  |

## Support

If you encounter issues:

1. Check the service logs: `docker service logs holmes-gpt`
2. Verify Docker secrets: `docker secret ls`
3. Test the API locally first
4. Check the browser console for client-side errors
