# Martinez Studio

Static product website for [martinezstudio.dev](https://martinezstudio.dev), hosted with GitHub Pages.

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

The site publishes from the `main` branch root. `CNAME` declares `martinezstudio.dev` as the custom domain. The domain registrar must point the apex domain to GitHub Pages before HTTPS can be enforced.
