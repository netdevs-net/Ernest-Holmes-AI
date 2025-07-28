import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Theme types
export type Theme = 'dark' | 'light';

// Get initial theme from localStorage or default to dark
function getInitialTheme(): Theme {
  if (browser) {
    const saved = localStorage.getItem('holmes-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  }
  return 'dark';
}

// Create the theme store
export const theme = writable<Theme>(getInitialTheme());

// Subscribe to theme changes and save to localStorage
if (browser) {
  theme.subscribe((value) => {
    localStorage.setItem('holmes-theme', value);
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', value);
    document.documentElement.classList.toggle('dark', value === 'dark');
    document.documentElement.classList.toggle('light', value === 'light');
  });
}

// Theme toggle function
export function toggleTheme() {
  theme.update(current => current === 'dark' ? 'light' : 'dark');
}

// Set specific theme
export function setTheme(newTheme: Theme) {
  theme.set(newTheme);
} 