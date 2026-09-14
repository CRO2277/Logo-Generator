import { Smartphone, CreditCard, Globe, Shirt, ShoppingBag, AtSign } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { ICONS } from '../data/brand';
import { contrastText } from '../lib/color';

const TEE_PATH = 'M70 25 L92 14 Q100 26 108 14 L130 25 L162 50 L139 68 L139 176 Q100 186 61 176 L61 68 L38 50 Z';

function MockupCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="flex items-center justify-center overflow-hidden rounded-lg bg-slate-950/40 p-4">{children}</div>
    </div>
  );
}

export function Mockups({ concept }) {
  const icon = ICONS.find((i) => i.id === concept.icon) || ICONS[0];
  const markContrast = contrastText(concept.colors?.icon || '#4F46E5');

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <MockupCard icon={Smartphone} title="App Icon / Favicon">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl shadow-lg"
          style={{ background: concept.colors?.icon || '#4F46E5' }}
        >
          <svg viewBox="0 0 24 24" className="h-12 w-12">
            <path d={icon.d} fill={markContrast} fillRule={icon.fr || 'nonzero'} />
          </svg>
        </div>
      </MockupCard>

      <MockupCard icon={CreditCard} title="Business Card">
        <div
          className="flex w-72 max-w-full items-center justify-between gap-3 rounded-xl border border-slate-200/20 p-4 shadow-lg"
          style={{ background: concept.colors?.bg || '#fff' }}
        >
          <div className="min-w-0 flex-1">
            <LogoMark concept={concept} />
          </div>
          <div className="shrink-0 text-right font-mono text-[9px] leading-relaxed" style={{ color: concept.colors?.tag || '#64748B' }}>
            <div style={{ color: concept.colors?.title || '#0F172A' }}>{concept.name}</div>
            <div>hello@{(concept.name || 'brand').toLowerCase().replace(/[^a-z0-9]/g, '')}.com</div>
            <div>+1 (555) 010-0100</div>
          </div>
        </div>
      </MockupCard>

      <MockupCard icon={Globe} title="Website Navigation">
        <div
          className="flex w-full max-w-md items-center justify-between rounded-lg border border-slate-200/20 px-4 py-2.5 shadow"
          style={{ background: concept.colors?.bg || '#fff' }}
        >
          <div className="w-28">
            <LogoMark concept={concept} />
          </div>
          <div className="flex gap-3 text-[10px]" style={{ color: concept.colors?.tag || '#64748B' }}>
            <span>About</span>
            <span>Services</span>
            <span>Contact</span>
          </div>
        </div>
      </MockupCard>

      <MockupCard icon={AtSign} title="Social Avatar">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full ring-4 ring-slate-700/60"
          style={{ background: concept.colors?.icon || '#4F46E5' }}
        >
          <svg viewBox="0 0 24 24" className="h-12 w-12">
            <path d={icon.d} fill={markContrast} fillRule={icon.fr || 'nonzero'} />
          </svg>
        </div>
      </MockupCard>

      <MockupCard icon={Shirt} title="T-Shirt">
        <div className="relative w-40">
          <svg viewBox="0 0 200 200" className="w-full">
            <path d={TEE_PATH} fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="absolute inset-x-0 top-[28%] mx-auto w-1/2">
            <LogoMark concept={concept} />
          </div>
        </div>
      </MockupCard>

      <MockupCard icon={ShoppingBag} title="Tote Bag">
        <div className="relative w-36">
          <svg viewBox="0 0 200 200" className="w-full">
            <path d="M75 58 C75 26 125 26 125 58" fill="none" stroke="#94A3B8" strokeWidth="4" vectorEffect="non-scaling-stroke" />
            <rect x="62" y="58" width="76" height="102" rx="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="absolute inset-x-0 top-[45%] mx-auto w-3/5">
            <LogoMark concept={concept} />
          </div>
        </div>
      </MockupCard>
    </div>
  );
}
