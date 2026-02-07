export const bus = {
  on(evt, fn) {
    document.addEventListener(evt, (e) => fn(e.detail));
  },
  emit(evt, detail) {
    document.dispatchEvent(new CustomEvent(evt, { detail }));
  },
};
