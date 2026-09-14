import { useEffect, useMemo, useState } from 'react';
import { Controls } from './components/Controls';
import { Gallery } from './components/Gallery';
import { LogoMark } from './components/LogoMark';
import { makeVariants, randomCfg } from './lib/variants';
import { downloadPng, downloadSvg } from './lib/export';
import { listSaved, saveToGallery, removeFromGallery } from './lib/gallery';

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
  const [gallery, setGallery] = useState(listSaved);
  const [savedFlash, setSavedFlash] = useState(false);
  const [view, setView] = useState(() =>
    window.location.hash === '#/gallery' ? 'gallery' : 'studio'
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch {
      /* ignore */
    }
  }, [cfg]);

  useEffect(() => {
    const onHash = () =>
      setView(window.location.hash === '#/gallery' ? 'gallery' : 'studio');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (v) => {
    window.location.hash = v === 'gallery' ? '#/gallery' : '#/';
    setView(v);
  };

  const set = (patch) => setCfg((c) => ({ ...c, ...patch }));
  const variants = useMemo(() => makeVariants(cfg), [cfg]);

  const handleSave = () => {
    const entry = saveToGallery(cfg);
    setGallery((g) => [entry, ...g]);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  const handleEdit = (item) => {
    setCfg({ ...DEFAULT_CFG, ...item.cfg });
    go('studio');
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    removeFromGallery(id);
    setGallery((g) => g.filter((i) => i.id !== id));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-row">
          <div className="brand">
            <svg className="brand-icon" viewBox="0 0 24 24">
              <path d={BOLT} fill="#818CF8" />
            </svg>
            <h1>LogoForge</h1>
          </div>
          <nav className="nav-tabs" aria-label="Sections">
            <button className={view === 'studio' ? 'on' : ''} onClick={() => go('studio')}>
              Studio
            </button>
            <button className={view === 'gallery' ? 'on' : ''} onClick={() => go('gallery')}>
              Gallery
              {gallery.length > 0 && <span className="badge">{gallery.length}</span>}
            </button>
          </nav>
        </div>
        <p className="tagline-sub">
          Craft a logo for your brand — pick a style, tune every detail, download SVG or PNG.
        </p>
      </header>

      {view === 'studio' ? (
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
                  <button className="btn ghost" onClick={handleSave}>
                    {savedFlash ? 'Saved ✓' : 'Save'}
                  </button>
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
      ) : (
        <main className="gallery-wrap">
          <Gallery items={gallery} onEdit={handleEdit} onDelete={handleDelete} />
        </main>
      )}

      <footer className="footer">
        Everything renders locally in your browser — no account, no uploads.
      </footer>
    </div>
  );
}
