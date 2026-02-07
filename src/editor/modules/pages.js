// src/editor/modules/pages.js
export function initPages({ project, canvasApi, history, saveProject }) {
  const addBtn = document.getElementById("nxAddPage");
  const wrap = document.querySelector(".nxPages");
  const { layer, select } = canvasApi;

  function renderBar() {
    // deja el + al final
    wrap.querySelectorAll(".nxPageThumb").forEach((n) => n.remove());

    project.doc.pages.forEach((p, idx) => {
      const el = document.createElement("div");
      el.className =
        "nxPageThumb" + (idx === project.doc.activePage ? " isActive" : "");
      el.innerHTML = `<div class="nxPageThumb__mini"></div><span>${idx + 1}</span>`;
      el.title = "Click para cambiar. Click derecho para eliminar.";

      el.addEventListener("click", () => {
        project.doc.activePage = idx;
        loadPage();
        renderBar();
        saveProject();
      });

      // eliminar con click derecho
      el.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (project.doc.pages.length === 1) return;

        history.push(
          () => {
            project.doc.pages.splice(idx, 1);
            if (project.doc.activePage >= project.doc.pages.length) {
              project.doc.activePage = project.doc.pages.length - 1;
            }
            loadPage();
            renderBar();
            saveProject();
          },
          () => {
            // undo simple: no lo reconstruyo completo aquí, si quieres lo hacemos “perfecto” después
            alert(
              "Undo de delete página: lo dejamos para la siguiente mejora 🙏",
            );
          },
        );

        history.doLast();
      });

      wrap.insertBefore(el, addBtn);
    });
  }

  function loadPage() {
    select(null);
    layer.destroyChildren(); // borra todo
    layer.draw();
    // aquí luego renderizas elementos guardados (image/text/shapes)
  }

  addBtn?.addEventListener("click", () => {
    history.push(
      () => {
        project.doc.pages.push({ id: cryptoId(), elements: [], bg: "#ffffff" });
        project.doc.activePage = project.doc.pages.length - 1;
        loadPage();
        renderBar();
        saveProject();
      },
      () => {},
    );
    history.doLast();
  });

  // init
  if (project.doc.activePage == null) project.doc.activePage = 0;
  renderBar();
  loadPage();
}

function cryptoId() {
  return "p_" + Math.random().toString(16).slice(2) + "_" + Date.now();
}
