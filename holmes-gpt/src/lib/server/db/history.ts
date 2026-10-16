import { randomUUID } from "node:crypto";
import type { Category, HistoryExchange, HistoryItem } from "$lib/types/chat";
import { getDb, likePattern, parseDbDate } from "./database";

interface QuestionRow {
  id: string;
  question: string;
  category: Category;
  timestamp: string;
  is_bookmarked: number;
  tags: string | null;
  response_preview: string | null;
  source: string | null;
  session_id: string | null;
  user_ip: string | null;
}

interface AnswerRow {
  assistant_message: string;
}

const PREVIEW_LENGTH = 180;

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function toItem(row: QuestionRow): HistoryItem {
  return {
    id: row.id,
    question: row.question,
    category: row.category,
    tags: parseTags(row.tags),
    isBookmarked: row.is_bookmarked === 1,
    preview: row.response_preview ?? "",
    source: row.source,
    createdAt: parseDbDate(row.timestamp).toISOString(),
  };
}

function answerFor(questionId: string): string {
  const row = getDb()
    .prepare(
      "SELECT assistant_message FROM conversations WHERE question_id = ? ORDER BY timestamp DESC LIMIT 1",
    )
    .get(questionId) as AnswerRow | undefined;
  return row?.assistant_message ?? "";
}

function clip(text: string): string {
  const flat = text
    .replace(/\*\*?|^#+\s*|•/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return flat.length > PREVIEW_LENGTH
    ? `${flat.slice(0, PREVIEW_LENGTH - 1)}…`
    : flat;
}

export interface ExchangeInput {
  sessionId: string;
  question: string;
  answer: string;
  category: Category;
  tags: string[];
  source: string;
  ip: string;
  userAgent: string;
}

/** Persist a question together with the answer that was streamed back. */
export function saveExchange(input: ExchangeInput): string {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();

  db.transaction(() => {
    db.prepare(
      `INSERT INTO questions
         (id, question, category, timestamp, is_bookmarked, tags, response_preview,
          source, user_ip, user_agent, session_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      input.question,
      input.category,
      now,
      JSON.stringify(input.tags),
      clip(input.answer),
      input.source,
      input.ip,
      input.userAgent,
      input.sessionId,
      now,
      now,
    );

    db.prepare(
      `INSERT INTO conversations
         (id, question_id, user_message, assistant_message, source, user_ip,
          user_agent, session_id, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      randomUUID(),
      id,
      input.question,
      input.answer,
      input.source,
      input.ip,
      input.userAgent,
      input.sessionId,
      now,
    );
  })();

  return id;
}

export interface HistoryQuery {
  search?: string;
  bookmarkedOnly?: boolean;
  limit?: number;
}

/** History is always scoped to one browser session. */
export function listForSession(
  sessionId: string,
  { search, bookmarkedOnly, limit = 100 }: HistoryQuery = {},
): HistoryItem[] {
  let sql = "SELECT * FROM questions WHERE session_id = ?";
  const params: unknown[] = [sessionId];

  if (bookmarkedOnly) sql += " AND is_bookmarked = 1";
  if (search?.trim()) {
    sql += " AND (question LIKE ? ESCAPE '\\' OR tags LIKE ? ESCAPE '\\')";
    const pattern = likePattern(search.trim());
    params.push(pattern, pattern);
  }
  sql += " ORDER BY timestamp DESC LIMIT ?";
  params.push(Math.min(Math.max(limit, 1), 500));

  const rows = getDb()
    .prepare(sql)
    .all(...params) as QuestionRow[];
  return rows.map(toItem);
}

export function getForSession(
  sessionId: string,
  id: string,
): HistoryExchange | null {
  const row = getDb()
    .prepare("SELECT * FROM questions WHERE id = ? AND session_id = ?")
    .get(id, sessionId) as QuestionRow | undefined;
  if (!row) return null;
  return { ...toItem(row), answer: answerFor(id) };
}

export function toggleBookmark(sessionId: string, id: string): boolean | null {
  const db = getDb();
  const result = db
    .prepare(
      `UPDATE questions
         SET is_bookmarked = 1 - is_bookmarked, updated_at = ?
       WHERE id = ? AND session_id = ?`,
    )
    .run(new Date().toISOString(), id, sessionId);
  if (result.changes === 0) return null;
  const row = db
    .prepare("SELECT is_bookmarked FROM questions WHERE id = ?")
    .get(id) as { is_bookmarked: number };
  return row.is_bookmarked === 1;
}

export function deleteForSession(sessionId: string, id: string): boolean {
  return (
    getDb()
      .prepare("DELETE FROM questions WHERE id = ? AND session_id = ?")
      .run(id, sessionId).changes > 0
  );
}

/* ───────────── Admin ───────────── */

export interface AdminQuestion extends HistoryItem {
  ip: string | null;
  sessionId: string | null;
}

export function listAll(
  { search, category }: { search?: string; category?: string } = {},
  limit = 500,
): AdminQuestion[] {
  let sql = "SELECT * FROM questions WHERE 1 = 1";
  const params: unknown[] = [];

  if (category && category !== "all") {
    sql += " AND category = ?";
    params.push(category);
  }
  if (search?.trim()) {
    sql += " AND (question LIKE ? ESCAPE '\\' OR tags LIKE ? ESCAPE '\\')";
    const pattern = likePattern(search.trim());
    params.push(pattern, pattern);
  }
  sql += " ORDER BY timestamp DESC LIMIT ?";
  params.push(limit);

  const rows = getDb()
    .prepare(sql)
    .all(...params) as QuestionRow[];
  return rows.map((row) => ({
    ...toItem(row),
    ip: row.user_ip,
    sessionId: row.session_id,
  }));
}

export function getAnswerById(id: string): string {
  return answerFor(id);
}

export function deleteAny(id: string): boolean {
  return (
    getDb().prepare("DELETE FROM questions WHERE id = ?").run(id).changes > 0
  );
}

export interface QuestionStats {
  total: number;
  bookmarked: number;
  sessions: number;
  last24h: number;
  byCategory: Record<string, number>;
}

export function questionStats(): QuestionStats {
  const db = getDb();
  const totals = db
    .prepare(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(is_bookmarked), 0) AS bookmarked,
              COUNT(DISTINCT session_id) AS sessions
         FROM questions`,
    )
    .get() as { total: number; bookmarked: number; sessions: number };

  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const recent = db
    .prepare("SELECT COUNT(*) AS n FROM questions WHERE timestamp >= ?")
    .get(since) as { n: number };

  const byCategory: Record<string, number> = {};
  for (const row of db
    .prepare("SELECT category, COUNT(*) AS n FROM questions GROUP BY category")
    .all() as Array<{ category: string; n: number }>) {
    byCategory[row.category] = row.n;
  }

  return { ...totals, last24h: recent.n, byCategory };
}
