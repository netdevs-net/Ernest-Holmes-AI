import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import sqliteStorage from "$lib/utils/sqliteStorage";
import { extractTags } from "$lib/utils/questionStorage";
import { getClientInfo } from "$lib/utils/clientInfo";

// GET /api/questions - Get all questions with optional filters
export const GET: RequestHandler = async ({
  url,
  cookies,
  getClientAddress,
}) => {
  try {
    const category = url.searchParams.get("category");
    const searchTerm = url.searchParams.get("search");
    const bookmarkedOnly = url.searchParams.get("bookmarked") === "true";
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const sessionId = url.searchParams.get("sessionId");

    const filters = {
      category: category || undefined,
      searchTerm: searchTerm || undefined,
      bookmarkedOnly,
      userSessionId: sessionId || undefined,
      userMac: undefined,
    };

    let questions;
    if (Object.values(filters).some((f) => f !== undefined)) {
      questions = sqliteStorage.searchQuestions(filters);
    } else {
      questions = sqliteStorage.getQuestionsForUser(
        filters.userSessionId,
        filters.userMac,
      );
    }

    // Apply limit
    if (limit && limit > 0) {
      questions = questions.slice(0, limit);
    }

    // Always get user-specific count when sessionId is provided
    const total = filters.userSessionId
      ? sqliteStorage.getQuestionCountForUser(
          filters.userSessionId,
          filters.userMac,
        )
      : sqliteStorage.getQuestionCount();

    return json({
      questions,
      count: questions.length,
      total,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return json({ error: "Failed to fetch questions" }, { status: 500 });
  }
};

// POST /api/questions - Create a new question
export const POST: RequestHandler = async ({
  request,
  cookies,
  getClientAddress,
}) => {
  try {
    const {
      question,
      category = "general",
      userMac,
      userAgent,
      sessionId,
    } = await request.json();

    // Get client information
    const clientInfo = getClientInfo({
      request,
      cookies,
      getClientAddress,
    } as any);

    if (!question || !question.trim()) {
      return json({ error: "Question is required" }, { status: 400 });
    }

    const tags = extractTags(question);

    sqliteStorage.saveQuestion({
      question: question.trim(),
      category,
      isBookmarked: false,
      tags,
      userIp: clientInfo.ip,
      userMac: userMac || clientInfo.mac,
      userAgent: userAgent || clientInfo.userAgent,
      sessionId: sessionId || clientInfo.sessionId,
    });

    return json({
      success: true,
      message: "Question saved successfully",
      tags,
    });
  } catch (error) {
    console.error("Error saving question:", error);
    return json({ error: "Failed to save question" }, { status: 500 });
  }
};
