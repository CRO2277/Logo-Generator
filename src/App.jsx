import { useEffect, useReducer } from 'react';
import { SlidersHorizontal, Monitor, Images } from 'lucide-react';
import { Wizard } from './components/Wizard';
import { Gallery } from './components/Gallery';
import { CanvasStage } from './components/CanvasStage';
import { ConceptGrid } from './components/ConceptGrid';
import { CustomizePanel } from './components/CustomizePanel';
import { Mockups } from './components/Mockups';
import { BrandKitModal } from './components/BrandKitModal';
import { StyleEditor } from './components/StyleEditor';
import { generateConcepts } from './lib/generate';
import { FONTS } from './data/brand';

const initialState = {
  wizard: {
    name: 'Nova Studio',
    tagline: 'digital craft',
    niche: 'creative',
    personality: 'minimal',
    paletteId: 'monochrome',
    layout: 'stacked',
    custom: { icon: '#6366F1', title: '#0F172A', tag: '#64748B', bg: '#F8FAFC' },
  },
  concepts: [],
  activeId: null,
  gallery: [],
  ui: { bg: 'brand', checker: false, innerTab: 'customize', mobileTab: 'design', kitOpen: false },
};

function reducer(state, action) {
  switch (action.type) {
    case 'WIZARD':
      return { ...state, wizard: { ...state.wizard, ...action.patch } };
    case 'GENERATE': {
      const concepts = generateConcepts(state.wizard);
      return { ...state, concepts, activeId: concepts[0].id };
    }
    case 'UPDATE_CONCEPT':
      return {
        ...state,
        concepts: state.concepts.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c)),
      };
    case 'SET_ACTIVE':
      return { ...state, activeId: action.id };
    case 'APPLY_STYLE': {
      const { titleFont, ...rest } = action.patch;
      return {
        ...state,
        concepts: state.concepts.map((c) => {
          const next = { ...c, ...rest };
          if (titleFont) {
            const f = FONTS.find((x) => x.id === titleFont);
            next.titleFont = titleFont;
            if (f && !f.weights.includes(next.titleWeight)) {
              next.titleWeight = f.weights[Math.min(f.weights.length - 1, 2)];
            }
          }
          return next;
        }),
      };
    }
    case 'SAVE_TO_GALLERY': {
      const c = action.concept;
      const exists = state.gallery.some((g) => g.id === c.id);
      return {
        ...state,
        gallery: exists ? state.gallery.filter((g) => g.id !== c.id) : [...state.gallery, c],
      };
    }
    case 'REMOVE_FROM_GALLERY':
      return { ...state, gallery: state.gallery.filter((g) => g.id !== action.id) };
    case 'UI':
      return { ...state, ui: { ...state.ui, ...action.patch } };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: 'GENERATE' });
  }, []);

  const active = state.concepts.find((c) => c.id === state.activeId) || null;
  const mt = state.ui.mobileTab;
  const galleryMode = mt === 'gallery';

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3.5 sm:px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 font-bold text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <text x="12" y="17.5" textAnchor="middle" fontSize="15" fontWeight="800" fontFamily="Inter, sans-serif" fill="currentColor">L</text>
            </svg>
          </span>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-100">
              LogoLegacy<span className="font-normal text-slate-500">.pro</span>
            </h1>
            <p className="hidden text-[11px] text-slate-400 sm:block">
              Logo & brand identity studio — free, instant, full-resolution files. No signup, no paywalls.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6">
        {/* Top-level tabs */}
        <div className="mb-4 flex gap-2">
          {[
            { id: 'design', label: 'Design', Icon: SlidersHorizontal },
            { id: 'studio', label: 'Studio', Icon: Monitor },
            { id: 'gallery', label: 'Gallery', Icon: Images },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => dispatch({ type: 'UI', patch: { mobileTab: id } })}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                mt === id
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                  : 'border-slate-700 bg-slate-800/60 text-slate-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {galleryMode ? (
          <Gallery concepts={state.gallery} dispatch={dispatch} />
        ) : (
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          {/* Wizard sidebar */}
          <aside
            className={`w-full shrink-0 ${mt === 'design' ? '' : 'hidden'} ${mt === 'gallery' ? '' : 'lg:block lg:w-[380px]'}`}
          >
            <Wizard wizard={state.wizard} dispatch={dispatch} />
          </aside>

          {/* Studio column */}
          <main
            className={`w-full min-w-0 flex-1 space-y-5 ${mt === 'studio' || mt === 'design' ? '' : 'hidden'} ${
              mt === 'gallery' ? '' : 'lg:block'
            }`}
          >
            {active && (
              <CanvasStage
                concept={active}
                ui={state.ui}
                dispatch={dispatch}
                saved={state.gallery.some((g) => g.id === active.id)}
              />
            )}
            <ConceptGrid
              concepts={state.concepts}
              activeId={state.activeId}
              dispatch={dispatch}
              savedIds={state.gallery.map((g) => g.id)}
            />
            {active && (
              <section className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
                <div className="mb-4 flex rounded-lg border border-slate-700 bg-slate-900/80 p-0.5">
                  {[
                    { id: 'customize', label: 'Customize' },
                    { id: 'style', label: 'Style Editor' },
                    { id: 'mockups', label: 'Mockups' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => dispatch({ type: 'UI', patch: { innerTab: t.id } })}
                      className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition ${
                        state.ui.innerTab === t.id ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {state.ui.innerTab === 'customize' ? (
                  <CustomizePanel concept={active} dispatch={dispatch} />
                ) : state.ui.innerTab === 'style' ? (
                  <StyleEditor concepts={state.concepts} activeId={state.activeId} dispatch={dispatch} />
                ) : (
                  <Mockups concept={active} />
                )}
              </section>
            )}
          </main>
        </div>
        )}
      </div>

      {state.ui.kitOpen && active && (
        <BrandKitModal concept={active} onClose={() => dispatch({ type: 'UI', patch: { kitOpen: false } })} />
      )}
    </div>
  );
}
