// @ts-check
import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  if (locals.user) throw redirect(303, '/dashboard');
  const allowRegister = /^(1|true|yes)$/i.test(env.AUTH_ALLOW_REGISTER || '');
  return { allowRegister };
};

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '').trim();
    if (!email || !password) return fail(400, { error: 'Email and password required' });

    try {
      await auth.api.signInEmail({ headers: request.headers, body: { email, password } });
    } catch (e) {
      return fail(400, { error: 'Invalid email or password' });
    }

    // 3) Redirect outside try/catch so we don't capture the redirect exception
    throw redirect(303, '/dashboard');
  }
};
