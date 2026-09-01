# Martinez Studio

Static product website for [martinezstudio.dev](https://martinezstudio.dev), hosted with GitHub Pages.

## Purpose

Martinez Studio is the public home for current and future apps. The site separates the studio identity from Omar Martinez's engineering portfolio: visitors get a product-led catalog, while each app receives space for its value proposition, screenshots, status, and support information.

## Design and architecture

- **Product-led identity:** the warmer orange visual system connects to Ostinova while leaving room for future products.
- **Data-driven catalog:** `data/apps.json` is the source of truth for homepage app cards, reducing duplicated markup as the catalog grows.
- **Independent product routes:** every app lives under `apps/<slug>/`, giving it a stable URL for marketing, support, and App Store metadata.
- **Static delivery:** HTML, CSS, and small progressive JavaScript keep hosting reliable, fast, and inexpensive.
- **Responsive and accessible:** fluid layouts, semantic landmarks, keyboard focus states, descriptive imagery, and reduced-motion handling cover small phones through desktop screens.
- **Privacy-conscious website:** the site has no analytics, ads, forms, or cookies; the website privacy page documents this separately from each app's privacy behavior.

## Structure

```text
.
├── apps/                 # One stable product page per app
├── assets/               # Shared icons and optimized screenshots
├── data/apps.json        # Homepage catalog source of truth
├── index.html            # Studio homepage
├── privacy.html          # Website privacy disclosure
├── CNAME                 # GitHub Pages custom-domain declaration
└── .nojekyll             # Serve static files directly
```

## Adding a future app

1. Add the app icon and product imagery under `assets/`.
2. Add a product page under `apps/<slug>/`.
3. Add one entry to `data/apps.json`.
4. Add the product URL to `sitemap.xml`.

The homepage renders the current catalog from `data/apps.json`, keeping the app list maintainable without duplicating markup.

## Local preview

```sh
python3 -m http.server 4174
```

Open `http://localhost:4174`.

## GitHub Pages and DNS

The site publishes from the `main` branch root. `CNAME` declares `martinezstudio.dev` as the custom domain.

Configure the following records at the domain's DNS provider:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `omar-martinez-dev.github.io` |

After DNS resolves and GitHub's domain check succeeds, enable **Enforce HTTPS** in the repository's Pages settings. DNS changes may take time to propagate.
