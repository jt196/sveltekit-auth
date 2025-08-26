// @ts-check
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  if (locals.user) throw redirect(303, '/dashboard');
};

/** @type {import('./$types').Actions} */
export const actions = {
  login: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = String(form.get('email') || '').trim();
    if (!email) return { success: false };

    // Dev-only: create a simple session cookie; replace with Better Auth
    const session = JSON.stringify({ id: crypto.randomUUID(), email });
    cookies.set('session', session, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true in production behind HTTPS
      maxAge: 60 * 60 * 24 * 7
    });
    throw redirect(303, '/dashboard');
  }
};

