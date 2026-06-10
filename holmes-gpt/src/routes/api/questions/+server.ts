import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import sqliteStorage from "$lib/utils/sqliteStorage";
import { extractTags, type QuestionHistory } from "$lib/utils/questionStorage";
import { getClientInfo } from "$lib/utils/clientInfo";
import { isAdminQuestionsRequest } from "$lib/server/adminAuth";

function applyQuestionFilters(
  questions: QuestionHistory[],
  filters: {
    category?: string;
    searchTerm?: string;
    bookmarkedOnly?: boolean;
  },
): QuestionHistory[] {
  let result = questions;

  if (filters.category) {
    result = result.filter((q) => q.category === filters.category);
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    result = result.filter(
      (q) =>
        q.question.toLowerCase().includes(term) ||
        q.tags.some((tag) => tag.toLowerCase().includes(term)),
    );
  }

  if (filters.bookmarkedOnly) {
    result = result.filter((q) => q.isBookmarked);
  }

  return result;
}

// GET /api/questions - Session-scoped history for users; full list for admin
export const GET: RequestHandler = async ({ url }) => {
  try {
    const category = url.searchParams.get("category") || undefined;
    const searchTerm = url.searchParams.get("search") || undefined;
    const bookmarkedOnly = url.searchParams.get("bookmarked") === "true";
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const sessionId = url.searchParams.get("sessionId");

    let questions: QuestionHistory[];

    if (sessionId) {
      questions = sqliteStorage.getQuestionsForUser(sessionId);
      questions = applyQuestionFilters(questions, {
        category,
        searchTerm,
        bookmarkedOnly,
      });
    } else if (isAdminQuestionsRequest(url)) {
      questions = sqliteStorage.getQuestions();
    } else {
      questions = [];
    }

    if (limit > 0) {
      questions = questions.slice(0, limit);
    }

    const total = sessionId
      ? sqliteStorage.getQuestionCountForUser(sessionId)
      : isAdminQuestionsRequest(url)
        ? sqliteStorage.getQuestionCount()
        : 0;

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
