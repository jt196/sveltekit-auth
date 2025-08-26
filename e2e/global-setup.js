// @ts-check
import { spawnSync } from 'node:child_process';

export default async function globalSetup() {
  // Seed demo user before tests
  const res = spawnSync(process.execPath, ['seed.js'], { stdio: 'inherit' });
  if (res.status !== 0) {
    throw new Error('Seeding failed');
  }
}
