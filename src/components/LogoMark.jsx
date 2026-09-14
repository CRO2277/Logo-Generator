import { useEffect, useMemo, useState } from 'react';
import { layoutLogo } from '../lib/layout';

function Prim({ p }) {
  if (p.t === 'path') {
    return (
      <g transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
        <path d={p.d} fill={p.fill} fillRule={p.fr || 'nonzero'} />
      </g>
    );
  }
  if (p.t === 'rect') {
    return <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx} fill={p.fill} />;
  }
  return (
    <text
      x={p.x}
      y={p.y}
      textAnchor={p.anchor}
      fontFamily={p.family}
      fontSize={p.size}
      fontWeight={p.weight}
      fill={p.fill}
      letterSpacing={p.ls || 0}
    >
      {p.text}
    </text>
  );
}

// Renders the logo as an SVG using the shared geometry (same as exports).
export function LogoMark({ cfg, theme = 'light' }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) setTick((t) => t + 1); // re-measure once webfonts land
    });
    return () => {
      alive = false;
    };
  }, []);
  const { w, h, prims } = useMemo(() => layoutLogo(cfg, theme), [cfg, theme, tick]);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      style={{ maxWidth: '100%', height: 'auto' }}
      role="img"
      aria-label={`${cfg.name || 'Brand'} logo`}
    >
      {prims.map((p, i) => (
        <Prim key={i} p={p} />
      ))}
    </svg>
  );
}
