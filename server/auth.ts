import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';

if (!process.env.ADMIN_PASSWORD) {
  console.warn('[auth] ADMIN_PASSWORD is not set — using the default "change-me". Set it in .env before deploying.');
}

export function verifyPassword(password: string): boolean {
  const supplied = Buffer.from(password);
  const expected = Buffer.from(ADMIN_PASSWORD);
  if (supplied.length !== expected.length) return false;
  return crypto.timingSafeEqual(supplied, expected);
}

export function issueToken(): string {
  return jwt.sign({ role: 'admin' }, SESSION_SECRET, { expiresIn: '12h' });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    const payload = jwt.verify(token, SESSION_SECRET);
    if (typeof payload === 'object' && payload.role === 'admin') {
      next();
      return;
    }
  } catch {
    // fall through to 401
  }
  res.status(401).json({ error: 'Admin authentication required' });
}
