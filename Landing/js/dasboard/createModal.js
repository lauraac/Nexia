// Dashboard/createModal.js
(function () {
  const UI = {
    mount() {
      if (document.getElementById("nexiaCreateModal")) return;

      const div = document.createElement("div");
      div.id = "nexiaCreateModal";
      div.className = "ncm";
      div.innerHTML = `
        <div class="ncm__backdrop" data-close="1"></div>

        <section class="ncm__panel glass" role="dialog" aria-modal="true" aria-label="Crear un diseño">
          <button class="ncm__close iconBtnMini" type="button" aria-label="Cerrar" data-close="1">✕</button>

          <header class="ncm__top">
            <h2 class="ncm__title">Crea un diseño</h2>

            <label class="ncm__search">
              <span class="ncm__searchIco">🔎</span>
              <input id="ncmSearch" type="search" placeholder="¿Qué quieres diseñar?" />
            </label>
          </header>

          <div class="ncm__body">
            <!-- Left menu -->
            <aside class="ncm__menu">
              ${menuItem("para-ti", "✨", "Para ti", true)}
              ${menuItem("presentaciones", "📊", "Presentaciones")}
              ${menuItem("redes", "💗", "Redes sociales")}
              ${menuItem("fotos", "🖼️", "Fotos")}
              ${menuItem("videos", "🎬", "Videos")}
              ${menuItem("impresion", "🖨️", "Impresiones")}
              ${menuItem("docs", "📄", "Nexia Docs")}
              ${menuItem("pizarras", "🧠", "Pizarras")}
              ${menuItem("hojas", "▦", "Hojas de cálculo")}
              ${menuItem("web", "🌐", "Sitios web")}
              ${menuItem("email", "✉️", "Correos")}
              ${menuItem("custom", "↕", "Tamaño personalizado")}
              ${menuItem("subir", "☁️", "Subir")}
              ${menuItem("mas", "⋯", "Más")}
            </aside>

            <!-- Content -->
            <main class="ncm__content">
              <section class="ncm__section">
                <h3 class="ncm__h">Acciones rápidas</h3>
                <div class="ncm__actions">
                  ${action("Code", "Canva Code")}
                  ${action("Escritura", "Escritura")}
                  ${action("Traductor", "Traductor")}
                  ${action("Kit", "Kit de Marca")}
                  ${action("Planner", "Planificador")}
                  ${action("Mockups", "Mockups")}
                  ${action("Resize", "Redimensionar")}
                </div>
              </section>

              <section class="ncm__section">
                <div class="ncm__row">
                  <h3 class="ncm__h">Crear un diseño</h3>
                  <button class="ncm__link" type="button">Ver todo</button>
                </div>

                <div class="ncm__cards">
                  ${card("Video (horizontal)", "▶")}
                  ${card("Presentación (16:9)", "▭")}
                  ${card("Logo", "CO")}
                  ${card("Video para móviles", "▶")}
                  ${card("Currículum", "CV")}
                </div>
              </section>

              <section class="ncm__section">
                <h3 class="ncm__h">Plantillas para ti</h3>
                <div class="ncm__grid">
                  ${thumb("¡Hola!")}
                  ${thumb("¿ESTÁS AHÍ?")}
                  ${thumb("PROMOS")}
                  ${thumb("DESCUENTOS")}
                </div>
              </section>
            </main>
          </div>
        </section>
      `;

      document.body.appendChild(div);

      // Close handlers
      div.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.getAttribute && t.getAttribute("data-close") === "1") {
          window.NexiaCreateModal.close();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") window.NexiaCreateModal.close();
      });
    },

    open() {
      UI.mount();
      const el = document.getElementById("nexiaCreateModal");
      if (!el) return;
      el.classList.add("is-open");
      document.documentElement.classList.add("modal-open");
      setTimeout(() => document.getElementById("ncmSearch")?.focus(), 50);
    },

    close() {
      const el = document.getElementById("nexiaCreateModal");
      if (!el) return;
      el.classList.remove("is-open");
      document.documentElement.classList.remove("modal-open");
    },
  };

  function menuItem(id, ico, label, active = false) {
    return `
      <button class="ncm__menuItem ${active ? "is-active" : ""}" type="button" data-menu="${id}">
        <span class="ncm__miIco">${ico}</span>
        <span class="ncm__miTxt">${label}</span>
      </button>
    `;
  }

  function action(tag, label) {
    return `
      <button class="ncm__action" type="button" data-action="${tag}">
        <span class="ncm__aDot"></span>
        <span class="ncm__aTxt">${label}</span>
      </button>
    `;
  }

  function card(label, badge) {
    return `
      <article class="ncmCard" role="button" tabindex="0" data-create="${label}">
        <div class="ncmCard__thumb"><span>${badge}</span></div>
        <div class="ncmCard__label">${label}</div>
      </article>
    `;
  }

  function thumb(title) {
    return `
      <article class="ncmThumb" role="button" tabindex="0">
        <div class="ncmThumb__img"></div>
        <div class="ncmThumb__txt">${title}</div>
      </article>
    `;
  }

  window.NexiaCreateModal = UI;
})();
