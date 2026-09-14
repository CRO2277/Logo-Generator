import { Type, Palette } from 'lucide-react';
import { FONTS, PALETTES } from '../data/brand';

function SectionTitle({ icon: Icon, children }) {
  return (
    <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </h4>
  );
}

export function StyleEditor({ concepts, activeId, dispatch }) {
  const active = concepts.find((c) => c.id === activeId);
  if (!active) {
    return <p className="text-sm text-slate-500">Generate concepts to style them.</p>;
  }
  const apply = (patch) => dispatch({ type: 'APPLY_STYLE', patch });

  const btnCls = (on) =>
    `rounded-xl border p-3 text-left transition ${
      on ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
    }`;

  return (
    <div className="space-y-6">
      <p className="text-[11px] text-slate-400">
        Every pick restyles all {concepts.length} concepts instantly — canvas, grid and mockups included.
      </p>

      <div>
        <SectionTitle icon={Type}>Title Typeface</SectionTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FONTS.map((f) => (
            <button key={f.id} onClick={() => apply({ titleFont: f.id })} className={btnCls(active.titleFont === f.id)}>
              <span className="block text-xl leading-tight text-slate-100" style={{ fontFamily: f.family, fontWeight: 700 }}>
                Aa
              </span>
              <span className="mt-0.5 block truncate text-[10px] text-slate-400">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle icon={Type}>Tagline Typeface</SectionTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FONTS.map((f) => (
            <button key={f.id} onClick={() => apply({ tagFont: f.id })} className={btnCls(active.tagFont === f.id)}>
              <span
                className="block text-xs uppercase tracking-widest text-slate-200"
                style={{ fontFamily: f.family, fontWeight: 600 }}
              >
                Aa tagline
              </span>
              <span className="mt-1 block truncate text-[10px] text-slate-400">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle icon={Palette}>Color Palette</SectionTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => apply({ colors: { icon: p.icon, title: p.title, tag: p.tag, bg: p.bg } })}
              className={btnCls(active.colors?.icon === p.icon && active.colors?.title === p.title)}
            >
              <div className="flex gap-1">
                <span className="h-4 w-4 rounded-full" style={{ background: p.icon }} />
                <span className="h-4 w-4 rounded-full" style={{ background: p.title }} />
                <span className="h-4 w-4 rounded-full" style={{ background: p.tag }} />
                <span className="h-4 w-4 rounded-full border border-slate-600" style={{ background: p.bg }} />
              </div>
              <span className="mt-1.5 block truncate text-[10px] text-slate-400">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
