import { writable, derived } from "svelte/store";
import type {
  QuestionHistory,
  QuestionFilters,
} from "$lib/utils/questionStorage";
import { getSessionId, getDeviceFingerprint } from "$lib/utils/macAddress";

// Create writable stores for data
const questionsData = writable<QuestionHistory[]>([]);
const questionCountData = writable(0);
const bookmarkedCountData = writable(0);

// Create a writable store for triggering updates
const questionUpdateTrigger = writable(0);

// Derived stores that update when triggered
export const questionCount = derived(
  [questionUpdateTrigger, questionCountData],
  ([_, count]) => count,
);
export const bookmarkedCount = derived(
  [questionUpdateTrigger, bookmarkedCountData],
  ([_, count]) => count,
);
export const questions = derived(
  [questionUpdateTrigger, questionsData],
  ([_, questions]) => questions,
);

// Function to trigger updates
export function triggerQuestionUpdate() {
  questionUpdateTrigger.update((n) => n + 1);
}

// Function to load questions from API
async function loadQuestions() {
  try {
    // Get user session information
    const sessionId = getSessionId();
    const userMac = getDeviceFingerprint();

    const params = new URLSearchParams();
    if (sessionId) params.append("sessionId", sessionId);

    const response = await fetch(`/api/questions?${params.toString()}`);
    if (response.ok) {
      const data = await response.json();
      const questions = data.questions || [];
      const total = data.total || questions.length;

      console.log("Loading questions from API:", {
        questionsCount: questions.length,
        total,
        sessionId,
      });

      questionsData.set(questions);
      questionCountData.set(total);
    }
  } catch (error) {
    console.error("Failed to load questions:", error);
  }
}

// Function to load counts from API
async function loadCounts() {
  try {
    const response = await fetch("/api/stats");
    if (response.ok) {
      const data = await response.json();
      const total = data.questions?.total || 0;
      const bookmarked = data.questions?.bookmarked || 0;

      console.log("Loading counts from API:", { total, bookmarked, data });

      questionCountData.set(total);
      bookmarkedCountData.set(bookmarked);
    }
  } catch (error) {
    console.error("Failed to load counts:", error);
  }
}

// Wrapper functions that make API calls
export async function saveQuestion(
  question: Omit<QuestionHistory, "id" | "timestamp">,
) {
  try {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question),
    });
    if (response.ok) {
      // Update the local count immediately for better UX
      questionCountData.update((count) => count + 1);
      triggerQuestionUpdate();

      // Then refresh from server to ensure accuracy
      await loadQuestions();
      await loadCounts();
    }
  } catch (error) {
    console.error("Failed to save question:", error);
  }
}

export async function toggleBookmark(questionId: string) {
  try {
    const response = await fetch(`/api/questions/${questionId}/bookmark`, {
      method: "POST",
    });
    if (response.ok) {
      await loadQuestions();
      await loadCounts();
      triggerQuestionUpdate();
    }
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    const response = await fetch(`/api/questions/${questionId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await loadQuestions();
      await loadCounts();
      triggerQuestionUpdate();
    }
  } catch (error) {
    console.error("Failed to delete question:", error);
  }
}

export async function updateQuestionSource(
  questionId: string,
  updates: { responsePreview?: string; source?: string },
) {
  try {
    const response = await fetch(`/api/questions/${questionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (response.ok) {
      await loadQuestions();
      triggerQuestionUpdate();
    }
  } catch (error) {
    console.error("Failed to update question:", error);
  }
}

export async function searchQuestions(filters: QuestionFilters) {
  try {
    // Get user session information
    const sessionId = getSessionId();
    const userMac = getDeviceFingerprint();

    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.searchTerm) params.append("search", filters.searchTerm);
    if (filters.bookmarkedOnly !== undefined)
      params.append("bookmarked", filters.bookmarkedOnly.toString());
    if (sessionId) params.append("sessionId", sessionId);

    const response = await fetch(`/api/questions?${params.toString()}`);
    if (response.ok) {
      const data = await response.json();
      return data.questions || [];
    }
    return [];
  } catch (error) {
    console.error("Failed to search questions:", error);
    return [];
  }
}

export async function getQuestionsByCategory(category: string) {
  return searchQuestions({ category });
}

export async function exportQuestions() {
  try {
    const response = await fetch("/api/questions");
    if (response.ok) {
      const data = await response.json();
      return JSON.stringify(data.questions || [], null, 2);
    }
    return "[]";
  } catch (error) {
    console.error("Failed to export questions:", error);
    return "[]";
  }
}

export async function importQuestions(jsonData: string) {
  try {
    const questions = JSON.parse(jsonData);
    for (const question of questions) {
      await saveQuestion(question);
    }
    await loadQuestions();
    await loadCounts();
    triggerQuestionUpdate();
  } catch (error) {
    console.error("Failed to import questions:", error);
  }
}

// Function to refresh all data
export async function refreshQuestionData() {
  await loadQuestions();
  await loadCounts();
  triggerQuestionUpdate();
}

// Initialize data on first load
if (typeof window !== "undefined") {
  // Load data immediately
  loadQuestions();
  loadCounts();

  // Also refresh data when the page becomes visible (in case data was added in another tab)
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        refreshQuestionData();
      }
    });
  }

  // Debug subscription to track question count changes
  questionCount.subscribe((count) => {
    console.log("Question count updated:", count);
  });
}
