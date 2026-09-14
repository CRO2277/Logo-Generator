import { X, Download } from 'lucide-react';
import { FONTS, LAYOUTS } from '../data/brand';
import { fmtColor } from '../lib/color';
import { downloadBrandKit } from '../lib/export';

const COLOR_KEYS = [
  { k: 'icon', label: 'Primary Mark' },
  { k: 'title', label: 'Title' },
  { k: 'tag', label: 'Tagline' },
  { k: 'bg', label: 'Background' },
];

export function BrandKitModal({ concept, onClose }) {
  const titleFont = FONTS.find((f) => f.id === concept.titleFont) || FONTS[0];
  const tagFont = FONTS.find((f) => f.id === concept.tagFont) || FONTS[0];
  const layout = LAYOUTS.find((l) => l.id === concept.layout) || LAYOUTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">Brand Kit — {concept.name || 'Brand'}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Colors</h4>
        <div className="mb-5 grid grid-cols-2 gap-2">
          {COLOR_KEYS.map(({ k, label }) => {
            const f = fmtColor(concept.colors?.[k] || '#000000');
            return (
              <div key={k} className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                <span className="h-9 w-9 shrink-0 rounded-lg border border-slate-600" style={{ background: f.hex }} />
                <div className="min-w-0">
                  <div className="truncate text-[11px] font-medium text-slate-200">{label}</div>
                  <div className="truncate font-mono text-[10px] text-slate-400">{f.hex}</div>
                  <div className="truncate font-mono text-[10px] text-slate-500">rgb({f.rgb})</div>
                  <div className="truncate font-mono text-[10px] text-slate-500">hsl({f.hsl})</div>
                </div>
              </div>
            );
          })}
        </div>

        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Typography Pairing</h4>
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs">
            <span className="text-slate-300">Title — {titleFont.label}</span>
            <span className="font-mono text-[10px] text-slate-400">
              {concept.titleWeight} · {concept.trackEm.toFixed(2)}em{concept.uppercase !== false ? ' · caps' : ''}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs">
            <span className="text-slate-300">Tagline — {tagFont.label}</span>
            <span className="font-mono text-[10px] text-slate-400">{concept.tagWeight || 600} · 0.22em · caps</span>
          </div>
        </div>

        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Layout Lockup Rules</h4>
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs">
            <span className="text-slate-300">{layout.label}</span>
            <span className="font-mono text-[10px] text-slate-400">{concept.align} aligned</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs">
            <span className="text-slate-300">Icon scale / gap</span>
            <span className="font-mono text-[10px] text-slate-400">
              {Math.round(concept.iconScale * 100)}% / {Math.round(concept.gap * 100)}%
            </span>
          </div>
        </div>

        <button
          onClick={() => downloadBrandKit(concept)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          <Download className="h-4 w-4" />
          Download Brand Kit Summary
        </button>
      </div>
    </div>
  );
}
