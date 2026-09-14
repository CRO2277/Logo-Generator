import { useMemo, useRef, useState } from 'react';
import { Brain, Copy, Check, AlertTriangle, Route, Wand2, Loader2, Download, RefreshCw } from 'lucide-react';
import { FONTS } from '../data/brand';
import { saveBlob, slug } from '../lib/export';

// Keyless in-app generation engines (Pollinations) — ranked by text accuracy.
const ENGINES = {
  nano: { label: 'Nano Banana Pro', model: 'nanobanana-v2', note: 'best text accuracy, keyless' },
  gpt: { label: 'GPT Image', model: 'gptimage', note: 'short strings' },
  flux: { label: 'Flux', model: 'flux', note: 'fastest' },
};

const MODELS = {
  ideogram: { name: 'Ideogram 3.0 / 4.0', accuracy: '~90–95% wordmark accuracy', accent: '#4F46E5' },
  recraft: { name: 'Recraft V3 / V4', accuracy: 'Excellent, inconsistent on long strings', accent: '#06B6D4' },
  gpt: { name: 'GPT Image 2', accuracy: 'Excellent, especially short strings', accent: '#F59E0B' },
  seedream: { name: 'Seedream 4.5', accuracy: 'Highest raw text score (4.93)', accent: '#10B981' },
  nano: { name: 'Nano Banana / Pro', accuracy: 'Good, conversational refinement', accent: '#F472B6' },
};

const MATRIX = [
  ['Ideogram 3.0/4.0', '~90–95%', 'Wordmarks, stylized/script lettering, kerning control', 'Text-heavy logos, wordmarks, lettermarks'],
  ['Recraft V3/V4', 'Excellent, inconsistent on long strings', 'Vector output, brand consistency, font weight/kerning precision', 'Design-oriented brand systems needing SVG'],
  ['GPT Image 2', 'Excellent, especially short strings', 'Strong instruction-following, clean typography in ChatGPT', 'Quick single-word or product-name logos'],
  ['Seedream 4.5', 'Highest raw text score (4.93)', 'Non-Latin scripts, broad prompt types', 'Multilingual or international branding'],
  ['Nano Banana / Pro', 'Good, conversational refinement', 'Fast iteration, multi-image fusion, free tier', 'Rapid concept exploration'],
];

const TASKS = [
  {
    id: 'wordmark',
    label: 'Wordmark / lettermark',
    model: 'ideogram',
    why: 'Ideogram owns wordmark and lettermark logos outright — no other model competes when the brand name itself is the primary visual element. Text is a first-class design element with layout-aware prompt expansion, and it handles multi-line text, script lettering and hand-drawn type best.',
  },
  {
    id: 'vector',
    label: 'Vector SVG output',
    model: 'recraft',
    why: 'Recraft is the strongest pick when the deliverable must be an editable vector. It respects font weight, kerning and alignment like an actual design tool, and is the only major model with open weights for self-hosting.',
  },
  {
    id: 'short',
    label: 'Short label / product name',
    model: 'gpt',
    why: 'GPT Image 2 benefits from strong instruction-following and does well on a single word or product name — accuracy drops on longer or heavily stylized text.',
  },
  {
    id: 'multilingual',
    label: 'Multilingual / non-Latin',
    model: 'seedream',
    why: 'Seedream 4.5 posts the highest raw text score (4.93) and handles non-Latin scripts and broad prompt types — the pick for international branding.',
  },
  {
    id: 'explore',
    label: 'Rapid exploration',
    model: 'nano',
    why: 'Nano Banana trades peak accuracy for speed and conversational editing — generate and refine back-and-forth in seconds before committing to a final vectorized version.',
  },
];

const TIPS = {
  ideogram: 'Put the exact strings in quotes and use the "Design" style mode — quoted text renders at ~90–95% accuracy and prompts expand layout-aware.',
  recraft: 'Vector mode is the strength, but text is less reliable than Ideogram\'s raster — keep strings short, or vectorize an already-approved raster wordmark.',
  gpt: 'Best on short strings: a single word or product name. Longer stylized text degrades quickly.',
  seedream: 'Strongest raw text score (4.93) — ideal for non-Latin scripts and international brand variants.',
  nano: 'Refine conversationally: generate, then ask for tweaks in seconds. Explore here, vectorize the winner later.',
};

function buildPrompt(modelId, concept) {
  const name = concept?.name || 'Brand';
  const tag = concept?.tagline || 'tagline';
  const c = concept?.colors || {};
  const tf = FONTS.find((f) => f.id === concept?.titleFont);
  const gf = FONTS.find((f) => f.id === concept?.tagFont);
  const font = `${tf?.label || 'Inter'} ${concept?.titleWeight || 700}`;
  const caps = concept?.uppercase !== false ? 'all caps, ' : '';
  const track = `${(concept?.trackEm ?? 0.1).toFixed(2)}em tracking`;
  const common = `Brand mark color ${c.icon || '#4F46E5'} on a ${c.bg || '#F8FAFC'} background. Flat vector aesthetic, centered lockup, generous negative space.`;

  switch (modelId) {
    case 'ideogram':
      return `Logo design for "${name}". Render the exact text "${name}" as the wordmark — the primary visual element — set in ${font}, ${caps}${track}, color ${c.title || '#0F172A'}. Below it, the exact text "${tag}" in ${gf?.label || 'Inter'} ${concept?.tagWeight || 600}, 0.22em tracking, color ${c.tag || '#64748B'}. ${common}`;
    case 'recraft':
      return `Vector logo (SVG output) for "${name}". Wordmark "${name}" in ${font}, ${caps}${track}, color ${c.title || '#0F172A'}. Tagline "${tag}" in smaller type beneath. ${common} Respect font weight and kerning precisely.`;
    case 'gpt':
      return `A minimal logo for "${name}". The single word "${name}" is the entire mark, set in ${font}, color ${c.title || '#0F172A'}, clean typography, perfectly legible. Keep the tagline "${tag}" small and secondary. ${common}`;
    case 'seedream':
      return `Logo for "${name}" with exact text rendering: "${name}" as the wordmark in ${font}, ${caps}${track}, with "${tag}" as a small tagline beneath. ${common}`;
    default:
      return `Logo concept for "${name}": wordmark "${name}" in ${font}, ${caps}${track}, with tagline "${tag}". ${common} Simple exploration pass — refine conversationally.`;
  }
}

export function AiAdvisor({ concept }) {
  const [taskId, setTaskId] = useState('wordmark');
  const [modelId, setModelId] = useState('ideogram');
  const [copied, setCopied] = useState(''); // '' | 'copied' | 'manual'
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [engine, setEngine] = useState('nano');
  const promptRef = useRef(null);

  const task = TASKS.find((t) => t.id === taskId);
  const prompt = useMemo(() => buildPrompt(modelId, concept), [modelId, concept]);

  const pickTask = (id) => {
    setTaskId(id);
    setModelId(TASKS.find((t) => t.id === id).model);
    setCopied('');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied('copied');
    } catch {
      // clipboard API unavailable (e.g. embedded frame) — select for manual copy
      promptRef.current?.focus();
      promptRef.current?.select();
      setCopied('manual');
    }
    setTimeout(() => setCopied(''), 2500);
  };

  // Free, keyless generation via Pollinations — no account, no API key.
  // Typographic-accuracy suffix steers every engine toward exact quoted spelling.
  const generate = () => {
    setFailed(false);
    setLoading(true);
    const typographySuffix =
      ' The text must be spelled exactly as quoted — clean, legible, professionally kerned typography with no misspelled or invented characters.';
    setImgUrl(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + typographySuffix)}?width=1024&height=1024&nologo=true&model=${ENGINES[engine].model}&seed=${Math.floor(Math.random() * 1e6)}`
    );
  };

  const downloadPreview = async () => {
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      saveBlob(blob, `${slug(concept?.name || 'brand')}-ai-preview.png`);
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className="space-y-5" data-tour="ai-advisor">
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-100">
          <Brain className="h-4 w-4 text-indigo-400" />
          AI Model Advisor
        </h2>
        <p className="mt-1 text-[11px] text-slate-400">
          The working consensus on which image model to use for which logo job — with a prompt composer tuned to the
          model you pick.
        </p>
      </div>

      {/* Task → model recommender */}
      <div className="flex flex-wrap gap-2">
        {TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => pickTask(t.id)}
            className={`rounded-lg border px-3 py-1.5 text-[11px] transition ${
              task.id === t.id
                ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                : 'border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4"
        style={{ boxShadow: `inset 3px 0 0 ${MODELS[task.model].accent}` }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-display text-sm font-bold tracking-tight text-slate-50">
            {MODELS[task.model].name}
          </span>
          <span className="font-mono text-[10px] tracking-wider text-slate-400">{MODELS[task.model].accuracy}</span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-300">{task.why}</p>
      </div>

      {/* Prompt composer */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Prompt Composer</h3>
          <select
            value={modelId}
            onChange={(e) => {
              setModelId(e.target.value);
              setCopied('');
            }}
            className="rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 font-mono text-[10px] text-slate-300 focus:border-indigo-500 focus:outline-none"
          >
            {Object.entries(MODELS).map(([id, m]) => (
              <option key={id} value={id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          ref={promptRef}
          readOnly
          value={prompt}
          rows={5}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/70 p-3 font-mono text-[11px] leading-relaxed text-slate-200 focus:border-indigo-500 focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="max-w-[60%] text-[10px] leading-relaxed text-amber-300/90">{TIPS[modelId]}</p>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              title="In-app generation engine"
              className="rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 font-mono text-[10px] text-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="nano">Nano Banana Pro · best text</option>
              <option value="gpt">GPT Image · short strings</option>
              <option value="flux">Flux · fastest</option>
            </select>
            <button
              onClick={generate}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:from-indigo-400 hover:to-cyan-400 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
              {loading ? 'Rendering…' : 'Generate free preview'}
            </button>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 transition hover:border-slate-500"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === 'copied' ? 'Copied' : copied === 'manual' ? 'Selected — ⌘/Ctrl+C' : 'Copy prompt'}
            </button>
          </div>
        </div>

        {imgUrl && (
          <div className="mt-4 space-y-2">
            <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-950/70">
              {loading && (
                <div className="flex aspect-square items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                  <span className="font-mono text-[10px] tracking-wider text-slate-400">
                    {ENGINES[engine].label} is rendering your concept…
                  </span>
                </div>
              )}
              <img
                src={imgUrl}
                alt="AI-generated logo concept preview"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setFailed(true);
                }}
                className={`w-full ${loading ? 'hidden' : ''}`}
              />
            </div>
            {failed ? (
              <p className="text-[10px] text-rose-400">
                The free renderer didn't respond — try again, or copy the prompt into Ideogram's free web app.
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={downloadPreview}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 transition hover:border-slate-500"
                >
                  <Download className="h-3.5 w-3.5" />
                  PNG
                </button>
                <button
                  onClick={generate}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 transition hover:border-slate-500 disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              </div>
            )}
            <p className="text-[10px] leading-relaxed text-slate-500">
              Free raster preview via {ENGINES[engine].label} (Pollinations) — no key or account needed. For ~90–95%
              wordmark spelling accuracy, take the prompt to Ideogram's free web app, then vectorize the winner with
              Recraft.
            </p>
          </div>
        )}
      </div>

      {/* Model matrix */}
      <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-700/60 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                <th className="p-3">Model</th>
                <th className="p-3">Text Accuracy</th>
                <th className="p-3">Strengths for Logos</th>
                <th className="p-3">Best Use Case</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row[0]} className="border-b border-slate-700/30 last:border-0">
                  <td className="p-3 font-semibold text-slate-100">{row[0]}</td>
                  <td className="p-3 font-mono text-[10px] text-slate-300">{row[1]}</td>
                  <td className="p-3 text-slate-300">{row[2]}</td>
                  <td className="p-3 text-slate-400">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workflow */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          <Route className="h-4 w-4 text-cyan-400" />
          The recommended workflow
        </h3>
        <ol className="space-y-3">
          {[
            {
              n: '1',
              t: 'Generate the wordmark with Ideogram',
              d: 'It gets the brand name spelled correctly most reliably — start there, in Design style mode.',
            },
            {
              n: '2',
              t: 'Vectorize with Recraft (or Illustrator Image Trace)',
              d: 'Run the approved raster through Recraft\'s vectorizer for an editable SVG that works across web and print.',
            },
          ].map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 font-mono text-[10px] font-bold text-indigo-300">
                {s.n}
              </span>
              <div>
                <div className="text-[11px] font-semibold text-slate-100">{s.t}</div>
                <div className="text-[10px] text-slate-400">{s.d}</div>
              </div>
            </li>
          ))}
          <li className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 font-mono text-[10px] font-bold text-amber-300">
              3
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-100">
                <AlertTriangle className="h-3 w-3 text-amber-400" />
                Zoom in and verify every character
              </div>
              <div className="text-[10px] text-slate-400">
                Even the leading models still make occasional errors — a manual check pass is recommended regardless of
                which tool you use.
              </div>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
