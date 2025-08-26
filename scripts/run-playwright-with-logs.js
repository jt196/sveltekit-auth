// @ts-check
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync, createWriteStream, existsSync } from 'node:fs';
import { join } from 'node:path';

const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });
let targetFile = join(logsDir, 'tests.log');
const out = createWriteStream(targetFile, { flags: 'a' });

const stripAnsi = (s) => s.toString().replace(/\u001b\[[0-9;]*m/g, '');
const stamp = () => new Date().toISOString();
const writeLines = (kind, chunk) => {
  const clean = stripAnsi(chunk);
  const lines = clean.split(/\r?\n/);
  for (const line of lines) {
    if (!line) continue;
    out.write(`[${stamp()}] runner-${kind}: ${line}\n`);
  }
};

// Run local playwright binary
const bin = join('node_modules', '.bin', 'playwright');
console.log(`[run-playwright-with-logs] Appending runner output to ${targetFile}`);
const child = spawn(bin, ['test'], { stdio: ['inherit', 'pipe', 'pipe'] });

child.stdout.on('data', (c) => { process.stdout.write(c); writeLines('stdout', c); });
child.stderr.on('data', (c) => { process.stderr.write(c); writeLines('stderr', c); });
child.on('close', (code) => { out.end(); process.exit(code ?? 0); });
