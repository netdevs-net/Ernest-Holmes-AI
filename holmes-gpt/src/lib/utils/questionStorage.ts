export interface QuestionHistory {
  id: string;
  question: string;
  category: "spiritual" | "practical" | "metaphysical" | "personal" | "general";
  timestamp: Date;
  isBookmarked: boolean;
  tags: string[];
  responsePreview?: string;
  source?: string;
  userIp?: string;
  userMac?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface QuestionFilters {
  category?: string;
  dateRange?: { start: Date; end: Date };
  searchTerm?: string;
  bookmarkedOnly?: boolean;
}

export class QuestionStorage {
  private static STORAGE_KEY = "holmes_questions";

  static saveQuestion(
    question: Omit<QuestionHistory, "id" | "timestamp">,
  ): void {
    if (typeof window === "undefined") return;
    const questions = this.getQuestions();
    const newQuestion: QuestionHistory = {
      ...question,
      id: this.generateId(),
      timestamp: new Date(),
    };

    questions.unshift(newQuestion); // Add to beginning
    this.saveQuestions(questions);
  }

  static getQuestions(): QuestionHistory[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static searchQuestions(filters: QuestionFilters): QuestionHistory[] {
    let questions = this.getQuestions();

    if (filters.category) {
      questions = questions.filter((q) => q.category === filters.category);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      questions = questions.filter(
        (q) =>
          q.question.toLowerCase().includes(term) ||
          q.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    if (filters.bookmarkedOnly) {
      questions = questions.filter((q) => q.isBookmarked);
    }

    if (filters.dateRange) {
      questions = questions.filter((q) => {
        const questionDate = new Date(q.timestamp);
        return (
          questionDate >= filters.dateRange!.start &&
          questionDate <= filters.dateRange!.end
        );
      });
    }

    return questions;
  }

  static toggleBookmark(questionId: string): void {
    if (typeof window === "undefined") return;
    const questions = this.getQuestions();
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      question.isBookmarked = !question.isBookmarked;
      this.saveQuestions(questions);
    }
  }

  static deleteQuestion(questionId: string): void {
    if (typeof window === "undefined") return;
    const questions = this.getQuestions();
    const filteredQuestions = questions.filter((q) => q.id !== questionId);
    this.saveQuestions(filteredQuestions);
  }

  static exportQuestions(): string {
    if (typeof window === "undefined") return "[]";
    const questions = this.getQuestions();
    return JSON.stringify(questions, null, 2);
  }

  static importQuestions(jsonData: string): void {
    if (typeof window === "undefined") return;
    try {
      const questions = JSON.parse(jsonData);
      if (Array.isArray(questions)) {
        this.saveQuestions(questions);
      }
    } catch (error) {
      console.error("Failed to import questions:", error);
    }
  }

  static getQuestionCount(): number {
    if (typeof window === "undefined") return 0;
    return this.getQuestions().length;
  }

  static getBookmarkedCount(): number {
    if (typeof window === "undefined") return 0;
    return this.getQuestions().filter((q) => q.isBookmarked).length;
  }

  static updateQuestionSource(
    questionId: string,
    updates: { responsePreview?: string; source?: string },
  ): void {
    if (typeof window === "undefined") return;
    const questions = this.getQuestions();
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      if (updates.responsePreview)
        question.responsePreview = updates.responsePreview;
      if (updates.source) question.source = updates.source;
      this.saveQuestions(questions);
    }
  }

  private static generateId(): string {
    return "q_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  private static saveQuestions(questions: QuestionHistory[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questions));
  }
}

// Utility function for extracting tags from questions
export function extractTags(question: string): string[] {
  const tags: string[] = [];
  const lowerQuestion = question.toLowerCase();

  // Spiritual concepts
  if (lowerQuestion.includes("principle")) tags.push("principle");
  if (lowerQuestion.includes("meditation")) tags.push("meditation");
  if (lowerQuestion.includes("prayer")) tags.push("prayer");
  if (lowerQuestion.includes("healing")) tags.push("healing");
  if (lowerQuestion.includes("success")) tags.push("success");
  if (lowerQuestion.includes("oneness")) tags.push("oneness");
  if (lowerQuestion.includes("infinite mind")) tags.push("infinite-mind");
  if (lowerQuestion.includes("spiritual law")) tags.push("spiritual-law");
  if (lowerQuestion.includes("creative power")) tags.push("creative-power");
  if (lowerQuestion.includes("divine intelligence"))
    tags.push("divine-intelligence");

  // Practical applications
  if (lowerQuestion.includes("daily")) tags.push("daily-practice");
  if (lowerQuestion.includes("challenge")) tags.push("challenges");
  if (lowerQuestion.includes("problem")) tags.push("problems");
  if (lowerQuestion.includes("relationship")) tags.push("relationships");
  if (lowerQuestion.includes("work") || lowerQuestion.includes("career"))
    tags.push("work");
  if (lowerQuestion.includes("health")) tags.push("health");
  if (lowerQuestion.includes("money") || lowerQuestion.includes("financial"))
    tags.push("money");

  // Personal growth
  if (lowerQuestion.includes("fear")) tags.push("fear");
  if (lowerQuestion.includes("doubt")) tags.push("doubt");
  if (lowerQuestion.includes("confidence")) tags.push("confidence");
  if (lowerQuestion.includes("peace")) tags.push("peace");
  if (lowerQuestion.includes("joy")) tags.push("joy");
  if (lowerQuestion.includes("love")) tags.push("love");

  return tags;
}
