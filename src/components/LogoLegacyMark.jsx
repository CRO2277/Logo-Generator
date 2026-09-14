import { useId } from 'react';

// ————————————————————————————————————————————————
// The Refractive LL Monogram
// Isometric double-L weave: the front L and the back L are 180°
// rotationally symmetric, each with a chamfered inner corner. The two
// chamfers carve a faceted diamond node of negative space at the exact
// center — the "generative seed" — highlighted with a liquid-amber point.
// Silhouette stays razor-legible down to 16px.
// ——————————————————————————————————————————————
// eslint-disable-next-line
const L_FRONT = 'M4.2 2.6H8.4V14.2L11.2 17.2H19.8V21.4H4.2Z';
const L_BACK = 'M19.8 21.4H15.6V9.8L12.8 6.8H4.2V2.6H19.8Z';
const SEED = 'M12 10.6L13.4 12L12 13.4L10.6 12Z';
const EMBER_TIP = 'M4.2 2.6H6.4L4.2 4.8Z';

export function LogoLegacyMark({ size = 32, variant = 'chromatic', className }) {
  const uid = useId().replace(/[:]/g, '');
  const mono = variant !== 'chromatic';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label="Logo Legacy monogram"
      className={className}
    >
      {!mono && (
        <defs>
          <linearGradient id={`ll-front-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id={`ll-back-${uid}`} x1="1" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#06B6D4" />
            <stop offset="0.68" stopColor="#0E7490" />
            <stop offset="1" stopColor="#155E75" />
          </linearGradient>
          <clipPath id={`ll-weave-${uid}`}>
            <rect x="15.6" y="17.2" width="4.2" height="4.2" />
          </clipPath>
        </defs>
      )}

      {/* back L — the "Legacy" strut */}
      <path d={L_BACK} fill={mono ? 'currentColor' : `url(#ll-back-${uid})`} />
      {/* front L — the "Logo" gesture, woven over at the top-left crossing */}
      <path d={L_FRONT} fill={mono ? 'currentColor' : `url(#ll-front-${uid})`} />
      {/* weave completion: the back L passes back over at the bottom-right crossing */}
      {!mono && (
        <g clipPath={`url(#ll-weave-${uid})`}>
          <path d={L_BACK} fill={`url(#ll-back-${uid})`} />
        </g>
      )}
      {/* fine-point liquid-amber accents: mitered tip + the generative seed */}
      {!mono && (
        <>
          <path d={EMBER_TIP} fill="#F59E0B" />
          <path d={SEED} fill="#F59E0B" />
        </>
      )}
    </svg>
  );
}

export function LogoLegacyLockup({ subtitle = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative shrink-0">
        <LogoLegacyMark size={34} />
        <span
          className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 animate-glow"
          aria-hidden="true"
        />
      </div>
      <div className="leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[15px] font-extrabold tracking-tighter text-slate-50">LOGO LEGACY</span>
          <span className="rounded border border-slate-600 px-1 py-px font-mono text-[8px] font-semibold tracking-widest text-slate-400">
            .PRO
          </span>
        </div>
        {subtitle && (
          <p className="mt-1 hidden text-[10px] text-slate-400 sm:block">
            AI logo & brand identity studio — free, full-resolution files.
          </p>
        )}
      </div>
    </div>
  );
}
