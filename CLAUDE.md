# Image Watermark — Capstone Project

## Project explanation

The idea and explanation of the algorithm is on ./algorithm.pdf

The capstone report is **[Report.md](Report.md)** — problem/relevance, the USC-SIPI dataset, metrics, the experimental analysis (Additive/LSB/SVD baseline comparison, NCC *lift over a zero-embedding control*, imperceptibility), the threat model / use cases, and the rationale for design decisions (e.g. why the Walsh-Hadamard transform was removed and why the default embedding strength is α = 0.01). Read it when reasoning about the method's behaviour, results, or limitations.

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
- **[marking-module](marking-module/CLAUDE.md)** — Stateless FastAPI service that embeds/extracts invisible watermarks using block-wise SVD.

## Keeping documentation in sync

When making changes that affect a subproject's architecture, conventions, or rules, update the corresponding `CLAUDE.md` file in the same commit. This includes (but is not limited to): new layers or patterns, changes to testing rules, modified API contracts, or updated tooling.

## Committing and pushing

Do not run `git commit` or `git push` unless the user explicitly requests it **in that same message**. Approval from an earlier message does not carry forward — treat every commit and every push as needing its own explicit, current instruction.

## Running locally

```bash
docker compose up
```

Environment variables are in root `.env` (not committed). Each subproject has its own `.env.example`.
