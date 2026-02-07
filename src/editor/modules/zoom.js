// src/editor/modules/zoom.js
export function initZoom(canvasApi) {
  const zoomRange = document.getElementById("zoomRange");
  const zoomPct = document.getElementById("zoomPct");
  const zoomIn = document.getElementById("zoomIn");
  const zoomOut = document.getElementById("zoomOut");

  const stageArea = document.querySelector(".nxStage__bg");
  const wrap = canvasApi.wrap;

  // ✅ En Canva: 100% = FIT (no es escala 1.0)
  let baseFit = 1; // escala que hace “caber” el papel
  let pct = 100; // % relativo al FIT

  function clampPct(x) {
    return Math.max(10, Math.min(200, x)); // 10%..200% como tu slider
  }

  function computeFitScale() {
    if (!stageArea || !wrap) return 1;

    const r = stageArea.getBoundingClientRect();
    const pad = 24;
    const availW = Math.max(1, r.width - pad * 2);
    const availH = Math.max(1, r.height - pad * 2);

    const paperW = canvasApi.W || wrap.offsetWidth || 700;
    const paperH = canvasApi.H || wrap.offsetHeight || 700;

    // escala que hace que el papel QUEPA completo
    return Math.min(availW / paperW, availH / paperH);
  }

  function apply() {
    const scale = baseFit * (pct / 100);

    if (zoomPct) zoomPct.textContent = `${Math.round(pct)}%`;
    if (zoomRange) zoomRange.value = String(Math.round(pct));

    canvasApi.setZoomScale(scale);
  }

  function setPct(next, { user = false } = {}) {
    pct = clampPct(next);
    apply();
  }

  function fitToScreen() {
    baseFit = computeFitScale();
    pct = 100; // ✅ aquí 100% es FIT
    apply();
  }

  // Slider cambia % relativo al FIT
  zoomRange?.addEventListener("input", () => {
    setPct(Number(zoomRange.value), { user: true });
  });

  // Botones +/- suben/bajan 10%
  zoomIn?.addEventListener("click", () => setPct(pct + 10, { user: true }));
  zoomOut?.addEventListener("click", () => setPct(pct - 10, { user: true }));

  // Al entrar: FIT
  requestAnimationFrame(() => fitToScreen());

  // Si cambia tamaño de ventana: recalcula FIT y mantiene el mismo pct
  window.addEventListener("resize", () => {
    const currentPct = pct;
    baseFit = computeFitScale();
    pct = currentPct;
    apply();
  });
}
