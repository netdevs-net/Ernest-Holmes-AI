export interface SecurityMetrics {
  totalRequests: number;
  rateLimitHits: number;
  botDetections: number;
  promptInjectionAttempts: number;
  dailyUsageExceeded: number;
  averageTokensPerRequest: number;
  totalCost: number;
  lastUpdated: string;
}

type NumericMetricKey = Exclude<keyof SecurityMetrics, "lastUpdated">;

let securityMetrics: SecurityMetrics = {
  totalRequests: 0,
  rateLimitHits: 0,
  botDetections: 0,
  promptInjectionAttempts: 0,
  dailyUsageExceeded: 0,
  averageTokensPerRequest: 0,
  totalCost: 0,
  lastUpdated: new Date().toISOString(),
};

export function getSecurityMetrics(): SecurityMetrics {
  return { ...securityMetrics };
}

export function updateSecurityMetrics(
  type: NumericMetricKey,
  value: number = 1,
) {
  securityMetrics[type] += value;
  securityMetrics.lastUpdated = new Date().toISOString();

  console.log(`Security Event: ${type} = ${value}`, {
    timestamp: securityMetrics.lastUpdated,
    totalRequests: securityMetrics.totalRequests,
  });
}

export const securityLimits = {
  maxRequestsPer15Min: 10,
  maxTokensPerDay: 50000,
  maxRequestsPerDay: 50,
  maxMessageLength: 1000,
};

export const securityRecommendations = [
  "Monitor rate limit hits for potential DDoS attacks",
  "Track bot detections for automated abuse",
  "Watch for prompt injection attempts",
  "Monitor daily usage to prevent cost overruns",
];
