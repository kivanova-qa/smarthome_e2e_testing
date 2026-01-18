import { json } from '@sveltejs/kit';
import { confirmAccountDeletion } from '$lib/db.js';

export async function GET({ url }) {
  try {
    const token = url.searchParams.get('token');
    
    if (!token) {
      return json({ error: 'Token is required' }, { status: 400 });
    }

    const deletedUser = confirmAccountDeletion(token);
    
    if (!deletedUser) {
      return json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    return json({ 
      message: 'Account deleted successfully.',
      deleted: true
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return json({ error: 'Account deletion failed' }, { status: 500 });
  }
}

