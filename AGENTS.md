# LogoLegacy (logolegacy.pro) — Logo & Brand Identity Studio

Browser-only logo maker: React 19 + Vite 6 + Tailwind CSS v4 + lucide-react. No backend, no database, no secrets.

## Run here

```bash
docker compose -f docker-compose.base44.yml up -d
# app on http://localhost:3000 (vite dev server, live reload)
```

- `node_modules` lives in a named volume; `npm install` runs on container start (fast when cached). After changing `package.json`, `docker compose -f docker-compose.base44.yml restart web` re-installs and restarts.
- Vite config sets `server.allowedHosts: true` and `host: true` so the sandbox proxy host works.
- Tailwind v4 via `@tailwindcss/vite` (no config file); `src/index.css` starts with `@import "tailwindcss";`.

## Structure

- `src/data/brand.js` — icon glyphs (filled 24×24 paths), 8 Google typefaces, 6 curated palettes, 7 niches (icon pools + font pairings), 5 personalities (fonts/weight/tracking), 5 layout archetypes.
- `src/lib/layout.js` — single source of geometry: concept → primitives (path/rect/text) in a content box. Preview SVG, SVG export and PNG export all consume it, so preview always matches export. Text measured with canvas 2D (letter-spacing aware). Ring shapes are filled evenodd annuli — no strokes anywhere, exports are pure fills.
- `src/lib/generate.js` — concept generator: 6 concepts seeded by brand name, crossing niche icon pools + font pairings with personality fonts/weights/tracking and rotated palettes.
- `src/lib/export.js` — SVG export (subsetted Google Fonts embedded as base64 `@font-face`, best-effort) and square PNG at 1024/2048/4096 with transparency toggle; brand-kit markdown summary.
- `src/lib/color.js` — hex/rgb/hsl conversion, luminance, contrast text.
- Components: `Wizard` (6-step sidebar), `CanvasStage` (bg modes + checkerboard + export toolbar), `ConceptGrid`, `CustomizePanel` (fonts/weights/tracking/scale/gap/alignment/colors), `Mockups` (app icon, business card, nav header, tee, tote), `BrandKitModal`, `LogoMark` (the SVG renderer).
- State: one `useReducer` in `App.jsx` (WIZARD / GENERATE / UPDATE_CONCEPT / SET_ACTIVE / UI).

## Quirks

- Webfonts come from Google Fonts CDN (`index.html` link, all 8 families). Font data uses single quotes inside family stacks so the same string works for SVG attrs, canvas `ctx.font` and measurement. Fallbacks (serif/sans/monospace) are in every stack.
- Text measures before webfonts land; `LogoMark` re-renders once via `document.fonts.ready`.
- Mobile (< lg): top-level tabs Design/Studio; wizard hidden while Studio visible. Desktop: 380px wizard + fluid studio column.
- Canvas preview modes: White / Charcoal / Brand (`concept.colors.bg`); transparency checkerboard toggle. Logo auto-fits via `max-width: 100%`.

## Verify

```bash
curl -s http://localhost:3000 | head    # vite index.html
```

Then in the preview: type a brand name → Generate Concepts → 6 cards → click a card → Customize (fonts, tracking, sliders, colors) → Mockups tab → Brand Kit → export SVG + PNG.
