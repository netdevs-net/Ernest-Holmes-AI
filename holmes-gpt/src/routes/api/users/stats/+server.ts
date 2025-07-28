import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import sqliteStorage from "$lib/utils/sqliteStorage";

// GET /api/users/stats - Get user statistics
export const GET: RequestHandler = async () => {
  try {
    const db = sqliteStorage.getDatabaseStats();

    // Get all questions to analyze user data
    const allQuestions = sqliteStorage.getQuestions();

    // Group questions by IP address
    const questionsByIP: Record<string, any[]> = {};
    const questionsByDevice: Record<string, any[]> = {};
    const questionsBySession: Record<string, any[]> = {};

    allQuestions.forEach((question) => {
      if (question.userIp && question.userIp !== "unknown") {
        if (!questionsByIP[question.userIp]) {
          questionsByIP[question.userIp] = [];
        }
        questionsByIP[question.userIp].push(question);
      }

      if (question.userMac) {
        if (!questionsByDevice[question.userMac]) {
          questionsByDevice[question.userMac] = [];
        }
        questionsByDevice[question.userMac].push(question);
      }

      if (question.sessionId) {
        if (!questionsBySession[question.sessionId]) {
          questionsBySession[question.sessionId] = [];
        }
        questionsBySession[question.sessionId].push(question);
      }
    });

    // Calculate statistics
    const stats = {
      totalUsers: Object.keys(questionsByIP).length,
      totalDevices: Object.keys(questionsByDevice).length,
      totalSessions: Object.keys(questionsBySession).length,
      topUsers: Object.entries(questionsByIP)
        .map(([ip, questions]) => ({ ip, count: questions.length }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      topDevices: Object.entries(questionsByDevice)
        .map(([device, questions]) => ({ device, count: questions.length }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      recentActivity: allQuestions
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 20)
        .map((q) => ({
          id: q.id,
          question: q.question.substring(0, 50) + "...",
          timestamp: q.timestamp,
          ip: q.userIp,
          device: q.userMac,
        })),
    };

    return json({
      ...stats,
      database: db,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return json({ error: "Failed to fetch user statistics" }, { status: 500 });
  }
};
