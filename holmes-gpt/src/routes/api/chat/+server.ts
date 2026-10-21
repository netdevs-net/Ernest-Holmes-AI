import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sanitizeHistory, streamChat } from "$lib/server/claude";
import { categorize, extractTags } from "$lib/server/classify";
import { saveExchange } from "$lib/server/db/history";
import { admit, failureResponse, streamResponse } from "$lib/server/gate";
import { model } from "$lib/server/claude";
import {
  MAX_MESSAGE_LENGTH,
  type Category,
  type ResponseStyle,
} from "$lib/types/chat";

const CATEGORIES = [
  "spiritual",
  "practical",
  "metaphysical",
  "personal",
  "general",
];

/** Honour the visitor's choice; otherwise infer a topic from the question. */
function chosenCategory(value: unknown, question: string): Category {
  return typeof value === "string" && CATEGORIES.includes(value)
    ? (value as Category)
    : categorize(question);
}

export const POST: RequestHandler = async (event) => {
  const { request } = event;

  let body: {
    message?: unknown;
    history?: unknown;
    style?: unknown;
    category?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, { status: 400 });
  }

  const question = typeof body.message === "string" ? body.message.trim() : "";
  if (!question) {
    return json(
      { error: "Please share a question to begin." },
      { status: 400 },
    );
  }
  if (question.length > MAX_MESSAGE_LENGTH) {
    return json(
      {
        error: `Please keep your question under ${MAX_MESSAGE_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  const caller = admit(event);
  if (caller instanceof Response) return caller;

  const style: ResponseStyle =
    body.style === "his-words" ? "his-words" : "modern";
  const abort = new AbortController();
  request.signal.addEventListener("abort", () => abort.abort());

  try {
    const reply = await streamChat(
      { question, history: sanitizeHistory(body.history), style },
      abort.signal,
    );

    return streamResponse(reply, caller, abort, (answer) => {
      saveExchange({
        sessionId: caller.sessionId,
        question,
        answer,
        category: chosenCategory(body.category, question),
        tags: extractTags(question),
        source: model(),
        ip: caller.ip,
        userAgent: caller.userAgent,
      });
    });
  } catch (error) {
    return failureResponse(error);
  }
};
