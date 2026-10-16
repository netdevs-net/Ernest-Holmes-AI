import { json, type RequestEvent } from "@sveltejs/kit";
import type { ReplyStream, Usage } from "./claude";
import { describeError, isConfigured, model } from "./claude";
import { FALLBACK_RESPONSES } from "./prompts";
import {
  chatBurstLimiter,
  dailyRequestLimiter,
  dailyTokenLimiter,
  limits,
  looksLikeBot,
  recordMetric,
  recordUsage,
  secondsUntil,
} from "./security";

export interface Caller {
  ip: string;
  userAgent: string;
  sessionId: string;
}

/**
 * Shared admission checks for the model-backed endpoints. Returns the caller
 * on success, or a ready-made error Response.
 */
export function admit(event: RequestEvent): Caller | Response {
  if (!isConfigured()) {
    return json(
      { error: "The assistant is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const userAgent = event.request.headers.get("user-agent");
  recordMetric("totalRequests");

  if (looksLikeBot(userAgent)) {
    recordMetric("botDetections");
    return json(
      { error: "Automated requests are not supported." },
      { status: 403 },
    );
  }

  const ip = event.getClientAddress();

  const burst = chatBurstLimiter.hit(ip);
  if (!burst.allowed) {
    recordMetric("rateLimitHits");
    const wait = secondsUntil(burst.resetAt);
    return json(
      {
        error: `Many questions are arriving at once. Please try again in ${wait} seconds.`,
        retryAfter: wait,
      },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
  }

  const tokens = dailyTokenLimiter.peek(ip);
  const daily = dailyRequestLimiter.hit(ip);
  if (!daily.allowed || !tokens.allowed) {
    recordMetric("dailyUsageExceeded");
    const wait = secondsUntil(daily.resetAt);
    return json(
      {
        error: `You have reached today's limit of ${limits.requestsPerDay} questions. Please come back tomorrow.`,
        retryAfter: wait,
      },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
  }

  return { ip, userAgent: userAgent ?? "", sessionId: event.locals.sessionId };
}

/** The JSON error Response for a failed model call. */
export function failureResponse(error: unknown): Response {
  console.error("Model request failed:", error);
  const { status, message, fallback } = describeError(error);
  return json(
    {
      error: message,
      fallback: fallback
        ? FALLBACK_RESPONSES[
            Math.floor(Math.random() * FALLBACK_RESPONSES.length)
          ]
        : undefined,
    },
    { status },
  );
}

/** Streams a reply to the browser as plain text, then runs `onComplete`. */
export function streamResponse(
  reply: ReplyStream,
  caller: Caller,
  abort: AbortController,
  onComplete: (text: string, usage: Usage) => void,
): Response {
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(reply.first));
        for await (const chunk of reply.rest) {
          controller.enqueue(encoder.encode(chunk));
        }
        const { text, usage } = await reply.done;
        dailyTokenLimiter.add(
          caller.ip,
          usage.inputTokens + usage.outputTokens,
        );
        recordUsage(usage.inputTokens + usage.outputTokens, usage.cost);
        try {
          onComplete(text, usage);
        } catch (error) {
          console.error("Could not save the exchange:", error);
        }
        controller.close();
      } catch (error) {
        console.error("Stream interrupted:", error);
        controller.error(error);
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
      "X-Holmes-Model": model(),
    },
  });
}
