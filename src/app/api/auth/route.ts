import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { createSessionToken, verifySessionToken, COOKIE_NAME } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    const token = match ? match[1] : undefined;
    const authenticated = verifySessionToken(token);

    return NextResponse.json({ authenticated });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password, newPassword } = body;

    const db = getDb();

    if (action === 'login') {
      const inputUser = (username || '').toLowerCase().trim();
      const validUsernames = [
        (db.admin.username || '').toLowerCase().trim(),
        'admin@psmocollege.ac.in',
        'admin@bca.edu',
        'admin',
      ];
      if (validUsernames.includes(inputUser) && password === db.admin.passwordHash) {
        const token = createSessionToken(inputUser);
        const response = NextResponse.json({
          success: true,
          message: 'Logged in successfully',
          username: db.admin.username,
        });

        response.cookies.set({
          name: COOKIE_NAME,
          value: token,
          httpOnly: true,
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
          sameSite: 'lax',
        });

        return response;
      }
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    if (action === 'change_password') {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
      const token = match ? match[1] : undefined;

      if (!verifySessionToken(token)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      if (password !== db.admin.passwordHash) {
        return NextResponse.json({ success: false, message: 'Current password is wrong' }, { status: 400 });
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ success: false, message: 'New password must be at least 6 characters' }, { status: 400 });
      }

      db.admin.passwordHash = newPassword;
      db.admin.updatedAt = new Date().toISOString();
      saveDb(db);

      return NextResponse.json({ success: true, message: 'Admin password updated successfully' });
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
