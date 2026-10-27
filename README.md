# Holmes AI

**Ask Ernest Holmes a question and get an answer in his own voice, sourced from his own writing.**

[ernestholmes.us](https://ernestholmes.us) · Version 2.0

Ernest Holmes (1887–1960) founded Religious Science and wrote the texts that Centers for Spiritual Living still teach from. Holmes AI puts those writings behind a conversation: you bring a question, and the answer comes back in his 1920s–40s cadence — or in plain modern language, if that lands better.

Built for CSL members, Science of Mind students, and anyone who has picked up *The Science of Mind* and wanted to ask it something back.

---

## How it works

Holmes AI is not a fine-tuned model. It is Claude Haiku 4.5 steered by two things:

1. **Persona prompts** that fix the voice, the vocabulary (Principle, Infinite Mind, Spiritual Law) and the shape of an answer. `HOLMES_PROMPT` for his own cadence, `MODERN_PROMPT` for contemporary language, chosen per request.
2. **A quote library** drawn from his books, so answers can cite his actual sentences instead of paraphrasing from memory.

The corpus was assembled offline. `downloads/` holds the Python scrapers and the processed source texts — **463,148 words** across *Creative Mind and Success* (1919), *The Hidden Power of the Bible* (1929), *The Science of Mind* (1938), *This Thing Called You* (1948) and *Words That Heal Today* (1949). `downloads/training_data/` holds what the running app actually reads: quote, Q&A, treatment and explanation sets extracted from those texts.

That split matters for what the app will and won't do. It serves quotes it has rather than inventing new ones; where it has nothing to cite, it answers in voice without a citation.

---

## What it does

- **Two voices** — "In His Words" for Holmes' own cadence, "Modern" for plain contemporary language.
- **Source citations** on quoted material, traceable back to a book.
- **Treatment generator** — builds a Science of Mind spiritual mind treatment around the question asked.
- **Question history** with bookmarking, search, filtering and automatic tagging by category.
- **Quotes browser** over the Holmes quote library.
- **Email sharing** of an answer or a treatment.
- **Admin view** for reviewing submitted questions.
- **Light and dark themes**, keyboard navigable, WCAG AA.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit 2 on Svelte 5 (runes) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Model | Claude Haiku 4.5 via `@anthropic-ai/sdk` |
| Storage | SQLite via `better-sqlite3` |
| Build | Vite 8, `@sveltejs/adapter-node` |
| Tests | Vitest + Testing Library |
| Deploy | Docker (Node 20 alpine) behind nginx |

---

## Running it

Node 20+.

```bash
cd holmes-gpt
npm install
cp env.example .env   # then add your Anthropic key
npm run dev
```

The SQLite database is created on first run.

### Environment

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Model access |
| `ANTHROPIC_MODEL` | no | Override the default model id |
| `DB_DIR` | no | SQLite location |
| `ADMIN_PASSWORD` | no | Enables the `/admin` view |
| `SECURITY_TOKEN` | no | Bearer token for `GET /api/security` metrics |

### Docker

```bash
cd holmes-gpt
docker compose -f docker-compose.local.yml up --build
```

Serves on `:3015`, with the database on a named volume so it survives a rebuild.

### Checks

```bash
npm run check     # svelte-check
npm run lint      # prettier + eslint
npm run test:run  # vitest
```

---

## Abuse controls

The app calls a paid API from an unauthenticated public page, so the server enforces its own ceilings before a request reaches the model:

| Limit | Value |
|---|---|
| Requests per 15 minutes | 10 |
| Requests per day | 50 |
| Tokens per day | 50,000 |
| Max message length | 1,000 characters |

Alongside those: user-agent bot detection, a 10/hour cap on email sends, 5 admin login attempts per 10 minutes, constant-time password comparison, and counters for requests, rate-limit hits, bot detections and spend, exposed at `GET /api/security` behind a bearer token.

---

## Layout

```
holmes-gpt/
├── src/
│   ├── lib/
│   │   ├── server/      # claude.ts, prompts.ts, knowledge.ts,
│   │   │                # security.ts, gate.ts, classify.ts, db/
│   │   ├── components/  # Svelte UI
│   │   ├── state/       # runes-based stores
│   │   └── data/        # treatment templates
│   └── routes/
│       ├── api/         # chat, quotes, treatment, history,
│       │                # emails, admin, security, health
│       └── …            # about, support, privacy, admin
├── downloads/           # corpus + Python processing scripts
└── resources/           # source and provenance notes
docs/                    # design and implementation notes
```

---

## License

Private and proprietary. All rights reserved.

Not affiliated with or endorsed by Centers for Spiritual Living.
