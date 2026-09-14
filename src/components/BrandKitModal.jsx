import { useState } from 'react';
import { X, Download, Package, Loader2 } from 'lucide-react';
import { FONTS, LAYOUTS } from '../data/brand';
import { fmtColor } from '../lib/color';
import { downloadBrandKit, downloadSvg, downloadPng } from '../lib/export';
import { ASSETS, downloadAsset, downloadAllZip } from '../lib/assets';
import { DriveToggle } from './DriveToggle';
import { driveEnabled, backupZipToDrive } from '../lib/drive';

const COLOR_KEYS = [
  { k: 'icon', label: 'Primary Mark' },
  { k: 'title', label: 'Title' },
  { k: 'tag', label: 'Tagline' },
  { k: 'bg', label: 'Background' },
];

const VARIANTS = [
  { id: 'color', label: 'Primary (color)' },
  { id: 'mono', label: 'Monochrome (print ink)' },
  { id: 'reversed', label: 'Reversed (for dark backgrounds)' },
];

function Row({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3">
      <div className="min-w-0">
        <div className="truncate text-xs text-slate-300">{label}</div>
        {hint && <div className="truncate font-mono text-[10px] text-slate-500">{hint}</div>}
      </div>
      <div className="flex shrink-0 gap-1.5">{children}</div>
    </div>
  );
}

const miniBtn =
  'rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] text-slate-200 transition hover:border-indigo-500 hover:text-indigo-300 disabled:opacity-40';

export function BrandKitModal({ concept, onClose }) {
  const [busy, setBusy] = useState(null);
  const [driveStatus, setDriveStatus] = useState(null);
  const titleFont = FONTS.find((f) => f.id === concept.titleFont) || FONTS[0];
  const tagFont = FONTS.find((f) => f.id === concept.tagFont) || FONTS[0];
  const layout = LAYOUTS.find((l) => l.id === concept.layout) || LAYOUTS[0];

  const run = async (id, fn) => {
    setBusy(id);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  const groups = [...new Set(ASSETS.map((a) => a.group))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Brand Kit — {concept.name || 'Brand'}</h3>
            <p className="text-[11px] text-slate-400">Everything the paid tools charge for — free, full-resolution.</p>
          </div>
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
          <Row label={`Title — ${titleFont.label}`} hint={`${concept.titleWeight} · ${concept.trackEm.toFixed(2)}em${concept.uppercase !== false ? ' · caps' : ''}`} />
          <Row label={`Tagline — ${tagFont.label}`} hint={`${concept.tagWeight || 600} · 0.22em · caps`} />
        </div>

        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Layout Lockup Rules</h4>
        <div className="mb-5 space-y-2">
          <Row label={layout.label} hint={`${concept.align} aligned`} />
          <Row label="Icon scale / gap" hint={`${Math.round(concept.iconScale * 100)}% / ${Math.round(concept.gap * 100)}%`} />
        </div>

        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Logo Variants</h4>
        <div className="mb-5 space-y-2">
          {VARIANTS.map((v) => (
            <Row key={v.id} label={v.label} hint="">
              <button className={miniBtn} disabled={busy !== null} onClick={() => run(`${v.id}-svg`, () => downloadSvg(concept, v.id))}>SVG</button>
              <button className={miniBtn} disabled={busy !== null} onClick={() => run(`${v.id}-png`, () => downloadPng(concept, 2048, v.id === 'color', v.id))}>PNG</button>
            </Row>
          ))}
        </div>

        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Brand Asset Suite</h4>
        <div className="mb-5 space-y-3">
          {groups.map((g) => (
            <div key={g} className="space-y-2">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{g}</div>
              {ASSETS.filter((a) => a.group === g).map((a) => (
                <Row key={a.id} label={a.label} hint={`${a.w} × ${a.h}`}>
                  <button className={miniBtn} disabled={busy !== null} onClick={() => run(a.id, () => downloadAsset(concept, a))}>
                    {busy === a.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'PNG'}
                  </button>
                </Row>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <DriveToggle onError={setDriveStatus} />
          </div>
          {driveStatus === 'saving' && <p className="text-center text-[10px] text-slate-400">Saving a copy to Google Drive…</p>}
          {driveStatus === 'saved' && <p className="text-center text-[10px] text-emerald-400">✓ A copy is safe in your Google Drive</p>}
          {driveStatus === 'error' && (
            <p className="text-center text-[10px] text-rose-400">Drive upload failed — reconnect via the toggle and try again.</p>
          )}
          <button
            onClick={() =>
              run('zip', async () => {
                const { blob, filename } = await downloadAllZip(concept);
                if (driveEnabled()) {
                  setDriveStatus('saving');
                  try {
                    await backupZipToDrive(blob, filename);
                    setDriveStatus('saved');
                  } catch {
                    setDriveStatus('error');
                  }
                }
              })
            }
            disabled={busy !== null}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
          >
            {busy === 'zip' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
            {busy === 'zip' ? 'Preparing your files…' : 'Download Everything — ZIP (17 files)'}
          </button>
          <button
            onClick={() => downloadBrandKit(concept)}
            disabled={busy !== null}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Brand Kit Summary (.md)
          </button>
        </div>
      </div>
    </div>
  );
}
