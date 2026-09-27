# Risen eSports website

Static three-page site (Home, Leagues, Contact) built with [Vite](https://vitejs.dev), React and TypeScript. The 3D hero logo uses [three.js](https://threejs.org).

## Run locally

Requires Node 20.19+ (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc, no output
npm run build      # typecheck, then output to dist/
npm run preview    # serve the built site
```

## Deploy to GitHub Pages

1. Create a GitHub repo and push this folder to the `main` branch.
2. In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds and publishes the site.
   It will be live at `https://<username>.github.io/<repo-name>/`.

`vite.config.ts` uses `base: './'`, so the same build works at a repo sub-path or on a custom domain.

### Custom domain (optional)
Add a file `public/CNAME` containing your domain (e.g. `www.risenesports.com`), then point the domain's DNS at GitHub Pages and set the domain under **Settings → Pages**.

## Editing content

| What | Where |
|---|---|
| League formats, divisions, ranks, fees, prizes, schedules | `src/data.ts` |
| Discord invite / Stats links | `DISCORD_URL` / `STATS_URL` in `src/data.ts` |
| Home copy | `src/pages/HomePage.tsx` |
| Contact topics, staff list | `TOPICS` / `STAFF` in `src/pages/ContactPage.tsx` |
| Page titles and meta descriptions | the `.html` files |
| Colors, fonts, spacing | CSS variables at the top of `src/styles.css` |
| 3D logo rotation limits | `MAX_YAW` / `MAX_PITCH` in `src/lib/logo3d.ts` |

Fees, prize pools, season dates and the Discord link are **placeholders** — update them before launch.

## Structure

Each page is its own HTML entry (a `<head>` plus `<div id="root">`) that mounts a React page component.

```
index.html / leagues.html / contact.html   Page shells: title, meta, fonts
src/
  entries/        One per page: mounts the page component
  pages/          HomePage, LeaguesPage (tabs, detail, compare table), ContactPage
  components/     Layout, Nav, Footer, PageHero, Reveal (scroll-in), Logo3D
  hooks/          Cursor parallax (--mx/--my), scroll vars (--p/--c), in-view
  lib/            three.js logo, mount helper, small utils
  data.ts         League data and types
  styles.css      All styles
  assets/         Logo
.github/workflows/deploy.yml   GitHub Pages deploy
```
