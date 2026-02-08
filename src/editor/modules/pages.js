export function initPages({ project, canvasApi, history, saveProject }) {
  const pagesWrap = document.querySelector(".nxPages");
  const addBtnA = document.querySelector(".nxPages .nxPageAdd");
  const addBtnB = document.getElementById("nxAddPage");

  if (!pagesWrap) return;

  function persist() {
    try {
      saveProject?.();
    } catch {}
  }

  function render() {
    const btnThumbPlus = addBtnA;
    pagesWrap.innerHTML = "";

    project.doc.pages.forEach((p, idx) => {
      const el = document.createElement("div");
      el.className =
        "nxPageThumb" + (p.id === project.doc.activePageId ? " isActive" : "");
      el.dataset.pageId = p.id;

      el.innerHTML = `
        <button class="nxPageThumb__hit" type="button">
          <div class="nxPageThumb__mini"></div>
          <span>${idx + 1}</span>
        </button>
        <button class="nxPageThumb__del" type="button" title="Eliminar">✕</button>
      `;

      el.querySelector(".nxPageThumb__hit").addEventListener("click", () => {
        canvasApi.setActivePage(p.id);
        render();
        persist();
      });

      el.querySelector(".nxPageThumb__del").addEventListener("click", (ev) => {
        ev.stopPropagation();
        history?.pushSnapshot?.();

        const ok = canvasApi.deletePage(p.id);
        if (!ok) return;

        history?.pushSnapshot?.();
        render();
        persist();
      });

      pagesWrap.appendChild(el);
    });

    if (btnThumbPlus) pagesWrap.appendChild(btnThumbPlus);
  }

  function addPage() {
    history?.pushSnapshot?.();
    canvasApi.addPage();
    history?.pushSnapshot?.();
    render();
    persist();
  }

  addBtnA?.addEventListener("click", addPage);
  addBtnB?.addEventListener("click", addPage);

  render();
}
