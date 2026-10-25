import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Support writable SQLite in Vercel serverless environment (/tmp)
if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    const candidates = [
      path.join(process.cwd(), 'prisma/dev.db'),
      path.join(process.cwd(), 'backend/prisma/dev.db'),
      path.join(process.cwd(), 'dist/prisma/dev.db'),
      '/var/task/prisma/dev.db',
      '/var/task/backend/prisma/dev.db',
      '/var/task/dist/prisma/dev.db'
    ];
    let copied = false;
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        try {
          fs.copyFileSync(c, tmpDbPath);
          console.log(`[QueueZero] Successfully copied SQLite database from ${c} to ${tmpDbPath}`);
          copied = true;
          break;
        } catch (err) {
          console.error(`[QueueZero] Failed to copy database from ${c}:`, err);
        }
      }
    }
    if (!copied) {
      console.warn('[QueueZero] Could not locate pre-bundled dev.db in candidate paths.');
    }
  }
  process.env.DATABASE_URL = `file:${tmpDbPath}`;
} else if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});
