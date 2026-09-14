// Intelligent concept generation: pairs niches with personality traits to
// produce twelve mathematically varied but on-brief logo concepts —
// more first-pass variety than any competitor.

import { PALETTES, NICHES, PERSONALITIES, LAYOUTS, FONTS } from '../data/brand';

export function generateConcepts(w) {
  const niche = NICHES.find((n) => n.id === w.niche) || NICHES[0];
  const pers = PERSONALITIES.find((p) => p.id === w.personality) || PERSONALITIES[0];
  const seed = [...(w.name || 'brand')].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const layoutIds = LAYOUTS.map((l) => l.id);
  const startIdx = Math.max(0, layoutIds.indexOf(w.layout));
  const palIdx = Math.max(0, PALETTES.findIndex((p) => p.id === w.paletteId));
  const ts = Date.now();

  const colorsFor = (i) => {
    if (w.paletteId === 'custom' && i < 2) return { ...w.custom };
    const off = i < 2 ? 0 : i;
    const p = PALETTES[(palIdx + off) % PALETTES.length];
    return { icon: p.icon, title: p.title, tag: p.tag, bg: p.bg };
  };

  return Array.from({ length: 12 }, (_, i) => {
    const layout = i === 0 ? layoutIds[startIdx] : layoutIds[(startIdx + i) % layoutIds.length];
    const icon = niche.icons[(seed + i * 3) % niche.icons.length];
    const fontPool = i % 3 === 2 ? pers.fonts : [niche.fonts.title, ...pers.fonts];
    const titleFontId = fontPool[(seed + i) % fontPool.length];
    const tagFontId = pers.id === 'bold' && i % 2 === 0 ? 'jetbrainsMono' : niche.fonts.tag;
    const tf = FONTS.find((f) => f.id === titleFontId) || FONTS[0];
    const baseWeight = i % 2 === 0 ? pers.weight : Math.max(tf.weights[0], pers.weight - 100);
    const titleWeight = Math.min(baseWeight, tf.weights[tf.weights.length - 1]);
    const trackBase = i % 3 === 2 ? Math.max(-0.02, pers.track - 0.02) : pers.track;
    return {
      id: `c${i}-${ts}`,
      name: w.name,
      tagline: w.tagline,
      layout,
      icon,
      titleFont: titleFontId,
      tagFont: tagFontId,
      titleWeight,
      tagWeight: 600,
      trackEm: Math.round((trackBase + (i % 2 === 1 ? 0.02 : 0)) * 100) / 100,
      iconScale: 1,
      gap: 1,
      uppercase: true,
      align: layout === 'horizontal' ? 'left' : 'center',
      colors: colorsFor(i),
    };
  });
}
