# LogoForge — Logo Generator

Browser-only logo generator: React 19 + Vite 6. No backend, no database, no secrets.

## Run here

```bash
docker compose -f docker-compose.base44.yml up -d
# app on http://localhost:3000 (vite dev server, live reload)
```

- `node_modules` lives in a named volume; `npm install` runs on container start (fast when cached).
- Vite config sets `server.allowedHosts: true` and `host: true` so the sandbox proxy host works.

## Structure

- `src/data/brand.js` — icons (SVG path data in a 24×24 box), palettes, typefaces, style presets, layouts.
- `src/lib/layout.js` — single source of geometry: turns a config into primitives (path/rect/text) in a content box. The SVG preview and both exporters consume it, so preview always matches export. Text is measured with a canvas 2D context (respects letter-spacing).
- `src/lib/export.js` — SVG export (embeds subsetted Google Fonts as base64 `@font-face`, best-effort) and PNG export (canvas 2x, transparent background).
- `src/lib/variants.js` — deterministic variation generator + shuffle.
- `src/components/Controls.jsx`, `src/components/LogoMark.jsx`, `src/App.jsx`.

## Quirks

- Webfonts come from Google Fonts CDN (`index.html` link). Text measurement happens before fonts load on first paint; `LogoMark` re-renders once via `document.fonts.ready`.
- User config persists in `localStorage` (`logoforge:cfg`).
- Font data uses single quotes inside family stacks (`'Space Grotesk', sans-serif`) so the same string works for SVG attributes, canvas `ctx.font`, and measure calls.

## Verify

```bash
curl -s http://localhost:3000 | head    # vite index.html
```

Then in the preview: type a brand name, click style chips / icons / palettes, click a variation, download SVG + PNG.
