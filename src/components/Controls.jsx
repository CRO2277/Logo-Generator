import { ICONS, PALETTES, FONTS, PRESETS, LAYOUTS } from '../data/brand';

export function Controls({ cfg, set }) {
  return (
    <aside className="controls">
      <section className="panel">
        <h3>Brand</h3>
        <label className="field">
          <span>Name</span>
          <input
            value={cfg.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Aurora Labs"
            maxLength={24}
          />
        </label>
        <label className="field">
          <span>Tagline</span>
          <input
            value={cfg.tagline}
            onChange={(e) => set({ tagline: e.target.value })}
            placeholder="design tools"
            maxLength={32}
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={cfg.uppercase}
            onChange={(e) => set({ uppercase: e.target.checked })}
          />
          Uppercase name
        </label>
      </section>

      <section className="panel">
        <h3>Style</h3>
        <div className="chips">
          {PRESETS.map((p) => (
            <button key={p.id} className="chip" onClick={() => set(p.cfg)}>
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Layout</h3>
        <div className="chips">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              className={`chip ${cfg.layout === l.id ? 'sel' : ''}`}
              onClick={() => set({ layout: l.id })}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Icon</h3>
        <div className="icon-grid">
          {ICONS.map((ic) => (
            <button
              key={ic.id}
              title={ic.label}
              aria-label={ic.label}
              className={`icon-btn ${cfg.icon === ic.id ? 'sel' : ''}`}
              onClick={() => set({ icon: ic.id })}
            >
              <svg viewBox="0 0 24 24">
                <path d={ic.d} fill="currentColor" fillRule={ic.fr || 'nonzero'} />
              </svg>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Palette</h3>
        <div className="swatches">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              title={p.label}
              aria-label={p.label}
              className={`swatch ${cfg.palette === p.id ? 'sel' : ''}`}
              onClick={() => set({ palette: p.id })}
            >
              <span className="dot" style={{ background: p.primary }} />
              <span className="dot" style={{ background: p.secondary }} />
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Typeface</h3>
        <div className="font-grid">
          {FONTS.map((f) => (
            <button
              key={f.id}
              className={`font-btn ${cfg.font === f.id ? 'sel' : ''}`}
              style={{ fontFamily: f.family, fontWeight: f.weight }}
              onClick={() => set({ font: f.id })}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
