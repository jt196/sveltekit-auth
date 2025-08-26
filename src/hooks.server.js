// @ts-check
// (console tee disabled to avoid duplicate lines; run-with-logs captures stdout/stderr)
import { appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { svelteKitHandler, isAuthPath } from 'better-auth/svelte-kit';
import { auth, setCurrentRequestEvent } from '$lib/server/auth';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  // Make request event available to the Better Auth cookie plugin
  setCurrentRequestEvent(event);

  // Route Better Auth API requests
  if (isAuthPath(event.url.toString(), auth.options)) {
    return svelteKitHandler({ auth, event, resolve, building: false });
  }

  // Resolve Better Auth session
  const sessionRes = await auth.api.getSession({ headers: event.request.headers });
  event.locals.user = sessionRes?.user ?? null;

  const id = event.route.id ?? '';

  const started = Date.now();
  const response = await resolve(event);
  const ms = Date.now() - started;
  if (event.url.pathname !== '/__clientlog') {
    console.log(`[access] ${event.request.method} ${event.url.pathname} route=${id} -> ${response.status} ${ms}ms`);
  }
  return response;
};

// Centralized error logging (server-only)
/** @type {import('@sveltejs/kit').HandleServerError} */
export const handleError = async ({ error, event }) => {
  const line = `[${new Date().toISOString()}] ${event.request.method} ${event.url} -> ${error?.message || error}\n`;
  try {
    await appendFile(join(process.cwd(), 'logs', 'server-errors.log'), line);
  } catch {}
  return { message: 'Internal error' };
};
