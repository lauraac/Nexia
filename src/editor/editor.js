import { bus } from "./modules/bus.js";
import { loadCurrentProject, ensureProjectHasPages } from "./modules/store.js";
import { initCanvas } from "./modules/canvas.js";
import { initZoom } from "./modules/zoom.js";
import { initPages } from "./modules/pages.js";
import { initFloatingBar } from "./modules/floatingbar.js";

// 👉 NUEVOS imports
import { createHistory, bindUndoRedoButtons } from "./modules/history.js";
import { initImages } from "./modules/images.js";
import { initClipboard } from "./modules/clipboard.js";
import { initBackground } from "./modules/background.js";

/* ===============================
   1️⃣ Cargar proyecto
================================ */
const project = loadCurrentProject();
ensureProjectHasPages(project);

/* ===============================
   2️⃣ Título y meta
================================ */
const titleEl = document.getElementById("docTitle");
const metaEl = document.getElementById("docMeta");

titleEl.textContent = project.title || "Diseño sin título";
metaEl.textContent = `${project.width} × ${project.height} ${project.unit}`;

/* ===============================
   3️⃣ Canvas
================================ */
const canvasApi = initCanvas(project);

/* ===============================
   4️⃣ Zoom visual (slider)
================================ */
initZoom(canvasApi);

/* ===============================
   5️⃣ Historial (UNDO / REDO)
================================ */
const history = createHistory();
bindUndoRedoButtons(history);

/* helper: página activa */
const getActivePage = () => project.doc.pages[project.doc.activePage || 0];

/* ===============================
   6️⃣ Funciones reales del editor
================================ */
initBackground({ canvasApi, history, getActivePage });
initImages({ canvasApi, history, getActivePage });
initClipboard({ canvasApi, history, getActivePage });

/* ===============================
   7️⃣ Páginas (abajo)
================================ */
initPages({
  project,
  canvasApi,
  history,
  saveProject: () => {
    const list = JSON.parse(localStorage.getItem("nexia:projects") || "[]");
    const i = list.findIndex((x) => x.id === project.id);
    if (i >= 0) list[i] = project;
    localStorage.setItem("nexia:projects", JSON.stringify(list));
  },
});

(function initLeftDrawer() {
  const left = document.getElementById("nxLeft");
  const overlay = document.getElementById("nxOverlay");
  const hotspot = document.getElementById("nxEdgeHotspot");
  const stageArea = document.querySelector(".nxStage__bg");
  if (!left || !overlay) return;

  const isMobile = () => window.matchMedia("(max-width: 980px)").matches;

  const open = () => {
    if (!isMobile()) return;
    left.classList.add("isOpen");
    overlay.classList.add("isOpen");
  };

  const close = () => {
    left.classList.remove("isOpen");
    overlay.classList.remove("isOpen");
  };

  overlay.addEventListener("click", close);
  stageArea?.addEventListener("click", () => isMobile() && close());

  // swipe desde el borde
  let startX = 0,
    startY = 0,
    tracking = false;

  const onStart = (e) => {
    if (!isMobile()) return;
    tracking = true;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  };

  const onMove = (e) => {
    if (!tracking || !isMobile()) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > 30 && Math.abs(dy) < 40) {
      if (dx > 0) open();
      tracking = false;
    }
  };

  const onEnd = () => {
    tracking = false;
  };

  hotspot?.addEventListener("touchstart", onStart, { passive: true });
  hotspot?.addEventListener("touchmove", onMove, { passive: true });
  hotspot?.addEventListener("touchend", onEnd);

  // inicia cerrado en móvil
  close();
})();

/* ===============================
   8️⃣ Barra flotante (UI)
================================ */
initFloatingBar();

/* ===============================
   9️⃣ Evento listo
================================ */
bus.emit("project:ready", { project });
