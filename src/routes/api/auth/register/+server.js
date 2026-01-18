import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createUser, getUserByEmail } from '$lib/db.js';
import { logError } from '$lib/errorLogger.js';

export async function POST({ request, url }) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      logError('/api/auth/register', 'POST', 400, 'Email and password are required');
      return json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      logError('/api/auth/register', 'POST', 400, `User already exists: ${email}`);
      return json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    
    const user = createUser(email, hashedPassword, confirmationToken);

    // Generate confirmation link
    const baseUrl = url.origin;
    const confirmationLink = `${baseUrl}/verify?token=${confirmationToken}`;
    
    // In production, send email here
    // For now, log it to console
    console.log('\n=== EMAIL CONFIRMATION ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Verify your account`);
    console.log(`\nPlease click the following link to verify your account:`);
    console.log(confirmationLink);
    console.log('===========================\n');

    return json({ 
      message: 'Registration successful! Please check your email to verify your account.',
      showLink: true,
      confirmationLink
    });
  } catch (error) {
    logError('/api/auth/register', 'POST', 500, 'Registration failed', error.stack);
    return json({ error: 'Registration failed' }, { status: 500 });
  }
}

