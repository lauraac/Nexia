export function initBackground({ canvasApi, history }) {
  const btn = document.getElementById("nxBgBtn");
  const picker = document.getElementById("nxBgColor");
  if (!btn || !picker) return;

  btn.addEventListener("click", () => picker.click());

  picker.addEventListener("input", () => {
    history?.pushSnapshot?.();
    canvasApi.setBackground(picker.value);
    history?.pushSnapshot?.();
  });
}
