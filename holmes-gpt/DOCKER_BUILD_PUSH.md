# Docker Build and Push Guide

This guide explains how to build and push the HolmesGPT Docker image to GitHub Container Registry (ghcr.io).

## Prerequisites

1. **Docker Desktop** installed and running
2. **GitHub Personal Access Token** with `write:packages` permission
3. **GitHub CLI** (optional, for easier authentication)

## Authentication

### Option 1: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh

# Login to GitHub
gh auth login

# Login to GitHub Container Registry
gh auth token | docker login ghcr.io -u USERNAME --password-stdin
```

### Option 2: Manual Login

```bash
# Login to GitHub Container Registry
docker login ghcr.io
# Enter your GitHub username and Personal Access Token
```

## Building and Pushing

### Option 1: Using the Build Script (Recommended)

```bash
# Make the script executable (if not already done)
chmod +x build-and-push.sh

# Run the build and push script
./build-and-push.sh
```

### Option 2: Manual Commands

```bash
# Build the image
docker build -t ghcr.io/netdevs-net/holmes-gpt:latest .

# Tag with timestamp
docker tag ghcr.io/netdevs-net/holmes-gpt:latest ghcr.io/netdevs-net/holmes-gpt:$(date +%Y%m%d-%H%M%S)

# Push to registry
docker push ghcr.io/netdevs-net/holmes-gpt:latest
docker push ghcr.io/netdevs-net/holmes-gpt:$(date +%Y%m%d-%H%M%S)
```

## GitHub Actions (Automated)

The repository includes a GitHub Actions workflow (`.github/workflows/docker-build-push.yml`) that automatically builds and pushes the image when:

- Code is pushed to `main` or `master` branch
- A tag starting with `v` is pushed (e.g., `v1.0.0`)
- A pull request is opened against `main` or `master`
- The workflow is manually triggered

### Manual Trigger

1. Go to the GitHub repository
2. Navigate to Actions tab
3. Select "Build and Push Docker Image"
4. Click "Run workflow"

## Image Tags

The following tags are automatically created:

- `latest` - Latest build from main branch
- `main` - Latest build from main branch
- `v1.0.0` - Semantic version tags
- `main-sha-abc123` - Branch with commit SHA
- `pr-123` - Pull request builds

## Pulling the Image

```bash
# Pull the latest version
docker pull ghcr.io/netdevs-net/holmes-gpt:latest

# Pull a specific version
docker pull ghcr.io/netdevs-net/holmes-gpt:v1.0.0
```

## Running the Image

```bash
# Run with Docker Compose
docker-compose up -d

# Run directly with Docker
docker run -d \
  --name holmes-gpt \
  -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your-api-key \
  ghcr.io/netdevs-net/holmes-gpt:latest
```

## Troubleshooting

### Permission Denied

```bash
# Ensure you have write:packages permission in your GitHub token
# Go to GitHub Settings > Developer settings > Personal access tokens
# Create a new token with 'write:packages' scope
```

### Authentication Failed

```bash
# Re-login to ghcr.io
docker logout ghcr.io
docker login ghcr.io
```

### Build Fails

```bash
# Check Docker is running
docker info

# Clean up Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t ghcr.io/netdevs-net/holmes-gpt:latest .
```

## Viewing the Image

- **GitHub Packages**: https://github.com/netdevs-net/holmes-gpt/packages
- **Docker Hub**: Not applicable (using ghcr.io)

## Security Notes

- The image is built with a non-root user for security
- Sensitive data (API keys) should be passed as environment variables
- The image includes only production dependencies
- Multi-stage build reduces final image size
