import { useEffect, useRef, useState } from 'react';
import { Download, LayoutGrid, Grid3X3, Spline, FileCode, Bookmark, Palette } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { downloadSvg, downloadPng, variantConcept } from '../lib/export';

const BG_MODES = [
  { id: 'obsidian', label: 'Obsidian', color: '#08090C' },
  { id: 'paper', label: 'Paper', color: '#F4F1EA' },
  {
    id: 'gradient',
    label: 'Gradient',
    color: '#08090C',
    gradient:
      'radial-gradient(130% 130% at 18% 12%, rgba(79,70,229,0.38) 0%, rgba(8,9,12,0.92) 58%), radial-gradient(120% 120% at 85% 95%, rgba(6,182,212,0.3) 0%, rgba(8,9,12,0) 60%), #08090C',
  },
  { id: 'app', label: 'App Icon' },
];

// Extracts bezier anchor points from the rendered logo SVG, mapping every
// path command endpoint and text/rect anchor into viewBox coordinates.
function collectAnchors(svgEl) {
  const vb = svgEl.getAttribute('viewBox') || '0 0 100 100';
  const nums = vb.split(/\s+/).map(Number);
  const vw = nums[2] || 100;
  const pts = [];
  const push = (x, y) => {
    if (Number.isFinite(x) && Number.isFinite(y)) pts.push({ x, y });
  };

  svgEl.querySelectorAll('path').forEach((p) => {
    let tx = 0;
    let ty = 0;
    let sc = 1;
    const g = p.closest('g');
    const tr = g?.getAttribute('transform') || '';
    const tm = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)/.exec(tr);
    if (tm) {
      tx = +tm[1];
      ty = +tm[2];
    }
    const sm = /scale\(\s*([-\d.]+)\s*\)/.exec(tr);
    if (sm) sc = +sm[1];
    const d = p.getAttribute('d') || '';
    const re = /([A-Za-z])((?:[^A-Za-z])*)/g;
    let m;
    while ((m = re.exec(d))) {
      const cmd = m[1].toUpperCase();
      const n = (m[2].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      const at = (i) => push(tx + n[i] * sc, ty + n[i + 1] * sc);
      if (cmd === 'M' || cmd === 'L' || cmd === 'T') {
        for (let i = 0; i + 1 < n.length; i += 2) at(i);
      } else if (cmd === 'C') {
        for (let i = 0; i + 5 < n.length; i += 6) at(i + 4);
      } else if (cmd === 'S') {
        for (let i = 0; i + 3 < n.length; i += 4) at(i + 2);
      } else if (cmd === 'A') {
        for (let i = 0; i + 6 < n.length; i += 7) at(i + 5);
      }
    }
  });

  svgEl.querySelectorAll('text').forEach((t) => {
    push(parseFloat(t.getAttribute('x')), parseFloat(t.getAttribute('y')));
  });

  svgEl.querySelectorAll('rect').forEach((r) => {
    const x = parseFloat(r.getAttribute('x')) || 0;
    const y = parseFloat(r.getAttribute('y')) || 0;
    const w = parseFloat(r.getAttribute('width')) || 0;
    const h = parseFloat(r.getAttribute('height')) || 0;
    push(x, y);
    push(x + w, y);
    push(x, y + h);
    push(x + w, y + h);
  });

  return { vb, vw, pts: pts.slice(0, 160) };
}

export function CanvasStage({ concept, ui, dispatch, saved }) {
  const [pngSize, setPngSize] = useState(1024);
  const [transparent, setTransparent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [inspector, setInspector] = useState(false);
  const [anchors, setAnchors] = useState(null);
  const stageRef = useRef(null);

  const zoom = ui.zoom ?? 1;
  const mode = BG_MODES.find((b) => b.id === ui.bg) || BG_MODES[0];

  useEffect(() => {
    if (!inspector) {
      setAnchors(null);
      return;
    }
    const svg = stageRef.current?.querySelector('svg');
    if (svg) setAnchors(collectAnchors(svg));
  }, [inspector, concept, ui.bg]);

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const surfaceStyle =
    ui.bg === 'gradient' ? { background: mode.gradient } : { background: mode.color };

  const toggleCls = (on) =>
    `rounded-lg border p-1.5 transition ${
      on
        ? 'border-amber-400 bg-amber-400/15 text-amber-300'
        : 'border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200'
    }`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/60">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/60 p-3" data-tour="canvas-toolbar">
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
          onClick={() => dispatch({ type: 'UI', patch: { grid: !ui.grid } })}
          title="Grid overlay"
          aria-pressed={!!ui.grid}
          className={toggleCls(ui.grid)}
        >
          <Grid3X3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => setInspector(!inspector)}
          title="Bezier point inspector"
          aria-pressed={inspector}
          className={toggleCls(inspector)}
        >
          <Spline className="h-4 w-4" />
        </button>
        <button
          onClick={() => dispatch({ type: 'UI', patch: { checker: !ui.checker } })}
          title="Toggle transparency checkerboard"
          aria-pressed={!!ui.checker}
          className={toggleCls(ui.checker)}
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

      {/* Museum-grade presentation surface */}
      <div
        className={`relative flex min-h-[300px] items-center justify-center overflow-hidden p-6 sm:min-h-[380px] ${
          ui.checker ? 'checker' : ''
        }`}
        style={ui.checker ? undefined : surfaceStyle}
      >
        {ui.grid && <div className="pointer-events-none absolute inset-0 grid-overlay" aria-hidden="true" />}
        {inspector && anchors && (
          <span className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] tracking-wider text-amber-400/90">
            {anchors.pts.length} bezier anchors · inspector
          </span>
        )}

        {ui.bg === 'app' ? (
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-[26%] p-9 shadow-2xl ring-1 ring-white/10"
              style={{ background: concept.colors?.icon || '#4F46E5' }}
            >
              <div className="w-full">
                <LogoMark concept={variantConcept(concept, 'mono')} />
              </div>
            </div>
            <span className="font-mono text-[10px] tracking-wider text-slate-400">512 × 512 · app icon preview</span>
          </div>
        ) : (
          <div
            ref={stageRef}
            className="relative w-full max-w-2xl origin-center transition-transform duration-150"
            style={{ transform: `scale(${zoom})` }}
          >
            <LogoMark concept={concept} />
            {inspector && anchors && (
              <svg viewBox={anchors.vb} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                {anchors.pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={anchors.vw * 0.008}
                    fill="#F59E0B"
                    fillOpacity="0.9"
                    stroke="#08090C"
                    strokeWidth={anchors.vw * 0.003}
                  />
                ))}
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
