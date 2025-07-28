import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sqliteStorage from '$lib/utils/sqliteStorage';

// GET /api/stats - Get database statistics
export const GET: RequestHandler = async () => {
  try {
    const stats = sqliteStorage.getDatabaseStats();
    const conversationStats = sqliteStorage.getConversationStats();

    return json({
      database: stats,
      conversations: conversationStats,
      questions: {
        total: stats.questions,
        bookmarked: sqliteStorage.getBookmarkedCount(),
        byCategory: {
          spiritual: sqliteStorage.getQuestionsByCategory('spiritual').length,
          practical: sqliteStorage.getQuestionsByCategory('practical').length,
          metaphysical: sqliteStorage.getQuestionsByCategory('metaphysical').length,
          personal: sqliteStorage.getQuestionsByCategory('personal').length,
          general: sqliteStorage.getQuestionsByCategory('general').length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}; 