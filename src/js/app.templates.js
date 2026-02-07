// Nexia Templates Page logic
// - render categorías, ribbons, grids
// - filtro por búsqueda
// - sidebar active
// - notificaciones + menú cuenta (toggle)

const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
const MOBILE_MAX_CATS = 6; // cuántas se ven en la fila en celular (sin scroll)
function getCatLimitByScreen() {
  const w = window.innerWidth;

  // celular
  if (w <= 520) return 4;

  // tablet
  if (w <= 900) return 8;

  // desktop
  return 12;
}

const state = {
  query: "",
  category: "all",
  notif: [
    {
      title: "Nuevo diseño guardado",
      body: "Tu plantilla “Historia” se guardó correctamente.",
    },
    {
      title: "Tip rápido",
      body: "Prueba buscar: “Invitación” para ver filtros.",
    },
    {
      title: "Marca",
      body: "Guarda tus colores para reutilizarlos en todos tus diseños.",
    },
  ],
  categories: [
    { key: "presentation", name: "Presentación", icon: "📽️" },
    { key: "social", name: "Redes", icon: "❤️" },
    { key: "video", name: "Video", icon: "🎬" },
    { key: "print", name: "Impresión", icon: "🖨️" },
    { key: "doc", name: "Doc", icon: "📄" },
    { key: "whiteboard", name: "Pizarra", icon: "🧠" },
    { key: "sheet", name: "Hoja", icon: "📊" },
    { key: "web", name: "Web", icon: "</>" },
    { key: "email", name: "Email", icon: "✉️" },
    { key: "photo", name: "Foto", icon: "📷" },
    { key: "upload", name: "Subir", icon: "☁️" },
    { key: "more", name: "Más", icon: "⋯" },
  ],
  ribbon: [
    {
      title: "Presentación",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      key: "presentation",
    },
    {
      title: "Cartel",
      img: "https://i.pinimg.com/1200x/cf/5a/ee/cf5aee8d1de8e3532230231c5d5511d7.jpg",
      key: "print",
    },
    {
      title: "Currículum",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      key: "doc",
    },
    {
      title: "Invitación",
      img: "https://i.pinimg.com/1200x/fb/1e/75/fb1e75bd3f0cc790f8afba2c53a09cf0.jpg",
      key: "social",
    },
    {
      title: "Logo",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      key: "web",
    },
    {
      title: "Flyer",
      img: "https://i.pinimg.com/1200x/72/61/22/72612283bf16547f6bd51f1ae979c0d7.jpg",
      key: "print",
    },
    {
      title: "Menú",
      img: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=1200&q=80",
      key: "print",
    },
    {
      title: "Sitio web",
      img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
      key: "web",
    },
  ],
  inspired: [
    {
      title: "Respira",
      img: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80",
      key: "social",
    },
    {
      title: "Motivación",
      img: "https://i.pinimg.com/736x/c5/e3/f2/c5e3f2643388eabfbcbdd4346ba42b40.jpg",
      key: "print",
    },
    {
      title: "Atardecer",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      key: "photo",
    },
    {
      title: "Invitación",
      img: "https://i.pinimg.com/736x/72/b9/03/72b9031de8cd66ecad2746c751098f2e.jpg",
      key: "social",
    },
    {
      title: "Evento",
      img: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
      key: "social",
    },
    {
      title: "Historia",
      img: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
      key: "video",
    },
    {
      title: "Tipografía",
      img: "https://i.pinimg.com/736x/a1/85/fc/a185fcb97f71e6da00b15c56c959c192.jpg",
      key: "doc",
    },
    {
      title: "Cover",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      key: "web",
    },
    {
      title: "Poster",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      key: "print",
    },
    {
      title: "Social",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      key: "social",
    },
    {
      title: "Música",
      img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
      key: "video",
    },
    {
      title: "Minimal",
      img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
      key: "web",
    },
  ],
  discover: [
    {
      title: "Nexia Pro",
      desc: "Organiza tus proyectos, comparte plantillas y colabora con tu equipo.",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Plantillas premium",
      desc: "Colecciones por temporada: eventos, negocios, redes sociales.",
      img: "https://images.unsplash.com/photo-1529336953121-a0e3a3a6718d?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Aprende diseño",
      desc: "Mini guías para que tus diseños se vean más pro en minutos.",
      img: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80",
    },
  ],
};

function isMobile() {
  return window.matchMedia("(max-width: 520px)").matches;
}

function renderCats() {
  const wrap = document.getElementById("catRow");
  wrap.innerHTML = "";

  const limit = getCatLimitByScreen(); // 4 / 8 / 12
  const all = state.categories.filter((c) => c.key !== "more");

  // Visible = las primeras N + botón Más
  const visible = [
    ...all.slice(0, limit),
    { key: "more", name: "Más", icon: "⋯" },
  ];

  visible.forEach((c) => {
    const el = document.createElement("button");
    el.className = "cat";
    el.type = "button";
    el.dataset.cat = c.key;

    el.innerHTML = `
      <span class="cat__bubble" aria-hidden="true">${iconToSvg(c.icon)}</span>
      <span class="cat__name">${c.name}</span>
    `;

    el.addEventListener("click", () => {
      if (c.key === "more") {
        document.getElementById("moreSheet")?.classList.add("show");
        return;
      }
      state.category = c.key;
      applyFilters();
      highlightCategory(c.key);
    });

    wrap.appendChild(el);
  });
}

function iconToSvg(token) {
  // Para emojis dejamos tal cual, para "</>" hacemos mini svg
  if (token === "</>") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18 3 12l6-6M15 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  return `<span style="font-weight:900">${token}</span>`;
}

function renderRibbon() {
  const track = $("#lookTrack");
  track.innerHTML = "";

  state.ribbon.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "ribbonCard";
    card.dataset.key = item.key;
    card.innerHTML = `
      <div class="ribbonCard__img" style="background-image:url('${item.img}')"></div>
      <div class="ribbonCard__txt">${item.title}</div>
    `;
    card.addEventListener("click", () => {
      state.category = item.key;
      applyFilters();
      highlightCategory(item.key);
      // scroll to inspired section
      document
        .querySelector("#inspiredGrid")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    track.appendChild(card);
  });

  // nav buttons
  const scroller = $("#lookScroll");
  $("#btnPrevLook").addEventListener("click", () =>
    scroller.scrollBy({ left: -520, behavior: "smooth" }),
  );
  $("#btnNextLook").addEventListener("click", () =>
    scroller.scrollBy({ left: 520, behavior: "smooth" }),
  );
}

function renderInspired(list) {
  const grid = $("#inspiredGrid");
  grid.innerHTML = "";

  list.forEach((tpl) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "tpl";
    el.dataset.key = tpl.key;
    el.dataset.title = tpl.title.toLowerCase();

    el.innerHTML = `
      <div class="tpl__img" style="background-image:url('${tpl.img}')"></div>
      <div class="tpl__grad"></div>
      <div class="tpl__label">${tpl.title}</div>
    `;

    el.addEventListener("click", () => {
      // Por ahora: demo
      alert(
        `Abrir plantilla: ${tpl.title}\n(Siguiente paso: abrir editor con Konva)`,
      );
    });

    grid.appendChild(el);
  });
}

function renderDiscover() {
  const grid = $("#discoverGrid");
  grid.innerHTML = "";

  state.discover.forEach((x) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "wide";
    el.innerHTML = `
      <div class="wide__img" style="background-image:url('${x.img}')"></div>
      <div class="wide__content">
        <h3 class="wide__title">${x.title}</h3>
        <p class="wide__desc">${x.desc}</p>
      </div>
    `;
    el.addEventListener("click", () =>
      alert(`${x.title}\n(esto será una sección real después)`),
    );
    grid.appendChild(el);
  });
}

function applyFilters() {
  const q = state.query.trim().toLowerCase();
  const cat = state.category;

  const filtered = state.inspired.filter((item) => {
    const okQ = !q || item.title.toLowerCase().includes(q);
    const okC = cat === "all" || item.key === cat;
    return okQ && okC;
  });

  renderInspired(filtered);
}

function highlightCategory(key) {
  // Visual: solo “resalta” el nombre, sin complicar
  $$(".cat").forEach((b) => {
    const name = b.querySelector(".cat__name");
    if (!name) return;
    name.style.color = b.dataset.cat === key ? "var(--text)" : "var(--muted)";
  });
}

function initSidebar() {
  $$(".sb__item").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".sb__item").forEach((x) => x.classList.remove("isActive"));
      btn.classList.add("isActive");

      // demo route (luego haces navegación real)
      const route = btn.dataset.route;
      if (route === "projects") alert("Proyectos (siguiente vista)");
      if (route === "brand") alert("Marca (siguiente vista)");
      // templates/home se quedan aquí
    });
  });
}

function initChips() {
  $$(".chip").forEach((ch) => {
    ch.addEventListener("click", () => {
      $$(".chip").forEach((x) => x.classList.remove("isActive"));
      ch.classList.add("isActive");

      // demo behavior: chip cambia “modo”
      const mode = ch.dataset.chip;
      if (mode === "mine") {
        state.category = "all";
        state.query = "";
        $("#searchInput").value = "";
        applyFilters();
      }
      if (mode === "ai") {
        alert("Nexia IA (próxima función)");
      }
    });
  });
}

function initSearch() {
  const input = $("#searchInput");
  input.addEventListener("input", () => {
    state.query = input.value;
    applyFilters();
  });

  $("#btnFilters").addEventListener("click", () => {
    alert("Filtros avanzados (próximo paso)");
  });
}
function initMoreSheet() {
  const sheet = document.getElementById("moreSheet");
  const backdrop = document.getElementById("moreSheetBackdrop");
  const closeBtn = document.getElementById("closeMoreSheet");
  const grid = document.getElementById("moreSheetGrid");

  function close() {
    sheet.classList.remove("show");
  }

  backdrop.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Render todas las categorías (excepto "more")
  grid.innerHTML = state.categories
    .filter((c) => c.key !== "more")
    .map(
      (c) => `
      <button class="sheetItem" type="button" data-cat="${c.key}">
        <span class="sheetItem__bubble">${iconToSvg(c.icon)}</span>
        <span class="sheetItem__name">${c.name}</span>
      </button>
    `,
    )
    .join("");

  grid.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.cat;
      applyFilters();
      highlightCategory(state.category);
      close();
    });
  });
}

function initAccountMenu() {
  const menu = $("#accountMenu");
  const btnAccount = $("#btnAccount");

  btnAccount.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

  menu.addEventListener("click", (e) => {
    if (e.target === menu) menu.classList.remove("show");
  });

  // Cierra con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") menu.classList.remove("show");
  });
}

function initNotifications() {
  const drawer = $("#notifDrawer");
  const btnBell = $("#btnBell");
  const close = $("#closeNotif");
  const list = $("#notifList");
  const badge = $("#notifBadge");

  function render() {
    list.innerHTML = state.notif
      .map(
        (n) => `
      <div class="note">
        <p class="note__t">${n.title}</p>
        <p class="note__p">${n.body}</p>
      </div>
    `,
      )
      .join("");
    badge.textContent = String(state.notif.length);
  }

  render();

  btnBell.addEventListener("click", () => {
    drawer.classList.add("show");
  });
  close.addEventListener("click", () => {
    drawer.classList.remove("show");
  });
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) drawer.classList.remove("show");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") drawer.classList.remove("show");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCats();
  renderRibbon();
  renderDiscover();

  initSidebar();
  initChips();
  initSearch();
  initAccountMenu();
  initNotifications();
  initMoreSheet();

  highlightCategory("all");
  applyFilters();

  // ✅ si cambia el tamaño, ajusta el número de categorías
  window.addEventListener("resize", () => {
    renderCats();
  });
});

// ==============================
// Left Panel (tipo Canva)
// ==============================
// ==============================
// Left Panel (tipo Canva)  ✅ SOLO CON ☰
// ==============================
const leftPanel = document.getElementById("leftPanel");
const leftPanelBackdrop = document.getElementById("leftPanelBackdrop");
const closeLeftPanel = document.getElementById("closeLeftPanel");

const btnNew = document.getElementById("btnNew"); // +  (NO se usa aquí)
const btnMenu = document.getElementById("btnMenu");

btnMenu?.addEventListener("click", () => {
  if (leftPanel.classList.contains("show")) hideLeftPanel();
  else openLeftPanel();
});

function openLeftPanel() {
  leftPanel?.classList.add("show");
  leftPanel?.setAttribute("aria-hidden", "false");
}

function hideLeftPanel() {
  leftPanel?.classList.remove("show");
  leftPanel?.setAttribute("aria-hidden", "true");
}

// ✅ SOLO el ☰ abre/cierra el panel
btnMenu?.addEventListener("click", (e) => {
  e.preventDefault();
  if (leftPanel?.classList.contains("show")) hideLeftPanel();
  else openLeftPanel();
});

// ❌ IMPORTANTE: ELIMINAMOS el listener del +
// btnNew?.addEventListener("click", ...)  <-- YA NO

leftPanelBackdrop?.addEventListener("click", hideLeftPanel);
closeLeftPanel?.addEventListener("click", hideLeftPanel);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && leftPanel?.classList.contains("show"))
    hideLeftPanel();
});

// Click en opciones del panel
document.querySelectorAll("[data-panel-route]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("[data-panel-route]")
      .forEach((x) => x.classList.remove("isActive"));
    btn.classList.add("isActive");
    hideLeftPanel();
  });
});
