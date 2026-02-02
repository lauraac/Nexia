import { APP } from "./app.config.js";

const dict = {
  es: {
    nav_design: "Diseñar",
    nav_product: "Producto",
    nav_plans: "Planes",
    nav_help: "Ayuda",
    btn_signup: "Registrarme",
    btn_login: "Iniciar sesión",
    hero_title: "¿Qué vamos a crear hoy?",
    hero_sub:
      "Crea diseños, presentaciones y contenido para redes sociales con una experiencia rápida y moderna.",
    hero_cta: "Empieza a diseñar",
    hero_secondary: "Ver demo",
    feat1_t: "Plantillas inteligentes",
    feat1_p: "Arranca con diseños listos y personalízalos sin complicarte.",
    feat2_t: "Editor rápido",
    feat2_p: "Interacciones fluidas y UI clara para trabajar sin fricción.",
    feat3_t: "Hecho para móviles",
    feat3_p: "Responsive real para celular, tablet y computadora.",
    auth_title: "Accede a tu cuenta",
    tab_login: "Entrar",
    tab_register: "Crear cuenta",
    email: "Correo",
    pass: "Contraseña",
    name: "Nombre",
    terms: "Al crear tu cuenta aceptas los términos y la privacidad.",
    do_login: "Iniciar sesión",
    do_register: "Registrarme",
    ok_login: "Sesión iniciada. Redirigiendo…",
    ok_register: "Cuenta creada. Ya puedes iniciar sesión.",
    err_fields: "Revisa los campos.",
    err_login: "Correo o contraseña incorrectos.",
    err_exists: "Ese correo ya existe.",
  },
  en: {
    nav_design: "Design",
    nav_product: "Product",
    nav_plans: "Plans",
    nav_help: "Help",
    btn_signup: "Sign up",
    btn_login: "Log in",
    hero_title: "What will we create today?",
    hero_sub:
      "Create designs, presentations and social content with a fast, modern experience.",
    hero_cta: "Start designing",
    hero_secondary: "View demo",
    feat1_t: "Smart templates",
    feat1_p: "Start from ready-made designs and customize with ease.",
    feat2_t: "Fast editor",
    feat2_p: "Smooth interactions and clear UI to work without friction.",
    feat3_t: "Mobile-first",
    feat3_p: "True responsive layout for phone, tablet and desktop.",
    auth_title: "Access your account",
    tab_login: "Login",
    tab_register: "Register",
    email: "Email",
    pass: "Password",
    name: "Name",
    terms: "By creating an account you accept terms & privacy.",
    do_login: "Log in",
    do_register: "Sign up",
    ok_login: "Signed in. Redirecting…",
    ok_register: "Account created. You can now log in.",
    err_fields: "Please check your fields.",
    err_login: "Wrong email or password.",
    err_exists: "That email already exists.",
  },
};

export function getLang() {
  return localStorage.getItem(APP.storageKeys.lang) || "es";
}

export function setLang(lang) {
  localStorage.setItem(APP.storageKeys.lang, lang);
  applyLang(lang);
}

export function applyLang(lang) {
  const t = dict[lang] || dict.es;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });

  // placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key]) el.setAttribute("placeholder", t[key]);
  });
}

export function initI18n() {
  applyLang(getLang());
}
