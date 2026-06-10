import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  getSecurityMetrics,
  securityLimits,
  securityRecommendations,
  updateSecurityMetrics,
} from "$lib/server/securityMetrics";

export const GET: RequestHandler = async () => {
  return json({
    metrics: getSecurityMetrics(),
    limits: securityLimits,
    recommendations: securityRecommendations,
  });
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { type, value } = await request.json();
    if (type && typeof value === "number") {
      updateSecurityMetrics(type, value);
      return json({ success: true, updated: type, value });
    }
    return json({ error: "Invalid parameters" }, { status: 400 });
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }
};
