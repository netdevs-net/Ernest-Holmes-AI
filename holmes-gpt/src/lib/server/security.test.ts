import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  WindowLimiter,
  createAdminToken,
  isValidAdminToken,
  looksLikeBot,
  safeEqual,
} from "./security";

describe("WindowLimiter", () => {
  it("allows up to max hits per window then blocks", () => {
    const limiter = new WindowLimiter(1000, 2);
    expect(limiter.hit("a", 0).allowed).toBe(true);
    expect(limiter.hit("a", 1).allowed).toBe(true);
    const blocked = limiter.hit("a", 2);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("tracks keys independently and resets after the window", () => {
    const limiter = new WindowLimiter(1000, 1);
    expect(limiter.hit("a", 0).allowed).toBe(true);
    expect(limiter.hit("b", 0).allowed).toBe(true);
    expect(limiter.hit("a", 500).allowed).toBe(false);
    expect(limiter.hit("a", 1001).allowed).toBe(true);
  });

  it("peek does not consume and add accumulates usage", () => {
    const limiter = new WindowLimiter(1000, 100);
    expect(limiter.peek("a", 0).remaining).toBe(100);
    limiter.add("a", 100, 1);
    expect(limiter.peek("a", 2).allowed).toBe(false);
  });
});

describe("looksLikeBot", () => {
  it("flags missing and automated user agents", () => {
    expect(looksLikeBot(null)).toBe(true);
    expect(looksLikeBot("curl/8.1.2")).toBe(true);
    expect(looksLikeBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
  });

  it("lets real browsers through", () => {
    expect(
      looksLikeBot(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
      ),
    ).toBe(false);
  });
});

describe("admin tokens", () => {
  beforeEach(() => vi.stubEnv("ADMIN_PASSWORD", "correct horse"));
  afterEach(() => vi.unstubAllEnvs());

  it("accepts a fresh token and rejects tampered or expired ones", () => {
    const now = 1_000_000;
    const token = createAdminToken(now)!;
    expect(isValidAdminToken(token, now + 1000)).toBe(true);
    expect(isValidAdminToken(token, now + 8 * 24 * 3600 * 1000)).toBe(false);
    expect(isValidAdminToken(`${token}x`, now + 1000)).toBe(false);
    expect(isValidAdminToken(undefined, now)).toBe(false);
  });

  it("invalidates tokens when the password changes", () => {
    const token = createAdminToken()!;
    vi.stubEnv("ADMIN_PASSWORD", "another");
    expect(isValidAdminToken(token)).toBe(false);
  });

  it("compares strings of different lengths without throwing", () => {
    expect(safeEqual("a", "abc")).toBe(false);
    expect(safeEqual("same", "same")).toBe(true);
  });
});
