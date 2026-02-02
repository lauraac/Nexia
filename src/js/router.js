import { getSession } from "./auth.js";

export function goToApp() {
  // app.html será tu “editor / dashboard”
  window.location.href = "./app.html";
}

export function goToLogin() {
  window.location.href = "./login.html";
}

export function isLoggedIn() {
  return !!getSession();
}
