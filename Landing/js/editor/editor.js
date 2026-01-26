const qs = new URLSearchParams(window.location.search);
const w = Number(qs.get("w") || 1200);
const h = Number(qs.get("h") || 1200);
const unit = qs.get("u") || "px";

(function () {
  const docRaw = localStorage.getItem("nexia_current_doc");
  const doc = docRaw ? JSON.parse(docRaw) : null;

  const titleEl = document.getElementById("docTitle");
  const metaEl = document.getElementById("docMeta");

  const w = doc?.width || 1200;
  const h = doc?.height || 1200;
  const unit = doc?.unit || "px";
  const title = doc?.title || "Diseño sin título";

  titleEl.textContent = title;
  metaEl.textContent = `- ${w} ${unit} × ${h} ${unit}`;

  // ===== Konva stage =====
  const mount = document.getElementById("stageMount");

  // base zoom
  const zoomRange = document.getElementById("zoomRange");
  const zoomPct = document.getElementById("zoomPct");

  const stage = new Konva.Stage({
    container: "stageMount",
    width: w,
    height: h,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  // white page background
  const page = new Konva.Rect({
    x: 0,
    y: 0,
    width: w,
    height: h,
    fill: "#ffffff",
    cornerRadius: 2,
    listening: false,
  });
  layer.add(page);
  layer.draw();
  function fitStage() {
    const wrap = document.querySelector(".edStageWrap");
    const mount = document.getElementById("stageMount");
    if (!wrap || !mount) return;

    // espacio real disponible
    const padding = 16; // similar a tu padding visual
    const availableW = wrap.clientWidth - padding * 2;
    const availableH = wrap.clientHeight - padding * 2;

    // scale para que quepa completo
    const scale = Math.min(availableW / w, availableH / h, 1);

    // Konva: escalamos el stage y centramos
    stage.scale({ x: scale, y: scale });

    // el tamaño real del "viewport" del stage
    stage.size({
      width: w * scale,
      height: h * scale,
    });

    stage.draw();
  }

  window.addEventListener("resize", fitStage);
  requestAnimationFrame(fitStage);

  // Fit stage into available area using CSS scale
  function applyZoom(pct) {
    zoomPct.textContent = String(pct);
    const s = pct / 100;
    mount.style.transformOrigin = "center center";
    mount.style.transform = `scale(${s})`;
  }
  applyZoom(Number(zoomRange.value || 47));

  zoomRange.addEventListener("input", (e) => {
    applyZoom(Number(e.target.value));
  });

  // Active tool highlight
  document.querySelectorAll(".edTool").forEach((b) => {
    b.addEventListener("click", () => {
      document
        .querySelectorAll(".edTool")
        .forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
    });
  });
})();
