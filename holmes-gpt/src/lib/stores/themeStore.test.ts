import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { theme, toggleTheme, setTheme } from './themeStore';

// Mock browser environment
vi.mock('$app/environment', () => ({
	browser: true
}));

describe('Theme Store', () => {
	beforeEach(() => {
		// Reset localStorage mock
		vi.clearAllMocks();
		// Reset theme to dark
		setTheme('dark');
	});

	it('should initialize with dark theme by default', () => {
		expect(get(theme)).toBe('dark');
	});

	it('should toggle theme from dark to light', () => {
		expect(get(theme)).toBe('dark');
		toggleTheme();
		expect(get(theme)).toBe('light');
	});

	it('should toggle theme from light to dark', () => {
		setTheme('light');
		expect(get(theme)).toBe('light');
		toggleTheme();
		expect(get(theme)).toBe('dark');
	});

	it('should set specific theme', () => {
		setTheme('light');
		expect(get(theme)).toBe('light');
		setTheme('dark');
		expect(get(theme)).toBe('dark');
	});

	it('should save theme to localStorage', () => {
		setTheme('light');
		expect(localStorage.setItem).toHaveBeenCalledWith('holmes-theme', 'light');
	});
}); 