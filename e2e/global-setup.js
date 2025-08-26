// @ts-check
import { spawnSync } from 'node:child_process';
import { mkdirSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

export default async function globalSetup() {
  // Seed demo user before tests, append output to logs/test-run.log
  const logsDir = join(process.cwd(), 'logs');
  mkdirSync(logsDir, { recursive: true });
  const logFile = join(logsDir, 'seed.log');
  const ts = new Date().toISOString();
  const res = spawnSync(process.execPath, ['seed.js'], { encoding: 'utf8' });
  const out = res.stdout || '';
  const err = res.stderr || '';
  appendFileSync(logFile, `[${ts}] seed stdout:\n${out}\n`);
  if (err) appendFileSync(logFile, `[${ts}] seed stderr:\n${err}\n`);
  if (res.status !== 0) throw new Error('Seeding failed');
}
