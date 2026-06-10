import { createHmac, timingSafeEqual } from "node:crypto";
import type { Cookies } from "@sveltejs/kit";

export const ADMIN_COOKIE = "holmes_admin";

export function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD?.trim() || undefined;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminPassword());
}

export function isAdminQuestionsRequest(url: URL): boolean {
  return (
    !url.searchParams.get("sessionId") &&
    url.searchParams.get("limit") === "1000" &&
    !url.searchParams.get("category") &&
    !url.searchParams.get("search") &&
    url.searchParams.get("bookmarked") === null
  );
}

function signToken(password: string): string {
  return createHmac("sha256", password)
    .update("holmes-admin-session")
    .digest("hex");
}

export function createAdminCookieValue(): string | null {
  const password = getAdminPassword();
  if (!password) return null;
  return signToken(password);
}

export function isValidAdminCookie(cookies: Cookies): boolean {
  const password = getAdminPassword();
  if (!password) return false;

  const cookie = cookies.get(ADMIN_COOKIE);
  if (!cookie) return false;

  const expected = signToken(password);
  try {
    return timingSafeEqual(Buffer.from(cookie), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isValidAdminBearer(authHeader: string | null): boolean {
  const password = getAdminPassword();
  if (!password || !authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(password));
  } catch {
    return false;
  }
}

export function isAdminAuthorized(
  cookies: Cookies,
  authHeader: string | null,
): boolean {
  return isValidAdminCookie(cookies) || isValidAdminBearer(authHeader);
}

export function getSecurityToken(): string | undefined {
  return process.env.SECURITY_TOKEN?.trim() || getAdminPassword();
}

export function isValidSecurityBearer(authHeader: string | null): boolean {
  const token = getSecurityToken();
  if (!token || !authHeader?.startsWith("Bearer ")) return false;
  const provided = authHeader.slice(7);
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(token));
  } catch {
    return false;
  }
}

export function isProtectedApiRoute(
  pathname: string,
  url: URL,
  method: string,
): boolean {
  if (pathname === "/api/security") return true;
  if (pathname === "/api/stats") return true;
  if (pathname.startsWith("/api/users/")) return true;

  if (
    pathname === "/api/questions" &&
    method === "GET" &&
    isAdminQuestionsRequest(url)
  ) {
    return true;
  }

  if (/^\/api\/questions\/[^/]+$/.test(pathname) && method !== "GET") {
    return true;
  }

  if (pathname === "/api/emails" && method === "GET") {
    const action = url.searchParams.get("action");
    return action === "stats" || action === "recent" || action === "by-address";
  }

  if (pathname === "/api/emails" && method === "DELETE") {
    return true;
  }

  return false;
}

export function isProtectedAdminPage(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}
