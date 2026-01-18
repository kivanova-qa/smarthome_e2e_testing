import { json } from '@sveltejs/kit';
import { getUserById, deleteUser } from '$lib/db.js';

export async function POST({ locals }) {
  if (!locals.userId) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = getUserById(locals.userId);
    
    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the account immediately
    deleteUser(locals.userId);

    // Log the deletion
    console.log(`\n=== ACCOUNT DELETED ===`);
    console.log(`Email: ${user.email}`);
    console.log(`Account permanently deleted`);
    console.log('=======================\n');

    return json({ 
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return json({ error: 'Failed to delete account' }, { status: 500 });
  }
}

