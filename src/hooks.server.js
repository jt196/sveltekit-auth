// @ts-check
import { redirect } from '@sveltejs/kit';
import { svelteKitHandler, isAuthPath } from 'better-auth/svelte-kit';
import { auth, setCurrentRequestEvent } from '$lib/server/auth';

/**
 * Dev-only session reader. Replace with Better Auth session lookup.
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
function getUserFromCookie(cookies) {
  const session = cookies.get('session');
  if (!session) return null;
  try {
    const data = JSON.parse(session);
    return data && typeof data === 'object' && 'id' in data ? /** @type {{id: string, email?: string}} */ (data) : null;
  } catch {
    return null;
  }
}

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

  // Protect all routes within the (private) group
  const id = event.route.id ?? '';
  const isPrivate = id.includes('(private)');
  if (isPrivate && !event.locals.user) {
    throw redirect(303, '/login');
  }

  return resolve(event);
};
