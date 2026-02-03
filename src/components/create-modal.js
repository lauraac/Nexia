import { initSizeView } from "./create-modal/views/size/size.js";

export async function mountCreateModal({ mountId, openButtonId } = {}) {
  const mount = document.getElementById(mountId);
  const openBtn = document.getElementById(openButtonId);

  if (!mount) {
    console.warn("[create-modal] No existe mount:", mountId);
    return;
  }
  if (!openBtn) {
    console.warn("[create-modal] No existe botón +:", openButtonId);
    return;
  }

  // 1) Carga HTML del modal (tu archivo real está aquí)
  const html = await fetch("./src/components/create-modal.html", {
    cache: "no-store",
  }).then((r) => r.text());
  mount.innerHTML = html;

  // 2) Inicializa el comportamiento
  initCreateModal({ openBtnId: openButtonId });
}

// src/components/create-modal.js
import { initSizeView } from "./create-modal/views/size/size.js";

async function loadView(viewName) {
  const mount = document.getElementById("cmodalViewMount");
  if (!mount) return;

  // por ahora solo size; luego agregas más
  if (viewName === "size") {
    const html = await fetch(
      "./src/components/create-modal/views/size/size.html",
      { cache: "no-store" },
    ).then((r) => r.text());
    mount.innerHTML = html;

    // carga css (si no lo estás cargando global)
    // TIP: si ya lo importas en create-modal.css no necesitas esto
    initSizeView(mount);
    return;
  }

  mount.innerHTML = `<div style="padding:16px;color:rgba(235,242,255,.75)">Vista "${viewName}" en construcción…</div>`;
}

export function initCreateModal() {
  const modal = document.getElementById("createModal");
  const backdrop = document.getElementById("createBackdrop");
  const closeBtn = document.getElementById("closeCreate");

  const btnNew = document.getElementById("btnNew"); // el plus del sidebar
  const items = modal?.querySelectorAll(".cmodal__item[data-view]") || [];

  function open() {
    modal?.classList.add("show");
    document.body.classList.add("noScroll");
    // default: para ti o size como quieras
    loadView("size"); // 👈 si quieres que abra directo tamaño
  }

  function close() {
    modal?.classList.remove("show");
    document.body.classList.remove("noScroll");
  }

  btnNew?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      items.forEach((b) => b.classList.remove("isActive"));
      btn.classList.add("isActive");
      loadView(btn.dataset.view);
    });
  });
}
