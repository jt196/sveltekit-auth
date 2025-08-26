// @ts-check
import { spawn } from 'node:child_process';
import { mkdirSync, createWriteStream } from 'node:fs';
import { join } from 'node:path';

const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });
const file = join(logsDir, 'tests.log');
const out = createWriteStream(file, { flags: 'a' });
// Share the current log file path so other processes (e.g., test runner) can append
// no hint file; tests log to fixed tests.log

const stripAnsi = (s) => s.toString().replace(/\u001b\[[0-9;]*m/g, '');
const stamp = () => new Date().toISOString();
const writeLines = (kind, chunk) => {
  const clean = stripAnsi(chunk);
  const lines = clean.split(/\r?\n/);
  for (const line of lines) {
    if (!line) continue;
    out.write(`[${stamp()}] ${kind}: ${line}\n`);
  }
};

function run(cmd, args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ['inherit', 'pipe', 'pipe'], shell: false, env: { ...process.env, ...env } });
    child.stdout.on('data', (c) => { process.stdout.write(c); writeLines('stdout', c); });
    child.stderr.on('data', (c) => { process.stderr.write(c); writeLines('stderr', c); });
    child.on('close', (code) => resolve(code ?? 0));
  });
}

(async () => {
  console.log(`[web-server] Logging to ${file}`);
  // Build first (capture output)
  const buildCode = await run('vite', ['build'], { APP_LOG_FILE: file, PLAYWRIGHT_TESTS: '1' });
  if (buildCode !== 0) {
    console.error(`[web-server] Build failed with code ${buildCode}`);
    process.exit(buildCode);
  }
  // Then preview
  const preview = spawn('vite', ['preview', '--host', '127.0.0.1', '--port', '4173'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
    env: { ...process.env, APP_LOG_FILE: file, PLAYWRIGHT_TESTS: '1' }
  });
  preview.stdout.on('data', (c) => { process.stdout.write(c); writeLines('stdout', c); });
  preview.stderr.on('data', (c) => { process.stderr.write(c); writeLines('stderr', c); });
  preview.on('close', (code) => { out.end(); process.exit(code ?? 0); });
})();
