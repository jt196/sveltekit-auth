// @ts-check
import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  if (locals.user) throw redirect(303, '/dashboard');
};

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '').trim();
    if (!email || !password) return fail(400, { error: 'Email and password required' });

    // 1) Try to sign in
    try {
      await auth.api.signInEmail({ headers: request.headers, body: { email, password } });
    } catch (e) {
      // 2) If sign-in fails, try sign-up then sign-in
      const name = email.split('@')[0] || 'User';
      try {
        await auth.api.signUpEmail({ headers: request.headers, body: { name, email, password } });
        await auth.api.signInEmail({ headers: request.headers, body: { email, password } });
      } catch {
        return fail(400, { error: 'Unable to authenticate' });
      }
    }

    // 3) Redirect outside try/catch so we don't capture the redirect exception
    throw redirect(303, '/dashboard');
  }
};
