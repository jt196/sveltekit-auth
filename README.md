# SvelteKit Auth Starter

SvelteKit v2 + Svelte 5 + Tailwind v4 + DaisyUI + Better Auth + Drizzle ORM + SQLite.

## Stack & Structure
- Framework: SvelteKit (Svelte 5 snippets)
- Styles: Tailwind v4 + DaisyUI (`src/app.css`)
- Auth: Better Auth with Drizzle adapter
- DB: SQLite (file: `./data/dev.db`) via Drizzle ORM
- Routes: `(public)/` (landing, login, register) and `(private)/` (guarded dashboard)
- Key paths: `src/lib/server/auth/`, `src/lib/server/db/`, `drizzle/`, `data/`, `logs/`

## Setup
1) Install deps: `pnpm install`
2) Env (copy `.env.example` → `.env`):
   - `DATABASE_URL=file:./data/dev.db`
   - `AUTH_SECRET=<long-random-string>`
   - `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`, `DEMO_USER_NAME`
   - `AUTH_ALLOW_REGISTER=true|false` (toggle self‑registration)
3) Apply DB schema: `pnpm run db:push`
4) Seed demo user: `pnpm run seed`

## Develop & Build
- Dev: `pnpm run dev` (or `pnpm run dev:logs` to tee console to `logs/`)
- Build: `pnpm run build`
- Preview: `pnpm run preview` (or `pnpm run preview:logs`)

## Testing
- Unit: `pnpm run test:unit`
- E2E (Playwright):
  - Install browsers (once): `pnpm run browsers:install`
  - Run tests: `pnpm run test:e2e`
  - Combined server+runner logs: `logs/tests.log`
  - Artifacts: `logs/playwright-artifacts/` (traces, screenshots, videos)
  - HTML report: `logs/playwright-report/`

## Auth Notes
- Login: default action signs in with email/password. New account creation is not allowed here.
- Register: `/register` is available when `AUTH_ALLOW_REGISTER=true` and redirects to `/login` when disabled.
- Guard: `(private)` routes redirect to `/login` if no session (`src/hooks.server.js`).
- Better Auth API is mounted at `/api/auth/*`.

## Logging
- Run with logs: `pnpm run dev:logs` or `pnpm run preview:logs`.
- Files:
  - Dev: `logs/dev.log` (server stdout/stderr + client console)
  - Preview: `logs/preview.log`
  - Tests: `logs/tests.log` (build + preview + runner + client console)
  - Errors: `logs/server-errors.log`
- Per‑line timestamps; ANSI colors stripped. See `logs/README.md` for details.
- Clean logs: `pnpm run logs:clean`.

## Drizzle
- Config: `drizzle.config.js` (uses `DATABASE_URL`)
- Commands: `pnpm run db:push`, `pnpm run db:generate`, `pnpm run db:migrate`, `pnpm run db:studio`

## Architecture
```
Browser
  │
  ├─ GET /(public)/login → +page.svelte (DaisyUI form)
  │      └─ POST (default action) → +page.server.js
  │             └─ auth.api.signInEmail(headers, body)
  │                    │
  │                    └─ Better Auth (/api/auth/*)
  │                          ├─ Drizzle Adapter → SQLite (data/dev.db)
  │                          └─ SvelteKit Cookies Plugin → Set-Cookie
  │
  ├─ GET/POST /(public)/register (if AUTH_ALLOW_REGISTER=true)
  │      └─ POST → +page.server.js → auth.api.signUpEmail → auth.api.signInEmail
  │
  └─ 303 redirect → /(private)/dashboard
         └─ hooks.server.js
               ├─ svelteKitHandler for /api/auth/*
               └─ auth.api.getSession({ headers }) → event.locals.user
                    └─ guard: route.id includes '(private)' → redirect /login if missing
```
