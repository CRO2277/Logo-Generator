import { useState } from 'react';
import { Download, LayoutGrid, Palette, FileCode, Bookmark } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { downloadSvg, downloadPng } from '../lib/export';

const BG_MODES = [
  { id: 'white', label: 'White', color: '#FFFFFF' },
  { id: 'charcoal', label: 'Charcoal', color: '#0F172A' },
  { id: 'brand', label: 'Brand', color: null },
];

export function CanvasStage({ concept, ui, dispatch, saved }) {
  const [pngSize, setPngSize] = useState(1024);
  const [transparent, setTransparent] = useState(true);
  const [busy, setBusy] = useState(false);

  const brandBg = concept.colors?.bg || '#FFFFFF';
  const surface = ui.bg === 'brand' ? brandBg : BG_MODES.find((b) => b.id === ui.bg)?.color || '#FFFFFF';

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/60">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/60 p-3">
        <div className="flex rounded-lg border border-slate-700 bg-slate-900/80 p-0.5">
          {BG_MODES.map((b) => (
            <button
              key={b.id}
              onClick={() => dispatch({ type: 'UI', patch: { bg: b.id } })}
              className={`rounded-md px-2.5 py-1 text-[11px] transition ${
                ui.bg === b.id ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => dispatch({ type: 'UI', patch: { checker: !ui.checker } })}
          title="Toggle transparency checkerboard"
          className={`rounded-lg border p-1.5 transition ${
            ui.checker ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300' : 'border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>

        <div className="flex-1" />

        <select
          value={pngSize}
          onChange={(e) => setPngSize(Number(e.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-[11px] text-slate-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value={1024}>1024 px</option>
          <option value={2048}>2048 px</option>
          <option value={4096}>4096 px</option>
        </select>
        <label className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="accent-indigo-500" />
          Transparent
        </label>
        <button
          disabled={busy}
          onClick={() => run(() => downloadPng(concept, pngSize, transparent))}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          PNG
        </button>
        <button
          disabled={busy}
          onClick={() => run(() => downloadSvg(concept))}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 transition hover:border-slate-500 disabled:opacity-50"
        >
          <FileCode className="h-3.5 w-3.5" />
          SVG
        </button>
        <button
          onClick={() => dispatch({ type: 'SAVE_TO_GALLERY', concept })}
          title={saved ? 'Remove from gallery' : 'Save to gallery'}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] transition ${
            saved
              ? 'border-amber-400 bg-amber-400/15 text-amber-300'
              : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} />
          {saved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={() => dispatch({ type: 'UI', patch: { kitOpen: true } })}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 transition hover:border-slate-500"
        >
          <Palette className="h-3.5 w-3.5" />
          Brand Kit
        </button>
      </div>

      {/* Canvas */}
      <div
        className={`flex min-h-[300px] items-center justify-center p-6 transition-colors sm:min-h-[380px] ${ui.checker ? 'checker' : ''}`}
        style={ui.checker ? undefined : { background: surface }}
      >
        <div className="w-full max-w-2xl">
          <LogoMark concept={concept} />
        </div>
      </div>
    </div>
  );
}
