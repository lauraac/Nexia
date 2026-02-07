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
// --- IMAGEN (Subir)
const imgInput = document.getElementById("nxImgInput");
imgInput?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    await canvasApi.addImageFromDataUrl(String(reader.result));
    imgInput.value = ""; // permite subir la misma imagen otra vez
  };
  reader.readAsDataURL(file);
});

// --- FONDO (color)
const bgBtn = document.getElementById("nxBgBtn");
const bgColor = document.getElementById("nxBgColor");

bgBtn?.addEventListener("click", () => bgColor?.click());
bgColor?.addEventListener("input", (e) => {
  canvasApi.setBackground(e.target.value);
});

// --- ZOOM
let zoom = 1;
const zoomRange = document.getElementById("zoomRange");
const zoomPct = document.getElementById("zoomPct");
const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");

function setZoom(z) {
  zoom = Math.max(0.1, Math.min(2, z));
  canvasApi.setZoomScale(zoom);
  if (zoomRange) zoomRange.value = String(Math.round(zoom * 100));
  if (zoomPct) zoomPct.textContent = `${Math.round(zoom * 100)}%`;
}

zoomRange?.addEventListener("input", () => {
  setZoom(Number(zoomRange.value) / 100);
});
zoomIn?.addEventListener("click", () => setZoom(zoom + 0.1));
zoomOut?.addEventListener("click", () => setZoom(zoom - 0.1));

setZoom(1);

// --- PÁGINAS (agregar)
const addPageBtn =
  document.getElementById("nxAddPage") || document.querySelector(".nxPageAdd");
addPageBtn?.addEventListener("click", () => {
  canvasApi.addPage();
  // (luego hacemos render real de thumbnails abajo)
});

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
