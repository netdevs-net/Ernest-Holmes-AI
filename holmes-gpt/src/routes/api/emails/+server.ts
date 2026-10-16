import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { storeEmailShare } from "$lib/server/db/emails";
import { emailLimiter, secondsUntil } from "$lib/server/security";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CONTENT = 8000;

/** Logs that a response was shared by email (the mail itself opens client-side). */
export const POST: RequestHandler = async ({
  request,
  locals,
  getClientAddress,
}) => {
  let body: {
    emailAddress?: unknown;
    messageContent?: unknown;
    messageId?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, { status: 400 });
  }

  const emailAddress =
    typeof body.emailAddress === "string" ? body.emailAddress.trim() : "";
  const messageContent =
    typeof body.messageContent === "string" ? body.messageContent.trim() : "";

  if (!emailAddress || !messageContent) {
    return json(
      { error: "An email address and message are required." },
      { status: 400 },
    );
  }
  if (emailAddress.length > 254 || !EMAIL_PATTERN.test(emailAddress)) {
    return json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const ip = getClientAddress();
  const limit = emailLimiter.hit(ip);
  if (!limit.allowed) {
    return json(
      { error: "Too many shares. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(secondsUntil(limit.resetAt)) },
      },
    );
  }

  const record = storeEmailShare({
    emailAddress,
    messageContent: messageContent.slice(0, MAX_CONTENT),
    messageId:
      typeof body.messageId === "string"
        ? body.messageId.slice(0, 100)
        : undefined,
    ip,
    userAgent: request.headers.get("user-agent") ?? "",
    sessionId: locals.sessionId,
  });

  return json({ ok: true, id: record.id });
};
