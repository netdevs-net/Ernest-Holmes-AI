import DatabaseManager from "./database";
import type {
  QuestionHistory,
  QuestionFilters,
} from "$lib/utils/questionStorage";

export interface QuestionRecord {
  id: string;
  question: string;
  category: "spiritual" | "practical" | "metaphysical" | "personal" | "general";
  timestamp: string;
  is_bookmarked: boolean;
  tags: string;
  response_preview: string | null;
  source: string | null;
  user_ip: string | null;
  user_mac: string | null;
  user_agent: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export class QuestionRepository {
  private db: any;
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = DatabaseManager.getInstance();
    this.db = this.dbManager.getDatabase();
  }

  // Save a new question
  saveQuestion(
    question: Omit<QuestionHistory, "id" | "timestamp"> & {
      userIp?: string;
      userMac?: string;
      userAgent?: string;
      sessionId?: string;
    },
  ): void {
    const stmt = this.db.prepare(`
      INSERT INTO questions (id, question, category, is_bookmarked, tags, response_preview, source, user_ip, user_mac, user_agent, session_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = this.generateId();
    const tagsJson = JSON.stringify(question.tags);

    stmt.run(
      id,
      question.question,
      question.category,
      question.isBookmarked ? 1 : 0,
      tagsJson,
      question.responsePreview || null,
      question.source || null,
      question.userIp || null,
      question.userMac || null,
      question.userAgent || null,
      question.sessionId || null,
    );
  }

  // Get all questions
  getQuestions(): QuestionHistory[] {
    const stmt = this.db.prepare(`
      SELECT * FROM questions 
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all() as QuestionRecord[];
    return rows.map(this.mapRecordToQuestion);
  }

  // Get questions for a specific browser session only
  getQuestionsForUser(
    sessionId?: string,
    _userMac?: string,
  ): QuestionHistory[] {
    if (!sessionId) {
      return [];
    }

    const stmt = this.db.prepare(`
      SELECT * FROM questions
      WHERE session_id = ?
      ORDER BY timestamp DESC
    `);
    const rows = stmt.all(sessionId) as QuestionRecord[];
    return rows.map(this.mapRecordToQuestion);
  }

  // Search questions with filters
  searchQuestions(
    filters: QuestionFilters & { userSessionId?: string; userMac?: string },
  ): QuestionHistory[] {
    let query = "SELECT * FROM questions WHERE 1=1";
    const params: any[] = [];

    // User filtering - prioritize sessionId over userMac
    if (filters.userSessionId) {
      query += " AND session_id = ?";
      params.push(filters.userSessionId);
    } else if (filters.userMac) {
      query += " AND user_mac = ?";
      params.push(filters.userMac);
    }

    if (filters.category) {
      query += " AND category = ?";
      params.push(filters.category);
    }

    if (filters.searchTerm) {
      query += " AND (question LIKE ? OR tags LIKE ?)";
      const searchTerm = `%${filters.searchTerm}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.bookmarkedOnly) {
      query += " AND is_bookmarked = 1";
    }

    if (filters.dateRange) {
      query += " AND timestamp BETWEEN ? AND ?";
      params.push(
        filters.dateRange.start.toISOString(),
        filters.dateRange.end.toISOString(),
      );
    }

    query += " ORDER BY timestamp DESC";

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params) as QuestionRecord[];
    return rows.map(this.mapRecordToQuestion);
  }

  // Toggle bookmark status
  toggleBookmark(questionId: string): void {
    const stmt = this.db.prepare(`
      UPDATE questions 
      SET is_bookmarked = CASE WHEN is_bookmarked = 1 THEN 0 ELSE 1 END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(questionId);
  }

  // Delete a question
  deleteQuestion(questionId: string): void {
    const stmt = this.db.prepare("DELETE FROM questions WHERE id = ?");
    stmt.run(questionId);
  }

  // Update question source and response preview
  updateQuestionSource(
    questionId: string,
    updates: { responsePreview?: string; source?: string },
  ): void {
    const stmt = this.db.prepare(`
      UPDATE questions 
      SET response_preview = COALESCE(?, response_preview),
          source = COALESCE(?, source),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      updates.responsePreview || null,
      updates.source || null,
      questionId,
    );
  }

  // Get question count
  getQuestionCount(): number {
    const stmt = this.db.prepare("SELECT COUNT(*) as count FROM questions");
    const result = stmt.get() as { count: number };
    return result.count;
  }

  getQuestionCountForUser(sessionId?: string, _userMac?: string): number {
    if (!sessionId) {
      return 0;
    }

    const stmt = this.db.prepare(
      "SELECT COUNT(*) as count FROM questions WHERE session_id = ?",
    );
    const result = stmt.get(sessionId) as { count: number };
    return result.count;
  }

  // Get bookmarked question count
  getBookmarkedCount(): number {
    const stmt = this.db.prepare(
      "SELECT COUNT(*) as count FROM questions WHERE is_bookmarked = 1",
    );
    const result = stmt.get() as { count: number };
    return result.count;
  }

  // Export questions as JSON
  exportQuestions(): string {
    const questions = this.getQuestions();
    return JSON.stringify(questions, null, 2);
  }

  // Import questions from JSON
  importQuestions(jsonData: string): void {
    try {
      const questions = JSON.parse(jsonData);
      if (Array.isArray(questions)) {
        // Clear existing questions
        this.db.prepare("DELETE FROM questions").run();

        // Import new questions
        questions.forEach((question) => {
          this.saveQuestion({
            question: question.question,
            category: question.category,
            isBookmarked: question.isBookmarked,
            tags: question.tags,
            responsePreview: question.responsePreview,
            source: question.source,
          });
        });
      }
    } catch (error) {
      console.error("Failed to import questions:", error);
      throw error;
    }
  }

  // Get questions by category
  getQuestionsByCategory(category: string): QuestionHistory[] {
    const stmt = this.db.prepare(`
      SELECT * FROM questions 
      WHERE category = ?
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all(category) as QuestionRecord[];
    return rows.map(this.mapRecordToQuestion);
  }

  // Get recent questions
  getRecentQuestions(limit: number = 10): QuestionHistory[] {
    const stmt = this.db.prepare(`
      SELECT * FROM questions 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);

    const rows = stmt.all(limit) as QuestionRecord[];
    return rows.map(this.mapRecordToQuestion);
  }

  // Get bookmarked questions
  getBookmarkedQuestions(): QuestionHistory[] {
    const stmt = this.db.prepare(`
      SELECT * FROM questions 
      WHERE is_bookmarked = 1
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all() as QuestionRecord[];
    return rows.map(this.mapRecordToQuestion);
  }

  // Search questions by tags
  searchByTags(tags: string[]): QuestionHistory[] {
    const tagConditions = tags.map(() => "tags LIKE ?").join(" OR ");
    const query = `
      SELECT * FROM questions 
      WHERE ${tagConditions}
      ORDER BY timestamp DESC
    `;

    const searchParams = tags.map((tag) => `%${tag}%`);
    const stmt = this.db.prepare(query);
    const rows = stmt.all(...searchParams) as QuestionRecord[];
    return rows.map(this.mapRecordToQuestion);
  }

  // Private helper methods
  private generateId(): string {
    return "q_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  private mapRecordToQuestion(record: QuestionRecord): QuestionHistory {
    return {
      id: record.id,
      question: record.question,
      category: record.category,
      timestamp: new Date(record.timestamp),
      isBookmarked: Boolean(record.is_bookmarked),
      tags: record.tags ? JSON.parse(record.tags) : [],
      responsePreview: record.response_preview || undefined,
      source: record.source || undefined,
      userIp: record.user_ip || undefined,
      userMac: record.user_mac || undefined,
      userAgent: record.user_agent || undefined,
      sessionId: record.session_id || undefined,
    };
  }
}
