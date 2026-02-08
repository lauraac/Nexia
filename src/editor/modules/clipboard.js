// src/editor/modules/clipboard.js
let copiedJson = null;

function isBlockedNode(node) {
  if (!node) return true;

  // Fondo bloqueado
  if (node.name?.() === "nx-bg") return true;
  if (node.getAttr?.("nxLocked")) return true;

  // Evitar copiar transformer o layer/stage por error
  const cls = node.getClassName?.();
  if (cls === "Transformer" || cls === "Stage" || cls === "Layer") return true;

  return false;
}

// “Hornear” escala para que al copiar/pegar respete tamaño real
function bakeScale(node) {
  if (!node?.scaleX || !node?.scaleY || !node?.width || !node?.height) return;

  const sx = node.scaleX();
  const sy = node.scaleY();

  if (sx !== 1 || sy !== 1) {
    node.width(Math.max(1, node.width() * sx));
    node.height(Math.max(1, node.height() * sy));
    node.scaleX(1);
    node.scaleY(1);
  }
}

export function initClipboard({ canvasApi, history }) {
  window.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (!mod) return;

    // No interferir con inputs
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    // =========================
    // COPIAR (Ctrl/Cmd + C)
    // =========================
    if (e.key.toLowerCase() === "c") {
      const node = canvasApi.getSelectedNode?.();
      if (isBlockedNode(node)) return;

      e.preventDefault();

      // Clonamos y horneamos escala para copiar tamaño real
      const temp = node.clone();
      bakeScale(temp);

      copiedJson = temp.toObject();
      temp.destroy(); // limpieza
    }

    // =========================
    // PEGAR (Ctrl/Cmd + V)
    // =========================
    if (e.key.toLowerCase() === "v") {
      if (!copiedJson) return;
      e.preventDefault();

      history?.pushSnapshot?.();

      const clone = Konva.Node.create(copiedJson);

      // Asegura draggable
      if (clone.draggable) clone.draggable(true);

      // Canva: pega casi en el mismo lugar (ligero offset)
      clone.x((clone.x() || 0) + 10);
      clone.y((clone.y() || 0) + 10);

      canvasApi.layer.add(clone);

      // Selecciona lo pegado
      const tr = canvasApi.layer.findOne("Transformer");
      tr?.nodes([clone]);
      tr?.moveToTop();

      canvasApi.layer.draw();

      history?.pushSnapshot?.();
    }
  });
}
