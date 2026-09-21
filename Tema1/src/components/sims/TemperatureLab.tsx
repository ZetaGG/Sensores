import { useEffect, useState } from 'react';

type Tab = 'rtd' | 'ntc' | 'ptc' | 'tc';

const TABS: { id: Tab; label: string; sub: string; rango: string; min: number; max: number }[] = [
  { id: 'rtd', label: 'RTD · Pt100', sub: 'Resistencia de platino, casi lineal, precisa hasta 850 °C', rango: '-50 … 850 °C', min: -50, max: 850 },
  { id: 'ntc', label: 'TERMISTOR NTC', sub: 'Semiconductor: su resistencia BAJA al calentar', rango: '0 … 300 °C', min: 0, max: 300 },
  { id: 'ptc', label: 'TERMISTOR PTC', sub: 'Semiconductor: su resistencia SUBE al calentar', rango: '0 … 300 °C', min: 0, max: 300 },
  { id: 'tc', label: 'TERMOPAR', sub: 'Dos metales unidos: generan voltaje por efecto Seebeck', rango: '-200 … 1200 °C', min: -200, max: 1200 },
];

function rt(T: number) { return 100 * (1 + 0.00385 * T); }
function rntc(T: number) { return 10000 * Math.exp(3950 * (1 / (T + 273.15) - 1 / 298.15)); }
function rptc(T: number) { return 100 + 85 * Math.max(0, T); }
function vtc(T: number) { return 41e-6 * T; }

function curve(tab: Tab, T: number): { y: number; label: string } {
  switch (tab) {
    case 'rtd': return { y: rt(T), label: 'Ω' };
    case 'ntc': return { y: rntc(T), label: 'Ω' };
    case 'ptc': return { y: rptc(T), label: 'Ω' };
    case 'tc': return { y: vtc(T), label: 'mV' };
  }
}

function fmt(v: number, label: string) {
  if (label === 'mV') return (v * 1000).toFixed(2) + ' mV';
  if (v >= 10000) return (v / 1000).toFixed(1) + ' kΩ';
  if (v >= 1000) return v.toFixed(0) + ' Ω';
  return v.toFixed(1) + ' Ω';
}

function rangeFor(tab: Tab): [number, number] {
  const config = TABS.find((item) => item.id === tab)!;
  return [config.min, config.max];
}

function pointsFor(tab: Tab): [number, number][] {
  const [a, b] = rangeFor(tab);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const T = a + ((b - a) * i) / 60;
    const raw = curve(tab, T).y;
    const y = curve(tab, 20).label === 'mV' ? raw : Math.log10(raw + 1);
    pts.push([T, y]);
  }
  const ymin = Math.min(...pts.map((p) => p[1]));
  const ymax = Math.max(...pts.map((p) => p[1]));
  return pts.map(([T, y]) => [T, (y - ymin) / (ymax - ymin || 1)] as [number, number]);
}

const AX = { '--c': 'var(--ch-temp)' } as React.CSSProperties;
const GW = 380, GH = 200;

export default function TemperatureLab() {
  const [tab, setTab] = useState<Tab>('ntc');
  const [T, setT] = useState(25);
  const tabMeta = TABS.find((t) => t.id === tab)!;
  const [a, b] = rangeFor(tab);
  const safeT = Math.min(b, Math.max(a, T));
  const { y, label } = curve(tab, safeT);

  useEffect(() => {
    setT((current) => Math.min(b, Math.max(a, current)));
  }, [a, b]);

  const fill = (safeT - a) / (b - a || 1);
  const over = T < a || T > b;

  const pts = pointsFor(tab);
  const path = pts
    .map(([tt, yy], i) => `${i === 0 ? 'M' : 'L'}${(((tt - a) / (b - a)) * GW).toFixed(1)},${(GH - 18 - yy * (GH - 46)).toFixed(1)}`)
    .join('');
  const px = Math.max(3, Math.min(GW - 3, ((safeT - a) / (b - a)) * GW));
  const idx = Math.min(pts.length - 1, Math.round(((safeT - a) / (b - a)) * (pts.length - 1)));
  const py = Math.max(3, Math.min(GH - 20, GH - 18 - (pts[idx]?.[1] ?? 0) * (GH - 46)));
  const ticks = Array.from({ length: 5 }, (_, index) => a + ((b - a) * index) / 4);

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag">
        <span>BANCO 03 · TEMPERATURA</span>
        <span>{tabMeta.rango} · DOMINIO DEL SENSOR</span>
      </div>
      <div className="panel-inner col" style={{ gap: 16 }}>

        <div className="row">
          {TABS.map((t) => (
            <button key={t.id} className={`btn ${tab === t.id ? 'is-active' : ''}`} style={AX} onClick={() => setTab(t.id)} aria-pressed={tab === t.id}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="temperature-grid">
          {/* termómetro */}
          <div className="sim-stage graticule col" style={{ padding: '14px 10px', alignItems: 'center', gap: 6 }}>
            <svg viewBox="0 0 90 250" style={{ width: 80, height: 'auto' }}>
              <rect x="38" y="12" width="15" height="198" rx="7" fill="#0c1524" stroke="#33465f" strokeWidth="2" />
              <rect x="41.5" y={212 - fill * 186} width="8" height={8 + fill * 186} rx="4" fill="#ff5a3c" style={{ transition: 'all .5s ease' }} />
              <circle cx="45.5" cy="228" r="13" fill="#ff5a3c" style={{ filter: (over || fill > 0.98) ? 'drop-shadow(0 0 10px rgba(255,90,60,.8))' : undefined, transition: 'filter .3s' }} />
              {ticks.map((v) => {
                const yy = 212 - ((v - a) / (b - a)) * 186;
                return (
                  <g key={v.toFixed(1)}>
                    <line x1="56" y1={yy} x2="62" y2={yy} stroke="#8fa3bc" strokeWidth="1" />
                    <text x="66" y={yy + 3} style={{ fill: '#8fa3bc', fontSize: 8 }} className="mono">{Math.round(v)}</text>
                  </g>
                );
              })}
              <text x="26" y="250" style={{ fill: '#8fa3bc', fontSize: 9 }} className="mono">°C</text>
            </svg>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{over ? 'FUERA DE ESCALA' : `${a} … ${b} °C`}</span>
          </div>

          <div className="col" style={{ gap: 14 }}>
            <div className="sim-stage graticule" style={{ padding: 12 }}>
              <div className="stage-cap">
                <span>{tabMeta.label.toUpperCase()} · RESPUESTA AL CAMBIO DE TEMP.</span>
                <span>{a}° … {b}°</span>
              </div>
              <svg viewBox={`0 0 ${GW} ${GH}`} style={{ width: '100%', height: 'auto' }} role="img" aria-label="Curva del sensor">
                <line x1="0" x2={GW} y1={GH - 20} y2={GH - 20} stroke="rgba(120,150,190,.3)" strokeWidth="1" />
                {[0.25, 0.5, 0.75].map((f) => (
                  <line key={f} x1={GW * f} x2={GW * f} y1="8" y2={GH - 20} stroke="rgba(120,150,190,.09)" strokeWidth="1" />
                ))}
                <path d={path} fill="none" stroke="var(--ch-temp)" strokeWidth="2.5" strokeLinecap="round" className="trace-draw" style={{ filter: 'drop-shadow(0 0 6px rgba(255,90,60,.5))' }} />
                <circle cx={px} cy={py} r="5" fill="var(--ch-temp)" className="lamp-glow" />
                <line x1={px} x2={px} y1="8" y2={GH - 20} stroke="rgba(255,90,60,.4)" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="grid-2" style={{ gap: 12 }}>
              <div className="readout" style={AX}>
                <div className="lbl">TEMPERATURA</div>
                <div className="val">{safeT.toFixed(1)} °C</div>
              </div>
              <div className="readout" style={AX}>
                <div className="lbl">SALIDA DEL SENSOR</div>
                <div className="val">{fmt(y, label)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <input
            type="range" min={a} max={b} value={safeT}
            style={{ '--c': 'var(--ch-temp)', '--fill': `${fill * 100}%`, flex: 4, minWidth: 200 } as React.CSSProperties}
            onChange={(e) => setT(Number(e.target.value))}
            aria-label="Temperatura"
          />
        </div>

        {tab === 'tc' && (
          <div className="sim-stage graticule row" style={{ padding: 18, gap: 18, flexWrap: 'wrap' }}>
            <div className="row" style={{ gap: 0 }}>
              <div style={{ background: '#5b2c0e', color: '#f5d9a8', padding: '14px 18px', borderRadius: 4, textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 13 }}>COBRE</div>
                <div className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(safeT)}°</div>
              </div>
              <div style={{ width: 10, height: 10, background: 'var(--ch-temp)', borderRadius: '50%', boxShadow: '0 0 12px var(--ch-temp)', animation: 'pulse 1s infinite', margin: '0 -2px' }} />
              <div style={{ background: '#43464d', color: '#cdd3da', padding: '14px 18px', borderRadius: 4, textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 13 }}>HIERRO</div>
                <div className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(safeT)}°</div>
              </div>
            </div>
            <div className="grow" style={{ minWidth: 180, fontSize: 13.5, color: 'var(--ink-dim)' }}>
              <b style={{ color: 'var(--ink)' }}>Efecto Seebeck:</b> la unión caliente libera electrones que migran al metal frío.
              La diferencia de potencial resultante <span className="mono" style={{ color: 'var(--ch-temp)' }}>V ≈ {fmt(y, label)}</span> se mide en un voltímetro.
              A más temperatura, más energía de los electrones (míralos agitarse).
            </div>
            <svg viewBox="0 0 120 46" style={{ width: 120 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <circle key={i} cx={18 + i * 12} cy={12} r="2.2" fill="#ffd9a0"
                  style={{ animation: `electron ${Math.max(0.3, 1.6 - T / 500)}s ease-in-out ${i * 0.13}s infinite alternate` }} />
              ))}
              <rect x="10" y="22" width="100" height="3" rx="1.5" fill="#ff5a3c" opacity=".7" />
              <text x="10" y="42" style={{ fill: '#8fa3bc', fontSize: 8 }} className="mono">JUNCIÓN CALIENTE →</text>
            </svg>
          </div>
        )}

        <p className="sim-note">
          <b>{tabMeta.label}.</b> {tabMeta.sub}. La lectura es lo que entregará al controlador.
        </p>
      </div>
    </div>
  );
}
