import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  ADMIN_COOKIE,
  createAdminCookieValue,
  getAdminPassword,
  isValidAdminCookie,
} from "$lib/server/adminAuth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const POST: RequestHandler = async ({ request, cookies }) => {
  const configuredPassword = getAdminPassword();
  if (!configuredPassword) {
    return json(
      { error: "Admin authentication is not configured" },
      { status: 503 },
    );
  }

  try {
    const { password } = await request.json();
    if (!password || password !== configuredPassword) {
      return json({ error: "Invalid password" }, { status: 401 });
    }

    const cookieValue = createAdminCookieValue();
    if (!cookieValue) {
      return json(
        { error: "Admin authentication is not configured" },
        { status: 503 },
      );
    }

    cookies.set(ADMIN_COOKIE, cookieValue, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
    });

    return json({ success: true });
  } catch {
    return json({ error: "Invalid request" }, { status: 400 });
  }
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete(ADMIN_COOKIE, { path: "/" });
  return json({ success: true });
};

export const GET: RequestHandler = async ({ cookies }) => {
  return json({ authenticated: isValidAdminCookie(cookies) });
};
