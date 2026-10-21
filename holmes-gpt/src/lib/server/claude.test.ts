import { describe, expect, it, vi } from "vitest";

vi.mock("$env/dynamic/private", () => ({ env: {} }));

const { sanitizeHistory } = await import("./claude");

describe("sanitizeHistory", () => {
  it("ignores anything that is not an array of valid turns", () => {
    expect(sanitizeHistory(undefined)).toEqual([]);
    expect(sanitizeHistory("hi")).toEqual([]);
    expect(
      sanitizeHistory([
        null,
        3,
        { role: "system", content: "x" },
        { role: "user" },
      ]),
    ).toEqual([]);
  });

  it("keeps well-formed alternating turns", () => {
    const turns = [
      { role: "user", content: "q1" },
      { role: "assistant", content: "a1" },
    ];
    expect(sanitizeHistory(turns)).toEqual(turns);
  });

  it("starts on a user turn and ends on an assistant turn", () => {
    const out = sanitizeHistory([
      { role: "assistant", content: "orphan" },
      { role: "user", content: "q" },
      { role: "assistant", content: "a" },
      { role: "user", content: "unanswered" },
    ]);
    expect(out).toEqual([
      { role: "user", content: "q" },
      { role: "assistant", content: "a" },
    ]);
  });

  it("merges consecutive same-role turns", () => {
    const out = sanitizeHistory([
      { role: "user", content: "one" },
      { role: "user", content: "two" },
      { role: "assistant", content: "ok" },
    ]);
    expect(out).toHaveLength(2);
    expect(out[0].content).toBe("one\n\ntwo");
  });

  it("caps turns and length", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: "x".repeat(5000),
    }));
    const out = sanitizeHistory(many);
    expect(out.length).toBeLessThanOrEqual(6);
    expect(out.every((m) => m.content.length <= 2000)).toBe(true);
    expect(out[0].role).toBe("user");
  });
});

describe("removeDashes", () => {
  it("replaces em and en dashes", async () => {
    const { removeDashes } = await import("./claude");
    expect(removeDashes("Faith — the root of all")).toBe(
      "Faith, the root of all",
    );
    expect(removeDashes("pages 3–5")).toBe("pages 3 to 5");
    expect(removeDashes("wait—what")).toBe("wait, what");
    expect(removeDashes("plain text, with commas.")).toBe(
      "plain text, with commas.",
    );
  });
});
