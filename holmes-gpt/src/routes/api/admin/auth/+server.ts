import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  ADMIN_COOKIE,
  adminCookieMaxAge,
  createAdminToken,
  isAdminConfigured,
  isValidAdminToken,
  loginLimiter,
  secondsUntil,
  verifyAdminPassword,
} from "$lib/server/security";

export const POST: RequestHandler = async ({
  request,
  cookies,
  getClientAddress,
}) => {
  if (!isAdminConfigured()) {
    return json({ error: "Admin sign-in is not configured." }, { status: 503 });
  }

  const limit = loginLimiter.hit(getClientAddress());
  if (!limit.allowed) {
    return json(
      { error: "Too many attempts. Please wait a few minutes." },
      {
        status: 429,
        headers: { "Retry-After": String(secondsUntil(limit.resetAt)) },
      },
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return json({ error: "Invalid request." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return json({ error: "Incorrect password." }, { status: 401 });
  }

  cookies.set(ADMIN_COOKIE, createAdminToken()!, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: adminCookieMaxAge,
  });
  return json({ ok: true });
};

export const DELETE: RequestHandler = ({ cookies }) => {
  cookies.delete(ADMIN_COOKIE, { path: "/" });
  return json({ ok: true });
};

export const GET: RequestHandler = ({ cookies }) =>
  json({ authenticated: isValidAdminToken(cookies.get(ADMIN_COOKIE)) });
