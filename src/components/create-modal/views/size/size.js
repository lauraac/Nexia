// src/components/create-modal/views/size/size.js

const LIMITS = {
  px: { min: 40, max: 8000 },
  in: { min: 0.2, max: 100 }, // aprox 40px..8000px a 96dpi => 0.42..83.33, dejamos un margen
  mm: { min: 5, max: 2000 }, // aproximado
  cm: { min: 0.5, max: 200 }, // aproximado
};

// Sugerencias simples (puedes crecer esto después)
const SUGGESTIONS = [
  { title: "Post para LinkedIn", w: 1200, h: 1200, unit: "px" },
  { title: "Historia (9:16)", w: 1080, h: 1920, unit: "px" },
  { title: "A4", w: 21, h: 29.7, unit: "cm" },
];

function clampNumber(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : NaN;
}

function getLimits(unit) {
  return LIMITS[unit] || LIMITS.px;
}

function formatLimitText(unit) {
  const { min, max } = getLimits(unit);
  const u = unit;
  return `El tamaño no puede ser menor a ${min} ${u} ni mayor a ${max} ${u}.`;
}

function isInRange(val, unit) {
  const { min, max } = getLimits(unit);
  return val >= min && val <= max;
}

function setFieldState(el, ok) {
  if (!el) return;
  el.classList.toggle("isInvalid", !ok);
}

function upsertError(el, msg) {
  // usa un div pequeño debajo del grid (o debajo de inputs)
  if (!el) return;
  el.textContent = msg || "";
  el.style.display = msg ? "block" : "none";
}

function saveDraftSize({ w, h, unit, lock }) {
  const payload = { w, h, unit, lock: !!lock, ts: Date.now() };
  localStorage.setItem("nexia:newDesign:size", JSON.stringify(payload));
}

function createProject({ w, h, unit }) {
  const id = "nx_" + Math.random().toString(16).slice(2) + "_" + Date.now();
  const project = {
    id,
    title: "Diseño sin título",
    width: w,
    height: h,
    unit,
    createdAt: new Date().toISOString(),
    // aquí luego guardas layers, elements, etc.
    doc: {
      pages: [{ id: "p1", elements: [] }],
    },
  };

  const key = "nexia:projects";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.unshift(project);
  localStorage.setItem(key, JSON.stringify(list));

  // también guardamos el actual
  localStorage.setItem("nexia:currentProjectId", id);

  return id;
}

export function initSizeView(rootEl) {
  // rootEl es el contenedor del HTML ya montado (size.html)
  const widthEl = rootEl.querySelector("#cmSizeWidth");
  const heightEl = rootEl.querySelector("#cmSizeHeight");
  const unitEl = rootEl.querySelector("#cmSizeUnit");
  const btnEl = rootEl.querySelector("#cmCreateNew");
  const lockEl = rootEl.querySelector("#cmLockRatio"); // si lo agregas en HTML
  const hintEl = rootEl.querySelector(".cmHint");
  const sugWrap = rootEl.querySelector("#cmSuggestions"); // si lo agregas

  // si no existe hint, no pasa nada
  if (hintEl) hintEl.textContent = "Ingresa ancho y alto para habilitar.";

  function paintSuggestions() {
    if (!sugWrap) return;
    sugWrap.innerHTML = "";

    SUGGESTIONS.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cmSug";
      btn.innerHTML = `
        <span class="cmSug__icon">🖼️</span>
        <span class="cmSug__txt">
          <span class="cmSug__title">${s.title}</span>
          <span class="cmSug__meta">${s.w} × ${s.h} ${s.unit}</span>
        </span>
      `;
      btn.addEventListener("click", () => {
        unitEl.value = s.unit;
        widthEl.value = s.w;
        heightEl.value = s.h;
        validate();
      });
      sugWrap.appendChild(btn);
    });
  }

  function validate() {
    const unit = unitEl.value || "px";
    const w = clampNumber(widthEl.value);
    const h = clampNumber(heightEl.value);

    const wOk = Number.isFinite(w) && isInRange(w, unit);
    const hOk = Number.isFinite(h) && isInRange(h, unit);

    setFieldState(widthEl, wOk || !widthEl.value);
    setFieldState(heightEl, hOk || !heightEl.value);

    const allFilled = !!widthEl.value && !!heightEl.value;
    const allOk = allFilled && wOk && hOk;

    if (btnEl) btnEl.disabled = !allOk;

    if (hintEl) {
      if (!allFilled) {
        hintEl.textContent = "Ingresa ancho y alto para habilitar.";
        hintEl.classList.remove("isError");
      } else if (!allOk) {
        hintEl.textContent = formatLimitText(unit);
        hintEl.classList.add("isError");
      } else {
        hintEl.textContent = "";
        hintEl.classList.remove("isError");
      }
    }

    saveDraftSize({ w, h, unit, lock: lockEl?.checked });

    return { allOk, w, h, unit };
  }

  // (Opcional) lock ratio simple
  function syncRatio(changed) {
    if (!lockEl?.checked) return;
    const unit = unitEl.value || "px";
    const w = clampNumber(widthEl.value);
    const h = clampNumber(heightEl.value);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return;

    // ratio actual
    const r = w / h;

    if (changed === "w") {
      const newH = Math.round((w / r) * 1000) / 1000;
      heightEl.value = newH;
    } else if (changed === "h") {
      const newW = Math.round(h * r * 1000) / 1000;
      widthEl.value = newW;
    }
    // valida de nuevo
    validate();
  }

  widthEl?.addEventListener("input", () => {
    validate();
    // si quieres lock real, necesitarías guardar ratio inicial.
    // aquí lo dejamos simple; si te molesta lo quitamos.
  });
  heightEl?.addEventListener("input", () => validate());
  unitEl?.addEventListener("change", () => validate());

  btnEl?.addEventListener("click", () => {
    const { allOk, w, h, unit } = validate();
    if (!allOk) return;

    const id = createProject({ w, h, unit });

    // cierra el modal antes de ir
    document.getElementById("createModal")?.classList.remove("show");
    document.body.classList.remove("noScroll");

    // navega al editor
    window.location.href = `./src/editor/editor.html?designId=${encodeURIComponent(id)}`;
  });

  paintSuggestions();
  validate();
}
