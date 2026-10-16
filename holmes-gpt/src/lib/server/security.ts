import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { Cookies } from "@sveltejs/kit";

/* ───────────── Fixed-window rate limiting ───────────── */

interface Bucket {
  count: number;
  resetAt: number;
}

export interface LimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export class WindowLimiter {
  private buckets = new Map<string, Bucket>();
  private lastPrune = Date.now();

  constructor(
    private readonly windowMs: number,
    private readonly max: number,
  ) {}

  private bucket(key: string, now: number): Bucket {
    this.prune(now);
    let b = this.buckets.get(key);
    if (!b || now >= b.resetAt) {
      b = { count: 0, resetAt: now + this.windowMs };
      this.buckets.set(key, b);
    }
    return b;
  }

  /** Counts one hit and reports whether it fits in the window. */
  hit(key: string, now = Date.now()): LimitResult {
    const b = this.bucket(key, now);
    const allowed = b.count < this.max;
    if (allowed) b.count++;
    return {
      allowed,
      remaining: Math.max(0, this.max - b.count),
      resetAt: b.resetAt,
    };
  }

  /** Reads state without counting. */
  peek(key: string, now = Date.now()): LimitResult {
    const b = this.bucket(key, now);
    return {
      allowed: b.count < this.max,
      remaining: Math.max(0, this.max - b.count),
      resetAt: b.resetAt,
    };
  }

  /** Adds usage after the fact (e.g. tokens). */
  add(key: string, amount: number, now = Date.now()): void {
    this.bucket(key, now).count += amount;
  }

  /** Drops expired buckets so the map cannot grow without bound. */
  private prune(now: number): void {
    if (now - this.lastPrune < 60_000 && this.buckets.size < 5_000) return;
    this.lastPrune = now;
    for (const [key, b] of this.buckets) {
      if (now >= b.resetAt) this.buckets.delete(key);
    }
  }
}

export const limits = {
  requestsPer15Min: 10,
  requestsPerDay: 50,
  tokensPerDay: 50_000,
  maxMessageLength: 1000,
} as const;

const DAY = 24 * 3600 * 1000;

export const chatBurstLimiter = new WindowLimiter(
  15 * 60 * 1000,
  limits.requestsPer15Min,
);
export const dailyRequestLimiter = new WindowLimiter(
  DAY,
  limits.requestsPerDay,
);
export const dailyTokenLimiter = new WindowLimiter(DAY, limits.tokensPerDay);
export const emailLimiter = new WindowLimiter(60 * 60 * 1000, 10);
export const loginLimiter = new WindowLimiter(10 * 60 * 1000, 5);

export function secondsUntil(resetAt: number): number {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}

/* ───────────── Metrics (in-memory, reset on restart) ───────────── */

export interface SecurityMetrics {
  totalRequests: number;
  rateLimitHits: number;
  botDetections: number;
  dailyUsageExceeded: number;
  totalTokens: number;
  averageTokensPerRequest: number;
  totalCost: number;
  startedAt: string;
}

const metrics: Omit<SecurityMetrics, "averageTokensPerRequest"> & {
  completed: number;
} = {
  totalRequests: 0,
  rateLimitHits: 0,
  botDetections: 0,
  dailyUsageExceeded: 0,
  totalTokens: 0,
  totalCost: 0,
  completed: 0,
  startedAt: new Date().toISOString(),
};

export function recordMetric(
  type:
    "totalRequests" | "rateLimitHits" | "botDetections" | "dailyUsageExceeded",
): void {
  metrics[type]++;
}

export function recordUsage(tokens: number, cost: number): void {
  metrics.completed++;
  metrics.totalTokens += tokens;
  metrics.totalCost += cost;
}

export function getSecurityMetrics(): SecurityMetrics {
  const { completed, ...rest } = metrics;
  return {
    ...rest,
    averageTokensPerRequest: completed
      ? Math.round(metrics.totalTokens / completed)
      : 0,
  };
}

/* ───────────── Bot detection ───────────── */

const BOT_PATTERNS = [
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /^curl\//i,
  /^wget\//i,
  /python-requests/i,
  /node-fetch/i,
  /postman/i,
  /insomnia/i,
  /thunder client/i,
];

export function looksLikeBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((p) => p.test(userAgent));
}

/* ───────────── Admin authentication ───────────── */

export const ADMIN_COOKIE = "holmes_admin";
const ADMIN_TTL_MS = 7 * DAY;

export function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD?.trim() || undefined;
}

export function isAdminConfigured(): boolean {
  return Boolean(adminPassword());
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Constant-time string comparison that is safe for differing lengths. */
export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b));
}

export function verifyAdminPassword(input: unknown): boolean {
  const password = adminPassword();
  return (
    Boolean(password) &&
    typeof input === "string" &&
    safeEqual(input, password!)
  );
}

function sign(expires: string, password: string): string {
  return createHmac("sha256", password)
    .update(`holmes-admin:${expires}`)
    .digest("hex");
}

/** A signed, expiring session token (replaces the old never-expiring one). */
export function createAdminToken(now = Date.now()): string | null {
  const password = adminPassword();
  if (!password) return null;
  const expires = String(now + ADMIN_TTL_MS);
  return `${expires}.${sign(expires, password)}`;
}

export function isValidAdminToken(token: string | undefined, now = Date.now()) {
  const password = adminPassword();
  if (!password || !token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < now) return false;
  return safeEqual(signature, sign(expires, password));
}

export const adminCookieMaxAge = ADMIN_TTL_MS / 1000;

export function bearerToken(header: string | null): string | null {
  return header?.startsWith("Bearer ") ? header.slice(7) : null;
}

export function isAdminRequest(
  cookies: Cookies,
  authorization: string | null,
): boolean {
  if (isValidAdminToken(cookies.get(ADMIN_COOKIE))) return true;
  const bearer = bearerToken(authorization);
  return bearer !== null && verifyAdminPassword(bearer);
}

export function isSecurityTokenValid(authorization: string | null): boolean {
  const token = process.env.SECURITY_TOKEN?.trim() || adminPassword();
  const bearer = bearerToken(authorization);
  return Boolean(token) && bearer !== null && safeEqual(bearer, token!);
}
