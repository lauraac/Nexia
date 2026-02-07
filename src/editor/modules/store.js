function getQueryParam(name) {
  return new URL(window.location.href).searchParams.get(name);
}

export function loadCurrentProject() {
  const designId =
    getQueryParam("designId") || localStorage.getItem("nexia:currentProjectId");

  const list = JSON.parse(localStorage.getItem("nexia:projects") || "[]");
  const project = list.find((p) => p.id === designId);

  if (!project) {
    // fallback simple
    return {
      id: "nx_tmp",
      title: "Diseño sin título",
      width: 1080,
      height: 1080,
      unit: "px",
      widthPx: 1080,
      heightPx: 1080,
      doc: { pages: [{ id: "p1", elements: [] }] },
    };
  }
  return project;
}

export function saveProject(project) {
  const key = "nexia:projects";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = list.findIndex((p) => p.id === project.id);
  if (idx >= 0) list[idx] = project;
  else list.unshift(project);
  localStorage.setItem(key, JSON.stringify(list));
  localStorage.setItem("nexia:currentProjectId", project.id);
}

export function ensureProjectHasPages(project) {
  if (!project.doc) project.doc = {};
  if (!Array.isArray(project.doc.pages)) project.doc.pages = [];
  if (project.doc.pages.length === 0) {
    project.doc.pages.push({ id: "p1", elements: [] });
  }
  if (!project.doc.activePageId) {
    project.doc.activePageId = project.doc.pages[0].id;
  }
}

export function addPage(project) {
  const id = "p" + (project.doc.pages.length + 1);
  project.doc.pages.push({ id, elements: [] });
  project.doc.activePageId = id;
  saveProject(project);
  return id;
}

export function setActivePage(project, pageId) {
  project.doc.activePageId = pageId;
  saveProject(project);
}
