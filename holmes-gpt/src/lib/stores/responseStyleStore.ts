import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Response style types
export type ResponseStyle = "modern" | "his-words";

// Get initial response style from localStorage or default to modern
function getInitialResponseStyle(): ResponseStyle {
  if (browser) {
    const saved = localStorage.getItem("holmes-response-style");
    if (saved === "modern" || saved === "his-words") {
      return saved;
    }
  }
  return "modern"; // Default to modern
}

// Create the response style store
export const responseStyle = writable<ResponseStyle>(getInitialResponseStyle());

// Subscribe to response style changes and save to localStorage
if (browser) {
  responseStyle.subscribe((value) => {
    localStorage.setItem("holmes-response-style", value);
  });
}

// Toggle response style function
export function toggleResponseStyle() {
  responseStyle.update((current) =>
    current === "modern" ? "his-words" : "modern",
  );
}

// Set specific response style
export function setResponseStyle(style: ResponseStyle) {
  responseStyle.set(style);
}
