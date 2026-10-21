import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let dir: string;
let history: typeof import("./db/history");
let database: typeof import("./db/database");

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "holmes-test-"));
  process.env.DB_DIR = dir;
  database = await import("./db/database");
  history = await import("./db/history");
});

afterAll(() => {
  database.closeDb();
  rmSync(dir, { recursive: true, force: true });
});

const base = {
  category: "spiritual" as const,
  tags: ["prayer"],
  source: "test-model",
  ip: "1.2.3.4",
  userAgent: "test",
};

describe("history repository", () => {
  it("saves an exchange and reads it back for the owning session only", () => {
    const id = history.saveExchange({
      ...base,
      sessionId: "session-a",
      question: "How do I pray?",
      answer: "Prayer is recognition of the Truth.",
    });

    const mine = history.getForSession("session-a", id);
    expect(mine?.answer).toBe("Prayer is recognition of the Truth.");
    expect(mine?.question).toBe("How do I pray?");

    // Another visitor can neither read, bookmark nor delete it.
    expect(history.getForSession("session-b", id)).toBeNull();
    expect(history.toggleBookmark("session-b", id)).toBeNull();
    expect(history.deleteForSession("session-b", id)).toBe(false);
    expect(history.listForSession("session-b")).toEqual([]);
  });

  it("toggles bookmarks and filters by them", () => {
    const id = history.saveExchange({
      ...base,
      sessionId: "s1",
      question: "Q1",
      answer: "A1",
    });
    history.saveExchange({
      ...base,
      sessionId: "s1",
      question: "Q2",
      answer: "A2",
    });

    expect(history.toggleBookmark("s1", id)).toBe(true);
    const saved = history.listForSession("s1", { bookmarkedOnly: true });
    expect(saved.map((i) => i.id)).toEqual([id]);
    expect(history.toggleBookmark("s1", id)).toBe(false);
  });

  it("searches literally (wildcards are escaped) and orders newest first", () => {
    history.saveExchange({
      ...base,
      sessionId: "s2",
      question: "100% sure?",
      answer: "yes",
    });
    history.saveExchange({
      ...base,
      sessionId: "s2",
      question: "Anything else",
      answer: "no",
    });

    expect(history.listForSession("s2", { search: "%" })).toHaveLength(1);
    expect(history.listForSession("s2")[0].question).toBe("Anything else");
  });

  it("deletes, cascading the stored answer", () => {
    const id = history.saveExchange({
      ...base,
      sessionId: "s3",
      question: "Bye",
      answer: "gone",
    });
    expect(history.deleteForSession("s3", id)).toBe(true);
    expect(history.getAnswerById(id)).toBe("");
  });

  it("reports aggregate stats", () => {
    const stats = history.questionStats();
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.byCategory.spiritual).toBeGreaterThan(0);
  });

  it("parses legacy UTC timestamps without a zone as UTC", () => {
    expect(database.parseDbDate("2025-08-01 12:00:00").toISOString()).toBe(
      "2025-08-01T12:00:00.000Z",
    );
    expect(database.parseDbDate("2025-08-01T12:00:00.000Z").toISOString()).toBe(
      "2025-08-01T12:00:00.000Z",
    );
  });
});
