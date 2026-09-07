const header = document.querySelector("[data-header]");
const appList = document.querySelector("#app-list");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileNavigation = window.matchMedia("(max-width: 680px)");

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

if (header) {
  const menuButton = document.createElement("button");
  menuButton.className = "mobile-menu-button";
  menuButton.type = "button";
  menuButton.setAttribute("aria-label", "Open navigation");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-controls", "mobile-navigation-drawer");
  menuButton.innerHTML = '<span>Menu</span><span class="mobile-menu-lines" aria-hidden="true"><i></i><i></i></span>';

  const drawer = document.createElement("dialog");
  drawer.className = "mobile-drawer";
  drawer.id = "mobile-navigation-drawer";
  drawer.setAttribute("aria-labelledby", "mobile-drawer-title");

  const drawerHeader = document.createElement("div");
  drawerHeader.className = "mobile-drawer-header";
  const drawerWordmark = header.querySelector(".wordmark").cloneNode(true);
  drawerWordmark.removeAttribute("aria-label");

  const closeButton = document.createElement("button");
  closeButton.className = "mobile-drawer-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close navigation");
  closeButton.innerHTML = '<span>Close</span><i aria-hidden="true">×</i>';
  drawerHeader.append(drawerWordmark, closeButton);

  const drawerLabel = document.createElement("p");
  drawerLabel.className = "mobile-drawer-label";
  drawerLabel.id = "mobile-drawer-title";
  drawerLabel.textContent = "Navigate";

  const drawerNavigation = document.createElement("nav");
  drawerNavigation.className = "mobile-drawer-navigation";
  drawerNavigation.setAttribute("aria-label", "Mobile navigation");
  const sourceLinks = [...header.querySelectorAll("nav a"), header.querySelector(".nav-cta")].filter(Boolean);
  sourceLinks.forEach((sourceLink, index) => {
    const drawerLink = document.createElement("a");
    drawerLink.href = sourceLink.getAttribute("href");
    if (sourceLink.target) drawerLink.target = sourceLink.target;
    if (sourceLink.rel) drawerLink.rel = sourceLink.rel;
    if (sourceLink.getAttribute("aria-current")) drawerLink.setAttribute("aria-current", sourceLink.getAttribute("aria-current"));

    const number = document.createElement("span");
    number.className = "mobile-drawer-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("span");
    label.textContent = sourceLink.textContent.replace("↗", "").trim();
    const arrow = document.createElement("span");
    arrow.className = "mobile-drawer-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = sourceLink.getAttribute("href").startsWith("http") ? "↗" : "→";
    drawerLink.append(number, label, arrow);
    drawerNavigation.append(drawerLink);
  });

  const drawerFooter = document.createElement("div");
  drawerFooter.className = "mobile-drawer-footer";
  drawerFooter.innerHTML = "<span>Independent software</span><span>California</span>";
  drawer.append(drawerHeader, drawerLabel, drawerNavigation, drawerFooter);
  header.append(menuButton);
  document.body.append(drawer);

  let closeTimer;
  const finishClosingDrawer = () => {
    if (drawer.open) drawer.close();
    document.body.classList.remove("mobile-drawer-open");
  };
  const closeDrawer = () => {
    if (!drawer.open) return;
    window.clearTimeout(closeTimer);
    drawer.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    if (reduceMotion.matches) finishClosingDrawer();
    else closeTimer = window.setTimeout(finishClosingDrawer, 320);
  };
  const openDrawer = () => {
    window.clearTimeout(closeTimer);
    drawer.showModal();
    document.body.classList.add("mobile-drawer-open");
    menuButton.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      closeButton.focus({ preventScroll: true });
    });
  };

  menuButton.addEventListener("click", openDrawer);
  closeButton.addEventListener("click", closeDrawer);
  drawerNavigation.addEventListener("click", event => {
    if (event.target.closest("a")) closeDrawer();
  });
  drawer.addEventListener("click", event => {
    if (event.target === drawer) closeDrawer();
  });
  drawer.addEventListener("cancel", event => {
    event.preventDefault();
    closeDrawer();
  });
  mobileNavigation.addEventListener("change", event => {
    if (!event.matches && drawer.open) {
      window.clearTimeout(closeTimer);
      drawer.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      finishClosingDrawer();
    }
  });
}

let pointerPosition = { x: -1, y: -1 };
const pointerIsInHeaderZone = () => {
  const sideInset = window.innerWidth <= 680 ? 10 : 20;
  const zoneWidth = Math.min(window.innerWidth - (sideInset * 2), 1120);
  const zoneLeft = (window.innerWidth - zoneWidth) / 2;
  return pointerPosition.y >= 0 && pointerPosition.y <= 96 && pointerPosition.x >= zoneLeft && pointerPosition.x <= zoneLeft + zoneWidth;
};
const updateHeader = () => {
  if (!header) return;
  const isMinimized = !mobileNavigation.matches && window.scrollY > 96;
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
