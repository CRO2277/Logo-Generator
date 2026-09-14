// Export pipeline: builds SVG documents and PNG canvases from the same
// geometry the preview uses. SVG embeds subsetted Google Fonts as base64
// (best effort) so the file renders identically offline.

import { layoutLogo, resolveCfg } from './layout';
import { FONTS } from '../data/brand';

const PAD = 56;

function slug(s) {
  return ((s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')) || 'logo';
}

function saveBlob(blob, filename) {
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

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

function drawPrim(ctx, p) {
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
    roundRectPath(ctx, p.x, p.y, p.w, p.h, p.rx);
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

async function embedFonts(cfg) {
  const { font, name, nameRaw, tag } = resolveCfg(cfg);
  const initials = nameRaw
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const jobs = [
    fetchFontFace(font.cssName, font.weight, name),
    tag ? fetchFontFace('Inter', 600, tag) : Promise.resolve(''),
    cfg.layout === 'monogram' ? fetchFontFace('Inter', 700, initials) : Promise.resolve(''),
  ];
  const css = await Promise.all(jobs);
  return css.filter(Boolean).join('');
}

// --- Public API ---

export async function downloadSvg(cfg, theme = 'light') {
  let fontCss = '';
  try {
    fontCss = await embedFonts(cfg);
  } catch {
    // Fonts won't embed (offline?) — export anyway, system fallbacks apply.
  }
  const { w, h, prims } = layoutLogo(cfg, theme);
  const W = w + PAD * 2;
  const H = h + PAD * 2;
  const style = fontCss ? `<style>${fontCss}</style>` : '';
  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    style +
    `<g transform="translate(${PAD} ${PAD})">${prims.map(primToSvg).join('')}</g>` +
    `</svg>`;
  saveBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${slug(cfg.name)}-logo.svg`);
}

export async function downloadPng(cfg, theme = 'light', scale = 2) {
  const { w, h, prims } = layoutLogo(cfg, theme);
  const cv = document.createElement('canvas');
  cv.width = Math.round((w + PAD * 2) * scale);
  cv.height = Math.round((h + PAD * 2) * scale);
  const ctx = cv.getContext('2d');
  ctx.scale(scale, scale);
  ctx.translate(PAD, PAD);
  for (const p of prims) drawPrim(ctx, p);
  const blob = await new Promise((r) => cv.toBlob(r, 'image/png'));
  saveBlob(blob, `${slug(cfg.name)}-logo.png`);
}
