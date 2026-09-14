// Deterministic variation generator + randomizer.

import { ICONS, PALETTES, FONTS, LAYOUTS } from '../data/brand';

function at(arr, value, offset) {
  const i = arr.indexOf(value);
  return arr[(i + offset + arr.length * 4) % arr.length];
}

export function makeVariants(cfg) {
  const layouts = LAYOUTS.map((l) => l.id);
  const fonts = FONTS.map((f) => f.id);
  const icons = ICONS.map((i) => i.id);
  const pals = PALETTES.map((p) => p.id);
  const out = [];
  for (let i = 1; i <= 8; i++) {
    out.push({
      ...cfg,
      layout: at(layouts, cfg.layout, i),
      font: at(fonts, cfg.font, i * 2),
      icon: at(icons, cfg.icon, i * 3),
      palette: at(pals, cfg.palette, i),
    });
  }
  return out;
}

export function randomCfg(cfg) {
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  return {
    ...cfg,
    layout: pick(LAYOUTS).id,
    font: pick(FONTS).id,
    icon: pick(ICONS).id,
    palette: pick(PALETTES).id,
    uppercase: Math.random() < 0.7,
  };
}
