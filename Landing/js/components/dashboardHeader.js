window.NexiaDashboardHeader = function NexiaDashboardHeader(
  userName = "Usuario",
) {
  return `
    <div class="dbTopRow">
      <div class="dbUserPill">
        <span class="smallPill">Hola, ${userName}</span>
      </div>

      <div class="dbActions">
        <button class="iconBtn" id="themeBtnDash" type="button" aria-label="Tema">☾</button>
      </div>
    </div>
  `;
};
