import { writable, derived } from 'svelte/store';
import type { QuestionHistory, QuestionFilters } from '$lib/utils/questionStorage';
import { getSessionId, getDeviceFingerprint } from '$lib/utils/macAddress';

// Create writable stores for data
const questionsData = writable<QuestionHistory[]>([]);
const questionCountData = writable(0);
const bookmarkedCountData = writable(0);

// Create a writable store for triggering updates
const questionUpdateTrigger = writable(0);

// Derived stores that update when triggered
export const questionCount = derived(questionUpdateTrigger, () => {
	let value = 0;
	questionCountData.subscribe(v => value = v)();
	return value;
});
export const bookmarkedCount = derived(questionUpdateTrigger, () => {
	let value = 0;
	bookmarkedCountData.subscribe(v => value = v)();
	return value;
});
export const questions = derived(questionUpdateTrigger, () => {
	let value: QuestionHistory[] = [];
	questionsData.subscribe(v => value = v)();
	return value;
});

// Function to trigger updates
export function triggerQuestionUpdate() {
	questionUpdateTrigger.update(n => n + 1);
}

// Function to load questions from API
async function loadQuestions() {
	try {
		// Get user session information
		const sessionId = getSessionId();
		const userMac = getDeviceFingerprint();
		
		const params = new URLSearchParams();
		if (sessionId) params.append('sessionId', sessionId);
		
		const response = await fetch(`/api/questions?${params.toString()}`);
		if (response.ok) {
			const data = await response.json();
			questionsData.set(data.questions || []);
			questionCountData.set(data.total || 0);
		}
	} catch (error) {
		console.error('Failed to load questions:', error);
	}
}

// Function to load counts from API
async function loadCounts() {
	try {
		const response = await fetch('/api/stats');
		if (response.ok) {
			const data = await response.json();
			questionCountData.set(data.total || 0);
			bookmarkedCountData.set(data.bookmarked || 0);
		}
	} catch (error) {
		console.error('Failed to load counts:', error);
	}
}

// Wrapper functions that make API calls
export async function saveQuestion(question: Omit<QuestionHistory, 'id' | 'timestamp'>) {
	try {
		const response = await fetch('/api/questions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(question)
		});
		if (response.ok) {
			await loadQuestions();
			await loadCounts();
			triggerQuestionUpdate();
		}
	} catch (error) {
		console.error('Failed to save question:', error);
	}
}

export async function toggleBookmark(questionId: string) {
	try {
		const response = await fetch(`/api/questions/${questionId}/bookmark`, {
			method: 'POST'
		});
		if (response.ok) {
			await loadQuestions();
			await loadCounts();
			triggerQuestionUpdate();
		}
	} catch (error) {
		console.error('Failed to toggle bookmark:', error);
	}
}

export async function deleteQuestion(questionId: string) {
	try {
		const response = await fetch(`/api/questions/${questionId}`, {
			method: 'DELETE'
		});
		if (response.ok) {
			await loadQuestions();
			await loadCounts();
			triggerQuestionUpdate();
		}
	} catch (error) {
		console.error('Failed to delete question:', error);
	}
}

export async function updateQuestionSource(questionId: string, updates: { responsePreview?: string; source?: string }) {
	try {
		const response = await fetch(`/api/questions/${questionId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updates)
		});
		if (response.ok) {
			await loadQuestions();
			triggerQuestionUpdate();
		}
	} catch (error) {
		console.error('Failed to update question:', error);
	}
}

export async function searchQuestions(filters: QuestionFilters) {
	try {
		// Get user session information
		const sessionId = getSessionId();
		const userMac = getDeviceFingerprint();
		
		const params = new URLSearchParams();
		if (filters.category) params.append('category', filters.category);
		if (filters.searchTerm) params.append('search', filters.searchTerm);
		if (filters.bookmarkedOnly !== undefined) params.append('bookmarked', filters.bookmarkedOnly.toString());
		if (sessionId) params.append('sessionId', sessionId);
		
		const response = await fetch(`/api/questions?${params.toString()}`);
		if (response.ok) {
			const data = await response.json();
			return data.questions || [];
		}
		return [];
	} catch (error) {
		console.error('Failed to search questions:', error);
		return [];
	}
}

export async function getQuestionsByCategory(category: string) {
	return searchQuestions({ category });
}

export async function exportQuestions() {
	try {
		const response = await fetch('/api/questions');
		if (response.ok) {
			const data = await response.json();
			return JSON.stringify(data.questions || [], null, 2);
		}
		return '[]';
	} catch (error) {
		console.error('Failed to export questions:', error);
		return '[]';
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
		console.error('Failed to import questions:', error);
	}
}

// Initialize data on first load
if (typeof window !== 'undefined') {
	loadQuestions();
	loadCounts();
} 