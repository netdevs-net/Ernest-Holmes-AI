import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { deleteAny, getAnswerById } from "$lib/server/db/history";

// Both handlers are admin-only; hooks.server.ts guards /api/admin/*.

export const GET: RequestHandler = ({ params }) =>
  json({ answer: getAnswerById(params.id) });

export const DELETE: RequestHandler = ({ params }) => {
  if (!deleteAny(params.id)) error(404, "Not found");
  return json({ ok: true });
};
