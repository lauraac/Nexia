window.NexiaSidebar = function NexiaSidebar(active = "plantillas") {
  const item = (id, label, icon) => `
    <button class="sideItem ${active === id ? "is-active" : ""}" data-nav="${id}" type="button">
      <div class="sideIcon">${icon}</div>
      <div class="sideLabel">${label}</div>
    </button>
  `;

  // ✅ Íconos inline (estables). Luego puedes cambiar a <img src="...flaticon...">
  const icons = {
    create: "＋",
    home: "⌂",
    projects: "▦",
    templates: "▢",
    brand: "♛",
    ai: "✦",
  };

  return `
  <aside class="sidebar">
    <div class="sideBox glass">
      <div class="brandSide">
        <div class="brandSide__logo">N</div>
        <div class="brandSide__name">NEXIA</div>
      </div>
    </div>

 <div class="sideBox glass navBox">
  <nav class="sideNav" aria-label="Navegación">
    ${item("crear", "Crear", icons.create)}
    ${item("inicio", "Inicio", icons.home)}
    ${item("proyectos", "Proyectos", icons.projects)}
    ${item("plantillas", "Plantillas", icons.templates)}
    ${item("marca", "Marca", icons.brand)}
    ${item("ia", "Nexia IA", icons.ai)}
  </nav>
</div>


    <div class="sideBox glass">
      <div class="profile">
        <div class="avatar" aria-hidden="true"></div>
        <button class="btn" id="btnLogoutDash" type="button">Salir</button>
      </div>
    </div>
  </aside>
  `;
};
