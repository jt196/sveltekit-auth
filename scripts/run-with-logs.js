// @ts-check
import { spawn } from 'node:child_process';
import { mkdirSync, createWriteStream } from 'node:fs';
import { join } from 'node:path';

const mode = process.argv[2] || 'preview'; // 'dev' | 'preview'
const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });

const ts = new Date()
  .toISOString()
  .replace(/[:T]/g, '-')
  .replace(/\..+$/, '');
const file = join(logsDir, `${mode}-${ts}.log`);
const out = createWriteStream(file, { flags: 'a' });

/** @type {import('node:child_process').SpawnOptions} */
const opts = { stdio: ['inherit', 'pipe', 'pipe'], shell: true };
const cmd = mode === 'dev' ? 'vite dev' : 'vite preview';

console.log(`[run-with-logs] Starting '${cmd}', logging to ${file}`);
const child = spawn(cmd, [], opts);

child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  out.write(chunk);
});
child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk);
  out.write(chunk);
});

child.on('close', (code) => {
  console.log(`[run-with-logs] '${cmd}' exited with code ${code}`);
  out.end();
  process.exit(code ?? 0);
});

