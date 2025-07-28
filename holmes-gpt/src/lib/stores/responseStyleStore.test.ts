import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { responseStyle, toggleResponseStyle, setResponseStyle } from './responseStyleStore';

// Mock browser environment
vi.mock('$app/environment', () => ({
	browser: true
}));

describe('Response Style Store', () => {
	beforeEach(() => {
		// Reset localStorage mock
		vi.clearAllMocks();
		// Reset response style to modern
		setResponseStyle('modern');
	});

	it('should initialize with modern style by default', () => {
		expect(get(responseStyle)).toBe('modern');
	});

	it('should toggle from modern to his-words', () => {
		expect(get(responseStyle)).toBe('modern');
		toggleResponseStyle();
		expect(get(responseStyle)).toBe('his-words');
	});

	it('should toggle from his-words to modern', () => {
		setResponseStyle('his-words');
		expect(get(responseStyle)).toBe('his-words');
		toggleResponseStyle();
		expect(get(responseStyle)).toBe('modern');
	});

	it('should set specific response style', () => {
		setResponseStyle('his-words');
		expect(get(responseStyle)).toBe('his-words');
		setResponseStyle('modern');
		expect(get(responseStyle)).toBe('modern');
	});

	it('should save response style to localStorage', () => {
		setResponseStyle('his-words');
		expect(localStorage.setItem).toHaveBeenCalledWith('holmes-response-style', 'his-words');
	});
}); 