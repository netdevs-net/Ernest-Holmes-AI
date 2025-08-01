import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// Security monitoring data
interface SecurityMetrics {
  totalRequests: number;
  rateLimitHits: number;
  botDetections: number;
  promptInjectionAttempts: number;
  dailyUsageExceeded: number;
  averageTokensPerRequest: number;
  totalCost: number;
  lastUpdated: string;
}

let securityMetrics: SecurityMetrics = {
  totalRequests: 0,
  rateLimitHits: 0,
  botDetections: 0,
  promptInjectionAttempts: 0,
  dailyUsageExceeded: 0,
  averageTokensPerRequest: 0,
  totalCost: 0,
  lastUpdated: new Date().toISOString()
};

// Function to update security metrics
function updateSecurityMetrics(type: keyof SecurityMetrics, value: number = 1) {
  securityMetrics[type] += value;
  securityMetrics.lastUpdated = new Date().toISOString();
  
  // Log security events
  console.log(`Security Event: ${type} = ${value}`, {
    timestamp: securityMetrics.lastUpdated,
    totalRequests: securityMetrics.totalRequests
  });
}

export const GET: RequestHandler = async ({ request }) => {
  // Basic authentication for security endpoint
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.SECURITY_TOKEN || 'holmes-security-2024';
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return json({
    metrics: securityMetrics,
    limits: {
      maxRequestsPer15Min: 10,
      maxTokensPerDay: 50000,
      maxRequestsPerDay: 50,
      maxMessageLength: 1000
    },
    recommendations: [
      'Monitor rate limit hits for potential DDoS attacks',
      'Track bot detections for automated abuse',
      'Watch for prompt injection attempts',
      'Monitor daily usage to prevent cost overruns'
    ]
  });
};

export const POST: RequestHandler = async ({ request }) => {
  // Allow updating metrics via POST
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.SECURITY_TOKEN || 'holmes-security-2024';
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { type, value } = await request.json();
    if (type && typeof value === 'number') {
      updateSecurityMetrics(type, value);
      return json({ success: true, updated: type, value });
    }
    return json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error) {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }
}; 