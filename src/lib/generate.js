// Intelligent concept generation: pairs niches with personality traits to
// produce six mathematically varied but on-brief logo concepts.

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
    const off = w.paletteId === 'custom' || i < 2 ? (w.paletteId === 'custom' ? i : 0) : i;
    const p = PALETTES[(palIdx + off) % PALETTES.length];
    return { icon: p.icon, title: p.title, tag: p.tag, bg: p.bg };
  };

  return Array.from({ length: 6 }, (_, i) => {
    const layout = i === 0 ? layoutIds[startIdx] : layoutIds[(startIdx + i) % layoutIds.length];
    const icon = niche.icons[(seed + i * 2) % niche.icons.length];
    const titleFontId = i % 2 === 1 ? pers.fonts[(seed + i) % pers.fonts.length] : niche.fonts.title;
    const tagFontId = pers.id === 'bold' && i % 2 === 0 ? 'jetbrainsMono' : niche.fonts.tag;
    const tf = FONTS.find((f) => f.id === titleFontId) || FONTS[0];
    const titleWeight = Math.min(pers.weight, tf.weights[tf.weights.length - 1]);
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
      trackEm: i % 2 === 0 ? pers.track : Math.round((pers.track + 0.02) * 100) / 100,
      iconScale: 1,
      gap: 1,
      uppercase: true,
      align: layout === 'horizontal' ? 'left' : 'center',
      colors: colorsFor(i),
    };
  });
}
