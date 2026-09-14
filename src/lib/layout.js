// Shared logo geometry: turns a config into a list of primitives
// (paths, rounded rects, text) in a content box. The SVG preview and the
// PNG/SVG exporters both consume this, so preview always matches export.

import { ICONS, PALETTES, FONTS } from '../data/brand';

const TAG_FAMILY = "'Inter', system-ui, sans-serif";
const NAME_SIZE = 64; // base brand-name font size in px
const TAG_SIZE = 17;  // tagline font size
const TAG_LS = 3.2;   // tagline letter-spacing px
const TAG_GAP = 16;   // gap between name baseline area and tagline

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

export function resolveCfg(cfg) {
  const icon = ICONS.find((i) => i.id === cfg.icon) || ICONS[0];
  const pal = PALETTES.find((p) => p.id === cfg.palette) || PALETTES[0];
  const font = FONTS.find((f) => f.id === cfg.font) || FONTS[0];
  const upper = cfg.uppercase !== false;
  const nameRaw = (cfg.name || '').trim() || 'Brand';
  return {
    icon,
    pal,
    font,
    upper,
    name: upper ? nameRaw.toUpperCase() : nameRaw,
    nameRaw,
    tag: (cfg.tagline || '').trim().toUpperCase(),
  };
}

export function layoutLogo(cfg, theme = 'light') {
  const { icon, pal, font, name, tag } = resolveCfg(cfg);
  const hasTag = tag.length > 0;

  const nameLs = font.lsEm * NAME_SIZE;
  const nameFontStr = `${font.weight} ${NAME_SIZE}px ${font.family}`;
  const nameW = measureText(name, nameFontStr, nameLs);
  const tagFontStr = `600 ${TAG_SIZE}px ${TAG_FAMILY}`;
  const tagW = hasTag ? measureText(tag, tagFontStr, TAG_LS) : 0;

  const dark = theme === 'dark';
  const nameColor = dark ? '#F8FAFC' : pal.text;
  const tagColor = dark ? '#94A3B8' : pal.muted;
  const iconColor = dark ? (pal.darkAccent || pal.primary) : pal.primary;
  const accentColor = dark ? (pal.darkAccent || pal.primary) : pal.secondary;

  const prims = [];
  const addIcon = (x, y, s) =>
    prims.push({ t: 'path', d: icon.d, fr: icon.fr, x, y, s: s / 24, fill: iconColor });
  const addName = (x, anchor, baseline) =>
    prims.push({ t: 'text', text: name, x, y: baseline, anchor, size: NAME_SIZE, weight: font.weight, family: font.family, ls: nameLs, fill: nameColor });
  const addTag = (x, anchor, baseline) =>
    prims.push({ t: 'text', text: tag, x, y: baseline, anchor, size: TAG_SIZE, weight: 600, family: TAG_FAMILY, ls: TAG_LS, fill: tagColor });

  const nameH = NAME_SIZE * 0.74; // approx cap-height block
  const tagBlockH = hasTag ? TAG_GAP + TAG_SIZE + 4 : 0; // +4 slack under baseline
  let W = 0;
  let H = 0;

  switch (cfg.layout) {
    case 'icon-left': {
      const iconS = 58;
      const gap = 24;
      const textW = Math.max(nameW, tagW);
      W = iconS + gap + textW;
      const th = nameH + tagBlockH;
      H = Math.max(iconS, th);
      const top = (H - th) / 2;
      addIcon(0, (H - iconS) / 2, iconS);
      addName(iconS + gap, 'start', top + nameH);
      if (hasTag) addTag(iconS + gap, 'start', top + nameH + TAG_GAP + TAG_SIZE);
      break;
    }
    case 'icon-top': {
      const iconS = 76;
      const gap = 30;
      W = Math.max(iconS, nameW, tagW);
      H = iconS + gap + nameH + tagBlockH;
      addIcon((W - iconS) / 2, 0, iconS);
      addName(W / 2, 'middle', iconS + gap + nameH);
      if (hasTag) addTag(W / 2, 'middle', iconS + gap + nameH + TAG_GAP + TAG_SIZE);
      break;
    }
    case 'monogram': {
      const badge = 62;
      const rx = 16;
      const gap = 24;
      const initials = name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
      const textW = Math.max(nameW, tagW);
      W = badge + gap + textW;
      const th = nameH + tagBlockH;
      H = Math.max(badge, th);
      const top = (H - th) / 2;
      const by = (H - badge) / 2;
      prims.push({ t: 'rect', x: 0, y: by, w: badge, h: badge, rx, fill: iconColor });
      prims.push({
        t: 'text', text: initials, x: badge / 2, y: by + badge / 2 + 10.5, anchor: 'middle',
        size: 30, weight: 700, family: TAG_FAMILY, ls: 1, fill: dark ? '#0B1220' : '#FFFFFF',
      });
      addName(badge + gap, 'start', top + nameH);
      if (hasTag) addTag(badge + gap, 'start', top + nameH + TAG_GAP + TAG_SIZE);
      break;
    }
    default: {
      // wordmark: name + accent underline + optional tagline, all centered
      W = Math.max(nameW, tagW);
      H = nameH + 16 + 5 + (hasTag ? TAG_GAP + TAG_SIZE + 4 : 6);
      addName(W / 2, 'middle', nameH);
      prims.push({ t: 'rect', x: (W - nameW) / 2, y: nameH + 16, w: nameW, h: 5, rx: 2.5, fill: accentColor });
      if (hasTag) addTag(W / 2, 'middle', nameH + 16 + 5 + TAG_GAP + TAG_SIZE);
      break;
    }
  }

  return { w: Math.ceil(W), h: Math.ceil(H), prims };
}
