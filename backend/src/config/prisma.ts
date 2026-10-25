import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// Ensure DATABASE_URL fallback exists
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});
