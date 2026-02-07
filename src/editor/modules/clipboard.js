// src/editor/modules/clipboard.js
let clip = null;

export function initClipboard({ canvasApi, history, getActivePage }) {
  const { tr, addNode, select } = canvasApi;

  window.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const ctrl = isMac ? e.metaKey : e.ctrlKey;
    if (!ctrl) return;

    // Copiar
    if (e.key.toLowerCase() === "c") {
      const node = tr.nodes()[0];
      if (!node) return;
      e.preventDefault();
      clip = node.toObject();
    }

    // Pegar
    if (e.key.toLowerCase() === "v") {
      if (!clip) return; // ojo: si pegaste imagen real, lo maneja images.js
      e.preventDefault();

      const clone = Konva.Node.create(clip);
      clone.x((clone.x() || 0) + 20);
      clone.y((clone.y() || 0) + 20);
      clone.draggable(true);

      history.push(
        () => {
          addNode(clone);
          select(clone);
          getActivePage().elements.push({ type: "node", json: clip });
        },
        () => {
          clone.destroy();
        },
      );

      history.doLast();
    }
  });
}
