// Brand knowledge base: icon glyphs, typefaces, palettes, niches,
// personalities and layout archetypes.

export const ICONS = [
  { id: 'bolt', label: 'Bolt', d: 'M13 2 L4.5 13.5 L10.6 13.5 L10 22 L19.5 10.5 L13.4 10.5 Z' },
  { id: 'crown', label: 'Crown', d: 'M3 8 L7.5 12 L12 5 L16.5 12 L21 8 L19.4 19 L4.6 19 Z' },
  { id: 'diamond', label: 'Diamond', d: 'M12 2 L20 10 L12 22 L4 10 Z' },
  { id: 'hexagon', label: 'Hexagon', d: 'M12 2 L20.66 7 V17 L12 22 L3.34 17 V7 Z' },
  { id: 'sparkle', label: 'Spark', d: 'M12 2 L14.4 9.6 L22 12 L14.4 14.4 L12 22 L9.6 14.4 L2 12 L9.6 9.6 Z' },
  { id: 'heart', label: 'Heart', d: 'M12 21.2 C5.4 15.8 2 12.2 2 8.6 C2 5.5 4.5 3 7.6 3 C9.4 3 11 3.9 12 5.3 C13 3.9 14.6 3 16.4 3 C19.5 3 22 5.5 22 8.6 C22 12.2 18.6 15.8 12 21.2 Z' },
  { id: 'drop', label: 'Drop', d: 'M12 2.2 C12 2.2 19 9.8 19 14.6 A7 7 0 1 1 5 14.6 C5 9.8 12 2.2 12 2.2 Z' },
  { id: 'leaf', label: 'Leaf', d: 'M20.5 3.5 C20.5 12.9 12.9 20.5 3.5 20.5 C3.5 11.1 11.1 3.5 20.5 3.5 Z' },
  { id: 'mountain', label: 'Mountain', d: 'M2.5 19 L9 7.5 L12.8 14.2 L15.2 10.4 L21.5 19 Z' },
  { id: 'wave', label: 'Wave', d: 'M2 12 C4.7 8.5 7.3 8.5 10 12 C12.7 15.5 15.3 15.5 18 12 C19.3 10.3 20.7 9.4 22 9.1 L22 13.5 C20.7 13.8 19.3 14.7 18 16.4 C15.3 19.9 12.7 19.9 10 16.4 C7.3 12.9 4.7 12.9 2 16.4 Z' },
  { id: 'chat', label: 'Chat', d: 'M20 3 H4 A2 2 0 0 0 2 5 V15 A2 2 0 0 0 4 17 H8 V22 L13 17 H20 A2 2 0 0 0 22 15 V5 A2 2 0 0 0 20 3 Z' },
  { id: 'eye', label: 'Eye', fr: 'evenodd', d: 'M12 5 C6.5 5 2 12 2 12 C2 12 6.5 19 12 19 C17.5 19 22 12 22 12 C22 12 17.5 5 12 5 Z M12 8.5 a3.5 3.5 0 1 0 0 7 a3.5 3.5 0 1 0 0 -7 Z' },
  { id: 'shield', label: 'Shield', d: 'M12 2 L20 5 V11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 V5 Z' },
  { id: 'briefcase', label: 'Briefcase', d: 'M3 8h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8zM9 3h6v5H9z' },
  { id: 'pulse', label: 'Pulse', d: 'M2 10.5h5l2-5.5 4 13 2-7.5h7v3h-7l-2 5.5-4-13-2 7.5H2z' },
  { id: 'cup', label: 'Cup', d: 'M5 4h14v7a7 7 0 0 1-14 0V4zM19 6.5h1a3.2 3.2 0 0 1 0 6.4h-1zM3 19h18v2.2H3z' },
  { id: 'house', label: 'House', d: 'M12 3l9 8h-3v9H6v-9H3l9-8z' },
  { id: 'tag', label: 'Tag', fr: 'evenodd', d: 'M3 3h8l10 10-8 8L3 11V3zM7.5 7.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z' },
  { id: 'grid', label: 'App Grid', d: 'M3 3h7.5v7.5H3zM13.5 3H21v7.5h-7.5zM3 13.5h7.5V21H3zM13.5 13.5H21V21h-7.5z' },
  { id: 'pen', label: 'Pen', d: 'M20.7 3.3a2.4 2.4 0 0 0-3.4 0L6 14.6 4 20l5.4-2L20.7 6.7a2.4 2.4 0 0 0 0-3.4z' },
];

export const FONTS = [
  { id: 'inter', label: 'Inter', cssName: 'Inter', family: "'Inter', system-ui, sans-serif", weights: [400, 500, 600, 700, 800, 900] },
  { id: 'playfair', label: 'Playfair Display', cssName: 'Playfair Display', family: "'Playfair Display', Georgia, serif", weights: [400, 500, 600, 700, 800, 900] },
  { id: 'outfit', label: 'Outfit', cssName: 'Outfit', family: "'Outfit', system-ui, sans-serif", weights: [400, 500, 600, 700, 800] },
  { id: 'spaceGrotesk', label: 'Space Grotesk', cssName: 'Space Grotesk', family: "'Space Grotesk', system-ui, sans-serif", weights: [400, 500, 600, 700] },
  { id: 'plusJakarta', label: 'Plus Jakarta Sans', cssName: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', system-ui, sans-serif", weights: [400, 500, 600, 700, 800] },
  { id: 'syne', label: 'Syne', cssName: 'Syne', family: "'Syne', system-ui, sans-serif", weights: [400, 500, 600, 700, 800] },
  { id: 'cormorant', label: 'Cormorant Garamond', cssName: 'Cormorant Garamond', family: "'Cormorant Garamond', Georgia, serif", weights: [400, 500, 600, 700] },
  { id: 'jetbrainsMono', label: 'JetBrains Mono', cssName: 'JetBrains Mono', family: "'JetBrains Mono', ui-monospace, monospace", weights: [400, 500, 600, 700, 800] },
];

export const PALETTES = [
  { id: 'monochrome', label: 'Monochrome', icon: '#0F172A', title: '#0F172A', tag: '#64748B', bg: '#F8FAFC' },
  { id: 'midnight', label: 'Midnight Executive', icon: '#818CF8', title: '#E2E8F0', tag: '#94A3B8', bg: '#0F172A' },
  { id: 'terracotta', label: 'Warm Terracotta', icon: '#C05621', title: '#7C2D12', tag: '#B45309', bg: '#FFF7ED' },
  { id: 'electric', label: 'Electric Tech', icon: '#06B6D4', title: '#0F172A', tag: '#0891B2', bg: '#ECFEFF' },
  { id: 'earth', label: 'Earth Botanicals', icon: '#4D7C0F', title: '#1C1917', tag: '#57534E', bg: '#FAFAF9' },
  { id: 'coral', label: 'Vibrant Coral', icon: '#F43F5E', title: '#1F2937', tag: '#9F1239', bg: '#FFF1F2' },
];

export const NICHES = [
  { id: 'tech', label: 'Technology / SaaS', icons: ['bolt', 'hexagon', 'grid', 'sparkle', 'chat'], fonts: { title: 'spaceGrotesk', tag: 'jetbrainsMono' }, taglines: ['build the future', 'software, simplified', 'ship smarter'] },
  { id: 'commerce', label: 'Commerce & Retail', icons: ['tag', 'chat', 'diamond', 'grid', 'sparkle'], fonts: { title: 'outfit', tag: 'inter' }, taglines: ['shop the difference', 'quality you can trust', 'everyday essentials'] },
  { id: 'professional', label: 'Professional & Legal', icons: ['shield', 'briefcase', 'crown', 'eye'], fonts: { title: 'plusJakarta', tag: 'inter' }, taglines: ['counsel you can count on', 'precision. integrity. results.', 'trusted advisors'] },
  { id: 'health', label: 'Health & Wellness', icons: ['pulse', 'heart', 'drop', 'leaf'], fonts: { title: 'plusJakarta', tag: 'inter' }, taglines: ['care that puts you first', 'wellness, reimagined', 'your health, our mission'] },
  { id: 'hospitality', label: 'Hospitality & Food', icons: ['cup', 'leaf', 'heart', 'drop'], fonts: { title: 'playfair', tag: 'inter' }, taglines: ['taste the moment', 'gather around', 'crafted with love'] },
  { id: 'creative', label: 'Creative & Media', icons: ['pen', 'sparkle', 'eye', 'wave', 'mountain'], fonts: { title: 'syne', tag: 'inter' }, taglines: ['design that speaks', 'ideas made visible', 'craft beyond convention'] },
  { id: 'industrial', label: 'Industrial & Trades', icons: ['mountain', 'house', 'hexagon', 'bolt', 'shield'], fonts: { title: 'spaceGrotesk', tag: 'inter' }, taglines: ['built to last', 'strength in every detail', 'where things get made'] },
];

export const PERSONALITIES = [
  { id: 'minimal', label: 'Minimalist & Geometric', fonts: ['inter', 'outfit'], weight: 600, track: 0.1 },
  { id: 'elegant', label: 'Elegant & Luxury', fonts: ['cormorant', 'playfair'], weight: 600, track: 0.03 },
  { id: 'bold', label: 'Bold & Technical', fonts: ['spaceGrotesk', 'outfit'], weight: 800, track: 0 },
  { id: 'organic', label: 'Organic & Friendly', fonts: ['plusJakarta', 'outfit'], weight: 700, track: 0.02 },
  { id: 'classic', label: 'Classic & Authoritative', fonts: ['playfair', 'cormorant'], weight: 700, track: 0.05 },
];

export const LAYOUTS = [
  { id: 'horizontal', label: 'Horizontal Lockup' },
  { id: 'stacked', label: 'Stacked Center' },
  { id: 'monogram', label: 'Monogram Badge' },
  { id: 'wordmark', label: 'Minimalist Wordmark' },
  { id: 'emblem', label: 'Circular Emblem' },
];
