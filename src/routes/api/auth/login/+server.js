import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { getUserByEmail } from '$lib/db.js';
import { logError } from '$lib/errorLogger.js';

export async function POST({ request, cookies }) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      logError('/api/auth/login', 'POST', 400, 'Email and password are required');
      return json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      logError('/api/auth/login', 'POST', 401, `Invalid credentials for email: ${email}`);
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logError('/api/auth/login', 'POST', 401, `Invalid password for user: ${email}`);
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if user is verified
    if (!user.verified) {
      logError('/api/auth/login', 'POST', 403, `Unverified account login attempt: ${email}`);
      return json({ 
        error: 'Please verify your email before logging in. Check your email for the confirmation link.',
        needsVerification: true
      }, { status: 403 });
    }

    // Set session cookie
    cookies.set('session', JSON.stringify({ userId: user.id }), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    logError('/api/auth/login', 'POST', 500, 'Login failed', error.stack);
    return json({ error: 'Login failed' }, { status: 500 });
  }
}

