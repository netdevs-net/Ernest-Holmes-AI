import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  getSecurityMetrics,
  isSecurityTokenValid,
  limits,
} from "$lib/server/security";

/** Read-only metrics for external monitoring (Bearer SECURITY_TOKEN). */
export const GET: RequestHandler = ({ request }) => {
  if (!isSecurityTokenValid(request.headers.get("authorization"))) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  return json({ metrics: getSecurityMetrics(), limits });
};
