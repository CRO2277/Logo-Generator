import {
  Cpu, ShoppingBag, Scale, HeartPulse, Coffee, PenTool, Hammer,
  Shapes, Sparkles, Zap, Leaf, Landmark, Sparkles as GenerateIcon,
} from 'lucide-react';
import { NICHES, PERSONALITIES, PALETTES, LAYOUTS } from '../data/brand';

const NICHE_ICONS = { tech: Cpu, commerce: ShoppingBag, professional: Scale, health: HeartPulse, hospitality: Coffee, creative: PenTool, industrial: Hammer };
const PERSONALITY_ICONS = { minimal: Shapes, elegant: Sparkles, bold: Zap, organic: Leaf, classic: Landmark };

function Section({ step, title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {step} · {title}
      </h3>
      {children}
    </div>
  );
}

function LayoutGlyph({ id }) {
  const common = { viewBox: '0 0 48 24', className: 'h-5 w-10 text-slate-300' };
  switch (id) {
    case 'horizontal':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="16" height="16" rx="3" fill="currentColor" />
          <rect x="22" y="6" width="20" height="6" rx="2" fill="currentColor" opacity="0.9" />
          <rect x="22" y="15" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case 'stacked':
      return (
        <svg {...common}>
          <rect x="17" y="1" width="14" height="10" rx="2" fill="currentColor" />
          <rect x="12" y="14" width="24" height="4" rx="2" fill="currentColor" opacity="0.8" />
          <rect x="16" y="20" width="16" height="2.5" rx="1.25" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case 'monogram':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="16" height="16" rx="4" fill="currentColor" />
          <rect x="22" y="7" width="20" height="6" rx="2" fill="currentColor" opacity="0.8" />
          <rect x="22" y="16" width="13" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case 'wordmark':
      return (
        <svg {...common}>
          <text x="2" y="15" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="Inter, sans-serif">Aa</text>
          <rect x="22" y="17" width="20" height="3" rx="1.5" fill="currentColor" opacity="0.7" />
        </svg>
      );
    default: // emblem
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="12" cy="9" r="2.4" fill="currentColor" />
          <rect x="20" y="19" width="22" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
        </svg>
      );
  }
}

export function Wizard({ wizard, dispatch }) {
  const set = (patch) => dispatch({ type: 'WIZARD', patch });
  const canGenerate = (wizard.name || '').trim().length > 0;

  return (
    <div className="space-y-5 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 sm:p-5">
      <Section step="1" title="Brand Name">
        <div className="relative">
          <input
            value={wizard.name}
            onChange={(e) => set({ name: e.target.value.slice(0, 24) })}
            placeholder="Your brand name"
            maxLength={24}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 pr-14 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] tabular-nums ${wizard.name.length > 20 ? 'text-amber-400' : 'text-slate-500'}`}>
            {wizard.name.length}/24
          </span>
        </div>
      </Section>

      <Section step="2" title="Slogan / Tagline (optional)">
        <input
          value={wizard.tagline}
          onChange={(e) => set({ tagline: e.target.value.slice(0, 32) })}
          placeholder="e.g. digital craft co."
          maxLength={32}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      </Section>

      <Section step="3" title="Business Niche">
        <div className="grid grid-cols-2 gap-2">
          {NICHES.map((n) => {
            const Icon = NICHE_ICONS[n.id];
            const sel = wizard.niche === n.id;
            return (
              <button
                key={n.id}
                onClick={() => set({ niche: n.id })}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] leading-tight transition ${
                  sel ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300' : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {n.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section step="4" title="Brand Personality">
        <div className="flex flex-wrap gap-2">
          {PERSONALITIES.map((p) => {
            const Icon = PERSONALITY_ICONS[p.id];
            const sel = wizard.personality === p.id;
            return (
              <button
                key={p.id}
                onClick={() => set({ personality: p.id })}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                  sel ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300' : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {p.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section step="5" title="Color Mood">
        <div className="grid grid-cols-3 gap-2">
          {PALETTES.map((p) => {
            const sel = wizard.paletteId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => set({ paletteId: p.id })}
                title={p.label}
                className={`rounded-lg border p-2 text-left transition ${
                  sel ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                }`}
              >
                <div className="flex gap-1">
                  <span className="h-4 w-4 rounded-full" style={{ background: p.icon }} />
                  <span className="h-4 w-4 rounded-full" style={{ background: p.title }} />
                  <span className="h-4 w-4 rounded-full border border-slate-600" style={{ background: p.bg }} />
                </div>
                <span className="mt-1 block truncate text-[10px] text-slate-400">{p.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => set({ paletteId: 'custom' })}
            className={`rounded-lg border p-2 text-left transition ${
              wizard.paletteId === 'custom' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
            }`}
          >
            <div className="flex gap-1">
              <span className="h-4 w-4 rounded-full" style={{ background: wizard.custom.icon }} />
              <span className="h-4 w-4 rounded-full" style={{ background: wizard.custom.title }} />
              <span className="h-4 w-4 rounded-full border border-slate-600" style={{ background: wizard.custom.bg }} />
            </div>
            <span className="mt-1 block text-[10px] text-slate-400">Custom Hex</span>
          </button>
        </div>

        {wizard.paletteId === 'custom' && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {['icon', 'title', 'tag', 'bg'].map((k) => (
              <label key={k} className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 text-[11px] text-slate-300 capitalize">
                {k}
                <input
                  type="color"
                  value={wizard.custom[k]}
                  onChange={(e) => set({ custom: { ...wizard.custom, [k]: e.target.value } })}
                  className="h-7 w-10 cursor-pointer rounded border border-slate-700 bg-transparent"
                />
              </label>
            ))}
          </div>
        )}
      </Section>

      <Section step="6" title="Layout Archetype">
        <div className="grid grid-cols-1 gap-2">
          {LAYOUTS.map((l) => {
            const sel = wizard.layout === l.id;
            return (
              <button
                key={l.id}
                onClick={() => set({ layout: l.id })}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition ${
                  sel ? 'border-indigo-500 bg-indigo-500/15' : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                }`}
              >
                <span className={`rounded p-1 ${sel ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                  <LayoutGlyph id={l.id} />
                </span>
                <span className={`text-xs ${sel ? 'text-indigo-300' : 'text-slate-300'}`}>{l.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <button
        onClick={() => dispatch({ type: 'GENERATE' })}
        disabled={!canGenerate}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <GenerateIcon className="h-4 w-4" />
        Generate Concepts
      </button>
      {!canGenerate && <p className="text-center text-[11px] text-slate-500">Enter a brand name to generate</p>}
    </div>
  );
}
