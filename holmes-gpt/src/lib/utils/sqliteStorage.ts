import { QuestionRepository } from '$lib/db/questionRepository';
import { ConversationRepository } from '$lib/db/conversationRepository';
import type { QuestionHistory, QuestionFilters } from './questionStorage';

export class SQLiteStorage {
  private questionRepo: QuestionRepository;
  private conversationRepo: ConversationRepository;

  constructor() {
    this.questionRepo = new QuestionRepository();
    this.conversationRepo = new ConversationRepository();
  }

  // Question-related methods
  saveQuestion(question: Omit<QuestionHistory, 'id' | 'timestamp'> & {
    userIp?: string;
    userMac?: string;
    userAgent?: string;
    sessionId?: string;
  }): void {
    this.questionRepo.saveQuestion(question);
  }

  getQuestions(): QuestionHistory[] {
    return this.questionRepo.getQuestions();
  }

  getQuestionsForUser(sessionId?: string, userMac?: string): QuestionHistory[] {
    return this.questionRepo.getQuestionsForUser(sessionId, userMac);
  }

  searchQuestions(filters: QuestionFilters): QuestionHistory[] {
    return this.questionRepo.searchQuestions(filters);
  }

  toggleBookmark(questionId: string): void {
    this.questionRepo.toggleBookmark(questionId);
  }

  deleteQuestion(questionId: string): void {
    this.questionRepo.deleteQuestion(questionId);
  }

  updateQuestionSource(questionId: string, updates: { responsePreview?: string; source?: string }): void {
    this.questionRepo.updateQuestionSource(questionId, updates);
  }

  getQuestionCount(): number {
    return this.questionRepo.getQuestionCount();
  }

  getQuestionCountForUser(sessionId?: string, userMac?: string): number {
    return this.questionRepo.getQuestionCountForUser(sessionId, userMac);
  }

  getBookmarkedCount(): number {
    return this.questionRepo.getBookmarkedCount();
  }

  exportQuestions(): string {
    return this.questionRepo.exportQuestions();
  }

  importQuestions(jsonData: string): void {
    this.questionRepo.importQuestions(jsonData);
  }

  // Conversation-related methods
  saveConversation(conversation: {
    questionId?: string;
    userMessage: string;
    assistantMessage: string;
    source?: string;
    userIp?: string;
    userMac?: string;
    userAgent?: string;
    sessionId?: string;
  }): string {
    return this.conversationRepo.saveConversation({
      questionId: conversation.questionId || null,
      userMessage: conversation.userMessage,
      assistantMessage: conversation.assistantMessage,
      source: conversation.source || null,
      userIp: conversation.userIp,
      userMac: conversation.userMac,
      userAgent: conversation.userAgent,
      sessionId: conversation.sessionId
    });
  }

  getConversations(): any[] {
    return this.conversationRepo.getConversations();
  }

  getConversationsByQuestionId(questionId: string): any[] {
    return this.conversationRepo.getConversationsByQuestionId(questionId);
  }

  getRecentConversations(limit: number = 20): any[] {
    return this.conversationRepo.getRecentConversations(limit);
  }

  deleteConversation(conversationId: string): void {
    this.conversationRepo.deleteConversation(conversationId);
  }

  getConversationCount(): number {
    return this.conversationRepo.getConversationCount();
  }

  getConversationStats(): any {
    return this.conversationRepo.getConversationStats();
  }

  exportConversations(): string {
    return this.conversationRepo.exportConversations();
  }

  importConversations(jsonData: string): void {
    this.conversationRepo.importConversations(jsonData);
  }

  searchConversations(searchTerm: string): any[] {
    return this.conversationRepo.searchConversations(searchTerm);
  }

  // Advanced query methods
  getQuestionsByCategory(category: string): QuestionHistory[] {
    return this.questionRepo.getQuestionsByCategory(category);
  }

  getRecentQuestions(limit: number = 10): QuestionHistory[] {
    return this.questionRepo.getRecentQuestions(limit);
  }

  getBookmarkedQuestions(): QuestionHistory[] {
    return this.questionRepo.getBookmarkedQuestions();
  }

  searchByTags(tags: string[]): QuestionHistory[] {
    return this.questionRepo.searchByTags(tags);
  }

  getConversationsByDateRange(startDate: Date, endDate: Date): any[] {
    return this.conversationRepo.getConversationsByDateRange(startDate, endDate);
  }

  getConversationsBySource(source: string): any[] {
    return this.conversationRepo.getConversationsBySource(source);
  }

  // Database management methods
  getDatabaseStats(): { questions: number; conversations: number; size: string } {
    const dbManager = require('$lib/db/database').default.getInstance();
    return dbManager.getStats();
  }

  // Migration helper - migrate from localStorage to SQLite
  async migrateFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const localStorageData = localStorage.getItem('holmes_questions');
      if (localStorageData) {
        const questions = JSON.parse(localStorageData);
        if (Array.isArray(questions)) {
          // Clear existing questions in SQLite
          this.questionRepo.importQuestions('[]');
          
          // Import questions from localStorage
          questions.forEach(question => {
            this.saveQuestion({
              question: question.question,
              category: question.category,
              isBookmarked: question.isBookmarked,
              tags: question.tags || [],
              responsePreview: question.responsePreview,
              source: question.source
            });
          });

          // Clear localStorage after successful migration
          localStorage.removeItem('holmes_questions');
          console.log(`Migrated ${questions.length} questions from localStorage to SQLite`);
        }
      }
    } catch (error) {
      console.error('Error migrating from localStorage:', error);
    }
  }

  // Backup and restore functionality
  exportAllData(): { questions: string; conversations: string; stats: any } {
    return {
      questions: this.exportQuestions(),
      conversations: this.exportConversations(),
      stats: this.getDatabaseStats()
    };
  }

  importAllData(data: { questions: string; conversations: string }): void {
    if (data.questions) {
      this.importQuestions(data.questions);
    }
    if (data.conversations) {
      this.importConversations(data.conversations);
    }
  }
}

// Create a singleton instance
const sqliteStorage = new SQLiteStorage();

// Export the singleton instance
export default sqliteStorage; 