// @ts-check
import 'dotenv/config';
import { auth } from './src/lib/server/auth/index.js';

async function main() {
  const email = process.env.DEMO_USER_EMAIL;
  const password = process.env.DEMO_USER_PASSWORD;
  const name = process.env.DEMO_USER_NAME || (email ? email.split('@')[0] : 'Demo');
  if (!email || !password) {
    console.error('Missing DEMO_USER_EMAIL or DEMO_USER_PASSWORD in environment');
    process.exit(1);
  }

  const headers = new Headers();
  try {
    const res = await auth.api.signUpEmail({ headers, body: { name, email, password } });
    if (res && typeof res === 'object') {
      // If Response instance
      if (typeof res.status === 'number') {
        if (res.status >= 200 && res.status < 300) {
          console.log(`Seeded demo user: ${email}`);
          return;
        }
      } else if ('user' in res) {
        console.log(`Seeded demo user: ${email}`);
        return;
      }
    }
  } catch (e) {
    // If user exists, try sign-in to verify
    console.warn('Sign-up failed, attempting sign-in (user may already exist)...');
  }
  try {
    const res2 = await auth.api.signInEmail({ headers, body: { email, password } });
    if (res2 && typeof res2 === 'object') {
      if (typeof res2.status === 'number') {
        if (res2.status >= 200 && res2.status < 300) {
          console.log(`Demo user available: ${email}`);
          return;
        }
      } else if ('session' in res2 || 'user' in res2) {
        // Some endpoints may return session+user or just user
        console.log(`Demo user available: ${email}`);
        return;
      }
    }
    throw new Error('Auth API did not indicate success');
  } catch (e) {
    console.error('Failed to ensure demo user exists:', e?.message || e);
    process.exit(1);
  }
}

main();
