// src/editor/modules/background.js
export function initBackground({ canvasApi, history, getActivePage }) {
  const btn = document.getElementById("nxBgBtn");
  const picker = document.getElementById("nxBgColor");
  const { stage, layer } = canvasApi;

  // rect de fondo
  const bg = new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fill: "#ffffff",
    listening: false,
    name: "nexia-bg",
  });
  layer.add(bg);
  bg.moveToBottom();
  layer.draw();

  btn?.addEventListener("click", () => picker?.click());

  picker?.addEventListener("input", () => {
    const newColor = picker.value;
    const oldColor = bg.fill();

    history.push(
      () => {
        bg.fill(newColor);
        layer.draw();
        getActivePage().bg = newColor;
      },
      () => {
        bg.fill(oldColor);
        layer.draw();
        getActivePage().bg = oldColor;
      },
    );

    history.doLast();
  });
}
