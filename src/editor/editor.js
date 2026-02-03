// src/editor/editor.js

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function loadProject(id) {
  const list = JSON.parse(localStorage.getItem("nexia:projects") || "[]");
  return list.find((p) => p.id === id) || null;
}

function fitStageToViewport(stage, layer, designW, designH) {
  const mount = document.getElementById("stageMount");
  const pad = 60; // margen para que respire
  const vw = mount.clientWidth - pad;
  const vh = mount.clientHeight - pad;

  const scale = Math.min(vw / designW, vh / designH);
  return Math.max(0.05, Math.min(scale, 2));
}

function initKonva(designW, designH) {
  const mount = document.getElementById("stageMount");

  const stage = new Konva.Stage({
    container: "stageMount",
    width: mount.clientWidth,
    height: mount.clientHeight,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  // Documento (fondo)
  const paper = new Konva.Rect({
    x: 0,
    y: 0,
    width: designW,
    height: designH,
    fill: "white",
    cornerRadius: 2,
    shadowColor: "black",
    shadowBlur: 30,
    shadowOpacity: 0.25,
    shadowOffset: { x: 0, y: 10 },
  });

  const group = new Konva.Group({ x: 0, y: 0 });
  group.add(paper);
  layer.add(group);
  layer.draw();

  function centerAndFit(baseScale) {
    // escala
    group.scale({ x: baseScale, y: baseScale });

    // centrado
    const gx = (stage.width() - designW * baseScale) / 2;
    const gy = (stage.height() - designH * baseScale) / 2;
    group.position({ x: gx, y: gy });

    layer.batchDraw();
  }

  let zoomPct = 100;

  function applyZoom(pct) {
    zoomPct = Math.max(10, Math.min(pct, 200));
    const baseScale = fitStageToViewport(stage, layer, designW, designH);
    const userScale = zoomPct / 100;

    centerAndFit(baseScale * userScale);

    document.getElementById("zoomPct").textContent = `${zoomPct}%`;
    document.getElementById("zoomRange").value = String(zoomPct);
  }

  // resize
  function resize() {
    stage.width(mount.clientWidth);
    stage.height(mount.clientHeight);
    applyZoom(zoomPct);
  }
  window.addEventListener("resize", resize);

  // controles zoom
  document
    .getElementById("zoomIn")
    .addEventListener("click", () => applyZoom(zoomPct + 10));
  document
    .getElementById("zoomOut")
    .addEventListener("click", () => applyZoom(zoomPct - 10));
  document
    .getElementById("zoomRange")
    .addEventListener("input", (e) => applyZoom(Number(e.target.value)));

  // init zoom a “fit”
  applyZoom(100);

  return { stage, layer, group, applyZoom };
}

(function main() {
  const id =
    getQueryParam("id") || localStorage.getItem("nexia:currentProjectId");
  const project = id ? loadProject(id) : null;

  if (!project) {
    // si llega sin proyecto, lo mandamos al app
    window.location.href = "../../app.html";
    return;
  }

  document.getElementById("docTitle").textContent =
    project.title || "Diseño sin título";
  document.getElementById("docMeta").textContent =
    `${project.width} ${project.unit} × ${project.height} ${project.unit}`;

  document.getElementById("btnBack").addEventListener("click", () => {
    window.location.href = "../../app.html";
  });

  initKonva(project.width, project.height);
})();
