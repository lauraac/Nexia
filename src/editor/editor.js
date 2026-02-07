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

/* ===============================
   8️⃣ Barra flotante (UI)
================================ */
initFloatingBar();

/* ===============================
   9️⃣ Evento listo
================================ */
bus.emit("project:ready", { project });
