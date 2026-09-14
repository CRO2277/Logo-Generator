import { useEffect, useReducer, useState } from 'react';
import { SlidersHorizontal, Monitor, Images, Sparkles, FileDown, ZoomIn, ZoomOut, Brain, HelpCircle } from 'lucide-react';
import { LogoLegacyLockup } from './components/LogoLegacyMark';
import { AiAdvisor } from './components/AiAdvisor';
import { Tour } from './components/Tour';
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
  ui: { bg: 'obsidian', checker: false, grid: false, zoom: 1, innerTab: 'customize', mobileTab: 'design', kitOpen: false },
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
  const [tourOpen, setTourOpen] = useState(false);
  useEffect(() => {
    dispatch({ type: 'GENERATE' });
  }, []);
  useEffect(() => {
    try {
      if (!localStorage.getItem('logolegacy.tour-done')) {
        const t = setTimeout(() => setTourOpen(true), 1400);
        return () => clearTimeout(t);
      }
    } catch {
      /* private mode */
    }
  }, []);

  const active = state.concepts.find((c) => c.id === state.activeId) || null;
  const mt = state.ui.mobileTab;
  const galleryMode = mt === 'gallery';

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          {/* Left: brand lockup with live glow indicator */}
          <LogoLegacyLockup />

          {/* Center: engine status + canvas metrology */}
          <div className="hidden flex-1 items-center justify-center gap-3 lg:flex">
            <span className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 font-mono text-[10px] tracking-wider text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-glow" aria-hidden="true" />
              Vector Engine v2.4 · Ready
            </span>
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-700 bg-slate-900/80 px-1.5 py-1">
              <button
                onClick={() => dispatch({ type: 'UI', patch: { zoom: Math.max(0.5, Math.round((state.ui.zoom - 0.25) * 100) / 100) } })}
                aria-label="Zoom out"
                className="rounded p-1 text-slate-400 transition hover:text-slate-100"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="w-11 text-center font-mono text-[10px] text-slate-300">{Math.round(state.ui.zoom * 100)}%</span>
              <button
                onClick={() => dispatch({ type: 'UI', patch: { zoom: Math.min(2, Math.round((state.ui.zoom + 0.25) * 100) / 100) } })}
                aria-label="Zoom in"
                className="rounded p-1 text-slate-400 transition hover:text-slate-100"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Right: primary + secondary actions */}
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <button
              onClick={() => setTourOpen(true)}
              title="Guided tour"
              aria-label="Start guided tour"
              className="rounded-lg border border-slate-700 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-500 hover:text-slate-100"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => active && dispatch({ type: 'UI', patch: { kitOpen: true } })}
              disabled={!active}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 transition hover:border-slate-500 disabled:opacity-50"
            >
              <FileDown className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              data-tour="generate"
              onClick={() => {
                dispatch({ type: 'GENERATE' });
                dispatch({ type: 'UI', patch: { mobileTab: 'studio' } });
              }}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:from-indigo-400 hover:to-cyan-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Generate New Concept</span>
              <span className="sm:hidden">Generate</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6">
        {/* Top-level tabs */}
        <div className="mb-4 flex gap-2" data-tour="mode-tabs">
          {[
            { id: 'design', label: 'Design', Icon: SlidersHorizontal },
            { id: 'studio', label: 'Studio', Icon: Monitor },
            { id: 'gallery', label: 'Gallery', Icon: Images },
            { id: 'ai', label: 'AI Assist', Icon: Brain },
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
        ) : mt === 'ai' ? (
          <AiAdvisor concept={active} />
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

      {tourOpen && <Tour dispatch={dispatch} onClose={() => setTourOpen(false)} />}

      {state.ui.kitOpen && active && (
        <BrandKitModal concept={active} onClose={() => dispatch({ type: 'UI', patch: { kitOpen: false } })} />
      )}
    </div>
  );
}
