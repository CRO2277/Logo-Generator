import { Sparkles, Star } from 'lucide-react';
import { LogoMark } from './LogoMark';

export function ConceptGrid({ concepts, activeId, dispatch, savedIds = [] }) {
  if (!concepts.length) return null;
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4" data-tour="concept-grid">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          {concepts.length} Generated Concepts
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
          const saved = savedIds.includes(c.id);
          return (
            <div key={c.id} className="relative">
              <div
                role="button"
                tabIndex={0}
                aria-label={`Select concept ${c.layout}`}
                onClick={() => dispatch({ type: 'SET_ACTIVE', id: c.id })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') dispatch({ type: 'SET_ACTIVE', id: c.id });
                }}
                className={`flex min-h-[110px] w-full cursor-pointer items-center justify-center rounded-xl p-4 transition hover:-translate-y-0.5 ${
                  active ? 'ring-2 ring-indigo-500' : 'ring-1 ring-slate-700 hover:ring-slate-500'
                }`}
                style={{ background: c.colors?.bg || '#fff' }}
              >
                <div className="w-full px-1">
                  <LogoMark concept={c} />
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'SAVE_TO_GALLERY', concept: c })}
                title={saved ? 'Remove from gallery' : 'Save to gallery'}
                aria-label={saved ? `Remove concept ${c.layout} from gallery` : `Save concept ${c.layout} to gallery`}
                className={`absolute right-1.5 top-1.5 z-10 rounded-full p-1.5 shadow-md transition ${
                  saved ? 'bg-amber-400 text-slate-900' : 'bg-white/85 text-slate-600 hover:bg-white'
                }`}
              >
                <Star className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
