# Deploying HolmesGPT

Production runs on **kamatera1** as a plain Docker Compose service (no swarm), from the image
`ghcr.io/netdevs-net/holmes-gpt:latest`. ernestholmes.us goes through Cloudflare straight to
origin port **5544**.

## Deploy

Run the **Build and Push Docker Image** workflow (Actions → Run workflow). It:

1. runs the type check and the tests;
2. builds and pushes `:latest`, `:main` and `:main-<sha>` to GHCR;
3. on the self-hosted runner on kamatera1, runs `docker compose pull` and `up -d` with
   [`docker-compose.yml`](docker-compose.yml), then waits for the app to answer on `127.0.0.1:5544`.

## Server files

The workflow uses the compose file from its checkout. The project directory is
`/srv/projects/holmes-gpt` (`root:actions-runner`, mode `0750`), which holds the two files
that never go in git:

| File | Contents | Owner / mode |
|---|---|---|
| `.env` | `ADMIN_PASSWORD=...` | `root:actions-runner` `0640` |
| `secrets/anthropic_api_key` | the Anthropic API key, one line | uid `1001` (`svelte` in the image) `0400` |

Compose mounts the key at `/run/secrets/anthropic_api_key`. The app reads that path first and
falls back to `ANTHROPIC_API_KEY` (`src/lib/server/claude.ts`).

To rotate the key, put the new value in `secrets/anthropic_api_key` (same owner and mode) and
recreate the container:

```bash
cd /srv/projects/holmes-gpt && docker compose -f <checkout>/holmes-gpt/docker-compose.yml --project-directory . up -d --force-recreate
```

## Data

SQLite lives in the external volume `holmes-gpt-data`, mounted at `/app/data`. `docker compose down`
does not remove it. The host's b-kopia job backs it up to B2 every night.

## Manual commands on kamatera1

```bash
C="docker compose -f /path/to/checkout/holmes-gpt/docker-compose.yml --project-directory /srv/projects/holmes-gpt"
$C ps
$C logs --tail 100
$C restart
```

The app logs only failed requests (4xx/5xx), so a quiet log does not mean no traffic.

## Local

`docker-compose.local.yml` builds from source and serves on `localhost:3015`, using `.env` for the key.
