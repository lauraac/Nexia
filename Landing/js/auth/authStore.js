window.NexiaAuth = (function () {
  const KEYS = {
    users: "nexia_users_v1",
    session: "nexia_session_v1",
  };

  function _read(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  }

  function _write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function _hashPassword(pw) {
    // ⚠️ Solo demo. Luego se va al backend.
    let h = 0;
    for (let i = 0; i < pw.length; i++) h = (h * 31 + pw.charCodeAt(i)) >>> 0;
    return "h_" + h.toString(16);
  }

  function getSession() {
    return _read(KEYS.session, null);
  }

  function setSession(session) {
    _write(KEYS.session, session);
  }

  function clearSession() {
    localStorage.removeItem(KEYS.session);
  }

  function getUsers() {
    return _read(KEYS.users, []);
  }

  function setUsers(users) {
    _write(KEYS.users, users);
  }

  // ✅ Ready for future API:
  // window.NexiaAuthApi = { register(){...}, login(){...} }

  function register({ name, email, password }) {
    const users = getUsers();
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (exists) throw new Error("Ese correo ya está registrado.");

    const user = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: _hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    setUsers(users);

    // Auto login
    const session = {
      token: "local_token_" + Date.now(),
      user: { id: user.id, name: user.name, email: user.email },
      createdAt: new Date().toISOString(),
    };
    setSession(session);

    return session;
  }

  function login({ email, password }) {
    const users = getUsers();
    const user = users.find((u) => u.email === email.trim().toLowerCase());
    if (!user) throw new Error("Correo o contraseña incorrectos.");

    const hash = _hashPassword(password);
    if (user.passwordHash !== hash)
      throw new Error("Correo o contraseña incorrectos.");

    const session = {
      token: "local_token_" + Date.now(),
      user: { id: user.id, name: user.name, email: user.email },
      createdAt: new Date().toISOString(),
    };
    setSession(session);
    return session;
  }

  function logout() {
    clearSession();
  }

  return { register, login, logout, getSession };
})();
