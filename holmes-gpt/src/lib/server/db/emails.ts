import { randomUUID } from "node:crypto";
import { getDb } from "./database";

export interface EmailShare {
  id: string;
  emailAddress: string;
  createdAt: string;
}

export function storeEmailShare(input: {
  emailAddress: string;
  messageContent: string;
  messageId?: string;
  ip: string;
  userAgent: string;
  sessionId: string;
}): EmailShare {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const emailAddress = input.emailAddress.toLowerCase().trim();

  getDb()
    .prepare(
      `INSERT INTO emails
         (id, email_address, message_content, message_id, user_ip, user_agent, session_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      emailAddress,
      input.messageContent,
      input.messageId ?? null,
      input.ip,
      input.userAgent,
      input.sessionId,
      createdAt,
    );

  return { id, emailAddress, createdAt };
}

export interface EmailStats {
  total: number;
  unique: number;
  today: number;
  week: number;
  month: number;
}

export function emailStats(): EmailStats {
  const db = getDb();
  const day = 24 * 3600 * 1000;
  const since = (ms: number) => new Date(Date.now() - ms).toISOString();

  const count = (sql: string, ...params: string[]) =>
    (db.prepare(sql).get(...params) as { n: number }).n;

  return {
    total: count("SELECT COUNT(*) AS n FROM emails"),
    unique: count("SELECT COUNT(DISTINCT email_address) AS n FROM emails"),
    today: count(
      "SELECT COUNT(*) AS n FROM emails WHERE created_at >= ?",
      since(day),
    ),
    week: count(
      "SELECT COUNT(*) AS n FROM emails WHERE created_at >= ?",
      since(7 * day),
    ),
    month: count(
      "SELECT COUNT(*) AS n FROM emails WHERE created_at >= ?",
      since(30 * day),
    ),
  };
}
