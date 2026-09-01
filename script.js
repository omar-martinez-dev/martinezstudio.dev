const header = document.querySelector("[data-header]");
const appList = document.querySelector("#app-list");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const escapeHTML = value => String(value).replace(/[&<>'"]/g, character => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;"
}[character]));

const renderApps = apps => {
  appList.innerHTML = apps.map((app, index) => `
    <article class="app-feature reveal" style="--app-index:${index}">
      <div class="app-copy">
        <div class="app-identity">
          <img src="${escapeHTML(app.icon)}" alt="" width="76" height="76">
          <div>
            <p class="kicker">${escapeHTML(app.eyebrow)}</p>
            <h3>${escapeHTML(app.name)}</h3>
          </div>
        </div>
        <p class="status"><span aria-hidden="true"></span>${escapeHTML(app.status)}</p>
        <p class="app-tagline">${escapeHTML(app.tagline)}</p>
        <p class="app-description">${escapeHTML(app.description)}</p>
        <div class="app-actions">
          <a class="round-link" href="${escapeHTML(app.url)}">Explore ${escapeHTML(app.name)} <span aria-hidden="true">→</span></a>
          <a class="plain-link" href="${escapeHTML(app.caseStudy)}">Engineering case study <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <a class="app-image" href="${escapeHTML(app.url)}" aria-label="Explore ${escapeHTML(app.name)}">
        <img src="${escapeHTML(app.image)}" alt="${escapeHTML(app.name)} interface">
        <span aria-hidden="true">View app →</span>
      </a>
    </article>
  `).join("");

  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
};

fetch("data/apps.json")
  .then(response => {
    if (!response.ok) throw new Error("Unable to load app catalog");
    return response.json();
  })
  .then(renderApps)
  .catch(() => {
    appList.innerHTML = '<p class="catalog-error">The app catalog is temporarily unavailable. <a href="apps/ostinova/">Explore Ostinova directly.</a></p>';
  });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 22);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (!reduceMotion.matches) {
  const depth = document.querySelector("[data-depth]");
  window.addEventListener("scroll", () => {
    const amount = Math.min(28, window.scrollY * .035);
    depth?.style.setProperty("--depth", `${amount}px`);
  }, { passive: true });
}

document.querySelectorAll("[data-year]").forEach(element => {
  element.textContent = new Date().getFullYear();
});
