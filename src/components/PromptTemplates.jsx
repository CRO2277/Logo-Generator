import { Bookmark, Trash2, Wand2 } from 'lucide-react';

// Brand-agnostic prompt templates: saved prompts have the current brand name
// and tagline swapped for {name} / {tagline} tokens so they can be reused for
// any future brand.
export function tokenize(prompt, name, tagline) {
  let p = prompt;
  if (name) p = p.split(name).join('{name}');
  if (tagline) p = p.split(tagline).join('{tagline}');
  return p;
}

export function hydrate(template, name, tagline) {
  return template.split('{name}').join(name).split('{tagline}').join(tagline);
}

export function PromptTemplatesGallery({ templates, onUse, onDelete }) {
  if (!templates.length) {
    return (
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-6 text-center">
        <Bookmark className="mx-auto h-6 w-6 text-slate-600" />
        <h3 className="mt-2 text-[12px] font-semibold text-slate-200">No saved templates yet</h3>
        <p className="mx-auto mt-1 max-w-xs text-[10px] text-slate-400">
          Compose a prompt in the Prompt Composer, then hit "Save template" to keep a winning style on file for future
          brands.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {templates.map((t) => (
        <div key={t.id} className="flex flex-col rounded-2xl border border-slate-700/60 bg-slate-800/60 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[12px] font-semibold text-slate-100">{t.name}</h3>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{t.model}</span>
            </div>
            <button
              onClick={() => onDelete(t.id)}
              aria-label={`Delete template ${t.name}`}
              title="Delete template"
              className="shrink-0 rounded p-1 text-slate-500 transition hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 line-clamp-3 font-mono text-[10px] leading-relaxed text-slate-400">{t.prompt}</p>
          <button
            onClick={() => onUse(t)}
            className="mt-3 flex items-center justify-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-200 transition hover:border-indigo-500 hover:text-indigo-300"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Use with current brand
          </button>
        </div>
      ))}
    </div>
  );
}
