import { useEffect, useMemo, useState } from 'react';
import { Controls } from './components/Controls';
import { LogoMark } from './components/LogoMark';
import { makeVariants, randomCfg } from './lib/variants';
import { downloadPng, downloadSvg } from './lib/export';

const DEFAULT_CFG = {
  name: 'Aurora Labs',
  tagline: 'design tools',
  icon: 'sparkle',
  palette: 'indigo',
  font: 'grotesk',
  layout: 'icon-left',
  uppercase: true,
};
const STORAGE_KEY = 'logoforge:cfg';

function loadCfg() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return { ...DEFAULT_CFG, ...JSON.parse(s) };
  } catch {
    /* ignore */
  }
  return DEFAULT_CFG;
}

const BOLT = 'M13 2 L4.5 13.5 L10.6 13.5 L10 22 L19.5 10.5 L13.4 10.5 Z';

export default function App() {
  const [cfg, setCfg] = useState(loadCfg);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch {
      /* ignore */
    }
  }, [cfg]);

  const set = (patch) => setCfg((c) => ({ ...c, ...patch }));
  const variants = useMemo(() => makeVariants(cfg), [cfg]);

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <svg className="brand-icon" viewBox="0 0 24 24">
            <path d={BOLT} fill="#818CF8" />
          </svg>
          <h1>LogoForge</h1>
        </div>
        <p className="tagline-sub">
          Craft a logo for your brand — pick a style, tune every detail, download SVG or PNG.
        </p>
      </header>

      <main className="layout">
        <Controls cfg={cfg} set={set} />

        <section className="stage">
          <div className="preview-card">
            <div className="preview-toolbar">
              <div className="seg" role="group" aria-label="Preview background">
                <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>
                  Light
                </button>
                <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>
                  Dark
                </button>
              </div>
              <div className="actions">
                <button className="btn ghost" onClick={() => setCfg(randomCfg(cfg))}>
                  ⟳ Shuffle
                </button>
                <button className="btn" onClick={() => downloadSvg(cfg, theme)}>
                  Download SVG
                </button>
                <button className="btn primary" onClick={() => downloadPng(cfg, theme)}>
                  Download PNG
                </button>
              </div>
            </div>
            <div className={`surface ${theme}`}>
              <LogoMark cfg={cfg} theme={theme} />
            </div>
          </div>

          <div className="variants">
            <h3>Variations — tap to apply</h3>
            <div className="variant-row">
              {variants.map((v, i) => (
                <button key={i} className="variant" onClick={() => setCfg(v)} aria-label="Apply variation">
                  <LogoMark cfg={v} theme="light" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        Everything renders locally in your browser — no account, no uploads.
      </footer>
    </div>
  );
}
