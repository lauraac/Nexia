import { bus } from "./modules/bus.js";
import {
  loadCurrentProject,
  ensureProjectHasPages,
  saveProject,
} from "./modules/store.js";
import { initCanvas } from "./modules/canvas.js";
import { initZoom } from "./modules/zoom.js";
import { initPages } from "./modules/pages.js";
import { initFloatingBar } from "./modules/floatingbar.js";
import { initPasteImage } from "./modules/pasteImage.js";
import { createHistory, bindUndoRedoButtons } from "./modules/history.js";
import { initImages } from "./modules/images.js";
import { initBackground } from "./modules/background.js";

// ✅ NO usar clipboard ahorita (está incompatible)
// import { initClipboard } from "./modules/clipboard.js";

/* ===============================
   1) Cargar proyecto
================================ */
const project = loadCurrentProject();
ensureProjectHasPages(project);

/* ===============================
   2) Título y meta
================================ */
const titleEl = document.getElementById("docTitle");
const metaEl = document.getElementById("docMeta");

if (titleEl) titleEl.textContent = project.title || "Diseño sin título";
if (metaEl)
  metaEl.textContent = `${project.width} × ${project.height} ${project.unit}`;

/* ===============================
   3) Canvas
================================ */
const canvasApi = initCanvas(project);

/* helper: página activa (✅ ESTA ES LA BUENA) */
const getActivePage = () =>
  project.doc.pages.find((p) => p.id === project.doc.activePageId) ||
  project.doc.pages[0];

/* ===============================
   4) History (UNDO/REDO)
================================ */
const history = createHistory({ project, canvasApi });
bindUndoRedoButtons(history);

// snapshot base inicial (para que undo tenga un punto de partida)
history.pushSnapshot();

/* ===============================
   5) Módulos
================================ */
initBackground({ canvasApi, history, getActivePage });
initImages({ canvasApi, history, getActivePage });
initPasteImage({ canvasApi, history });

// initClipboard({ canvasApi, history, getActivePage }); // ❌ por ahora NO

initPages({
  project,
  canvasApi,
  history,
  saveProject: () => saveProject(project),
});

/* ===============================
   6) Zoom
================================ */
initZoom(canvasApi);

/* ===============================
   7) Drawer móvil (swipe + tap fuera)
================================ */
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

  let startX = 0;
  let startY = 0;
  let tracking = false;

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

  const onEnd = () => (tracking = false);

  hotspot?.addEventListener("touchstart", onStart, { passive: true });
  hotspot?.addEventListener("touchmove", onMove, { passive: true });
  hotspot?.addEventListener("touchend", onEnd);

  close();
})();

/* ===============================
   8) Barra flotante (solo UI)
================================ */
initFloatingBar();

/* ===============================
   9) Evento listo
================================ */
bus.emit("project:ready", { project });
