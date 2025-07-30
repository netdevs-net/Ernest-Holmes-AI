import Database from "better-sqlite3";
import { join } from "path";
import { existsSync, mkdirSync, statSync } from "fs";

// Database configuration
const DB_DIR = join(process.cwd(), "data");
const DB_PATH = join(DB_DIR, "holmes.db");

// Ensure data directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

// Database schema
const SCHEMA = `
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('spiritual', 'practical', 'metaphysical', 'personal', 'general')),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_bookmarked BOOLEAN DEFAULT 0,
  tags TEXT, -- JSON array of tags
  response_preview TEXT,
  source TEXT,
  user_ip TEXT,
  user_mac TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  question_id TEXT,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  source TEXT,
  user_ip TEXT,
  user_mac TEXT,
  user_agent TEXT,
  session_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_timestamp ON questions(timestamp);
CREATE INDEX IF NOT EXISTS idx_questions_bookmarked ON questions(is_bookmarked);
CREATE INDEX IF NOT EXISTS idx_conversations_question_id ON conversations(question_id);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp);
`;

class DatabaseManager {
  private db: Database.Database;
  private static instance: DatabaseManager;

  private constructor() {
    try {
      this.db = new Database(DB_PATH);
      this.db.pragma("journal_mode = WAL"); // Enable WAL mode for better concurrency
      this.db.pragma("foreign_keys = ON"); // Enable foreign key constraints
      this.initializeSchema();
    } catch (error) {
      console.error("Error in DatabaseManager constructor:", error);
      throw error;
    }
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initializeSchema(): void {
    try {
      this.db.exec(SCHEMA);
      console.log("Database schema initialized successfully");
    } catch (error) {
      console.error("Error initializing database schema:", error);
      throw error;
    }
  }

  public getDatabase(): Database.Database {
    return this.db;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
    }
  }

  // Get database statistics
  public getStats(): {
    questions: number;
    conversations: number;
    size: string;
  } {
    const questions = this.db
      .prepare("SELECT COUNT(*) as count FROM questions")
      .get() as { count: number };
    const conversations = this.db
      .prepare("SELECT COUNT(*) as count FROM conversations")
      .get() as { count: number };

    // Get file size
    const stats = statSync(DB_PATH);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    return {
      questions: questions.count,
      conversations: conversations.count,
      size: `${sizeInMB} MB`,
    };
  }
}

export default DatabaseManager;
