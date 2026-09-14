import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const DONE_KEY = 'logolegacy.tour-done';

const STEPS = [
  {
    title: 'Welcome to LogoLegacy.pro',
    body: 'The free AI-era logo studio — full-resolution files, no signup, no paywalls. This 60-second tour covers the whole flow.',
    tab: null,
    target: null,
  },
  {
    title: 'Four workspaces',
    body: 'Design sets your brand brief, Studio previews and exports, Gallery collects your saved logos, and AI Assist recommends the right AI model for each job.',
    tab: 'design',
    target: '[data-tour="mode-tabs"]',
  },
  {
    title: 'The presentation canvas',
    body: 'Switch surfaces (Obsidian, Paper, Gradient, App Icon), overlay the metrology grid, inspect bezier anchor points, and export PNG up to 4096px or crisp SVG.',
    tab: 'studio',
    target: '[data-tour="canvas-toolbar"]',
  },
  {
    title: 'Your 12 concepts',
    body: 'Click any card to make it active; the star saves it to your Gallery. Regenerate a fresh batch anytime.',
    tab: 'studio',
    target: '[data-tour="concept-grid"]',
  },
  {
    title: 'Gallery',
    body: 'Saved logos in one place — bulk ZIP download with per-logo SVG + transparent PNG, plus optional Google Drive auto-backup.',
    tab: 'gallery',
    target: '[data-tour="gallery"]',
  },
  {
    title: 'AI Model Advisor',
    body: 'A live model matrix, a prompt composer tuned to your brand, and free keyless AI concept previews — no API keys required.',
    tab: 'ai',
    target: '[data-tour="ai-advisor"]',
  },
  {
    title: 'Generate anytime',
    body: "Regenerate all 12 concepts from your brief in one click. That's everything — you're ready to build your brand.",
    tab: null,
    target: '[data-tour="generate"]',
  },
];

export function Tour({ dispatch, onClose }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(DONE_KEY, '1');
    } catch {
      /* private mode */
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    const s = STEPS[step];
    if (s.tab) dispatch({ type: 'UI', patch: { mobileTab: s.tab } });
    const t = setTimeout(() => {
      const el = s.target ? document.querySelector(s.target) : null;
      if (el && el.offsetParent !== null) {
        el.scrollIntoView({ block: 'center' });
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, w: r.width, h: r.height });
      } else {
        setRect(null);
      }
    }, s.tab ? 450 : 60);
    return () => clearTimeout(t);
  }, [step, dispatch]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
      if (e.key === 'ArrowRight' && step < STEPS.length - 1) setStep(step + 1);
      if (e.key === 'ArrowLeft' && step > 0) setStep(step - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, finish]);

  const s = STEPS[step];
  const last = step === STEPS.length - 1;
  const W = 320;
  const PAD = 14;

  let left = (window.innerWidth - W) / 2;
  let top = Math.max(PAD, window.innerHeight / 2 - 180);
  if (rect) {
    left = Math.min(Math.max(PAD, rect.left + rect.w / 2 - W / 2), window.innerWidth - W - PAD);
    const below = rect.top + rect.h + PAD + 230 < window.innerHeight;
    top = below ? rect.top + rect.h + PAD : Math.max(PAD, rect.top - 200);
  }

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-label="Guided tour">
      {/* spotlight */}
      {rect && (
        <div
          className="pointer-events-none absolute rounded-2xl border-2 border-amber-400/70"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.w + 16,
            height: rect.h + 16,
            boxShadow: '0 0 0 9999px rgba(8,9,12,0.85)',
          }}
          aria-hidden="true"
        />
      )}
      {!rect && <div className="absolute inset-0 bg-slate-950/80" aria-hidden="true" />}

      {/* tooltip card */}
      <div
        className="absolute w-[320px] max-w-[calc(100vw-28px)] rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-2xl"
        style={{ left, top }}
      >
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
            {step + 1} / {STEPS.length}
          </span>
          <button onClick={finish} aria-label="Skip tour" className="rounded p-1 text-slate-500 transition hover:text-slate-200">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <h3 className="font-display text-sm font-bold tracking-tight text-slate-50">{s.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">{s.body}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition ${i === step ? 'bg-amber-400' : 'bg-slate-600'}`}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-[11px] text-slate-300 transition hover:border-slate-500"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
            )}
            <button
              onClick={() => (last ? finish() : setStep(step + 1))}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:from-indigo-400 hover:to-cyan-400"
            >
              {last ? "Let's go" : 'Next'}
              {!last && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
