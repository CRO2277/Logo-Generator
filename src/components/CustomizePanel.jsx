import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { FONTS } from '../data/brand';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-slate-400">{label}</span>
      {children}
    </label>
  );
}

const selectCls =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none';

export function CustomizePanel({ concept, dispatch }) {
  if (!concept) {
    return <p className="p-4 text-sm text-slate-500">Generate concepts to customize.</p>;
  }
  const upd = (patch) => dispatch({ type: 'UPDATE_CONCEPT', id: concept.id, patch });
  const titleFont = FONTS.find((f) => f.id === concept.titleFont) || FONTS[0];
  const tagFont = FONTS.find((f) => f.id === concept.tagFont) || FONTS[0];

  const onTitleFont = (id) => {
    const nf = FONTS.find((f) => f.id === id);
    const weight = nf && !nf.weights.includes(concept.titleWeight)
      ? nf.weights[Math.min(nf.weights.length - 1, 2)]
      : concept.titleWeight;
    upd({ titleFont: id, titleWeight: weight });
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {/* Text */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Text</h4>
        <Field label="Brand name">
          <input
            value={concept.name}
            onChange={(e) => upd({ name: e.target.value.slice(0, 24) })}
            maxLength={24}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
        </Field>
        <Field label="Tagline">
          <input
            value={concept.tagline}
            onChange={(e) => upd({ tagline: e.target.value.slice(0, 32) })}
            maxLength={32}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
        </Field>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-[11px] text-slate-400">
            <input type="checkbox" checked={concept.uppercase} onChange={(e) => upd({ uppercase: e.target.checked })} className="accent-indigo-500" />
            Uppercase name
          </label>
        </div>
        <Field label="Alignment">
          <div className="flex gap-1.5">
            {[
              { id: 'left', Icon: AlignLeft },
              { id: 'center', Icon: AlignCenter },
              { id: 'right', Icon: AlignRight },
            ].map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => upd({ align: id })}
                className={`rounded-lg border p-2 transition ${
                  concept.align === id ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300' : 'border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Typography</h4>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Title font">
            <select value={concept.titleFont} onChange={(e) => onTitleFont(e.target.value)} className={selectCls}>
              {FONTS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Title weight">
            <select value={concept.titleWeight} onChange={(e) => upd({ titleWeight: Number(e.target.value) })} className={selectCls}>
              {titleFont.weights.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </Field>
          <Field label="Tagline font">
            <select value={concept.tagFont} onChange={(e) => upd({ tagFont: e.target.value })} className={selectCls}>
              {FONTS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Tagline weight">
            <select value={concept.tagWeight} onChange={(e) => upd({ tagWeight: Number(e.target.value) })} className={selectCls}>
              {tagFont.weights.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label={`Letter-spacing (tracking): ${concept.trackEm.toFixed(2)}em`}>
          <input
            type="range"
            min={-0.05}
            max={0.3}
            step={0.01}
            value={concept.trackEm}
            onChange={(e) => upd({ trackEm: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label={`Icon scale: ${Math.round(concept.iconScale * 100)}%`}>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={concept.iconScale}
              onChange={(e) => upd({ iconScale: Number(e.target.value) })}
              className="w-full"
            />
          </Field>
          <Field label={`Icon-to-text gap: ${Math.round(concept.gap * 100)}%`}>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={concept.gap}
              onChange={(e) => upd({ gap: Number(e.target.value) })}
              className="w-full"
            />
          </Field>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3 sm:col-span-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Colors</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { k: 'icon', label: 'Mark' },
            { k: 'title', label: 'Title' },
            { k: 'tag', label: 'Tagline' },
            { k: 'bg', label: 'Background' },
          ].map(({ k, label }) => (
            <label key={k} className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2">
              <span className="text-[11px] text-slate-300">{label}</span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-500">{(concept.colors?.[k] || '').toUpperCase()}</span>
                <input
                  type="color"
                  value={concept.colors?.[k] || '#000000'}
                  onChange={(e) => upd({ colors: { ...concept.colors, [k]: e.target.value } })}
                  className="h-7 w-10 cursor-pointer rounded border border-slate-700 bg-transparent"
                />
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
