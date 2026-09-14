// Shared logo geometry: turns a concept into primitives (paths, rounded
// rects, text) inside a content box. The SVG preview and the SVG/PNG
// exporters all consume this, so preview always matches export exactly.

import { ICONS, FONTS } from '../data/brand';
import { contrastText } from './color';

const TITLE = 40; // brand-name base size (viewBox units)
const TAG = 13;   // tagline base size
const TAG_TRACK = 0.22; // tagline letter-spacing (em)

let _mctx = null;
function measureCtx() {
  if (!_mctx) _mctx = document.createElement('canvas').getContext('2d');
  return _mctx;
}

export function measureText(text, font, ls = 0) {
  const ctx = measureCtx();
  ctx.font = font;
  ctx.letterSpacing = `${ls}px`;
  return ctx.measureText(text).width;
}

// Filled annulus (ring) as an evenodd path — no strokes anywhere, so
// exported SVGs are pure fills and scale-invariant.
function annulus(cx, cy, r, w) {
  const ri = r - w;
  return (
    `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z ` +
    `M ${cx - ri} ${cy} a ${ri} ${ri} 0 1 0 ${2 * ri} 0 a ${ri} ${ri} 0 1 0 ${-2 * ri} 0 Z`
  );
}

export function layoutLogo(c) {
  const icon = ICONS.find((i) => i.id === c.icon) || ICONS[0];
  const titleFont = FONTS.find((f) => f.id === c.titleFont) || FONTS[0];
  const tagFont = FONTS.find((f) => f.id === c.tagFont) || FONTS[0];
  const upper = c.uppercase !== false;
  const nameRaw = (c.name || '').trim() || 'Brand';
  const name = upper ? nameRaw.toUpperCase() : nameRaw;
  const tag = ((c.tagline || '').trim()).toUpperCase();
  const hasTag = !!tag;

  const col = c.colors || {};
  const iconColor = col.icon || '#4F46E5';
  const titleColor = col.title || '#0F172A';
  const tagColor = col.tag || '#64748B';

  const titleWeight = c.titleWeight || 700;
  const tagWeight = c.tagWeight || 600;
  const titleLs = (c.trackEm ?? 0.02) * TITLE;
  const tagLs = TAG_TRACK * TAG;

  const nameFontStr = `${titleWeight} ${TITLE}px ${titleFont.family}`;
  const nameW = measureText(name, nameFontStr, titleLs);
  const tagFontStr = `${tagWeight} ${TAG}px ${tagFont.family}`;
  const tagW = hasTag ? measureText(tag, tagFontStr, tagLs) : 0;

  const nameH = TITLE * 0.74; // approx cap-height block
  const tagBlock = hasTag ? 8 + TAG + 2 : 0;
  const th = nameH + tagBlock;
  const align = c.align || 'center';
  const scale = c.iconScale ?? 1;
  const gapMul = c.gap ?? 1;

  const prims = [];
  const addIcon = (x, y, s) =>
    prims.push({ t: 'path', d: icon.d, fr: icon.fr, x, y, s: s / 24, fill: iconColor });
  const addName = (x, anchor, y) =>
    prims.push({ t: 'text', text: name, x, y, anchor, size: TITLE, weight: titleWeight, family: titleFont.family, ls: titleLs, fill: titleColor });
  const addTag = (x, anchor, y) =>
    prims.push({ t: 'text', text: tag, x, y, anchor, size: TAG, weight: tagWeight, family: tagFont.family, ls: tagLs, fill: tagColor });

  // Anchor points for a text block of width tw starting at bx.
  const textAnchor = (bx, tw) =>
    align === 'left' ? { x: bx, anchor: 'start' }
    : align === 'right' ? { x: bx + tw, anchor: 'end' }
    : { x: bx + tw / 2, anchor: 'middle' };

  let W = 0;
  let H = 0;

  switch (c.layout) {
    case 'horizontal': {
      const is = 50 * scale;
      const gap = 20 * gapMul;
      const tw = Math.max(nameW, tagW);
      W = is + gap + tw;
      H = Math.max(is, th);
      const top = (H - th) / 2;
      addIcon(0, (H - is) / 2, is);
      const a = textAnchor(is + gap, tw);
      addName(a.x, a.anchor, top + nameH);
      if (hasTag) addTag(a.x, a.anchor, top + nameH + 8 + TAG);
      break;
    }
    case 'stacked': {
      const is = 64 * scale;
      const gap = 16 * gapMul;
      W = Math.max(is, nameW, tagW);
      H = is + gap + nameH + tagBlock;
      addIcon(align === 'left' ? 0 : align === 'right' ? W - is : (W - is) / 2, 0, is);
      const a = align === 'left' ? { x: 0, anchor: 'start' } : align === 'right' ? { x: W, anchor: 'end' } : { x: W / 2, anchor: 'middle' };
      addName(a.x, a.anchor, is + gap + nameH);
      if (hasTag) addTag(a.x, a.anchor, is + gap + nameH + 8 + TAG);
      break;
    }
    case 'monogram': {
      const badge = 54 * scale;
      const gap = 18 * gapMul;
      const tw = Math.max(nameW, tagW);
      W = badge + gap + tw;
      H = Math.max(badge, th);
      const top = (H - th) / 2;
      const by = (H - badge) / 2;
      prims.push({ t: 'rect', x: 0, y: by, w: badge, h: badge, rx: badge * 0.26, fill: iconColor });
      const initials = nameRaw.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
      const initSize = badge * 0.44;
      prims.push({
        t: 'text', text: initials, x: badge / 2, y: by + badge / 2 + initSize * 0.36,
        anchor: 'middle', size: initSize, weight: 700,
        family: "'Inter', system-ui, sans-serif", ls: 0, fill: contrastText(iconColor),
      });
      const a = textAnchor(badge + gap, tw);
      addName(a.x, a.anchor, top + nameH);
      if (hasTag) addTag(a.x, a.anchor, top + nameH + 8 + TAG);
      break;
    }
    case 'emblem': {
      const r = 42 * scale;
      const is = 34 * scale;
      const gap = 14 * gapMul;
      W = Math.max(r * 2, nameW, tagW);
      const cx = W / 2;
      H = r * 2 + gap + nameH + tagBlock;
      prims.push({ t: 'path', d: annulus(cx, r, r, 3), fr: 'evenodd', x: 0, y: 0, s: 1, fill: iconColor });
      addIcon(cx - is / 2, r - is / 2, is);
      addName(cx, 'middle', r * 2 + gap + nameH);
      if (hasTag) addTag(cx, 'middle', r * 2 + gap + nameH + 8 + TAG);
      break;
    }
    default: {
      // wordmark: typography-only with accent bar
      W = Math.max(nameW, tagW);
      const barY = nameH + 12;
      H = barY + 4 + (hasTag ? 10 + TAG + 2 : 4);
      const a = align === 'left' ? { x: 0, anchor: 'start' } : align === 'right' ? { x: W, anchor: 'end' } : { x: W / 2, anchor: 'middle' };
      addName(a.x, a.anchor, nameH);
      const barX = align === 'left' ? 0 : align === 'right' ? W - nameW : (W - nameW) / 2;
      prims.push({ t: 'rect', x: barX, y: barY, w: nameW, h: 4, rx: 2, fill: iconColor });
      if (hasTag) addTag(a.x, a.anchor, barY + 4 + 10 + TAG);
      break;
    }
  }

  return { w: Math.ceil(W), h: Math.ceil(H), prims };
}
