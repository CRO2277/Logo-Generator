// Brand data: icons, palettes, typefaces, style presets and layouts.

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
];

export const PALETTES = [
  { id: 'ocean', label: 'Ocean', primary: '#0EA5E9', secondary: '#0369A1', text: '#0F172A', muted: '#64748B', darkAccent: '#38BDF8' },
  { id: 'indigo', label: 'Indigo', primary: '#6366F1', secondary: '#4338CA', text: '#1E1B4B', muted: '#64748B', darkAccent: '#818CF8' },
  { id: 'violet', label: 'Violet', primary: '#8B5CF6', secondary: '#7C3AED', text: '#2E1065', muted: '#6B7280', darkAccent: '#A78BFA' },
  { id: 'forest', label: 'Forest', primary: '#16A34A', secondary: '#15803D', text: '#052E16', muted: '#6B7280', darkAccent: '#4ADE80' },
  { id: 'sunset', label: 'Sunset', primary: '#F97316', secondary: '#EA580C', text: '#431407', muted: '#78716C', darkAccent: '#FB923C' },
  { id: 'rose', label: 'Rose', primary: '#F43F5E', secondary: '#E11D48', text: '#4C0519', muted: '#6B7280', darkAccent: '#FB7185' },
  { id: 'amber', label: 'Amber', primary: '#F59E0B', secondary: '#D97706', text: '#451A03', muted: '#78716C', darkAccent: '#FBBF24' },
  { id: 'slate', label: 'Slate', primary: '#475569', secondary: '#0F172A', text: '#0F172A', muted: '#64748B', darkAccent: '#CBD5E1' },
];

export const FONTS = [
  { id: 'inter', label: 'Inter', cssName: 'Inter', family: "'Inter', system-ui, sans-serif", weight: 900, lsEm: -0.015 },
  { id: 'poppins', label: 'Poppins', cssName: 'Poppins', family: "'Poppins', system-ui, sans-serif", weight: 700, lsEm: -0.01 },
  { id: 'grotesk', label: 'Space Grotesk', cssName: 'Space Grotesk', family: "'Space Grotesk', system-ui, sans-serif", weight: 700, lsEm: -0.005 },
  { id: 'playfair', label: 'Playfair', cssName: 'Playfair Display', family: "'Playfair Display', Georgia, serif", weight: 700, lsEm: 0.005 },
  { id: 'dmserif', label: 'DM Serif', cssName: 'DM Serif Display', family: "'DM Serif Display', Georgia, serif", weight: 400, lsEm: 0 },
  { id: 'bebas', label: 'Bebas Neue', cssName: 'Bebas Neue', family: "'Bebas Neue', Impact, sans-serif", weight: 400, lsEm: 0.03 },
  { id: 'pacifico', label: 'Pacifico', cssName: 'Pacifico', family: "'Pacifico', cursive", weight: 400, lsEm: 0 },
  { id: 'quicksand', label: 'Quicksand', cssName: 'Quicksand', family: "'Quicksand', system-ui, sans-serif", weight: 700, lsEm: 0.01 },
];

export const LAYOUTS = [
  { id: 'icon-left', label: 'Icon left' },
  { id: 'icon-top', label: 'Icon top' },
  { id: 'monogram', label: 'Badge' },
  { id: 'wordmark', label: 'Text only' },
];

export const PRESETS = [
  { id: 'minimal', label: 'Minimal', cfg: { font: 'inter', layout: 'wordmark', palette: 'slate', icon: 'diamond', uppercase: true } },
  { id: 'bold', label: 'Bold', cfg: { font: 'bebas', layout: 'icon-left', palette: 'sunset', icon: 'bolt', uppercase: true } },
  { id: 'playful', label: 'Playful', cfg: { font: 'pacifico', layout: 'icon-top', palette: 'amber', icon: 'sparkle', uppercase: false } },
  { id: 'elegant', label: 'Elegant', cfg: { font: 'dmserif', layout: 'icon-left', palette: 'rose', icon: 'diamond', uppercase: false } },
  { id: 'tech', label: 'Tech', cfg: { font: 'grotesk', layout: 'monogram', palette: 'ocean', icon: 'hexagon', uppercase: true } },
  { id: 'organic', label: 'Organic', cfg: { font: 'quicksand', layout: 'icon-left', palette: 'forest', icon: 'leaf', uppercase: false } },
];
