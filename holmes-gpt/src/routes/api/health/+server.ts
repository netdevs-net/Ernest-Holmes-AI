import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isHealthy } from "$lib/server/db/database";

/** Liveness probe. Deliberately exposes no paths or sizes. */
export const GET: RequestHandler = () => {
  const database = isHealthy();
  return json(
    { status: database ? "ok" : "error", database: database ? "up" : "down" },
    { status: database ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
};
