// @ts-check
import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';

/**
 * The hooks module sets this before handling each request so the cookies
 * plugin can write SvelteKit cookies.
 * @type {import('@sveltejs/kit').RequestEvent | undefined}
 */
export let currentRequestEvent;
/**
 * @param {import('@sveltejs/kit').RequestEvent} ev
 */
export function setCurrentRequestEvent(ev) {
  currentRequestEvent = ev;
}

/**
 * Export a configured Better Auth instance.
 * - basePath: where the auth API is mounted.
 * - plugins: sveltekitCookies to sync Set-Cookie headers.
 * - adapter: swap to Drizzle when tables are ready.
 */
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';

export const auth = betterAuth({
  basePath: '/api/auth',
  database: drizzleAdapter(db, { schema, provider: 'sqlite' }),
  plugins: [sveltekitCookies(() => /** @type {any} */ (currentRequestEvent))],
  secret: AUTH_SECRET,
  emailAndPassword: { enabled: true, requireEmailVerification: false, autoSignIn: true }
});
