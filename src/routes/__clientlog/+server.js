// @ts-check
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export const POST = async ({ request }) => {
  let level = 'log';
  let message = '';
  try {
    const data = await request.json();
    level = data?.level || level;
    message = data?.message || '';
  } catch {
    try {
      message = await request.text();
    } catch {}
  }

  const logsDir = join(process.cwd(), 'logs');
  await mkdir(logsDir, { recursive: true }).catch(() => {});
  const target = process.env.APP_LOG_FILE || join(logsDir, process.env.PLAYWRIGHT_TESTS ? 'tests.log' : 'dev.log');
  const line = `[${new Date().toISOString()}] client-${level}: ${message}\n`;
  try {
    await appendFile(target, line);
  } catch {}
  return new Response(null, { status: 204 });
};

