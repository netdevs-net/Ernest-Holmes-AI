import { json, redirect, type Handle } from "@sveltejs/kit";
import { randomUUID } from "node:crypto";
import {
  ADMIN_COOKIE,
  isAdminConfigured,
  isAdminRequest,
} from "$lib/server/security";

const SESSION_COOKIE = "holmes_sid";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isAdminPage(pathname: string): boolean {
  return (
    (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    pathname !== "/admin/login"
  );
}

function isAdminApi(pathname: string): boolean {
  return pathname.startsWith("/api/admin/") && pathname !== "/api/admin/auth";
}

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  /* Visitor session: a server-issued httpOnly cookie. History is scoped to it,
     so the client never holds (or can forge) its own identifier. */
  let sessionId = event.cookies.get(SESSION_COOKIE);
  if (!sessionId || !UUID.test(sessionId)) {
    sessionId = randomUUID();
    event.cookies.set(SESSION_COOKIE, sessionId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: event.url.protocol === "https:",
      maxAge: SESSION_MAX_AGE,
    });
  }
  event.locals.sessionId = sessionId;

  /* Admin area */
  if (isAdminPage(pathname) || isAdminApi(pathname)) {
    if (!isAdminConfigured()) {
      return json(
        { error: "Admin sign-in is not configured." },
        { status: 503 },
      );
    }
    if (
      !isAdminRequest(event.cookies, event.request.headers.get("authorization"))
    ) {
      if (isAdminApi(pathname)) {
        return json({ error: "Unauthorized" }, { status: 401 });
      }
      event.cookies.delete(ADMIN_COOKIE, { path: "/" });
      redirect(303, "/admin/login");
    }
  }

  const response = await resolve(event, {
    preload: ({ type }) => type === "js" || type === "css" || type === "font",
  });

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (event.url.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return response;
};
