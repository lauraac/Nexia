export function initZoom(canvasApi) {
  const zoomRange = document.getElementById("zoomRange");
  const zoomPct = document.getElementById("zoomPct");
  const zoomIn = document.getElementById("zoomIn");
  const zoomOut = document.getElementById("zoomOut");

  let scale = 1;

  function paint() {
    const pct = Math.round(scale * 100);
    if (zoomPct) zoomPct.textContent = `${pct}%`;
    if (zoomRange) zoomRange.value = String(pct);
    canvasApi.setZoomScale(scale);
  }

  function setScale(next) {
    scale = Math.max(0.1, Math.min(2, next)); // 10%..200%
    paint();
  }

  zoomRange?.addEventListener("input", () =>
    setScale(Number(zoomRange.value) / 100),
  );
  zoomIn?.addEventListener("click", () => setScale(scale + 0.1));
  zoomOut?.addEventListener("click", () => setScale(scale - 0.1));

  paint();
}
