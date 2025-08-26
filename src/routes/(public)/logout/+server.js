// @ts-check
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

export const GET = async ({ request }) => {
  await auth.api.signOut({ headers: request.headers });
  throw redirect(303, '/');
};
