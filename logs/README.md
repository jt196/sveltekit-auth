# Logs

This folder holds plain‑text logs to help debugging locally and in CI.

Files
- `dev.log`: Live dev server output. Appends each time you run `pnpm dev:logs`.
  - Includes server stdout/stderr and client console logs.
- `preview.log`: Local preview server output (`pnpm preview:logs`).
- `tests.log`: Combined output for E2E runs: build, preview server, and Playwright runner.
  - Also includes client console logs during tests.
- `seed.log`: Output from seeding (both test global setup and `pnpm seed:logs`).
- `server-errors.log`: SvelteKit `handleError` entries (method, URL, message).
- `playwright-report/`, `playwright-artifacts/`, `playwright-report.json`: Playwright reports and artifacts.

Conventions
- Each line is timestamped: `[YYYY-MM-DDTHH:mm:ss.sssZ] <source>: <message>`.
- ANSI color codes are stripped for readability.
- Logs append across sessions; run `pnpm logs:clean` to clear generated files.
  - Access lines like `[access] GET / ...` are emitted to console and captured in `dev.log/tests.log`; a separate `access.log` is not used.

Common commands
- Live dev (log to `dev.log`): `pnpm dev:logs`
- Manual preview (log to `preview.log`): `pnpm preview:logs`
- Seed (log to `seed.log`): `pnpm seed:logs`
- E2E tests (log to `tests.log`): `pnpm test:e2e`
- View HTML report: `pnpm exec playwright show-report logs/playwright-report`
- Clean logs: `pnpm logs:clean`
