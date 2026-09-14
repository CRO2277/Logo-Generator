import { Sparkles } from 'lucide-react';
import { LogoMark } from './LogoMark';

export function ConceptGrid({ concepts, activeId, dispatch }) {
  if (!concepts.length) return null;
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          6 Generated Concepts
        </h3>
        <button
          onClick={() => dispatch({ type: 'GENERATE' })}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Regenerate
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {concepts.map((c) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE', id: c.id })}
              aria-label={`Select concept ${c.layout}`}
              className={`flex min-h-[110px] items-center justify-center rounded-xl p-4 transition hover:-translate-y-0.5 ${
                active ? 'ring-2 ring-indigo-500' : 'ring-1 ring-slate-700 hover:ring-slate-500'
              }`}
              style={{ background: c.colors?.bg || '#fff' }}
            >
              <div className="w-full px-1">
                <LogoMark concept={c} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
