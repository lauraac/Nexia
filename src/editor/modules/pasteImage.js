// src/editor/modules/pasteImage.js
export function initPasteImage({ canvasApi, history }) {
  const isEditable = (el) => {
    const tag = el?.tagName?.toLowerCase();
    return tag === "input" || tag === "textarea" || el?.isContentEditable;
  };

  async function readClipboardImage() {
    // Necesita HTTPS o localhost
    if (!navigator.clipboard?.read) return null;

    const items = await navigator.clipboard.read();
    for (const item of items) {
      for (const type of item.types) {
        if (type.startsWith("image/")) {
          const blob = await item.getType(type);
          return blob;
        }
      }
    }
    return null;
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  window.addEventListener("paste", async (e) => {
    // no interceptar si estás escribiendo en inputs
    if (isEditable(document.activeElement)) return;

    try {
      // 1) Primer intento: usar clipboardData (a veces funciona)
      const dt = e.clipboardData;
      if (dt?.items?.length) {
        const imgItem = Array.from(dt.items).find((it) =>
          it.type?.startsWith("image/"),
        );
        if (imgItem) {
          e.preventDefault();
          const blob = imgItem.getAsFile();
          if (!blob) return;

          const dataUrl = await blobToDataUrl(blob);

          history?.pushSnapshot?.();
          await canvasApi.addImageFromDataUrl(dataUrl);
          history?.pushSnapshot?.();
          return;
        }
      }

      // 2) Segundo intento: Clipboard API (Chrome moderno)
      const blob = await readClipboardImage();
      if (!blob) return;

      e.preventDefault();
      const dataUrl = await blobToDataUrl(blob);

      history?.pushSnapshot?.();
      await canvasApi.addImageFromDataUrl(dataUrl);
      history?.pushSnapshot?.();
    } catch (err) {
      // Si falla por permisos / HTTP, no rompemos nada
      console.warn("[pasteImage] no se pudo pegar imagen:", err);
    }
  });
}
