import DatabaseManager from "./database";

export interface ConversationRecord {
  id: string;
  question_id: string | null;
  user_message: string;
  assistant_message: string;
  source: string | null;
  user_ip: string | null;
  user_mac: string | null;
  user_agent: string | null;
  session_id: string | null;
  timestamp: string;
}

export interface Conversation {
  id: string;
  questionId: string | null;
  userMessage: string;
  assistantMessage: string;
  source: string | null;
  userIp?: string;
  userMac?: string;
  userAgent?: string;
  sessionId?: string;
  timestamp: Date;
}

export class ConversationRepository {
  private db: any;
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = DatabaseManager.getInstance();
    this.db = this.dbManager.getDatabase();
  }

  // Save a new conversation
  saveConversation(
    conversation: Omit<Conversation, "id" | "timestamp">,
  ): string {
    const stmt = this.db.prepare(`
      INSERT INTO conversations (id, question_id, user_message, assistant_message, source, user_ip, user_mac, user_agent, session_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = this.generateId();

    stmt.run(
      id,
      conversation.questionId,
      conversation.userMessage,
      conversation.assistantMessage,
      conversation.source,
      conversation.userIp || null,
      conversation.userMac || null,
      conversation.userAgent || null,
      conversation.sessionId || null,
    );

    return id;
  }

  // Get all conversations
  getConversations(): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all() as ConversationRecord[];
    return rows.map(this.mapRecordToConversation);
  }

  // Get conversations by question ID
  getConversationsByQuestionId(questionId: string): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      WHERE question_id = ?
      ORDER BY timestamp ASC
    `);

    const rows = stmt.all(questionId) as ConversationRecord[];
    return rows.map(this.mapRecordToConversation);
  }

  // Get recent conversations
  getRecentConversations(limit: number = 20): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);

    const rows = stmt.all(limit) as ConversationRecord[];
    return rows.map(this.mapRecordToConversation);
  }

  // Get conversations by date range
  getConversationsByDateRange(startDate: Date, endDate: Date): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      WHERE timestamp BETWEEN ? AND ?
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all(
      startDate.toISOString(),
      endDate.toISOString(),
    ) as ConversationRecord[];
    return rows.map(this.mapRecordToConversation);
  }

  // Get conversations by source
  getConversationsBySource(source: string): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      WHERE source = ?
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all(source) as ConversationRecord[];
    return rows.map(this.mapRecordToConversation);
  }

  // Delete a conversation
  deleteConversation(conversationId: string): void {
    const stmt = this.db.prepare("DELETE FROM conversations WHERE id = ?");
    stmt.run(conversationId);
  }

  // Delete conversations by question ID
  deleteConversationsByQuestionId(questionId: string): void {
    const stmt = this.db.prepare(
      "DELETE FROM conversations WHERE question_id = ?",
    );
    stmt.run(questionId);
  }

  // Get conversation count
  getConversationCount(): number {
    const stmt = this.db.prepare("SELECT COUNT(*) as count FROM conversations");
    const result = stmt.get() as { count: number };
    return result.count;
  }

  // Get conversation statistics
  getConversationStats(): {
    total: number;
    bySource: Record<string, number>;
    byDate: Record<string, number>;
  } {
    const total = this.getConversationCount();

    // Get count by source
    const sourceStmt = this.db.prepare(`
      SELECT source, COUNT(*) as count 
      FROM conversations 
      WHERE source IS NOT NULL 
      GROUP BY source
    `);
    const sourceRows = sourceStmt.all() as Array<{
      source: string;
      count: number;
    }>;
    const bySource: Record<string, number> = {};
    sourceRows.forEach((row) => {
      bySource[row.source] = row.count;
    });

    // Get count by date (last 7 days)
    const dateStmt = this.db.prepare(`
      SELECT DATE(timestamp) as date, COUNT(*) as count 
      FROM conversations 
      WHERE timestamp >= date('now', '-7 days')
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `);
    const dateRows = dateStmt.all() as Array<{ date: string; count: number }>;
    const byDate: Record<string, number> = {};
    dateRows.forEach((row) => {
      byDate[row.date] = row.count;
    });

    return { total, bySource, byDate };
  }

  // Export conversations as JSON
  exportConversations(): string {
    const conversations = this.getConversations();
    return JSON.stringify(conversations, null, 2);
  }

  // Import conversations from JSON
  importConversations(jsonData: string): void {
    try {
      const conversations = JSON.parse(jsonData);
      if (Array.isArray(conversations)) {
        // Clear existing conversations
        this.db.prepare("DELETE FROM conversations").run();

        // Import new conversations
        conversations.forEach((conversation) => {
          this.saveConversation({
            questionId: conversation.questionId,
            userMessage: conversation.userMessage,
            assistantMessage: conversation.assistantMessage,
            source: conversation.source,
          });
        });
      }
    } catch (error) {
      console.error("Failed to import conversations:", error);
      throw error;
    }
  }

  // Search conversations by content
  searchConversations(searchTerm: string): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      WHERE user_message LIKE ? OR assistant_message LIKE ?
      ORDER BY timestamp DESC
    `);

    const searchPattern = `%${searchTerm}%`;
    const rows = stmt.all(searchPattern, searchPattern) as ConversationRecord[];
    return rows.map(this.mapRecordToConversation);
  }

  // Private helper methods
  private generateId(): string {
    return "conv_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  private mapRecordToConversation(record: ConversationRecord): Conversation {
    return {
      id: record.id,
      questionId: record.question_id,
      userMessage: record.user_message,
      assistantMessage: record.assistant_message,
      source: record.source,
      userIp: record.user_ip || undefined,
      userMac: record.user_mac || undefined,
      userAgent: record.user_agent || undefined,
      sessionId: record.session_id || undefined,
      timestamp: new Date(record.timestamp),
    };
  }
}
