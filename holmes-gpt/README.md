# HolmesAI

A conversational AI practitioner inspired by Ernest Holmes, author of *The Science of Mind*.
SvelteKit 2 · Svelte 5 (runes) · Tailwind 4 · SQLite · Claude (Anthropic API) · Satoshi.

## Develop

```bash
cp env.example .env      # add ANTHROPIC_API_KEY and ADMIN_PASSWORD
npm ci
npm run dev              # http://localhost:3000
npm run check && npm run test:run && npm run build
```

## Structure

```
src/
  app.css                  design tokens (light "paper" / dark "twilight") + shared classes
  hooks.server.ts          visitor session cookie, admin guard, security headers
  lib/
    components/            Header, Composer, Thread, Message, Dialog, panels…
    state/                 rune-based state: chat, history, theme, preferences, ui
    data/treatments.ts     ready-made mind treatments
    utils/                 safe markdown renderer, time, storage helpers
    server/                claude (streaming), gate (limits), security, db/, prompts
  routes/
    +page.svelte           home: greeting, composer, suggestions, cards → conversation
    about | support | privacy | admin
    api/chat               streamed answer (text/plain), saves the exchange
    api/treatment          streamed personal treatment
    api/history[/id]       the visitor's own questions (session-scoped)
    api/quotes | emails | health | security | admin/*
static/fonts/              Satoshi variable (self-hosted; see FFL.txt for the licence)
```

## Behaviour worth knowing

- **Identity:** a server-issued httpOnly cookie (`holmes_sid`) scopes each visitor's history. No fingerprinting.
- **Limits (per IP):** 10 questions / 15 min, 50 / day, 50k tokens / day — see `lib/server/security.ts`.
- **Behind a proxy:** set `ADDRESS_HEADER`, `XFF_DEPTH`, `PROTOCOL_HEADER`, `HOST_HEADER` (see `env.example`), otherwise every visitor shares the proxy's IP and rate limit.
- **Admin:** `/admin` (password `ADMIN_PASSWORD`, signed 7-day cookie, login throttled). `GET /api/security` with `Authorization: Bearer $SECURITY_TOKEN` returns safeguard metrics.
- **Data:** SQLite at `$DB_DIR/holmes.db` (default `./data`). Quotes come from `downloads/training_data/*.json`.

Older notes in `docs/` describe the pre-redesign app and are historical.
