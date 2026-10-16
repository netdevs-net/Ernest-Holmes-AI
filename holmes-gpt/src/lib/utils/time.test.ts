import { describe, expect, it } from "vitest";
import { relativeTime } from "./time";

describe("relativeTime", () => {
  const now = Date.parse("2026-10-16T12:00:00Z");

  it("reads recent times", () => {
    expect(relativeTime("2026-10-16T11:59:40Z", now)).toBe("just now");
    expect(relativeTime("2026-10-16T11:55:00Z", now)).toBe("5 minutes ago");
    expect(relativeTime("2026-10-16T09:00:00Z", now)).toBe("3 hours ago");
  });

  it("reads days", () => {
    expect(relativeTime("2026-10-15T12:00:00Z", now)).toBe("yesterday");
  });
});
