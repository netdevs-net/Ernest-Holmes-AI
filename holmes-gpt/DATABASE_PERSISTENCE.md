# Database Persistence Guide

## Overview

The HolmesGPT application is configured to work with persistent database storage using Docker volumes. This ensures that your data persists across container restarts and deployments.

## Configuration Options

### 1. Default Configuration

- Database location: `/app/data/holmes.db` (inside container)
- Uses SQLite with WAL mode for better concurrency
- Automatically creates database directory if it doesn't exist

### 2. Custom Database Directory

You can specify a custom database directory using the `DB_DIR` environment variable:

```bash
# Docker run example
docker run -e DB_DIR=/custom/path -v /host/path:/custom/path ghcr.io/netdevs-net/holmes-gpt:latest

# Docker service example
docker service create \
  --name holmes-gpt \
  --env DB_DIR=/custom/path \
  --mount type=bind,source=/host/path,target=/custom/path \
  ghcr.io/netdevs-net/holmes-gpt:latest
```

### 3. Volume Mount Examples

#### Basic Volume Mount

```bash
docker run -v holmes-data:/app/data ghcr.io/netdevs-net/holmes-gpt:latest
```

#### Named Volume with Docker Swarm

```bash
docker service create \
  --name holmes-gpt \
  --mount type=volume,source=holmes-data,target=/app/data \
  ghcr.io/netdevs-net/holmes-gpt:latest
```

#### Bind Mount (Host Directory)

```bash
docker run -v /host/path/to/data:/app/data ghcr.io/netdevs-net/holmes-gpt:latest
```

## Health Check

The application includes a health check endpoint to monitor database status:

```bash
curl http://localhost:3000/api/health
```

Response example:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": {
    "status": "healthy",
    "path": "/app/data/holmes.db",
    "size": "2.45 MB"
  },
  "environment": {
    "nodeEnv": "production",
    "dbDir": "default",
    "cwd": "/app"
  }
}
```

## Database Schema

The application automatically creates the following tables if they don't exist:

- `questions` - Stores user questions and metadata
- `conversations` - Stores chat conversations
- `user_preferences` - Stores user preferences

All tables use `CREATE TABLE IF NOT EXISTS` to prevent conflicts with existing databases.

## Migration Safety

- The application uses SQLite's WAL (Write-Ahead Logging) mode for better concurrency
- Foreign key constraints are enabled
- Schema changes are additive and safe for existing data
- Database file is automatically created if it doesn't exist

## Troubleshooting

### Database Connection Issues

1. Check the health endpoint: `GET /api/health`
2. Verify volume mount permissions
3. Check container logs for database initialization messages

### Permission Issues

If you encounter permission errors:

```bash
# Ensure the data directory has correct permissions
chmod 755 /path/to/data
chown 1001:1001 /path/to/data  # svelte user in container
```

### Data Loss Prevention

- Always use volume mounts for production deployments
- Test volume mounts before deploying to production
- Monitor the health endpoint regularly
- Backup the database file periodically

## Environment Variables

| Variable   | Default      | Description                    |
| ---------- | ------------ | ------------------------------ |
| `DB_DIR`   | `/app/data`  | Custom database directory path |
| `NODE_ENV` | `production` | Node.js environment            |
| `PORT`     | `3000`       | Application port               |

## Best Practices

1. **Always use volume mounts** for production deployments
2. **Monitor the health endpoint** to ensure database connectivity
3. **Backup your database** regularly
4. **Test volume mounts** in staging before production
5. **Use named volumes** for easier management
6. **Set appropriate permissions** on host directories
