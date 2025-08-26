This directory holds server-only auth code (e.g., Better Auth setup).

Suggested structure:
- `src/lib/server/auth/index.ts` — export configured auth instance.
- `src/hooks.server.ts` — wire auth session into `event.locals`.
- `src/routes/(auth)/*` — login/logout routes and callbacks.

Keep secrets in `.env`; do not import from client code.

