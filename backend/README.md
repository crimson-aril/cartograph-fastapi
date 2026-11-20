# Cartograph FastAPI backend

FastAPI is the primary API for repository submission. The Next.js app remains
the frontend and keeps its existing submission action as a fallback. The
analysis runner still uses Cartograph's TypeScript parser so the map keeps the
same parser and database contract during this migration.

The WSL environment needs Python 3.14, `uv`, Node.js, and the root pnpm
dependencies. The `dev:api` command creates a separate WSL virtual environment
and syncs the Python lockfile when run there.

This is an application project, so `uv` installs its dependencies without
building the FastAPI source as a distributable Python package.

## Run locally

From the repository root, start the API in WSL:

```bash
pnpm dev:api
```

The WSL script uses `backend/.venv-wsl` so it does not reuse the Windows
virtual environment that may exist in the shared workspace.

In another terminal, start the web app:

```bash
pnpm dev
```

The API listens on `http://127.0.0.1:8000`. OpenAPI docs are at
`http://127.0.0.1:8000/api/docs`; the health endpoint is
`http://127.0.0.1:8000/api/health`.

The FastAPI process reads the root `.env.local` and uses its existing Clerk and
Supabase credentials. For local development, `FASTAPI_URL` defaults to
`http://127.0.0.1:8000` and `CLERK_AUTHORIZED_PARTIES` defaults to
`http://localhost:3000`, so neither needs to be added to `.env.local`.

`CLERK_JWT_KEY` is also optional. If set, use Clerk's public PEM key to avoid
fetching signing keys at runtime. Set `CLERK_AUTHORIZED_PARTIES` when the
frontend uses a different origin; it accepts a comma-separated list. For
production, add the production origin and use an HTTPS `FASTAPI_URL`. The
Supabase service key is used only after Clerk verifies the session, and the
organization ID always comes from the verified session claim.

## Current API

- `POST /api/v1/analyses` accepts `{ "repository_url": "owner/repo" }` and
  returns `{ "analysis_id": "...", "created": true }`.
- `GET /api/health` is an unauthenticated process health check.

New submissions are persisted by FastAPI, then the existing TypeScript
analysis command runs in a FastAPI background task. The Next.js action calls
FastAPI first and falls back to its existing pipeline if the API cannot be
reached. Reads, reruns, and AI actions still run through Next.js and can be
migrated in later slices.

This bridge expects the FastAPI service to run from the Cartograph monorepo
with Node.js and the root dependencies available. It keeps parsing behavior
unchanged while the API boundary moves; it does not yet make the Python service
independently deployable.
