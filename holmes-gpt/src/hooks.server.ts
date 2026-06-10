import { redirect, json, type Handle } from "@sveltejs/kit";
import {
  isAdminAuthConfigured,
  isAdminAuthorized,
  isProtectedAdminPage,
  isProtectedApiRoute,
  isValidSecurityBearer,
} from "$lib/server/adminAuth";

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;
  const method = event.request.method;

  if (isProtectedAdminPage(pathname)) {
    if (!isAdminAuthConfigured()) {
      return json(
        { error: "Admin authentication is not configured" },
        { status: 503 },
      );
    }

    if (
      !isAdminAuthorized(
        event.cookies,
        event.request.headers.get("authorization"),
      )
    ) {
      throw redirect(303, "/admin/login");
    }
  }

  if (pathname === "/api/security") {
    if (!isValidSecurityBearer(event.request.headers.get("authorization"))) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (isProtectedApiRoute(pathname, event.url, method)) {
    if (!isAdminAuthConfigured()) {
      return json(
        { error: "Admin authentication is not configured" },
        { status: 503 },
      );
    }

    if (
      !isAdminAuthorized(
        event.cookies,
        event.request.headers.get("authorization"),
      )
    ) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const response = await resolve(event, {
    preload: ({ type }) => type === "js" || type === "css",
  });

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );
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
