import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sqliteStorage from '$lib/utils/sqliteStorage';

// POST /api/questions/[id]/bookmark - Toggle bookmark status
export const POST: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return json({ error: 'Question ID is required' }, { status: 400 });
    }

    sqliteStorage.toggleBookmark(id);

    return json({ 
      success: true, 
      message: 'Bookmark toggled successfully',
      bookmarkedCount: sqliteStorage.getBookmarkedCount()
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}; 