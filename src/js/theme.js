import { APP } from "./app.config.js";

export function getTheme() {
  return localStorage.getItem(APP.storageKeys.theme) || "dusk";
}

export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(APP.storageKeys.theme, theme);
}

export function initTheme() {
  setTheme(getTheme());
}
