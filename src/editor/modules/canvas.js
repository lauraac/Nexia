// src/editor/modules/canvas.js
import { saveProject } from "./store.js";

export function initCanvas(project) {
  const mount = document.getElementById("stageMount");
  if (!mount) throw new Error("[canvas] No existe #stageMount");

  const wrap = mount.closest(".nxCanvasWrap");
  if (!wrap) throw new Error("[canvas] No existe .nxCanvasWrap");

  // -----------------------------
  // 1) Normaliza project
  // -----------------------------
  project.doc = project.doc || {};
  project.doc.pages = Array.isArray(project.doc.pages) ? project.doc.pages : [];

  if (project.doc.pages.length === 0) {
    project.doc.pages.push({ id: "p1", background: "#ffffff", elements: [] });
  }
  if (!project.doc.activePageId) {
    project.doc.activePageId = project.doc.pages[0].id;
  }

  const W = project.widthPx || 700;
  const H = project.heightPx || 700;

  mount.style.width = `${W}px`;
  mount.style.height = `${H}px`;

  // -----------------------------
  // 2) Konva
  // -----------------------------
  const stage = new Konva.Stage({
    container: "stageMount",
    width: W,
    height: H,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  // Fondo (no seleccionable)
  const bg = new Konva.Rect({
    x: 0,
    y: 0,
    width: W,
    height: H,
    fill: "#fff",
    name: "nx-bg",
    listening: false, // ✅ clave
  });
  bg.setAttr("nxLocked", true);
  layer.add(bg);

  const tr = new Konva.Transformer({
    rotateEnabled: true,
    enabledAnchors: [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
      "middle-left",
      "middle-right",
      "top-center",
      "bottom-center",
    ],
    boundBoxFunc: (oldBox, newBox) => {
      if (newBox.width < 20 || newBox.height < 20) return oldBox;
      return newBox;
    },
  });
  layer.add(tr);
  layer.draw();

  // -----------------------------
  // 3) Páginas
  // -----------------------------
  function getActivePage() {
    const id = project.doc.activePageId;
    return project.doc.pages.find((p) => p.id === id) || project.doc.pages[0];
  }

  function setActivePage(pageId) {
    const exists = project.doc.pages.some((p) => p.id === pageId);
    if (!exists) return;
    project.doc.activePageId = pageId;
    saveProject(project);
    loadActivePage();
  }

  function setBackground(color) {
    const page = getActivePage();
    page.background = color || "#ffffff";
    bg.fill(page.background);
    layer.draw();
    saveProject(project);
  }

  // -----------------------------
  // 4) Render
  // -----------------------------
  function clearPageButKeepBg() {
    const keep = new Set([bg._id, tr._id]);
    layer.getChildren().forEach((n) => {
      if (!keep.has(n._id)) n.destroy();
    });
    tr.nodes([]);
  }

  function wireSelectable(node) {
    node.on("click tap", (e) => {
      e.cancelBubble = true;
      tr.nodes([node]);
      layer.draw();
    });

    const commit = () => {
      const page = getActivePage();
      const idx = (page.elements || []).findIndex((x) => x.id === node._nxId);
      if (idx >= 0) {
        page.elements[idx] = {
          ...page.elements[idx],
          x: node.x(),
          y: node.y(),
          w: node.width(),
          h: node.height(),
          rotation: node.rotation(),
        };
        saveProject(project);
      }
    };

    node.on("dragend", commit);

    node.on("transformend", () => {
      const sx = node.scaleX();
      const sy = node.scaleY();

      node.width(Math.max(1, node.width() * sx));
      node.height(Math.max(1, node.height() * sy));
      node.scaleX(1);
      node.scaleY(1);

      commit();
    });
  }

  function renderImage(el) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const node = new Konva.Image({
          x: el.x ?? 80,
          y: el.y ?? 80,
          image: img,
          width: el.w ?? 420,
          height: el.h ?? 420,
          rotation: el.rotation ?? 0,
          draggable: true,
          name: "nx-el",
        });

        node._nxId = el.id;
        wireSelectable(node);

        layer.add(node);
        resolve(node);
      };
      img.onerror = () => resolve(null);
      img.src = el.src;
    });
  }

  async function _renderFromModelElement(el) {
    if (el.type === "image") {
      const node = await renderImage(el);
      layer.draw();
      return node;
    }
    return null;
  }

  function _selectById(id) {
    const node = layer
      .getChildren()
      .find((n) => n && n._nxId && n._nxId === id);

    if (!node) return;
    tr.nodes([node]);
    tr.moveToTop();
    layer.draw();
  }

  async function loadActivePage() {
    const page = getActivePage();
    page.elements = Array.isArray(page.elements) ? page.elements : [];

    clearPageButKeepBg();

    bg.fill(page.background || "#ffffff");

    for (const el of page.elements) {
      await _renderFromModelElement(el);
    }

    layer.draw();
  }

  stage.on("click tap", (e) => {
    // como bg no escucha, aquí solo limpiamos si es stage
    if (e.target === stage) {
      tr.nodes([]);
      layer.draw();
    }
  });

  // -----------------------------
  // 5) Zoom
  // -----------------------------
  function setZoomScale(scale) {
    wrap.style.transformOrigin = "center center";
    wrap.style.transform = `scale(${scale})`;
  }

  // -----------------------------
  // 6) Acciones
  // -----------------------------
  async function addImageFromDataUrl(dataUrl) {
    const page = getActivePage();
    page.elements = Array.isArray(page.elements) ? page.elements : [];

    const id = "el_" + Math.random().toString(16).slice(2) + "_" + Date.now();

    const el = {
      id,
      type: "image",
      src: dataUrl,
      x: 90,
      y: 90,
      w: 420,
      h: 420,
      rotation: 0,
    };

    page.elements.push(el);
    saveProject(project);

    await _renderFromModelElement(el);
    _selectById(id);

    return id;
  }

  function getSelectedNode() {
    const nodes = tr.nodes();
    return nodes && nodes.length ? nodes[0] : null;
  }

  function deleteSelected() {
    const node = getSelectedNode();
    if (!node) return;

    const id = node._nxId;
    if (!id) return; // ✅ evita borrar cosas no-modelo

    const page = getActivePage();
    page.elements = (page.elements || []).filter((x) => x.id !== id);

    tr.nodes([]);
    node.destroy();
    layer.draw();
    saveProject(project);
  }

  function addPage() {
    const next = project.doc.pages.length + 1;
    const id = "p" + next;
    project.doc.pages.push({ id, background: "#ffffff", elements: [] });
    project.doc.activePageId = id;
    saveProject(project);
    loadActivePage();
    return id;
  }

  function deletePage(pageId) {
    if (project.doc.pages.length <= 1) return false;

    const idx = project.doc.pages.findIndex((p) => p.id === pageId);
    if (idx < 0) return false;

    project.doc.pages.splice(idx, 1);

    if (project.doc.activePageId === pageId) {
      project.doc.activePageId = project.doc.pages[Math.max(0, idx - 1)].id;
    }

    saveProject(project);
    loadActivePage();
    return true;
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    deleteSelected();
  });

  // Inicial
  loadActivePage();

  return {
    project,
    stage,
    layer,
    mount,
    wrap,
    W,
    H,

    loadActivePage,
    setZoomScale,
    setActivePage,

    setBackground,
    addImageFromDataUrl,
    deleteSelected,
    getSelectedNode,
    addPage,
    deletePage,
    getActivePage,

    // ✅ helpers internos para clipboard
    _renderFromModelElement,
    _selectById,
  };
}
