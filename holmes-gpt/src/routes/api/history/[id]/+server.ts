import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  deleteForSession,
  getForSession,
  toggleBookmark,
} from "$lib/server/db/history";

export const GET: RequestHandler = ({ params, locals }) => {
  const exchange = getForSession(locals.sessionId, params.id);
  if (!exchange) error(404, "Not found");
  return json(exchange, { headers: { "Cache-Control": "no-store" } });
};

/** PATCH { isBookmarked } — flips the bookmark. */
export const PATCH: RequestHandler = ({ params, locals }) => {
  const isBookmarked = toggleBookmark(locals.sessionId, params.id);
  if (isBookmarked === null) error(404, "Not found");
  return json({ isBookmarked });
};

export const DELETE: RequestHandler = ({ params, locals }) => {
  if (!deleteForSession(locals.sessionId, params.id)) error(404, "Not found");
  return json({ ok: true });
};
