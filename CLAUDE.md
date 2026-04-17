# Image Watermark — Capstone Project

Three-service stack orchestrated by `docker-compose.yaml`.

| Service | Port | Role |
|---|---|---|
| `frontend` | 5173 | React SPA |
| `laravel` | 8080 | REST API + business logic |
| `backend` | 8000 | Python watermarking microservice |
| `db` | 3306 | MariaDB 11 |

## Subprojects

- **[react-front](react-front/CLAUDE.md)** — User-facing dashboard (upload images/watermarks, trigger engravings/extractions, view results).
- **[laravel-backend](laravel-backend/CLAUDE.md)** — Manages users, file storage, DB records, and orchestrates calls to the marking module.
- **[marking-module](marking-module/CLAUDE.md)** — Stateless FastAPI service that embeds/extracts invisible watermarks using SVD + Walsh-Hadamard transforms.

## Keeping documentation in sync

When making changes that affect a subproject's architecture, conventions, or rules, update the corresponding `CLAUDE.md` file in the same commit. This includes (but is not limited to): new layers or patterns, changes to testing rules, modified API contracts, or updated tooling.

## Running locally

```bash
docker compose up
```

Environment variables are in root `.env` (not committed). Each subproject has its own `.env.example`.
