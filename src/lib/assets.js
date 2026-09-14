// Brand Asset Suite: renders platform-exact marketing assets (social covers,
// favicons, avatars, business card) from the shared geometry engine, and
// bundles the complete kit into a single ZIP download — free, unlike the
// competition.

import JSZip from 'jszip';
import { ICONS } from '../data/brand';
import { contrastText } from './color';
import { layoutLogo } from './layout';
import {
  drawPrim, buildSvgString, embedFonts, variantConcept,
  renderLogoCanvas, brandKitMd, saveBlob, slug,
} from './export';

export const ASSETS = [
  // Social media (full lockup on brand background)
  { id: 'og', group: 'Social Media', label: 'Open Graph / link preview', file: 'social/open-graph-1200x630.png', w: 1200, h: 630, kind: 'lockup' },
  { id: 'x-header', group: 'Social Media', label: 'X / Twitter header', file: 'social/x-header-1500x500.png', w: 1500, h: 500, kind: 'lockup' },
  { id: 'fb-cover', group: 'Social Media', label: 'Facebook cover', file: 'social/facebook-cover-820x312.png', w: 820, h: 312, kind: 'lockup' },
  { id: 'li-banner', group: 'Social Media', label: 'LinkedIn banner', file: 'social/linkedin-banner-1584x396.png', w: 1584, h: 396, kind: 'lockup' },
  { id: 'yt-banner', group: 'Social Media', label: 'YouTube banner', file: 'social/youtube-banner-2048x1152.png', w: 2048, h: 1152, kind: 'lockup' },
  // Icons & favicons (mark only, on brand color)
  { id: 'app-icon', group: 'Icons', label: 'App icon', file: 'icons/app-icon-512.png', w: 512, h: 512, kind: 'mark' },
  { id: 'touch-icon', group: 'Icons', label: 'Apple touch icon', file: 'icons/apple-touch-180.png', w: 180, h: 180, kind: 'mark' },
  { id: 'favicon', group: 'Icons', label: 'Favicon', file: 'icons/favicon-32.png', w: 32, h: 32, kind: 'mark' },
  { id: 'avatar', group: 'Icons', label: 'Social avatar (circle)', file: 'icons/avatar-circle-400.png', w: 400, h: 400, kind: 'mark', circle: true },
  // Print
  { id: 'card', group: 'Print', label: 'Business card · 300 DPI', file: 'print/business-card-1050x600.png', w: 1050, h: 600, kind: 'card' },
];

// --- renderers ---

function drawLockup(ctx, concept, box) {
  const { w: lw, h: lh, prims } = layoutLogo(concept);
  const s = Math.min((box.w * 0.82) / lw, (box.h * 0.62) / lh);
  ctx.save();
  ctx.translate(box.x + (box.w - lw * s) / 2, box.y + (box.h - lh * s) / 2);
  ctx.scale(s, s);
  for (const p of prims) drawPrim(ctx, p);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

function initialsOf(concept) {
  return ((concept.name || 'B').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('') || 'B').toUpperCase();
}

function drawMark(ctx, concept, asset) {
  const size = Math.min(asset.w, asset.h);
  const bg = concept.colors?.icon || '#4F46E5';
  const glyphColor = contrastText(bg);

  if (asset.circle) {
    ctx.beginPath();
    ctx.arc(asset.w / 2, asset.h / 2, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();
  } else {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, asset.w, asset.h);
  }

  if (concept.layout === 'monogram') {
    const badge = size * 0.5;
    const x = (asset.w - badge) / 2;
    const y = (asset.h - badge) / 2;
    ctx.fillStyle = glyphColor;
    roundRect(ctx, x, y, badge, badge, badge * 0.26);
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.font = `700 ${badge * 0.4}px 'Inter', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(initialsOf(concept), asset.w / 2, asset.h / 2 + badge * 0.14);
  } else {
    const icon = ICONS.find((i) => i.id === concept.icon) || ICONS[0];
    const gs = size * 0.55;
    ctx.save();
    ctx.translate((asset.w - gs) / 2, (asset.h - gs) / 2);
    ctx.scale(gs / 24, gs / 24);
    ctx.fillStyle = glyphColor;
    ctx.fill(new Path2D(icon.d), icon.fr || 'nonzero');
    ctx.restore();
  }
}

function drawCard(ctx, concept, asset) {
  const bg = concept.colors?.bg || '#FFFFFF';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, asset.w, asset.h);

  // left: logo lockup
  drawLockup(ctx, concept, { x: 70, y: 70, w: asset.w * 0.5 - 70, h: asset.h - 140 });

  // right: contact block
  const right = asset.w * 0.58;
  const domain = slug(concept.name).replace(/-/g, '') || 'brand';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = concept.colors?.title || '#0F172A';
  ctx.font = `700 36px 'Inter', system-ui, sans-serif`;
  ctx.fillText(concept.name || 'Brand', right, asset.h / 2 - 55);
  ctx.fillStyle = concept.colors?.tag || '#64748B';
  ctx.font = `400 17px 'Inter', system-ui, sans-serif`;
  ctx.fillText(`hello@${domain}.com`, right, asset.h / 2 - 5);
  ctx.fillText('+1 (555) 010-0100', right, asset.h / 2 + 35);
  ctx.fillText(`${domain}.com`, right, asset.h / 2 + 75);
}

export function renderAsset(concept, asset) {
  const cv = document.createElement('canvas');
  cv.width = asset.w;
  cv.height = asset.h;
  const ctx = cv.getContext('2d');
  if (asset.kind === 'mark') {
    drawMark(ctx, concept, asset);
  } else if (asset.kind === 'card') {
    drawCard(ctx, concept, asset);
  } else {
    ctx.fillStyle = concept.colors?.bg || '#FFFFFF';
    ctx.fillRect(0, 0, asset.w, asset.h);
    drawLockup(ctx, concept, { x: 0, y: 0, w: asset.w, h: asset.h });
  }
  return cv;
}

// --- downloads ---

export async function downloadAsset(concept, asset) {
  const blob = await new Promise((r) => renderAsset(concept, asset).toBlob(r, 'image/png'));
  saveBlob(blob, asset.file.split('/').pop());
}

function zipFile(cv) {
  return new Promise((r) => cv.toBlob(r, 'image/png'));
}

export async function downloadAllZip(concept) {
  const zip = new JSZip();

  // Logo variants — SVG with embedded fonts
  for (const v of ['color', 'mono', 'reversed']) {
    const c = variantConcept(concept, v);
    let css = '';
    try {
      css = await embedFonts(c);
    } catch {
      /* best-effort embedding */
    }
    zip.file(`logo/${v}.svg`, buildSvgString(c, css));
  }

  // Logo variants — PNG
  zip.file('logo/color-2048-transparent.png', await zipFile(renderLogoCanvas(concept, 2048, true)));
  zip.file('logo/mono-2048.png', await zipFile(renderLogoCanvas(variantConcept(concept, 'mono'), 2048, false)));
  zip.file('logo/reversed-2048.png', await zipFile(renderLogoCanvas(variantConcept(concept, 'reversed'), 2048, false)));

  // Platform assets
  for (const asset of ASSETS) {
    zip.file(asset.file, await zipFile(renderAsset(concept, asset)));
  }

  // Guidelines
  zip.file('brand-kit.md', brandKitMd(concept));

  const blob = await zip.generateAsync({ type: 'blob' });
  saveBlob(blob, `${slug(concept.name)}-brand-kit.zip`);
}

// Bulk export: every saved gallery logo as SVG + transparent PNG in one ZIP.
export async function downloadGalleryZip(concepts) {
  const zip = new JSZip();
  for (let i = 0; i < concepts.length; i++) {
    const c = concepts[i];
    const folder = zip.folder(`${String(i + 1).padStart(2, '0')}-${c.layout}`);
    let css = '';
    try {
      css = await embedFonts(c);
    } catch {
      /* best-effort embedding */
    }
    folder.file('logo.svg', buildSvgString(c, css));
    folder.file('logo-1024.png', await zipFile(renderLogoCanvas(c, 1024, true)));
  }
  zip.file(
    'README.md',
    `# Logo Gallery\n\n${concepts.length} logo(s), generated free with LogoLegacy (logolegacy.pro).\nEach folder holds a font-embedded vector SVG and a transparent 1024px PNG.`
  );
  const blob = await zip.generateAsync({ type: 'blob' });
  saveBlob(blob, `${slug(concepts[0]?.name || 'brand')}-logos.zip`);
}
