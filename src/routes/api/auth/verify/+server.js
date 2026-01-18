import { json } from '@sveltejs/kit';
import { verifyUser } from '$lib/db.js';

export async function GET({ url }) {
  try {
    const token = url.searchParams.get('token');
    
    if (!token) {
      return json({ error: 'Token is required' }, { status: 400 });
    }

    const user = verifyUser(token);
    
    if (!user) {
      return json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    return json({ 
      message: 'Email verified successfully! You can now log in.',
      verified: true
    });
  } catch (error) {
    console.error('Verification error:', error);
    return json({ error: 'Verification failed' }, { status: 500 });
  }
}

