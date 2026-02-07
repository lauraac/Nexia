// src/editor/modules/history.js
export function createHistory() {
  const undoStack = [];
  const redoStack = [];
  let pending = null;

  function push(doFn, undoFn) {
    pending = { doFn, undoFn };
  }

  function doLast() {
    if (!pending) return;
    pending.doFn();
    undoStack.push(pending);
    redoStack.length = 0;
    pending = null;
  }

  function undo() {
    const a = undoStack.pop();
    if (!a) return;
    a.undoFn();
    redoStack.push(a);
  }

  function redo() {
    const a = redoStack.pop();
    if (!a) return;
    a.doFn();
    undoStack.push(a);
  }

  // teclas
  window.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const ctrl = isMac ? e.metaKey : e.ctrlKey;

    if (!ctrl) return;

    if (e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
    if (e.key.toLowerCase() === "y") {
      e.preventDefault();
      redo();
    }
  });

  return { push, doLast, undo, redo };
}

export function bindUndoRedoButtons(history) {
  document.getElementById("nxUndo")?.addEventListener("click", history.undo);
  document.getElementById("nxRedo")?.addEventListener("click", history.redo);
}
