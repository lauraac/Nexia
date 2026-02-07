// src/editor/modules/images.js
export function initImages({ canvasApi, history, getActivePage }) {
  const { stage, addNode, select } = canvasApi;

  // 1) input file
  const input = document.getElementById("nxImgInput");
  input?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await addImageFromFile(file);
    input.value = "";
  });

  // 2) pegar (Ctrl+V)
  window.addEventListener("paste", async (e) => {
    const items = [...(e.clipboardData?.items || [])];
    const imgItem = items.find((i) => i.type.startsWith("image/"));
    if (!imgItem) return;

    const file = imgItem.getAsFile();
    if (!file) return;

    await addImageFromFile(file);
  });

  // 3) drag & drop al área del stage
  const mount = document.getElementById("stageMount");
  if (mount) {
    mount.addEventListener("dragover", (e) => e.preventDefault());
    mount.addEventListener("drop", async (e) => {
      e.preventDefault();
      const file = [...(e.dataTransfer?.files || [])].find((f) =>
        f.type.startsWith("image/"),
      );
      if (!file) return;
      await addImageFromFile(file);
    });
  }

  async function addImageFromFile(file) {
    const dataUrl = await fileToDataUrl(file);
    await addImageFromUrl(dataUrl);
  }

  async function addImageFromUrl(src) {
    const img = await loadHtmlImage(src);

    // tamaño inicial sensato
    const maxW = Math.min(stage.width() * 0.6, 900);
    const scale = Math.min(1, maxW / img.width);

    const kImg = new Konva.Image({
      image: img,
      x: stage.width() / 2 - (img.width * scale) / 2,
      y: stage.height() / 2 - (img.height * scale) / 2,
      width: img.width,
      height: img.height,
      draggable: true,
      scaleX: scale,
      scaleY: scale,
      name: "nexia-node",
    });

    // seleccionar al click
    kImg.on("click", () => select(kImg));

    // guardar acción para undo/redo
    history.push(
      () => {
        addNode(kImg);
        getActivePage().elements.push(serializeNode(kImg, src));
      },
      () => {
        kImg.destroy();
        // elimina del doc
        const page = getActivePage();
        page.elements = page.elements.filter((el) => el.id !== kImg._id);
      },
    );

    // ejecuta "do"
    history.doLast();
  }

  function serializeNode(node, src) {
    return {
      id: node._id,
      type: "image",
      src,
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    };
  }
}

function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function loadHtmlImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
