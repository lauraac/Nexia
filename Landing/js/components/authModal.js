window.NexiaAuthModal = function NexiaAuthModal() {
  return `
  <div id="authBackdrop" class="modalBackdrop" aria-hidden="true">
    <div class="modal glass" role="dialog" aria-modal="true" aria-labelledby="authTitle">
      <div class="modal__head">
        <h3 class="modal__title" id="authTitle">Iniciar sesión</h3>
        <button class="modal__close" id="authClose" type="button" aria-label="Cerrar">✕</button>
      </div>

      <div class="modal__body">
        <div id="authAlert" class="alert"></div>

        <form class="form" id="authForm">
          <div class="field" id="fieldName" style="display:none;">
            <div class="label">Nombre</div>
            <input class="input" id="authName" autocomplete="name" placeholder="Tu nombre" />
          </div>

          <div class="field">
            <div class="label">Correo</div>
            <input class="input" id="authEmail" autocomplete="email" placeholder="tu@correo.com" />
          </div>

          <div class="field">
            <div class="label">Contraseña</div>
            <input class="input" id="authPassword" type="password" autocomplete="current-password" placeholder="••••••••" />
          </div>

          <div class="helperRow">
            <button class="linkBtn" id="authSwitch" type="button">¿No tienes cuenta? Regístrate</button>
            <span class="tiny muted" id="authHint">Guardado local (demo)</span>
          </div>

          <div class="modal__actions">
            <button class="btn btn--primary" type="submit" id="authSubmit">Iniciar sesión</button>
            <button class="btn" type="button" id="authCancel">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `;
};
