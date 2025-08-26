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

const stripAnsi = (s) => s.toString().replace(/\u001b\[[0-9;]*m/g, '');
const stamp = () => new Date().toISOString();
const writeLines = (kind, chunk) => {
  const clean = stripAnsi(chunk);
  const lines = clean.split(/\r?\n/);
  for (const line of lines) {
    if (line.length === 0) continue;
    out.write(`[${stamp()}] ${kind}: ${line}\n`);
  }
};

/** @type {import('node:child_process').SpawnOptions} */
const opts = { stdio: ['inherit', 'pipe', 'pipe'], shell: true };
const cmd = mode === 'dev' ? 'vite dev --host 127.0.0.1' : 'vite preview --host 127.0.0.1 --port 4173';

console.log(`[run-with-logs] Starting '${cmd}', logging to ${file}`);
const child = spawn(cmd, [], opts);

child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  writeLines('stdout', chunk);
});
child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk);
  writeLines('stderr', chunk);
});

child.on('close', (code) => {
  console.log(`[run-with-logs] '${cmd}' exited with code ${code}`);
  out.end();
  process.exit(code ?? 0);
});
