import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Theme types
export type Theme = "dark" | "light";

// Get initial theme from localStorage or default to dark
function getInitialTheme(): Theme {
  if (browser) {
    const saved = localStorage.getItem("holmes-theme");
    console.log("Initial theme from localStorage:", saved);
    if (saved === "light" || saved === "dark") {
      console.log("Using saved theme:", saved);
      return saved;
    }
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      console.log("Using system preference: light");
      return "light";
    }
  }
  console.log("Using default theme: dark");
  return "dark";
}

// Create the theme store
export const theme = writable<Theme>(getInitialTheme());

// Subscribe to theme changes and save to localStorage
if (browser) {
  theme.subscribe((value) => {
    console.log("Theme changed to:", value);
    localStorage.setItem("holmes-theme", value);
    // Apply theme to document
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", value);
      document.documentElement.classList.toggle("dark", value === "dark");
      document.documentElement.classList.toggle("light", value === "light");
      console.log("Applied theme to document:", value);
    }
  });
}

// Theme toggle function
export function toggleTheme() {
  theme.update((current) => {
    const newTheme = current === "dark" ? "light" : "dark";
    console.log("Toggling theme from", current, "to", newTheme);
    return newTheme;
  });
}

// Set specific theme
export function setTheme(newTheme: Theme) {
  console.log("Setting theme to:", newTheme);
  theme.set(newTheme);
}
