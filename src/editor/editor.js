// src/editor/editor.js
const qs = (s) => document.querySelector(s);

function getDesignId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("designId");
}

function loadProject(id) {
  const list = JSON.parse(localStorage.getItem("nexia:projects") || "[]");
  return list.find((p) => p.id === id) || null;
}

function fitZoom(stageW, stageH, wrapEl) {
  // fit to viewport (con margen)
  const pad = 120;
  const w = Math.max(200, wrapEl.clientWidth - pad);
  const h = Math.max(200, wrapEl.clientHeight - pad);
  const z = Math.min(w / stageW, h / stageH);
  return Math.max(0.1, Math.min(2, z));
}

function main() {
  const mount = qs("#stageMount");
  const titleEl = qs("#docTitle");
  const metaEl = qs("#docMeta");

  const zoomOut = qs("#zoomOut");
  const zoomIn = qs("#zoomIn");
  const zoomRange = qs("#zoomRange");
  const zoomPct = qs("#zoomPct");

  const id = getDesignId();
  if (!id) {
    alert("No se encontró designId. Crea un diseño primero.");
    window.location.href = "../../app.html";
    return;
  }

  const project = loadProject(id);
  if (!project) {
    alert("No encontré el diseño en localStorage. Vuelve a crearlo.");
    window.location.href = "../../app.html";
    return;
  }

  titleEl.textContent = project.title || "Diseño sin título";
  metaEl.textContent = `${project.width} × ${project.height} ${project.unit}`;

  const W = project.widthPx || project.width;
  const H = project.heightPx || project.height;

  // Stage
  const stage = new Konva.Stage({
    container: "stageMount",
    width: W,
    height: H,
  });

  // Layer base
  const layer = new Konva.Layer();
  stage.add(layer);

  // Fondo blanco tipo Canva
  const bg = new Konva.Rect({
    x: 0,
    y: 0,
    width: W,
    height: H,
    fill: "white",
    cornerRadius: 2,
    shadowColor: "black",
    shadowBlur: 18,
    shadowOpacity: 0.22,
    shadowOffset: { x: 0, y: 10 },
  });
  layer.add(bg);
  layer.draw();

  // Zoom
  const wrap = mount.closest(".edStageWrap");
  let zoom = fitZoom(W, H, wrap);

  function applyZoom() {
    stage.scale({ x: zoom, y: zoom });
    // centra visualmente el canvas en el wrapper
    const cx = (wrap.clientWidth - W * zoom) / 2;
    const cy = (wrap.clientHeight - H * zoom) / 2;
    stage.position({ x: cx, y: cy });
    stage.batchDraw();

    const pct = Math.round(zoom * 100);
    if (zoomPct) zoomPct.textContent = `${pct}%`;
    if (zoomRange) zoomRange.value = String(pct);
  }

  applyZoom();

  // Controles
  zoomOut?.addEventListener("click", () => {
    zoom = Math.max(0.1, zoom - 0.1);
    applyZoom();
  });

  zoomIn?.addEventListener("click", () => {
    zoom = Math.min(2, zoom + 0.1);
    applyZoom();
  });

  zoomRange?.addEventListener("input", () => {
    const pct = Number(zoomRange.value);
    if (!Number.isFinite(pct)) return;
    zoom = Math.max(0.1, Math.min(2, pct / 100));
    applyZoom();
  });

  window.addEventListener("resize", () => {
    zoom = fitZoom(W, H, wrap);
    applyZoom();
  });

  // Botón volver
  qs("#btnBack")?.addEventListener("click", () => {
    window.location.href = "../../app.html";
  });
}

document.addEventListener("DOMContentLoaded", main);
