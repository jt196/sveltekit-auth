// @ts-check
import { spawn } from 'node:child_process';
import { mkdirSync, createWriteStream } from 'node:fs';
import { join } from 'node:path';

const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });
const file = join(logsDir, 'seed.log');
const out = createWriteStream(file, { flags: 'a' });
out.write(`\n=== SEED START ${new Date().toISOString()} ===\n`);

const stripAnsi = (s) => s.toString().replace(/\u001b\[[0-9;]*m/g, '');
const stamp = () => new Date().toISOString();
const writeLines = (kind, chunk) => {
  const clean = stripAnsi(chunk);
  const lines = clean.split(/\r?\n/);
  for (const line of lines) {
    if (!line) continue;
    out.write(`[${stamp()}] seed-${kind}: ${line}\n`);
  }
};

const child = spawn(process.execPath, ['seed.js'], { stdio: ['inherit', 'pipe', 'pipe'] });
child.stdout.on('data', (c) => { process.stdout.write(c); writeLines('stdout', c); });
child.stderr.on('data', (c) => { process.stderr.write(c); writeLines('stderr', c); });
child.on('close', (code) => { out.end(); process.exit(code ?? 0); });

