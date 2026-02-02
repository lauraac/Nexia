import { initTheme, setTheme, getTheme } from "./theme.js";
import { initI18n, setLang, getLang } from "./i18n.js";
import { isLoggedIn } from "./router.js";

function setThemeLabel(theme) {
  const el = document.querySelector("#themeLabel");
  if (!el) return;
  el.textContent = theme === "night" ? "Night" : "Dusk";
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

  // CTA behavior
  const btnStart = document.querySelector("#btnStart");
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      window.location.href = isLoggedIn() ? "./app.html" : "./login.html";
    });
  }
});
