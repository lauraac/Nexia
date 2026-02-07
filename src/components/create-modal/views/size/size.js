// src/components/create-modal/views/size/size.js
// Vista "Elegir tamaño": valida, habilita botón y convierte unidades automáticamente.

export function initView(mount) {
  const $ = (sel) => mount.querySelector(sel);

  const wEl = $("#cmSizeWidth");
  const hEl = $("#cmSizeHeight");
  const unitEl = $("#cmSizeUnit");
  const lockEl = $("#cmLockRatio");
  const btn = $("#cmCreateNew");
  const hintEl = $(".cmHint");

  if (!wEl || !hEl || !unitEl || !btn) {
    console.warn("[size.js] Faltan elementos. Revisa IDs en size.html");
    return;
  }

  // Límites reales en pulgadas (como tu mensaje)
  const LIMITS_IN = { min: 0.417, max: 83.328 };

  const DPI = 96; // px por inch (web estándar)
  const MM_PER_IN = 25.4;
  const CM_PER_IN = 2.54;

  const getUnit = () => unitEl.value || "px";

  const toInches = (value, unit) => {
    if (!Number.isFinite(value)) return NaN;
    switch (unit) {
      case "in":
        return value;
      case "px":
        return value / DPI;
      case "mm":
        return value / MM_PER_IN;
      case "cm":
        return value / CM_PER_IN;
      default:
        return value;
    }
  };

  const fromInches = (inches, unit) => {
    if (!Number.isFinite(inches)) return NaN;
    switch (unit) {
      case "in":
        return inches;
      case "px":
        return inches * DPI;
      case "mm":
        return inches * MM_PER_IN;
      case "cm":
        return inches * CM_PER_IN;
      default:
        return inches;
    }
  };

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const unitMinMax = (unit) => ({
    min: fromInches(LIMITS_IN.min, unit),
    max: fromInches(LIMITS_IN.max, unit),
  });

  const formatForUnit = (value, unit) => {
    if (!Number.isFinite(value)) return "";
    // px entero, otras con 3 decimales máximo
    if (unit === "px") return String(Math.round(value));
    return String(Math.round(value * 1000) / 1000);
  };

  const parseNum = (el) => {
    const raw = String(el.value ?? "").trim();
    if (!raw) return NaN;
    // por si acaso (aunque type=number)
    const n = Number(raw.replace(/\s/g, "").replace(/,/g, ""));
    return Number.isFinite(n) ? n : NaN;
  };

  function setHint(text, isError) {
    if (!hintEl) return;
    hintEl.textContent = text || "";
    hintEl.style.color = isError ? "#ff5a6b" : "";
  }

  function validateAndToggle() {
    const unit = getUnit();
    const { min, max } = unitMinMax(unit);

    const w = parseNum(wEl);
    const h = parseNum(hEl);

    const has = Number.isFinite(w) && Number.isFinite(h);
    const ok = has && w >= min && w <= max && h >= min && h <= max;

    btn.disabled = !ok;

    if (!has) {
      setHint("Ingresa ancho y alto para habilitar.", false);
    } else if (!ok) {
      setHint(
        `El tamaño no puede ser menor a ${formatForUnit(min, unit)} ${unit} ni mayor a ${formatForUnit(max, unit)} ${unit}.`,
        true,
      );
    } else {
      setHint("", false);
    }

    return ok;
  }

  // --- Convertir automáticamente al cambiar unidad
  let lastUnit = getUnit();
  let baseRatio = null; // ratio original cuando se activa lock

  function captureRatioIfNeeded() {
    const w = parseNum(wEl);
    const h = parseNum(hEl);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w === 0) return;
    baseRatio = h / w;
  }

  lockEl?.addEventListener("change", () => {
    if (lockEl.checked) captureRatioIfNeeded();
    validateAndToggle();
  });

  function applyLockFromWidth() {
    if (!lockEl || !lockEl.checked) return;
    if (!baseRatio || !Number.isFinite(baseRatio)) captureRatioIfNeeded();

    const unit = getUnit();
    const w = parseNum(wEl);
    if (!Number.isFinite(w) || !Number.isFinite(baseRatio)) return;

    hEl.value = formatForUnit(w * baseRatio, unit);
  }

  function applyLockFromHeight() {
    if (!lockEl || !lockEl.checked) return;
    if (!baseRatio || !Number.isFinite(baseRatio)) captureRatioIfNeeded();

    const unit = getUnit();
    const h = parseNum(hEl);
    if (!Number.isFinite(h) || !Number.isFinite(baseRatio) || baseRatio === 0)
      return;

    wEl.value = formatForUnit(h / baseRatio, unit);
  }

  function convertOnUnitChange() {
    const newUnit = getUnit();
    const oldUnit = lastUnit;
    if (newUnit === oldUnit) return;

    const wOld = parseNum(wEl);
    const hOld = parseNum(hEl);

    // si no hay números, solo cambia unidad y valida
    if (!Number.isFinite(wOld) || !Number.isFinite(hOld)) {
      lastUnit = newUnit;
      validateAndToggle();
      return;
    }

    // convertir old -> inches -> new
    const wIn = toInches(wOld, oldUnit);
    const hIn = toInches(hOld, oldUnit);

    let wNew = fromInches(wIn, newUnit);
    let hNew = fromInches(hIn, newUnit);

    // clamp a límites permitidos en unidad nueva
    const { min, max } = unitMinMax(newUnit);
    wNew = clamp(wNew, min, max);
    hNew = clamp(hNew, min, max);

    wEl.value = formatForUnit(wNew, newUnit);

    if (lockEl?.checked) {
      // conserva proporción
      if (!baseRatio || !Number.isFinite(baseRatio))
        baseRatio = hOld / (wOld || 1);
      hEl.value = formatForUnit(wNew * baseRatio, newUnit);
    } else {
      hEl.value = formatForUnit(hNew, newUnit);
    }

    lastUnit = newUnit;
    validateAndToggle();
  }

  // Eventos de inputs
  wEl.addEventListener("input", () => {
    if (lockEl?.checked) applyLockFromWidth();
    validateAndToggle();
  });

  hEl.addEventListener("input", () => {
    if (lockEl?.checked) applyLockFromHeight();
    validateAndToggle();
  });

  unitEl.addEventListener("change", convertOnUnitChange);

  // Crear diseño
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validateAndToggle()) return;

    const unit = getUnit();
    const w = parseNum(wEl);
    const h = parseNum(hEl);

    const wIn = toInches(w, unit);
    const hIn = toInches(h, unit);

    const widthPx = Math.round(fromInches(wIn, "px"));
    const heightPx = Math.round(fromInches(hIn, "px"));

    // se lo mandamos al flujo que ya tienes (create-modal.js / app.js)
    mount.dispatchEvent(
      new CustomEvent("nexia:createDesign", {
        bubbles: true,
        detail: {
          width: w,
          height: h,
          unit,
          widthPx,
          heightPx,
        },
      }),
    );
  });

  // Inicial
  validateAndToggle();
}
