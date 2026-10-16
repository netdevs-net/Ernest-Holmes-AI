import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('spiritual', 'practical', 'metaphysical', 'personal', 'general')),
  timestamp TEXT NOT NULL,
  is_bookmarked INTEGER NOT NULL DEFAULT 0,
  tags TEXT,
  response_preview TEXT,
  source TEXT,
  user_ip TEXT,
  user_mac TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TEXT,
  updated_at TEXT
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
  timestamp TEXT,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  email_address TEXT NOT NULL,
  message_content TEXT NOT NULL,
  message_id TEXT,
  user_ip TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_session ON questions(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_conversations_question ON conversations(question_id);
CREATE INDEX IF NOT EXISTS idx_emails_address ON emails(email_address);
CREATE INDEX IF NOT EXISTS idx_emails_created ON emails(created_at);
`;

let instance: Database.Database | undefined;

export function dbPath(): string {
  return join(process.env.DB_DIR || join(process.cwd(), "data"), "holmes.db");
}

/** Lazily opens the SQLite database so importing this module has no side effects. */
export function getDb(): Database.Database {
  if (instance) return instance;

  const path = dbPath();
  const dir = join(path, "..");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  instance = db;
  return db;
}

/**
 * SQLite's CURRENT_TIMESTAMP (used by older rows) is UTC without a zone
 * ("2025-08-01 12:00:00"), which `new Date()` would read as local time.
 */
export function parseDbDate(value: string | null | undefined): Date {
  if (!value) return new Date(0);
  const iso = value.includes("T") ? value : value.replace(" ", "T");
  return new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`);
}

/** Escape LIKE wildcards so user search text matches literally. */
export function likePattern(term: string): string {
  return `%${term.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

export function isHealthy(): boolean {
  try {
    getDb().prepare("SELECT 1").get();
    return true;
  } catch {
    return false;
  }
}

export function closeDb(): void {
  instance?.close();
  instance = undefined;
}
