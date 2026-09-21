import { useState } from 'react';

type MType = 'rel' | 'abs' | 'diff';

const MTYPES: { id: MType; label: string; sub: string }[] = [
  { id: 'rel', label: 'SOBREPRESIÓN', sub: 'Mide contra la presión atmosférica (~101 kPa). La del manómetro de tu inflador.' },
  { id: 'abs', label: 'PRESIÓN ABSOLUTA', sub: 'Mide contra el vacío total. Es la presión real del fluido, sin restar la atmósfera.' },
  { id: 'diff', label: 'PRESIÓN DIFERENCIAL', sub: 'Mide la diferencia entre dos puntos. Suele usarse para caudal por caída de presión.' },
];

const P_MAX = 400;

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

const AX = { '--c': 'var(--ch-pres)' } as React.CSSProperties;

export default function PressureLab() {
  const [P, setP] = useState(150);
  const [type, setType] = useState<MType>('rel');
  const ang = 135 + (P / P_MAX) * 270;
  const absVal = P + 101.3;
  const diffOther = 60;

  const C = { x: 130, y: 128 };
  const r = 44 + (P / P_MAX) * 70;
  const s = 150, e = s + 120 + (P / P_MAX) * 190;

  const bPath = (rIn: number, rOut: number): string => {
    const [x1, y1] = polar(C.x, C.y, rOut, s);
    const [x2, y2] = polar(C.x, C.y, rOut, e);
    const [x3, y3] = polar(C.x, C.y, rIn, e);
    const [x4, y4] = polar(C.x, C.y, rIn, s);
    const large = e - s > 180 ? 1 : 0;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rOut} ${rOut} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} A ${rIn} ${rIn} 0 ${large} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z`;
  };

  const zones: { from: number; to: number; color: string }[] = [
    { from: 135, to: 220, color: 'rgba(255,176,32,.13)' },
    { from: 220, to: 345, color: 'rgba(61,220,132,.13)' },
    { from: 345, to: 405, color: 'rgba(255,90,60,.13)' },
  ];

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag">
        <span>BANCO 04 · PRESIÓN</span>
        <span>UNIT: kPa · RANGO 0–{P_MAX}</span>
      </div>
      <div className="panel-inner col" style={{ gap: 16 }}>

        <div className="row">
          {MTYPES.map((t) => (
            <button key={t.id} className={`btn ${type === t.id ? 'is-active' : ''}`} style={AX} onClick={() => setType(t.id)} aria-pressed={type === t.id}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="pressure-grid">
          <div className="sim-stage graticule col" style={{ padding: 16, alignItems: 'center', gap: 10 }}>
            <svg viewBox="0 0 260 170" style={{ width: 'min(300px,100%)', height: 'auto' }}>
              {zones.map((z) => {
                const arc = (rad: number, f: number, t: number) => {
                  const [x1, y1] = polar(130, 130, rad, f);
                  const [x2, y2] = polar(130, 130, rad, t);
                  const big = t - f > 180 ? 1 : 0;
                  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rad} ${rad} 0 ${big} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
                };
                return <path key={z.from} d={arc(92, z.from, z.to)} fill="none" stroke={z.color} strokeWidth="16" strokeLinecap="butt" />;
              })}
              {Array.from({ length: 11 }).map((_, i) => {
                const a = 135 + (i / 10) * 270;
                const [x1, y1] = polar(130, 130, 76, a);
                const [x2, y2] = polar(130, 130, 86, a);
                const [lx, ly] = polar(130, 130, 58, a);
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8fa3bc" strokeWidth="1.5" />
                    <text x={lx} y={ly + 3} textAnchor="middle" className="mono" style={{ fill: '#8fa3bc', fontSize: 9 }}>{i * 40}</text>
                  </g>
                );
              })}
              <text x="130" y="44" textAnchor="middle" className="mono" style={{ fill: '#8fa3bc', fontSize: 9, letterSpacing: '.2em' }}>kPa</text>
              <g style={{ transform: `translate(130px,130px) rotate(${ang}deg)`, transformOrigin: '0 0', transition: 'transform .4s cubic-bezier(.3,.8,.3,1)' }}>
                <line x1="0" y1="6" x2="0" y2="-78" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px rgba(56,189,248,.8))' }} />
                <circle cx="0" cy="0" r="7" fill="#0f1b30" stroke="#38bdf8" strokeWidth="2" />
              </g>
            </svg>
            <div className="row" style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div className="readout" style={{ ...AX, minWidth: 120 }}>
                <div className="lbl">{type === 'abs' ? 'PRESIÓN ABSOLUTA' : type === 'diff' ? 'PUERTO A' : 'SOBREPRESIÓN'}</div>
                <div className="val">{type === 'abs' ? absVal.toFixed(1) : P} kPa</div>
              </div>
              {type === 'abs' && (
                <div className="readout" style={{ ...AX, minWidth: 120 }}>
                  <div className="lbl">EQUIVALE A SOBREPRESIÓN</div>
                  <div className="val">{P} kPa</div>
                </div>
              )}
              {type === 'diff' && (
                <div className="readout" style={{ ...AX, minWidth: 120 }}>
                  <div className="lbl">PUERTO B (REF.) · ΔP</div>
                  <div className="val">{P - diffOther >= 0 ? `+${P - diffOther}` : P - diffOther} kPa</div>
                </div>
              )}
            </div>
          </div>

          <div className="sim-stage graticule col" style={{ padding: 16, alignItems: 'center', gap: 8 }}>
            <span className="mono-label" style={{ alignSelf: 'flex-start' }}>TUBO DE BOURDON · {P} kPa</span>
            <svg viewBox="0 0 260 200" style={{ width: 'min(300px,100%)', height: 'auto' }}>
              <line x1={C.x - 10} x2={C.x + 10} y1="168" y2="168" stroke="#22304a" strokeWidth="3" />
              <rect x={C.x - 9} y="150" width="18" height="20" fill="#0f1b30" stroke="#33465f" strokeWidth="1.5" />
              <path d={bPath(r, r + 13)} fill="#0f1b30" stroke="#38bdf8" strokeWidth="2" className="lamp-glow" style={{ transition: 'all .4s cubic-bezier(.3,.8,.3,1)', filter: `drop-shadow(0 0 ${4 + P / 80}px rgba(56,189,248,.5))` }} />
              {(() => { const [tx, ty] = polar(C.x, C.y, r + 13, e); return <circle cx={tx} cy={ty} r="3" fill="#38bdf8" className="lamp-glow" />; })()}
              <circle cx={C.x} cy={C.y} r="4" fill="#22304a" stroke="#33465f" strokeWidth="1.5" />
              <text x="14" y="192" className="mono" style={{ fill: '#8fa3bc', fontSize: 9 }}>LA PRESIÓN ENDEREZA EL TUBO →</text>
            </svg>
            <p className="mono-label" style={{ color: 'var(--ink-dim)', fontSize: 13, maxWidth: 36, textAlign: 'center' }}>
              El tubo curvo tiende a <b style={{ color: 'var(--ink)' }}>enderezarse</b> al subir la presión; ese movimiento acciona la aguja o una galga.
            </p>
          </div>
        </div>

        <div className="row">
          <input
            type="range" min="0" max={P_MAX} value={P}
            style={{ '--c': 'var(--ch-pres)', '--fill': `${(P / P_MAX) * 100}%`, flex: 1, minWidth: 220 } as React.CSSProperties}
            onChange={(e) => setP(Number(e.target.value))}
            aria-label="Presión"
          />
          <span className="chip">P = {P} kPa</span>
        </div>

        <p className="sim-note">
          <b>{MTYPES.find((t) => t.id === type)!.label}:</b> {MTYPES.find((t) => t.id === type)!.sub}
        </p>
      </div>
    </div>
  );
}
