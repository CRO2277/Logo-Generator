// Export pipeline: production-ready SVG (subsetted Google Fonts embedded as
// base64 @font-face, clean grouped paths, no inline styles), high-res square
// PNGs (1024/2048/4096) with transparency, logo variants (primary / mono /
// reversed), and the brand-kit markdown summary. All primitives are shared
// with the asset suite in assets.js.

import { layoutLogo } from './layout';
import { FONTS, LAYOUTS } from '../data/brand';
import { fmtColor } from './color';

const PAD = 48;

export function slug(s) {
  return ((s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')) || 'brand';
}

export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function primToSvg(p) {
  if (p.t === 'path') {
    return `<g transform="translate(${p.x} ${p.y}) scale(${p.s})"><path d="${p.d}" fill="${p.fill}" fill-rule="${p.fr || 'nonzero'}"/></g>`;
  }
  if (p.t === 'rect') {
    return `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${p.rx}" fill="${p.fill}"/>`;
  }
  return `<text x="${p.x}" y="${p.y}" text-anchor="${p.anchor}" font-family="${p.family}" font-size="${p.size}" font-weight="${p.weight}" letter-spacing="${p.ls || 0}" fill="${p.fill}">${escapeXml(p.text)}</text>`;
}

// Logo color variants: 'color' (as designed), 'mono' (single ink for print),
// 'reversed' (white for dark backgrounds).
export function variantConcept(concept, variant = 'color') {
  if (variant === 'mono') {
    return { ...concept, colors: { icon: '#0F172A', title: '#0F172A', tag: '#0F172A', bg: '#FFFFFF' } };
  }
  if (variant === 'reversed') {
    return { ...concept, colors: { icon: '#FFFFFF', title: '#FFFFFF', tag: '#E2E8F0', bg: '#0F172A' } };
  }
  return concept;
}

// Draws one geometry primitive on a canvas (shared with asset suite).
export function drawPrim(ctx, p) {
  if (p.t === 'path') {
    const path = new Path2D(p.d);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.s, p.s);
    ctx.fillStyle = p.fill;
    ctx.fill(path, p.fr || 'nonzero');
    ctx.restore();
  } else if (p.t === 'rect') {
    ctx.fillStyle = p.fill;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(p.x, p.y, p.w, p.h, p.rx);
    } else {
      const r = p.rx;
      ctx.moveTo(p.x + r, p.y);
      ctx.arcTo(p.x + p.w, p.y, p.x + p.w, p.y + p.h, r);
      ctx.arcTo(p.x + p.w, p.y + p.h, p.x, p.y + p.h, r);
      ctx.arcTo(p.x, p.y + p.h, p.x, p.y, r);
      ctx.arcTo(p.x, p.y, p.x + p.w, p.y, r);
      ctx.closePath();
    }
    ctx.fill();
  } else {
    ctx.fillStyle = p.fill;
    ctx.font = `${p.weight} ${p.size}px ${p.family}`;
    ctx.letterSpacing = `${p.ls || 0}px`;
    ctx.textAlign = p.anchor === 'middle' ? 'center' : p.anchor === 'end' ? 'right' : 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(p.text, p.x, p.y);
  }
}

// --- Google Fonts embedding (subsetted via &text=) ---

async function fetchFontFace(cssName, weight, text) {
  if (!text) return '';
  const wq = weight !== 400 ? `:wght@${weight}` : '';
  const url = `https://fonts.googleapis.com/css2?family=${cssName.replace(/ /g, '+')}${wq}&text=${encodeURIComponent(text)}&display=swap`;
  const css = await (await fetch(url)).text();
  const m = css.match(/url\((https:[^)]+)\)/);
  if (!m) return '';
  const buf = new Uint8Array(await (await fetch(m[1])).arrayBuffer());
  let bin = '';
  for (let i = 0; i < buf.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  }
  return `@font-face{font-family:'${cssName}';font-weight:${weight};font-style:normal;src:url(data:font/woff2;base64,${btoa(bin)}) format('woff2');}`;
}

export async function embedFonts(concept) {
  const titleFont = FONTS.find((f) => f.id === concept.titleFont) || FONTS[0];
  const tagFont = FONTS.find((f) => f.id === concept.tagFont) || FONTS[0];
  const upper = concept.uppercase !== false;
  const nameRaw = (concept.name || '').trim() || 'Brand';
  const name = upper ? nameRaw.toUpperCase() : nameRaw;
  const tag = ((concept.tagline || '').trim()).toUpperCase();
  const initials = nameRaw.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const jobs = [
    fetchFontFace(titleFont.cssName, concept.titleWeight || 700, name),
    tag ? fetchFontFace(tagFont.cssName, concept.tagWeight || 600, tag) : Promise.resolve(''),
    concept.layout === 'monogram' ? fetchFontFace('Inter', 700, initials) : Promise.resolve(''),
  ];
  const css = await Promise.all(jobs);
  return css.filter(Boolean).join('');
}

export function buildSvgString(concept, fontCss = '') {
  const { w, h, prims } = layoutLogo(concept);
  const W = w + PAD * 2;
  const H = h + PAD * 2;
  const style = fontCss ? `<style>${fontCss}</style>` : '';
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    style +
    `<g transform="translate(${PAD} ${PAD})">${prims.map(primToSvg).join('')}</g>` +
    `</svg>`
  );
}

// Square canvas with the logo centered (used by PNG export and the ZIP kit).
export function renderLogoCanvas(concept, size = 1024, transparent = true) {
  const { w, h, prims } = layoutLogo(concept);
  const cv = document.createElement('canvas');
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext('2d');
  if (!transparent) {
    ctx.fillStyle = concept.colors?.bg || '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
  }
  const margin = size * 0.1;
  const s = Math.min((size - margin * 2) / w, (size - margin * 2) / h);
  ctx.translate((size - w * s) / 2, (size - h * s) / 2);
  ctx.scale(s, s);
  for (const p of prims) drawPrim(ctx, p);
  return cv;
}

async function canvasBlob(cv) {
  return new Promise((r) => cv.toBlob(r, 'image/png'));
}

// --- Public API ---

export async function downloadSvg(concept, variant = 'color') {
  const c = variantConcept(concept, variant);
  let fontCss = '';
  try {
    fontCss = await embedFonts(c);
  } catch {
    // Font embedding is best-effort; the file still exports with font-family refs.
  }
  saveBlob(new Blob([buildSvgString(c, fontCss)], { type: 'image/svg+xml;charset=utf-8' }), `${slug(c.name)}-logo${variant !== 'color' ? `-${variant}` : ''}.svg`);
}

export async function downloadPng(concept, size = 1024, transparent = true, variant = 'color') {
  const c = variantConcept(concept, variant);
  const blob = await canvasBlob(renderLogoCanvas(c, size, transparent));
  saveBlob(blob, `${slug(c.name)}-logo${variant !== 'color' ? `-${variant}` : ''}-${size}.png`);
}

export function brandKitMd(concept) {
  const titleFont = FONTS.find((f) => f.id === concept.titleFont) || FONTS[0];
  const tagFont = FONTS.find((f) => f.id === concept.tagFont) || FONTS[0];
  const layout = LAYOUTS.find((l) => l.id === concept.layout) || LAYOUTS[0];
  const colorLines = ['icon', 'title', 'tag', 'bg'].map((k) => {
    const f = fmtColor(concept.colors?.[k] || '#000000');
    return `- **${k}**: ${f.hex} · rgb(${f.rgb}) · hsl(${f.hsl})`;
  });
  return [
    `# ${concept.name || 'Brand'} — Brand Kit`,
    '',
    '## Colors (HEX · RGB · HSL)',
    ...colorLines,
    '',
    '## Typography',
    `- Title: ${titleFont.label} — weight ${concept.titleWeight} — tracking ${concept.trackEm ?? 0.02}em${concept.uppercase !== false ? ' — uppercase' : ''}`,
    `- Tagline: ${tagFont.label} — weight ${concept.tagWeight || 600} — uppercase — tracking 0.22em`,
    '',
    '## Layout lockup',
    `- Archetype: ${layout.label}`,
    `- Alignment: ${concept.align}`,
    `- Icon scale: ${Math.round((concept.iconScale ?? 1) * 100)}% · icon-to-text gap: ${Math.round((concept.gap ?? 1) * 100)}%`,
    '',
    '## Variants',
    '- Primary (color), Monochrome (print, single ink), Reversed (white, for dark backgrounds)',
    '',
    '---',
    'Generated with LogoLegacy (logolegacy.pro) — free, instant, full-resolution brand files.',
  ].join('\n');
}

export function downloadBrandKit(concept) {
  saveBlob(new Blob([brandKitMd(concept)], { type: 'text/markdown;charset=utf-8' }), `${slug(concept.name)}-brand-kit.md`);
}
