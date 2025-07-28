import type { RequestEvent } from "@sveltejs/kit";

export interface ClientInfo {
  ip: string;
  userAgent: string;
  sessionId: string;
  mac?: string; // Will be set by client-side code
}

/**
 * Get client IP address from request
 * Handles various proxy scenarios and headers
 */
export function getClientIP(request: RequestEvent): string {
  const { request: req } = request;

  // Check for forwarded headers (common with proxies)
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[0];
  }

  // Check for real IP header
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Check for client IP header
  const clientIP = req.headers.get("x-client-ip");
  if (clientIP) {
    return clientIP;
  }

  // Check for CF-Connecting-IP (Cloudflare)
  const cfIP = req.headers.get("cf-connecting-ip");
  if (cfIP) {
    return cfIP;
  }

  // Fallback to connection remote address
  // Note: This might not be available in all environments
  const connection = (req as any).connection;
  if (connection && connection.remoteAddress) {
    return connection.remoteAddress;
  }

  // Final fallback
  return "unknown";
}

/**
 * Get user agent string
 */
export function getUserAgent(request: RequestEvent): string {
  return request.request.headers.get("user-agent") || "unknown";
}

/**
 * Generate or retrieve session ID
 */
export function getSessionId(request: RequestEvent): string {
  // Check for existing session ID in cookies
  const sessionId = request.cookies.get("holmes_session_id");

  if (sessionId) {
    return sessionId;
  }

  // Generate new session ID
  const newSessionId =
    "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

  // Set cookie for future requests
  request.cookies.set("holmes_session_id", newSessionId, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return newSessionId;
}

/**
 * Get complete client information
 */
export function getClientInfo(request: RequestEvent): ClientInfo {
  return {
    ip: getClientIP(request),
    userAgent: getUserAgent(request),
    sessionId: getSessionId(request),
  };
}

/**
 * Validate IP address format
 */
export function isValidIP(ip: string): boolean {
  if (ip === "unknown" || ip === "localhost") {
    return true; // Allow these special cases
  }

  // IPv4 validation
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(ip)) {
    return true;
  }

  // IPv6 validation (basic)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (ipv6Regex.test(ip)) {
    return true;
  }

  return false;
}

/**
 * Anonymize IP address for privacy
 * Keeps first 3 octets for IPv4, first 6 segments for IPv6
 */
export function anonymizeIP(ip: string): string {
  if (ip === "unknown" || ip === "localhost") {
    return ip;
  }

  // IPv4: 192.168.1.100 -> 192.168.1.xxx
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  }

  // IPv6: 2001:db8::1 -> 2001:db8:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx
  if (ip.includes(":")) {
    const parts = ip.split(":");
    if (parts.length >= 4) {
      return `${parts[0]}:${parts[1]}:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx`;
    }
  }

  return "unknown";
}
