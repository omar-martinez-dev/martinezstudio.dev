const header = document.querySelector("[data-header]");
const appList = document.querySelector("#app-list");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const escapeHTML = value => String(value).replace(/[&<>'"]/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
}[character]));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

const observeReveals = () => {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach(element => observer.observe(element));
};

const renderApps = apps => {
  appList.innerHTML = apps.map(app => `
    <article class="app-feature reveal">
      <div class="app-copy">
        <div class="app-meta">
          <img src="${escapeHTML(app.icon)}" alt="" width="56" height="56">
          <div><p class="eyebrow">${escapeHTML(app.eyebrow)}</p><p>${escapeHTML(app.status)}</p></div>
        </div>
        <h3>${escapeHTML(app.name)}</h3>
        <p class="app-tagline">${escapeHTML(app.tagline)}</p>
        <p class="app-description">${escapeHTML(app.description)}</p>
        <div class="app-actions">
          <a class="button button-light" href="${escapeHTML(app.url)}">Explore the product <span aria-hidden="true">→</span></a>
          <a class="text-link" href="${escapeHTML(app.privacy)}">Privacy policy</a>
          <a class="text-link" href="${escapeHTML(app.caseStudy)}">Case study ↗</a>
        </div>
      </div>
      <a class="app-visual" href="${escapeHTML(app.url)}" aria-label="Explore ${escapeHTML(app.name)}">
        <img src="${escapeHTML(app.image)}" alt="${escapeHTML(app.name)} practice interface">
        <span class="app-visual-label" aria-hidden="true">Product 001 · View →</span>
      </a>
    </article>
  `).join("");
  observeReveals();
};

if (appList) {
  fetch("data/apps.json")
    .then(response => { if (!response.ok) throw new Error("Unable to load app catalog"); return response.json(); })
    .then(renderApps)
    .catch(() => { appList.innerHTML = '<p>The app catalog is temporarily unavailable. <a href="apps/ostinova/">Explore Ostinova directly.</a></p>'; });
}

observeReveals();
let pointerPosition = { x: -1, y: -1 };
const pointerIsInHeaderZone = () => {
  const sideInset = window.innerWidth <= 680 ? 10 : 20;
  const zoneWidth = Math.min(window.innerWidth - (sideInset * 2), 1120);
  const zoneLeft = (window.innerWidth - zoneWidth) / 2;
  return pointerPosition.y >= 0 && pointerPosition.y <= 96 && pointerPosition.x >= zoneLeft && pointerPosition.x <= zoneLeft + zoneWidth;
};
const updateHeader = () => {
  if (!header) return;
  const isMinimized = window.scrollY > 96;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
  header.classList.toggle("is-minimized", isMinimized);
  header.classList.toggle("is-hover-expanded", isMinimized && pointerIsInHeaderZone());
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("pointermove", event => {
  if (event.pointerType === "touch") return;
  pointerPosition = { x: event.clientX, y: event.clientY };
  updateHeader();
}, { passive: true });
window.addEventListener("resize", updateHeader, { passive: true });
document.querySelectorAll("[data-year]").forEach(element => { element.textContent = new Date().getFullYear(); });
if (reduceMotion.matches) document.querySelectorAll(".reveal").forEach(element => element.classList.add("is-visible"));
