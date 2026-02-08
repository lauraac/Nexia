export function createHistory({ project, canvasApi }) {
  const undoStack = [];
  const redoStack = [];

  const snapshot = () =>
    JSON.stringify({
      doc: project.doc,
    });

  const restore = (snap) => {
    const state = JSON.parse(snap);
    project.doc = state.doc;
    canvasApi.loadActivePage();
  };

  const pushSnapshot = () => {
    undoStack.push(snapshot());
    redoStack.length = 0;
  };

  const undo = () => {
    if (undoStack.length <= 1) return;
    const current = undoStack.pop();
    redoStack.push(current);
    restore(undoStack[undoStack.length - 1]);
  };

  const redo = () => {
    if (!redoStack.length) return;
    const next = redoStack.pop();
    undoStack.push(next);
    restore(next);
  };

  return { pushSnapshot, undo, redo };
}

export function bindUndoRedoButtons(history) {
  const undoBtn = document.getElementById("nxUndo");
  const redoBtn = document.getElementById("nxRedo");

  undoBtn?.addEventListener("click", () => history.undo());
  redoBtn?.addEventListener("click", () => history.redo());

  document.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const mod = isMac ? e.metaKey : e.ctrlKey;

    if (!mod) return;

    if (e.key.toLowerCase() === "z" && !e.shiftKey) {
      e.preventDefault();
      history.undo();
    }

    if (
      e.key.toLowerCase() === "y" ||
      (e.key.toLowerCase() === "z" && e.shiftKey)
    ) {
      e.preventDefault();
      history.redo();
    }
  });
}
