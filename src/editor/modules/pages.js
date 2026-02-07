// src/editor/modules/pages.js
export function initPages({ project, canvasApi, history, saveProject }) {
  const pagesWrap = document.querySelector(".nxPages");
  const addBtnA = document.querySelector(".nxPages .nxPageAdd"); // el + junto a thumbnails
  const addBtnB = document.getElementById("nxAddPage"); // el + en el zoom

  if (!pagesWrap) return;

  function persist() {
    try {
      saveProject?.();
    } catch {}
  }

  function render() {
    // preserva botones + existentes
    const btnThumbPlus = addBtnA;
    pagesWrap.innerHTML = "";

    project.doc.pages.forEach((p, idx) => {
      const el = document.createElement("div");
      el.className =
        "nxPageThumb" + (p.id === project.doc.activePageId ? " isActive" : "");
      el.dataset.pageId = p.id;

      el.innerHTML = `
        <button class="nxPageThumb__hit" type="button" aria-label="Ir a página ${idx + 1}">
          <div class="nxPageThumb__mini"></div>
          <span>${idx + 1}</span>
        </button>
        <button class="nxPageThumb__del" type="button" title="Eliminar">✕</button>
      `;

      // ir a página
      el.querySelector(".nxPageThumb__hit").addEventListener("click", () => {
        canvasApi.setActivePage(p.id);
        render();
        persist();
      });

      // eliminar página
      el.querySelector(".nxPageThumb__del").addEventListener("click", (ev) => {
        ev.stopPropagation();

        // no borrar si solo queda 1
        const ok = canvasApi.deletePage(p.id);
        if (!ok) return;

        // historia (opcional) - si ya la usas, luego lo conectamos mejor
        history?.push?.("deletePage");

        render();
        persist();
      });

      pagesWrap.appendChild(el);
    });

    // vuelve a poner el + al final
    if (btnThumbPlus) pagesWrap.appendChild(btnThumbPlus);
  }

  function addPage() {
    const id = canvasApi.addPage();
    history?.push?.("addPage");
    render();
    persist();
    return id;
  }

  addBtnA?.addEventListener("click", addPage);
  addBtnB?.addEventListener("click", addPage);

  render();
}
