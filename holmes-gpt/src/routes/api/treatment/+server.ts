import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { streamTreatment } from "$lib/server/claude";
import { admit, failureResponse, streamResponse } from "$lib/server/gate";

const MAX_INTENTION = 600;

export const POST: RequestHandler = async (event) => {
  const { request } = event;

  let body: { intention?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, { status: 400 });
  }

  const intention =
    typeof body.intention === "string" ? body.intention.trim() : "";
  if (!intention) {
    return json(
      { error: "Please describe what you would like the treatment to hold." },
      { status: 400 },
    );
  }
  if (intention.length > MAX_INTENTION) {
    return json(
      {
        error: `Please keep your intention under ${MAX_INTENTION} characters.`,
      },
      { status: 400 },
    );
  }

  const caller = admit(event);
  if (caller instanceof Response) return caller;

  const abort = new AbortController();
  request.signal.addEventListener("abort", () => abort.abort());

  try {
    const reply = await streamTreatment(intention, abort.signal);
    return streamResponse(reply, caller, abort, () => {});
  } catch (error) {
    return failureResponse(error);
  }
};
