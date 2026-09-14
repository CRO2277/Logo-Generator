import { useState } from 'react';
import { Package, Loader2, Trash2, FileCode, Bookmark } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { downloadSvg } from '../lib/export';
import { downloadGalleryZip } from '../lib/assets';
import { DriveToggle } from './DriveToggle';
import { driveEnabled, backupZipToDrive } from '../lib/drive';

export function Gallery({ concepts, dispatch }) {
  const [busy, setBusy] = useState(false);
  const [driveStatus, setDriveStatus] = useState(null);

  if (!concepts.length) {
    return (
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-12 text-center">
        <Bookmark className="mx-auto h-8 w-8 text-slate-600" />
        <h3 className="mt-3 text-sm font-semibold text-slate-200">Your gallery is empty</h3>
        <p className="mx-auto mt-1 max-w-xs text-xs text-slate-400">
          Star concepts in the Studio to save them here — then download every logo as one ZIP.
        </p>
      </div>
    );
  }

  const run = async () => {
    setBusy(true);
    setDriveStatus(null);
    try {
      const { blob, filename } = await downloadGalleryZip(concepts);
      if (driveEnabled()) {
        setDriveStatus('saving');
        try {
          await backupZipToDrive(blob, filename);
          setDriveStatus('saved');
        } catch {
          setDriveStatus('error');
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Gallery</h2>
          <p className="text-[11px] text-slate-400">
            {concepts.length} saved {concepts.length === 1 ? 'logo' : 'logos'} · SVG + transparent PNG each
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DriveToggle onError={setDriveStatus} />
          <button
            onClick={run}
            disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
            {busy ? 'Preparing ZIP…' : 'Download All — ZIP'}
          </button>
        </div>
      </div>

      {driveStatus === 'saving' && <p className="text-[11px] text-slate-400">Saving a copy to Google Drive…</p>}
      {driveStatus === 'saved' && <p className="text-[11px] text-emerald-400">✓ A copy is safe in your Google Drive</p>}
      {driveStatus === 'error' && (
        <p className="text-[11px] text-rose-400">Drive upload failed — reconnect via the toggle and try again.</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {concepts.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-xl ring-1 ring-slate-700">
            <div className="flex min-h-[110px] items-center justify-center p-4" style={{ background: c.colors?.bg || '#fff' }}>
              <div className="w-full px-1">
                <LogoMark concept={c} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-slate-700 bg-slate-900/80 px-3 py-2">
              <span className="min-w-0 truncate text-[10px] text-slate-400">
                {(c.name || 'Brand') + ' · ' + c.layout}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => downloadSvg(c)}
                  title="Download SVG"
                  className="rounded-md border border-slate-700 bg-slate-800 p-1.5 text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300"
                >
                  <FileCode className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_FROM_GALLERY', id: c.id })}
                  title="Remove from gallery"
                  className="rounded-md border border-slate-700 bg-slate-800 p-1.5 text-slate-300 transition hover:border-rose-500 hover:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
