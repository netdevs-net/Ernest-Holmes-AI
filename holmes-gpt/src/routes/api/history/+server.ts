import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { listForSession } from "$lib/server/db/history";

/** The visitor's own saved questions (scoped by their session cookie). */
export const GET: RequestHandler = ({ url, locals }) => {
  const items = listForSession(locals.sessionId, {
    search: url.searchParams.get("q") ?? undefined,
    bookmarkedOnly: url.searchParams.get("bookmarked") === "1",
    limit: Number.parseInt(url.searchParams.get("limit") ?? "100", 10) || 100,
  });

  return json({ items }, { headers: { "Cache-Control": "no-store" } });
};
