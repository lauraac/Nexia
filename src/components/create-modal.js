// src/components/create-modal.js
// Carga el HTML del modal y maneja vistas (size, etc.) con import dinámico.

let isBound = false;

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function openModal() {
  const modal = qs("#createModal");
  if (!modal) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("noScroll");
}

function closeModal() {
  const modal = qs("#createModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("noScroll");
}

function setActiveLeft(btn) {
  const left = qs(".cmodal__left");
  if (!left) return;
  left
    .querySelectorAll(".cmodal__item")
    .forEach((b) => b.classList.remove("isActive"));
  btn.classList.add("isActive");
}

async function loadView(viewName) {
  const mount = qs("#cmodalViewMount");
  if (!mount) return;

  mount.innerHTML = "";

  try {
    // ✅ Rutas absolutas basadas en ESTE archivo (create-modal.js)
    const base = new URL(
      `./create-modal/views/${viewName}/${viewName}`,
      import.meta.url,
    );

    const htmlUrl = `${base}.html`;
    const jsUrl = `${base}.js`;

    const html = await fetch(htmlUrl, { cache: "no-store" }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
      return r.text();
    });

    mount.innerHTML = html;

    const mod = await import(jsUrl);
    if (mod?.initView) mod.initView(mount);
    if (viewName === "size" && mod?.initSizeView) mod.initSizeView(mount);
  } catch (e) {
    mount.innerHTML = `
      <div style="padding:16px;opacity:.85">
        <b>No se pudo cargar la vista:</b> ${viewName}<br/>
        Revisa rutas / archivos.
      </div>`;
    console.error(e);
  }
}

export async function mountCreateModal({
  mountId,
  openButtonId,
  defaultView = "size",
} = {}) {
  const mount = document.getElementById(mountId);
  if (!mount) {
    console.warn("[create-modal] No existe mount:", mountId);
    return;
  }

  const html = await fetch("./src/components/create-modal.html", {
    cache: "no-store",
  }).then((r) => r.text());
  mount.innerHTML = html;

  initCreateModal({ openButtonId, defaultView });
}
function createProjectFromSize({ width, height, unit, widthPx, heightPx }) {
  const id = "nx_" + Math.random().toString(16).slice(2) + "_" + Date.now();

  const project = {
    id,
    title: "Diseño sin título",
    width,
    height,
    unit,
    widthPx,
    heightPx,
    createdAt: new Date().toISOString(),
    doc: { pages: [{ id: "p1", elements: [] }] },
  };

  const key = "nexia:projects";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.unshift(project);
  localStorage.setItem(key, JSON.stringify(list));
  localStorage.setItem("nexia:currentProjectId", id);

  return id;
}

export function initCreateModal({
  openButtonId = "btnNew",
  defaultView = "size",
} = {}) {
  if (isBound) return;
  isBound = true;

  document.addEventListener("click", async (e) => {
    const openBtn = e.target.closest(`#${openButtonId}`);
    if (openBtn) {
      e.preventDefault();
      openModal();

      // carga la vista default al abrir
      const leftBtn = qs(`.cmodal__item[data-view="${defaultView}"]`);
      if (leftBtn) setActiveLeft(leftBtn);

      await loadView(defaultView);
      return;
    }

    const closeBtn = e.target.closest("[data-close='1']");
    if (closeBtn) {
      e.preventDefault();
      closeModal();
      return;
    }

    const viewBtn = e.target.closest(".cmodal__item[data-view]");
    if (viewBtn) {
      e.preventDefault();
      setActiveLeft(viewBtn);
      await loadView(viewBtn.dataset.view);
      return;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  // ✅ Escucha cuando "Elegir tamaño" pide crear diseño
  document.addEventListener("nexia:createDesign", (e) => {
    const d = e.detail || {};
    const id = createProjectFromSize(d);

    // cierra modal
    closeModal();

    // navega al editor (tu ruta real)
    window.location.href = `./src/editor/editor.html?designId=${encodeURIComponent(id)}`;
  });
}
