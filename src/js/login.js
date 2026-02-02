import { initTheme, setTheme, getTheme } from "./theme.js";
import { initI18n, setLang, getLang } from "./i18n.js";
import { login, register } from "./auth.js";
import { goToApp } from "./router.js";

function toast(msg, type = "ok") {
  const el = document.querySelector("#toast");
  if (!el) return;
  el.classList.remove("ok", "err", "show");
  el.textContent = msg;
  el.classList.add("show", type === "ok" ? "ok" : "err");
}

function setThemeLabel(theme) {
  const el = document.querySelector("#themeLabel");
  if (!el) return;
  el.textContent = theme === "night" ? "Night" : "Dusk";
}

function setTab(tab) {
  document
    .querySelectorAll(".tab")
    .forEach((b) => b.classList.remove("isActive"));
  document.querySelector(`#tab-${tab}`)?.classList.add("isActive");

  document.querySelector("#formLogin").style.display =
    tab === "login" ? "grid" : "none";
  document.querySelector("#formRegister").style.display =
    tab === "register" ? "grid" : "none";
  toast("", "ok");
  document.querySelector("#toast").classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initI18n();

  // theme
  const btnTheme = document.querySelector("#btnTheme");
  if (btnTheme) {
    setThemeLabel(getTheme());
    btnTheme.addEventListener("click", () => {
      const next = getTheme() === "dusk" ? "night" : "dusk";
      setTheme(next);
      setThemeLabel(next);
    });
  }

  // lang
  const langSel = document.querySelector("#langSel");
  if (langSel) {
    langSel.value = getLang();
    langSel.addEventListener("change", (e) => setLang(e.target.value));
  }

  // tabs
  document
    .querySelector("#tab-login")
    ?.addEventListener("click", () => setTab("login"));
  document
    .querySelector("#tab-register")
    ?.addEventListener("click", () => setTab("register"));

  // submit login
  document.querySelector("#formLogin")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#loginEmail").value;
    const password = document.querySelector("#loginPass").value;

    if (!email || !password) return toast("Revisa los campos.", "err");
    const res = login({ email, password });
    if (!res.ok) return toast("Correo o contraseña incorrectos.", "err");

    toast("Sesión iniciada. Redirigiendo…", "ok");
    setTimeout(goToApp, 650);
  });

  // submit register
  document.querySelector("#formRegister")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#regName").value;
    const email = document.querySelector("#regEmail").value;
    const password = document.querySelector("#regPass").value;

    if (!name || !email || password.length < 6)
      return toast("Revisa los campos.", "err");

    const res = register({ name, email, password });
    if (!res.ok && res.code === "EXISTS")
      return toast("Ese correo ya existe.", "err");

    toast("Cuenta creada. Ya puedes iniciar sesión.", "ok");
    setTab("login");
    document.querySelector("#loginEmail").value = email;
  });

  // default tab
  setTab("login");
});
