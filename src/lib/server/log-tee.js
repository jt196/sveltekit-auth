// @ts-check
// Tee server-side console output to a log file when APP_LOG_FILE is set
import { createWriteStream, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const file = process.env.APP_LOG_FILE;
if (file) {
  try {
    mkdirSync(dirname(file), { recursive: true });
    const stream = createWriteStream(file, { flags: 'a' });
    const stripAnsi = (s) => s.toString().replace(/\u001b\[[0-9;]*m/g, '');
    const stamp = () => new Date().toISOString();
    const write = (level, args) => {
      const line = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
      stream.write(`[${stamp()}] console-${level}: ${stripAnsi(line)}\n`);
    };
    const orig = { ...console };
    console.log = (...args) => {
      write('log', args);
      orig.log.apply(console, args);
    };
    console.info = (...args) => {
      write('info', args);
      orig.info.apply(console, args);
    };
    console.warn = (...args) => {
      write('warn', args);
      orig.warn.apply(console, args);
    };
    console.error = (...args) => {
      write('error', args);
      orig.error.apply(console, args);
    };
    // Header per import
    stream.write(`\n=== CONSOLE TEE ACTIVE ${stamp()} ===\n`);
  } catch {}
}

