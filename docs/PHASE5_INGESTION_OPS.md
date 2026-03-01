# Phase 5 — Ingestion Operations Guide

> **Scope**: Backend ingestion pipeline using Redis + BullMQ async jobs.
> **Prerequisite**: Phase 4 (Prisma schema, CRUD endpoints) must be complete.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection (Supabase pooler recommended) |
| `DIRECT_URL` | Optional | Direct Postgres connection (bypasses pgBouncer) |
| `REDIS_URL` | ✅ | Redis connection string (Upstash, local, etc.) |
| `INGEST_ENABLED` | ✅ | Set to `"true"` to enable ingestion endpoints |
| `PEXELS_API_KEY` | ✅ | Pexels API key for image fallback |
| `WORKER_MODE` | Worker only | Set to `"true"` when running the worker process |
| `GCS_PROJECT_ID` | ✅ | Google Cloud project ID |
| `GCS_BUCKET` | ✅ | GCS bucket name for image storage |
| `GOOGLE_APPLICATION_CREDENTIALS` | ✅ | Path to GCS service-account JSON |

## Architecture

```
POST /jobs/ingest-pack/:id → BullMQ Queue → Worker (OG + Pexels) → DB
GET /jobs/:jobId            → BullMQ Job status
GET /pins                   → DB only (no external calls)
```

- **API process** (`npm run start:dev`): Enqueues jobs, serves feed reads
- **Worker process** (`npm run worker`): Processes BullMQ jobs in background
- External calls (HTML fetch, Pexels) happen **only** in the worker

## Rate Limiting

| Endpoint | Limit |
|---|---|
| `POST /packs` | 10/min |
| `POST /packs/:id/items` | 30/min |
| `POST /jobs/ingest-pack/:id` | 10/min |

> Storage: Redis-backed via `@nestjs/throttler`. Falls back to in-memory if `REDIS_URL` is not set.

## Operational Commands (Windows)

### 1. Start API + Worker

```powershell
cd backend
npm run start:dev          # Terminal 1: API server on :4000
npm run worker             # Terminal 2: BullMQ worker
```

### 2. Seed 1000+ URLs

```powershell
cd backend
npm run seed:packs
```

Creates 5 packs × ~200 URLs each:
- Web Design & UI/UX
- Tech & AI Ecosystem
- DevOps & Cloud
- Creative Tools & Media
- Education & Security

### 3. Ingest Packs (async)

```powershell
cd backend
npm run ingest:packs
```

Enqueues ingestion jobs for each pack. Polls until completion. Prints summary counts.

### 4. Verify Pin Count

```powershell
cd backend
npx prisma studio
```

Open Prisma Studio in browser → navigate to `Pin` table → verify count ≥ 1000.

### 5. Verify DB-Only Feed

```powershell
Invoke-RestMethod -Uri http://localhost:4000/pins?limit=20
```

- Responses should be fast (no external fetch)
- No `[INGEST external fetch]` log lines should appear in the API terminal
- Those log lines only appear in the **worker** terminal during ingestion

## Ingestion Pipeline Flow

1. `POST /jobs/ingest-pack/:id` → validates pack exists, enqueues BullMQ job
2. Worker picks up job:
   - Fetches HTML for each pending pack item (`[INGEST external fetch]` logged)
   - Extracts OG metadata (title, description, image)
   - Canonicalizes URL (strips tracking params, resolves redirects)
   - Checks image quality (HEAD request for dimensions)
   - Falls back to Pexels if image is missing/low-quality
   - Creates Pin row (deduplicates by `canonicalUrl`)
   - Updates CuratedPackItem status to `ingested` or `failed`
3. `GET /jobs/:jobId` → returns `{ id, status, progress, result, error }`

## Guardrails

- `INGEST_ENABLED` must be `"true"` or all ingestion endpoints return 403
- No secrets are logged or committed
- `GET /pins` service (`pins.service.ts`) imports **zero** ingestion modules
- Worker logs `[INGEST external fetch]` for every external call (traceable)

## GCS Credentials

> [!CAUTION]
> GCS service account JSON must be local-only and gitignored (`backend/credentials/*`).
> Never commit credential files to the repository.

GCS vars are reserved for future image storage integration; current ingestion stores `imageUrl`/`attributionText` in DB.
