import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
	length: 0,
	key: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

// Mock fetch
global.fetch = vi.fn();

// Mock navigator
Object.defineProperty(window, 'navigator', {
	value: {
		userAgent: 'test-user-agent',
	},
	writable: true,
});

// Mock screen
Object.defineProperty(window, 'screen', {
	value: {
		width: 1920,
		height: 1080,
	},
	writable: true,
}); 