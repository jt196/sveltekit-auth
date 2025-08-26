// @ts-check
import { spawnSync } from 'node:child_process';

export default async function globalSetup() {
  // Seed demo user before tests
  const res = spawnSync('node', ['seed.js'], { stdio: 'inherit', shell: true });
  if (res.status !== 0) {
    throw new Error('Seeding failed');
  }
}

