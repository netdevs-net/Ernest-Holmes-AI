import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Theme types
export type Theme = "dark" | "light";

// Get initial theme from localStorage, time-based default, or system preference
function getInitialTheme(): Theme {
  if (browser) {
    const saved = localStorage.getItem("holmes-theme");
    console.log("Initial theme from localStorage:", saved);

    // If user has explicitly set a theme, use it
    if (saved === "light" || saved === "dark") {
      console.log("Using saved theme:", saved);
      return saved;
    }

    // Check if user has enabled auto theme switching
    const autoTheme = localStorage.getItem("holmes-auto-theme");
    if (autoTheme === "enabled" || autoTheme === null) {
      // Enable by default for new users
      const currentHour = new Date().getHours();
      const isDaytime = currentHour >= 7 && currentHour < 19; // 7am to 7pm
      const timeBasedTheme = isDaytime ? "light" : "dark";
      console.log(
        `Time-based theme: ${timeBasedTheme} (current hour: ${currentHour})`,
      );

      // Enable auto theme for new users
      if (autoTheme === null) {
        localStorage.setItem("holmes-auto-theme", "enabled");
        console.log("Auto theme enabled by default for new user");
      }

      return timeBasedTheme;
    }

    // Check system preference as fallback
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

// Enable auto theme switching based on time
export function enableAutoTheme() {
  console.log("Enabling auto theme switching");
  localStorage.setItem("holmes-auto-theme", "enabled");
  // Apply current time-based theme
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 7 && currentHour < 19; // 7am to 7pm
  const timeBasedTheme = isDaytime ? "light" : "dark";
  console.log(
    `Auto theme enabled, applying: ${timeBasedTheme} (current hour: ${currentHour})`,
  );
  theme.set(timeBasedTheme);
}

// Disable auto theme switching
export function disableAutoTheme() {
  console.log("Disabling auto theme switching");
  localStorage.removeItem("holmes-auto-theme");
}

// Check if auto theme is enabled
export function isAutoThemeEnabled(): boolean {
  if (browser) {
    return localStorage.getItem("holmes-auto-theme") === "enabled";
  }
  return false;
}

// Get current time-based theme without applying it
export function getTimeBasedTheme(): Theme {
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 7 && currentHour < 19; // 7am to 7pm
  return isDaytime ? "light" : "dark";
}

// Get current time info for debugging
export function getTimeInfo() {
  const now = new Date();
  const currentHour = now.getHours();
  const isDaytime = currentHour >= 7 && currentHour < 19;
  const timeBasedTheme = isDaytime ? "light" : "dark";

  return {
    currentHour,
    isDaytime,
    timeBasedTheme,
    currentTime: now.toLocaleTimeString(),
    autoThemeEnabled: isAutoThemeEnabled(),
  };
}

// Apply time-based theme if auto theme is enabled
export function applyTimeBasedTheme() {
  if (isAutoThemeEnabled()) {
    const timeBasedTheme = getTimeBasedTheme();
    console.log(`Auto theme: applying ${timeBasedTheme} based on current time`);
    theme.set(timeBasedTheme);
  }
}

// Initialize auto theme checking (call this on app startup)
export function initializeAutoTheme() {
  if (browser && isAutoThemeEnabled()) {
    // Check for theme updates every minute
    setInterval(() => {
      const currentTheme = getTimeBasedTheme();
      theme.update((existingTheme) => {
        if (existingTheme !== currentTheme) {
          console.log(
            `Auto theme: switching from ${existingTheme} to ${currentTheme}`,
          );
          return currentTheme;
        }
        return existingTheme;
      });
    }, 60000); // Check every minute

    console.log("Auto theme checking initialized");
  }
}
