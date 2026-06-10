import type { PageServerLoad } from "./$types";
import {
  getSecurityMetrics,
  securityLimits,
  securityRecommendations,
} from "$lib/server/securityMetrics";

export const load: PageServerLoad = async () => {
  return {
    metrics: getSecurityMetrics(),
    limits: securityLimits,
    recommendations: securityRecommendations,
  };
};
