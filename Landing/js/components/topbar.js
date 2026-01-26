window.NexiaTopbar = function NexiaTopbar() {
  return `
  <div class="topbarWrap">
    <div class="container">
      <div class="topbar glass">
        <div class="topbar__row">
         <a class="brand" href="../index.html" aria-label="Nexia Home">

            <div class="brand__logo">N</div>
            <div class="brand__name">NEXIA</div>
          </a>

          <nav class="nav" aria-label="Navegación">
            <a href="#" data-link="design">Diseño</a>
            <a href="#" data-link="product">Producto</a>
            <a href="#" data-link="plans">Planes</a>
            <a href="#" data-link="business">Empresas</a>
            <a href="#" data-link="help">Ayuda</a>
          </nav>

                    <div class="actions">
            <button class="iconBtn" id="themeBtn" type="button" aria-label="Cambiar tema" title="Tema">☾</button>

            <button class="iconBtn menuBtn" id="menuBtn" type="button" aria-label="Abrir menú" title="Menú">☰</button>

            <div id="authArea" style="display:flex; gap:10px; align-items:center;">
              <button class="btn btn--ghost" type="button" id="btnSignup">Regístrate</button>
              <button class="btn" type="button" id="btnLogin">Iniciar sesión</button>
            </div>

            <div id="userArea" style="display:none; gap:10px; align-items:center;">
              <span class="pill tiny" id="helloUser">Hola</span>
              <button class="btn" type="button" id="btnLogout">Salir</button>
            </div>
          </div>


        <div id="mobilePanel" class="mobilePanel glass" style="display:none;">
          <div class="mobileNav" aria-label="Menú móvil">
            <a href="#" data-link="design">Diseño</a>
            <a href="#" data-link="product">Producto</a>
            <a href="#" data-link="plans">Planes</a>
            <a href="#" data-link="business">Empresas</a>
            <a href="#" data-link="help">Ayuda</a>
          </div>

          <div class="mobileActions">
            <button class="btn btn--primary" type="button" id="btnStartMobile">Empieza a diseñar</button>
            <button class="btn" type="button" id="btnSignupMobile">Regístrate</button>
            <button class="btn" type="button" id="btnLoginMobile">Iniciar sesión</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
};
