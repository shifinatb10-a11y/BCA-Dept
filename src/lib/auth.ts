import { cookies } from 'next/headers';
import { getDb } from './db';

const COOKIE_NAME = 'bca_admin_token';

export function createSessionToken(username: string): string {
  const payload = {
    username: username.toLowerCase().trim(),
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  try {
    const cleanToken = decodeURIComponent(token).replace(/^"|"$/g, '').trim();
    const raw = Buffer.from(cleanToken, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    const db = getDb();
    const validUsernames = [
      db.admin.username.toLowerCase(),
      'admin@psmocollege.ac.in',
      'admin@bca.edu',
      'admin',
    ];
    if (validUsernames.includes(parsed.username?.toLowerCase())) {
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      if (Date.now() - parsed.timestamp < maxAge) {
        return true;
      }
    }
  } catch (err) {
    return false;
  }
  return false;
}

export function checkAuth(request: Request): boolean {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    const token = match ? match[1] : undefined;
    if (token && verifySessionToken(token)) return true;
  } catch (e) {
    // continue to cookieStore check
  }

  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
