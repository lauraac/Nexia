(function () {
  // ✅ Protect route: si no hay sesión -> landing
  const session = window.NexiaAuth.getSession();
  if (!session?.user) {
    window.location.href = "./index.html";
    return;
  }

  const root = document.getElementById("app");
  if (!root) return;

  root.innerHTML = `
    <div class="db">
      <div id="sidebarMount"></div>

      <main class="dbMain">
        <div class="dbShell">
          <div id="dashHeaderMount"></div>

          <section class="dbHero glass">
            <div class="dbHero__inner">
              <h1 class="dbTitle">¿Qué diseñamos hoy?</h1>

              <div class="dbTabs" role="tablist" aria-label="Secciones">
                <button class="chipBtn is-active" data-tab="mis">Mis diseños</button>
                <button class="chipBtn" data-tab="plantillas">Plantillas</button>
                <button class="chipBtn" data-tab="ia">Nexia IA</button>
              </div>

              <div class="searchWrap">
                <div class="searchBar">
                  <span style="opacity:.8;">🔎</span>
                  <input id="searchInput" type="search" placeholder="Busca entre plantillas..." />
                  <button class="iconBtnMini" type="button" title="Filtros">⚙</button>
                </div>
              </div>

              <div class="quickCarousel" aria-label="Accesos rápidos">
             <button class="qArrow qArrow--left" id="qLeft" type="button" aria-label="Anterior">‹</button>

  <div class="quickRow" id="quickTrack">
    ${quick("Presentación", "Crea slides", "📊")}
    ${quick("Redes", "Post e historia", "💗")}
    ${quick("Video", "Reels & clips", "🎬")}
    ${quick("Impresión", "Flyers/menús", "🖨️")}
    ${quick("Doc", "Cartas y más", "📄")}
    ${quick("Pizarra", "Ideas rápidas", "🧠")}
    ${quick("Web", "Landing pages", "🌐")}
    ${quick("Email", "Invitaciones", "✉️")}
    ${quick("Foto", "Editar", "🖼️")}
    ${quick("Subir", "Cargar archivos", "☁️")}
  </div>

  <button class="qArrow qArrow--right" id="qRight" type="button" aria-label="Siguiente">›</button>
</div>

            </div>
          </section>

          <section class="section">
  <h2 class="sectionTitle">Echa un vistazo a las plantillas</h2>

  <div class="hCarousel" data-carousel>
    <button class="hArrow hArrow--left" data-left type="button" aria-label="Anterior">‹</button>

    <div class="hScroll" data-track>
      ${tpl("Presentación", "Plantillas modernas")}
      ${tpl("Cartel", "Diseños listos para imprimir")}
      ${tpl("Currículum", "Pro y limpio")}
      ${tpl("Email", "Invitaciones y newsletters")}
      ${tpl("Logo", "Próximo: editor (API)")}
    </div>

    <button class="hArrow hArrow--right" data-right type="button" aria-label="Siguiente">›</button>
  </div>
</section>


         <section class="section">
  <h2 class="sectionTitle">Inspirado en tus diseños</h2>

  <div class="hCarousel" data-carousel>
    <button class="hArrow hArrow--left" data-left type="button" aria-label="Anterior">‹</button>

    <div class="hScroll" data-track>
      ${design("Invitación XV", "Premium")}
      ${design("Boda", "RSVP")}
      ${design("Historia IG", "Animada")}
      ${design("Cumpleaños", "Moderna")}
      ${design("Post Promo", "Social")}
    </div>

    <button class="hArrow hArrow--right" data-right type="button" aria-label="Siguiente">›</button>
  </div>
</section>


          <section class="section">
  <h2 class="sectionTitle">Descubre Nexia</h2>

  <div class="hCarousel" data-carousel>
    <button class="hArrow hArrow--left" data-left type="button" aria-label="Anterior">‹</button>

    <div class="hScroll" data-track>
      ${design("Catálogo", "Tendencia")}
      ${design("Bazar", "Vintage")}
      ${design("Promo 35% OFF", "Marketing")}
      ${design("Video Gamer", "Clips")}
      ${design("San Valentín", "Temporada")}
    </div>

    <button class="hArrow hArrow--right" data-right type="button" aria-label="Siguiente">›</button>
  </div>
</section>


        </div>
      </main>
    </div>
  `;

  // Mount sidebar + header
  document.getElementById("sidebarMount").innerHTML =
    window.NexiaSidebar("plantillas");
  document.getElementById("dashHeaderMount").innerHTML =
    window.NexiaDashboardHeader(session.user.name);
  // ===== Quick carousel arrows =====
  (function initQuickCarousel() {
    const track = document.getElementById("quickTrack");
    const left = document.getElementById("qLeft");
    const right = document.getElementById("qRight");
    if (!track || !left || !right) return;

    const step = () => Math.max(260, Math.floor(track.clientWidth * 0.8));

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const x = track.scrollLeft;

      const atStart = x <= 2;
      const atEnd = x >= max - 2;

      left.classList.toggle("is-visible", !atStart);
      right.classList.toggle("is-visible", !atEnd);
    };

    left.addEventListener("click", () =>
      track.scrollBy({ left: -step(), behavior: "smooth" }),
    );
    right.addEventListener("click", () =>
      track.scrollBy({ left: step(), behavior: "smooth" }),
    );

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    requestAnimationFrame(update);
  })();

  // Logout
  document.getElementById("btnLogoutDash")?.addEventListener("click", () => {
    window.NexiaAuth.logout();
    window.location.href = "./index.html";
  });

  // Theme toggle (same localStorage key)
  const themeBtn = document.getElementById("themeBtnDash");
  const setThemeIcon = () => {
    const t = document.documentElement.getAttribute("data-theme");
    if (themeBtn) themeBtn.textContent = t === "dark" ? "☾" : "☀";
  };

  const saved = localStorage.getItem("nexia_theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
  }
  setThemeIcon();

  themeBtn?.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("nexia_theme", next);
    setThemeIcon();
  });

  // Sidebar navigation (placeholder)
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-nav");

      if (id === "crear") {
        openCreateModal();
        return; // ⛔ corta aquí, no sigue
      }

      alert(`Sección "${id}" (placeholder) ✅`);
    });
  });
  function createNewDesignFromCustomSize() {
    const w = Number(document.getElementById("customW").value || 1200);
    const h = Number(document.getElementById("customH").value || 1200);
    const unit = document.getElementById("customUnit").value || "px";

    // guardamos el "documento" (mínimo viable)
    const doc = {
      id: "doc_" + Date.now(),
      title: "Diseño sin título",
      width: w,
      height: h,
      unit,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("nexia_current_doc", JSON.stringify(doc));

    // ir al editor (en otra pantalla)
    window.location.href = `./editor.html?doc=${encodeURIComponent(doc.id)}`;
  }

  // Tabs (placeholder)
  document.querySelectorAll("[data-tab]").forEach((t) => {
    t.addEventListener("click", () => {
      document
        .querySelectorAll("[data-tab]")
        .forEach((x) => x.classList.remove("is-active"));
      t.classList.add("is-active");
    });
  });

  function quick(title, sub, emoji) {
    return `
      <div class="quickCard" role="button" tabindex="0" data-quick="${title}">
        <div class="quickIcon">${emoji}</div>
        <div class="quickLabel">${title}</div>
        <div class="quickSub">${sub}</div>
      </div>
    `;
  }

  function tpl(name, meta) {
    return `
      <article class="templateCard">
        <div class="templateThumb"></div>
        <div class="templateName">${name}</div>
        <div class="templateMeta">${meta}</div>
      </article>
    `;
  }

  function design(name, tag) {
    return `
      <article class="templateCard">
        <div class="templateThumb"></div>
        <div class="templateName">${name}</div>
        <div class="templateMeta">${tag}</div>
      </article>
    `;
  }
  // ===== Horizontal carousels (all) =====
  (function initAllCarousels() {
    const carousels = document.querySelectorAll("[data-carousel]");
    if (!carousels.length) return;

    const calcStep = (track) =>
      Math.max(320, Math.floor(track.clientWidth * 0.85));

    const setup = (wrap) => {
      const track = wrap.querySelector("[data-track]");
      const left = wrap.querySelector("[data-left]");
      const right = wrap.querySelector("[data-right]");
      if (!track || !left || !right) return;

      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        const x = track.scrollLeft;
        left.classList.toggle("is-visible", x > 2);
        right.classList.toggle("is-visible", x < max - 2);
      };

      left.addEventListener("click", () =>
        track.scrollBy({ left: -calcStep(track), behavior: "smooth" }),
      );
      right.addEventListener("click", () =>
        track.scrollBy({ left: calcStep(track), behavior: "smooth" }),
      );

      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);

      requestAnimationFrame(update);
    };

    carousels.forEach(setup);
  })();
  // ================================
  // Create Modal (tipo Canva)
  // ================================
  function ensureCreateModal() {
    if (document.getElementById("createModalOverlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "cmOverlay";
    overlay.id = "createModalOverlay";

    overlay.innerHTML = `
    <div class="cmModal" role="dialog" aria-modal="true" aria-label="Crear un diseño">
      <button class="cmClose" id="cmClose" type="button" aria-label="Cerrar">✕</button>

      <aside class="cmLeft">
        <div class="cmTitle">Crea un diseño</div>

        <nav class="cmNav" aria-label="Categorías">
          ${cmNavItem("para-ti", "Para ti", "✦")}
          ${cmNavItem("presentaciones", "Presentaciones", "📊")}
          ${cmNavItem("redes", "Redes sociales", "💗")}
          ${cmNavItem("fotos", "Fotos", "🖼️")}
          ${cmNavItem("videos", "Videos", "🎬")}
          ${cmNavItem("impresiones", "Impresiones", "🖨️")}
          ${cmNavItem("docs", "Nexia Docs", "📄")}
          ${cmNavItem("pizarras", "Pizarras online", "🧠")}
          ${cmNavItem("hojas", "Hojas de cálculo", "▦")}
          ${cmNavItem("sitios", "Sitios web", "🌐")}
          ${cmNavItem("correos", "Correos electrónicos", "✉️", "Nuevo")}
          ${cmNavItem("custom", "Tamaño personalizado", "⤢", "", true)}
          ${cmNavItem("subir", "Subir", "☁️")}
          ${cmNavItem("mas", "Más", "⋯")}
        </nav>
      </aside>

      <section class="cmMain">
        <div class="cmTop">
          <div class="cmSearch">
            <span style="opacity:.85">🔎</span>
            <input type="search" placeholder="¿Qué quieres diseñar?" />
          </div>
        </div>

        <div id="cmContent"></div>
      </section>
    </div>
  `;

    document.body.appendChild(overlay);

    // Cerrar
    const close = () => overlay.classList.remove("is-open");
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.getElementById("cmClose")?.addEventListener("click", close);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // Nav clicks
    overlay.querySelectorAll(".cmItem").forEach((btn) => {
      btn.addEventListener("click", () => {
        overlay
          .querySelectorAll(".cmItem")
          .forEach((x) => x.classList.remove("is-active"));
        btn.classList.add("is-active");
        const id = btn.getAttribute("data-cm");
        renderCreateContent(id);
      });
    });

    // Default: custom size view
    overlay
      .querySelector('.cmItem[data-cm="custom"]')
      ?.classList.add("is-active");
    renderCreateContent("custom");

    function cmNavItem(id, label, ico, badge = "", active = false) {
      return `
      <button class="cmItem ${active ? "is-active" : ""}" type="button" data-cm="${id}">
        <span class="cmIco">${ico}</span>
        <span>${label}</span>
        ${badge ? `<span class="cmBadge">${badge}</span>` : `<span></span>`}
      </button>
    `;
    }

    function renderCreateContent(id) {
      const content = document.getElementById("cmContent");
      if (!content) return;

      if (id !== "custom") {
        content.innerHTML = `
        <div class="cmH2">Acciones rápidas</div>
        <div class="cmHint">
          Esta sección es placeholder ✅<br>
          Por ahora conecta <b>Tamaño personalizado</b> (ya funciona).
        </div>
      `;
        return;
      }

      content.innerHTML = `
      <div class="cmH2">Tamaño personalizado</div>

      <div class="cmGrid">
        <div class="cmField">
          <label>Ancho</label>
          <input id="cmW" type="number" min="1" placeholder="1200" />
        </div>

        <div class="cmField">
          <label>Alto</label>
          <input id="cmH" type="number" min="1" placeholder="1200" />
        </div>

        <div class="cmField">
          <label>Unidades</label>
          <select id="cmU">
            <option value="px" selected>px</option>
            <option value="in">in</option>
            <option value="mm">mm</option>
            <option value="cm">cm</option>
          </select>
        </div>

        <button class="cmBtn" id="cmCreateBtn" type="button" disabled>
          Crear un diseño nuevo
        </button>
      </div>

      <div class="cmHint" id="cmSug">
        Sugerencias: <b>Post para LinkedIn 1200 × 1200 px</b> (ejemplo)
      </div>
    `;

      const w = content.querySelector("#cmW");
      const h = content.querySelector("#cmH");
      const u = content.querySelector("#cmU");
      const btn = content.querySelector("#cmCreateBtn");

      const validate = () => {
        const W = Number(w?.value || 0);
        const H = Number(h?.value || 0);
        btn.disabled = !(W > 0 && H > 0);
      };

      w?.addEventListener("input", validate);
      h?.addEventListener("input", validate);
      validate();

      btn?.addEventListener("click", () => {
        const W = encodeURIComponent(w.value.trim());
        const H = encodeURIComponent(h.value.trim());
        const U = encodeURIComponent(u.value);

        // 👉 aquí mandamos a “pantalla en blanco”
        window.location.href = `./editor.html?w=${W}&h=${H}&u=${U}`;
      });
    }
  }

  function openCreateModal() {
    ensureCreateModal();
    document.getElementById("createModalOverlay")?.classList.add("is-open");
  }
})();
