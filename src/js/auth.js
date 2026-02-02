import { APP } from "./app.config.js";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(APP.storageKeys.users) || "[]");
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem(APP.storageKeys.users, JSON.stringify(users));
}

export function register({ name, email, password }) {
  const users = loadUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (exists) return { ok: false, code: "EXISTS" };

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: btoa(password), // demo local (luego se cambia por hash real + backend)
  };
  users.push(user);
  saveUsers(users);
  return { ok: true };
}

export function login({ email, password }) {
  const users = loadUsers();
  const found = users.find((u) => u.email === email.trim().toLowerCase());
  if (!found) return { ok: false };

  if (found.passwordHash !== btoa(password)) return { ok: false };

  const session = { userId: found.id, at: Date.now() };
  localStorage.setItem(APP.storageKeys.session, JSON.stringify(session));
  return {
    ok: true,
    user: { id: found.id, name: found.name, email: found.email },
  };
}

export function logout() {
  localStorage.removeItem(APP.storageKeys.session);
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(APP.storageKeys.session) || "null");
  } catch {
    return null;
  }
}

export function requireAuth() {
  const s = getSession();
  if (!s) window.location.href = "./login.html";
}
