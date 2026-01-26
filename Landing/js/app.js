(function () {
  const root = document.getElementById("app");
  if (!root) return;

  root.innerHTML = `
    <div class="landing">
      <header id="topbarMount"></header>
      <main class="landing__main">
        <section id="heroMount"></section>

        <section class="landing__showcase" aria-label="Categorías">
          <div class="showcase">
            <div class="showcase__grid" id="showcaseGrid"></div>
          </div>
        </section>
      </main>

      <footer class="landing__footer">
        <div class="container footer">
          <div class="footer__left">
            <div class="brandMini">
              <span class="brandMini__dot" aria-hidden="true"></span>
              <span class="brandMini__name">NEXIA</span>
            </div>
            <div class="tiny muted">Hecho para crear rápido y con estilo.</div>
          </div>
          <div class="footer__right tiny muted">
            © <span id="year"></span> Nexia Studio
          </div>
        </div>
      </footer>
            <div id="authModalMount"></div>

    </div>
  `;

  // Mount components
  document.getElementById("topbarMount").innerHTML = window.NexiaTopbar();
  document.getElementById("heroMount").innerHTML = window.NexiaHero();

  // Mount auth modal
  document.getElementById("authModalMount").innerHTML = window.NexiaAuthModal();

  // --- Auth UI helpers
  // --- Auth UI helpers
  const authArea = document.getElementById("authArea");
  const userArea = document.getElementById("userArea");
  const helloUser = document.getElementById("helloUser");

  function refreshAuthUI() {
    const session = window.NexiaAuth.getSession();

    if (session?.user) {
      authArea.style.display = "none";
      userArea.style.display = "flex";
      helloUser.textContent = `Hola, ${session.user.name}`;
    } else {
      authArea.style.display = "flex";
      userArea.style.display = "none";
    }
  }

  refreshAuthUI();

  // --- Modal controls
  const backdrop = document.getElementById("authBackdrop");
  const authTitle = document.getElementById("authTitle");
  const authForm = document.getElementById("authForm");
  const authAlert = document.getElementById("authAlert");
  const fieldName = document.getElementById("fieldName");
  const authName = document.getElementById("authName");
  const authEmail = document.getElementById("authEmail");
  const authPassword = document.getElementById("authPassword");
  const authSwitch = document.getElementById("authSwitch");
  const authSubmit = document.getElementById("authSubmit");

  let mode = "login"; // or "register"

  function showAlert(msg, ok = false) {
    authAlert.style.display = "block";
    authAlert.textContent = msg;
    authAlert.classList.toggle("is-ok", ok);
  }
  function clearAlert() {
    authAlert.style.display = "none";
    authAlert.textContent = "";
    authAlert.classList.remove("is-ok");
  }

  function setMode(next) {
    mode = next;
    clearAlert();
    if (mode === "register") {
      authTitle.textContent = "Crear cuenta";
      fieldName.style.display = "grid";
      authSubmit.textContent = "Registrarme";
      authSwitch.textContent = "¿Ya tienes cuenta? Inicia sesión";
      authPassword.setAttribute("autocomplete", "new-password");
    } else {
      authTitle.textContent = "Iniciar sesión";
      fieldName.style.display = "none";
      authSubmit.textContent = "Iniciar sesión";
      authSwitch.textContent = "¿No tienes cuenta? Regístrate";
      authPassword.setAttribute("autocomplete", "current-password");
    }
  }

  function openModal(openMode) {
    setMode(openMode);
    backdrop.classList.add("is-open");
    backdrop.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      (mode === "register" ? authName : authEmail).focus();
    }, 0);
  }

  function closeModal() {
    backdrop.classList.remove("is-open");
    backdrop.setAttribute("aria-hidden", "true");
    authForm.reset();
    clearAlert();
  }

  // Buttons from topbar
  document
    .getElementById("btnSignup")
    ?.addEventListener("click", () => openModal("register"));
  document
    .getElementById("btnLogin")
    ?.addEventListener("click", () => openModal("login"));

  // Close handlers
  document.getElementById("authClose")?.addEventListener("click", closeModal);
  document.getElementById("authCancel")?.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("is-open"))
      closeModal();
  });

  // Switch login/register
  authSwitch.addEventListener("click", () =>
    setMode(mode === "login" ? "register" : "login"),
  );

  // Submit
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAlert();

    const email = (authEmail.value || "").trim();
    const password = (authPassword.value || "").trim();
    const name = (authName.value || "").trim();

    // Validations
    if (!email.includes("@")) return showAlert("Escribe un correo válido.");
    if (password.length < 6)
      return showAlert("La contraseña debe tener al menos 6 caracteres.");
    if (mode === "register" && name.length < 2)
      return showAlert("Escribe tu nombre.");

    try {
      if (mode === "register") {
        window.NexiaAuth.register({ name, email, password });
        showAlert("Cuenta creada ✅", true);
      } else {
        window.NexiaAuth.login({ email, password });
        showAlert("Sesión iniciada ✅", true);
      }

      refreshAuthUI();
      refreshAuthUI();

      // ✅ manda al dashboard (página principal)
      setTimeout(() => {
        window.location.href = "../dashboard.html";
      }, 350);
    } catch (err) {
      showAlert(err?.message || "Ocurrió un error.");
    }
  });

  // Logout
  document.getElementById("btnLogout")?.addEventListener("click", () => {
    window.NexiaAuth.logout();
    refreshAuthUI();
  });

  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Showcase (placeholder para APIs futuras)
  const items = [
    {
      title: "Invitación XV",
      desc: "Plantillas elegantes y modernas.",
      tag: "PRO",
    },
    { title: "Boda", desc: "Diseños premium con RSVP.", tag: "TOP" },
    { title: "Cumpleaños", desc: "Estilo divertido y fácil.", tag: "NEW" },
    {
      title: "Post Instagram",
      desc: "Formatos listos para redes.",
      tag: "SOCIAL",
    },
    { title: "Presentación", desc: "Slides limpias y pro.", tag: "WORK" },
    { title: "Logo", desc: "Próximo: editor de logos.", tag: "API" },
    { title: "Iconos", desc: "Próximo: API de iconos.", tag: "API" },
    { title: "IA", desc: "Próximo: prompts + generación.", tag: "SOON" },
    { title: "Video", desc: "Próximo: animaciones.", tag: "SOON" },
    { title: "Sticker", desc: "Próximo: catálogo.", tag: "API" },
    { title: "Mockups", desc: "Próximo: export pro.", tag: "SOON" },
    { title: "QR & RSVP", desc: "Próximo: backend.", tag: "DB" },
  ];

  const grid = document.getElementById("showcaseGrid");
  if (grid) {
    grid.innerHTML = items
      .map(
        (i) => `
      <article class="card">
        <div class="card__tag">${i.tag}</div>
        <div class="card__title">${i.title}</div>
        <div class="card__desc">${i.desc}</div>
      </article>
    `,
      )
      .join("");
  }

  // Theme toggle (dark default)
  const themeBtn = document.getElementById("themeBtn");
  const setThemeIcon = () => {
    const t = document.documentElement.getAttribute("data-theme");
    if (themeBtn) themeBtn.textContent = t === "dark" ? "☾" : "☀";
  };

  const saved = localStorage.getItem("nexia_theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
  }
  setThemeIcon();

  themeBtn?.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("nexia_theme", next);
    setThemeIcon();
  });

  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");

  menuBtn?.addEventListener("click", () => {
    const isOpen = mobilePanel?.style.display === "block";
    if (mobilePanel) mobilePanel.style.display = isOpen ? "none" : "block";
  });

  // CTA (placeholder: después conectamos al editor real)
  const goEditor = () =>
    alert("Luego conectamos esto al Editor ✅ (placeholder)");
  document.getElementById("btnStart")?.addEventListener("click", goEditor);
  document
    .getElementById("btnStartMobile")
    ?.addEventListener("click", goEditor);
})();
