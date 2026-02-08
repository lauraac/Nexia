export function initImages({ canvasApi, history }) {
  const input = document.getElementById("nxImgInput");
  if (!input) return;

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || "");
      if (!dataUrl) return;

      history?.pushSnapshot?.();
      await canvasApi.addImageFromDataUrl(dataUrl);
      history?.pushSnapshot?.();

      input.value = "";
    };

    reader.readAsDataURL(file);
  });
}
