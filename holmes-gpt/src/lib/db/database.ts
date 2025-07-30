import Database from "better-sqlite3";
import { join } from "path";
import { existsSync, mkdirSync, statSync } from "fs";

// Database configuration - flexible for volume mounts
const DB_DIR = process.env.DB_DIR || join(process.cwd(), "data");
const DB_PATH = join(DB_DIR, "holmes.db");

// Ensure data directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
  console.log(`Created database directory: ${DB_DIR}`);
} else {
  console.log(`Using existing database directory: ${DB_DIR}`);
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
      console.log(`Connecting to database at: ${DB_PATH}`);
      this.db = new Database(DB_PATH);
      this.db.pragma("journal_mode = WAL"); // Enable WAL mode for better concurrency
      this.db.pragma("foreign_keys = ON"); // Enable foreign key constraints
      this.initializeSchema();
      console.log(`Database connection established successfully`);
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

  // Database health check
  public healthCheck(): { status: string; path: string; size?: string } {
    try {
      if (!this.db) {
        return { status: 'error', path: DB_PATH, size: 'Database not initialized' };
      }
      
      // Test a simple query
      const result = this.db.prepare('SELECT COUNT(*) as count FROM questions').get() as { count: number };
      
      // Get file size if it exists
      let size = 'unknown';
      if (existsSync(DB_PATH)) {
        const stats = statSync(DB_PATH);
        size = `${(stats.size / 1024 / 1024).toFixed(2)} MB`;
      }
      
      return { 
        status: 'healthy', 
        path: DB_PATH, 
        size 
      };
    } catch (error) {
      return { 
        status: 'error', 
        path: DB_PATH, 
        size: error instanceof Error ? error.message : 'Unknown error' 
      };
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
