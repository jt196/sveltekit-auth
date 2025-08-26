// @ts-check
import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  if (locals.user) throw redirect(303, '/dashboard');
};

/** @type {import('./$types').Actions} */
export const actions = {
  login: async ({ request }) => {
    const form = await request.formData();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '').trim();
    if (!email || !password) return fail(400, { error: 'Email and password required' });

    try {
      await auth.api.signInEmail({ headers: request.headers, body: { email, password } });
      throw redirect(303, '/dashboard');
    } catch {
      // If sign-in fails, try sign-up then re-sign-in
      const name = email.split('@')[0] || 'User';
      try {
        await auth.api.signUpEmail({ headers: request.headers, body: { name, email, password } });
        await auth.api.signInEmail({ headers: request.headers, body: { email, password } });
        throw redirect(303, '/dashboard');
      } catch (e) {
        return fail(400, { error: 'Unable to authenticate' });
      }
    }
  }
};
