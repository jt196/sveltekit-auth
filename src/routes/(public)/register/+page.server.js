// @ts-check
import { redirect, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { auth } from '$lib/server/auth';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  const allowRegister = /^(1|true|yes)$/i.test(env.AUTH_ALLOW_REGISTER || '');
  if (!allowRegister) throw redirect(303, '/login');
  if (locals.user) throw redirect(303, '/dashboard');
  return { allowRegister };
};

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '').trim();

    const allowRegister = /^(1|true|yes)$/i.test(env.AUTH_ALLOW_REGISTER || '');
    if (!allowRegister) throw redirect(303, '/login');
    if (!name || !email || !password) return fail(400, { error: 'All fields are required' });

    try {
      await auth.api.signUpEmail({ headers: request.headers, body: { name, email, password } });
      await auth.api.signInEmail({ headers: request.headers, body: { email, password } });
    } catch (e) {
      return fail(400, { error: 'Unable to register. Try a different email.' });
    }

    throw redirect(303, '/dashboard');
  }
};

