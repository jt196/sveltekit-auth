// @ts-check
import { redirect } from '@sveltejs/kit';

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
  // TODO: swap with Better Auth
  event.locals.user = getUserFromCookie(event.cookies);

  // Protect all routes within the (private) group
  const id = event.route.id ?? '';
  const isPrivate = id.includes('(private)');
  if (isPrivate && !event.locals.user) {
    throw redirect(303, '/login');
  }

  return resolve(event);
};

