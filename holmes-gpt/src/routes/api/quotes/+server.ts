import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { allQuotes, shuffle } from "$lib/server/knowledge";

export const GET: RequestHandler = ({ url }) => {
  const all = allQuotes();
  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
  const limit = Math.min(
    Math.max(
      Number.parseInt(url.searchParams.get("limit") ?? "10", 10) || 10,
      1,
    ),
    50,
  );
  const random = url.searchParams.get("random") === "true";

  let pool = search
    ? all.filter(
        (q) =>
          q.quote.toLowerCase().includes(search) ||
          q.source.toLowerCase().includes(search),
      )
    : all;

  pool = random ? shuffle(pool) : pool;

  return json({ quotes: pool.slice(0, limit), total: all.length });
};
