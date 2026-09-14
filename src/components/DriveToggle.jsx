import { useState } from 'react';
import { Cloud, Loader2 } from 'lucide-react';
import { isDriveConfigured, driveEnabled, setDriveEnabled, connectDrive } from '../lib/drive';

export function DriveToggle({ onError }) {
  const [on, setOn] = useState(driveEnabled());
  const [busy, setBusy] = useState(false);

  if (!isDriveConfigured()) return null;

  const toggle = async () => {
    if (on) {
      setDriveEnabled(false);
      setOn(false);
      return;
    }
    setBusy(true);
    try {
      await connectDrive();
      setOn(true);
      onError?.(null);
    } catch {
      onError?.('error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition ${
        on
          ? 'border-sky-500 bg-sky-500/10 text-sky-300'
          : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-sky-500 hover:text-sky-300'
      }`}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Cloud className="h-3.5 w-3.5" />}
      {on ? 'Drive backup ON' : 'Connect Google Drive'}
    </button>
  );
}
