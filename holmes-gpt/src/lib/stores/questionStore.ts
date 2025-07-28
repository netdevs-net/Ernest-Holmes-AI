import { writable, derived } from 'svelte/store';
import sqliteStorage from '$lib/utils/sqliteStorage';
import type { QuestionHistory, QuestionFilters } from '$lib/utils/questionStorage';

// Create a writable store for triggering updates
const questionUpdateTrigger = writable(0);

// Derived store for question count that updates when triggered
export const questionCount = derived(questionUpdateTrigger, () => {
	return sqliteStorage.getQuestionCount();
});

// Derived store for bookmarked count
export const bookmarkedCount = derived(questionUpdateTrigger, () => {
	return sqliteStorage.getBookmarkedCount();
});

// Derived store for all questions
export const questions = derived(questionUpdateTrigger, () => {
	return sqliteStorage.getQuestions();
});

// Function to trigger updates
export function triggerQuestionUpdate() {
	questionUpdateTrigger.update(n => n + 1);
}

// Wrapper functions that trigger updates
export function saveQuestion(question: Omit<QuestionHistory, 'id' | 'timestamp'>) {
	sqliteStorage.saveQuestion(question);
	triggerQuestionUpdate();
}

export function toggleBookmark(questionId: string) {
	sqliteStorage.toggleBookmark(questionId);
	triggerQuestionUpdate();
}

export function deleteQuestion(questionId: string) {
	sqliteStorage.deleteQuestion(questionId);
	triggerQuestionUpdate();
}

export function updateQuestionSource(questionId: string, updates: { responsePreview?: string; source?: string }) {
	sqliteStorage.updateQuestionSource(questionId, updates);
	triggerQuestionUpdate();
}

export function searchQuestions(filters: QuestionFilters) {
	return sqliteStorage.searchQuestions(filters);
}

export function getQuestionsByCategory(category: string) {
	return sqliteStorage.getQuestionsByCategory(category);
}

export function exportQuestions() {
	return sqliteStorage.exportQuestions();
}

export function importQuestions(jsonData: string) {
	sqliteStorage.importQuestions(jsonData);
	triggerQuestionUpdate();
} 