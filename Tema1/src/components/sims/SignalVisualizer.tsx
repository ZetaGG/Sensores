import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/** Genera puntos wave t->[-1,1] */
function makeWave(type: string, pts = 180): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < pts; i++) {
    const t = i / (pts - 1);
    let y = 0;
    switch (type) {
      case 'sine': y = Math.sin(t * Math.PI * 2 * 2.5) * 0.4; break;
      case 'square': y = (Math.sin(t * Math.PI * 2 * 2) >= 0 ? 0.5 : -0.5); break;
      case 'steps': { const s = Math.floor(t * 3); y = (s % 2 === 0 ? 0.35 : 0.65) - 0.5; break; }
      case 'saw': y = ((t * 2.5) % 1) * 2 - 1; y *= 0.5; break;
      case 'echo': { const p = (t * 4) % 1; y = Math.exp(-p * 6) * Math.sin(p * Math.PI * 10) * 0.8; y *= p < 0.08 ? 0 : 1; break; }
    }
    out.push([t, y]);
  }
  return out;
}

function toPath(pts: [number, number][], W: number, H: number, amp = 0.36): string {
  return pts
    .map(([t, y], i) => `${i === 0 ? 'M' : 'L'}${(t * W).toFixed(1)},${(H / 2 - y * H * amp * 2).toFixed(1)}`)
    .join('');
}

const MAGNITUDES = [
  {
    id: 'luz', label: 'LUZ', unit: 'lux', read: '860', simbolo: '◉',
    wave: 'square', inName: 'Fotocélula', vOut: '5.0 V', outTxt: 'NIVEL ALTO · DETECTADO',
    desc: 'La luz incide y el sensor conmuta su salida digital.',
  },
  {
    id: 'temp', label: 'TEMPERATURA', unit: '°C', read: '38.4', simbolo: '◍',
    wave: 'sine', inName: 'Termopar', vOut: '1.54 V', outTxt: 'SEÑAL ANALÓGICA · mV/°C',
    desc: 'El voltaje Seebeck varía de forma casi lineal con la temperatura.',
  },
  {
    id: 'pres', label: 'PRESIÓN', unit: 'kPa', read: '214', simbolo: '◔',
    wave: 'steps', inName: 'Galga extensiométrica', vOut: '3.21 V', outTxt: 'ESCALONES DE PROCESO',
    desc: 'Cada cambio de presión deforma el elemento y se traduce en voltaje.',
  },
  {
    id: 'dist', label: 'DISTANCIA', unit: 'mm', read: '425', simbolo: '◓',
    wave: 'echo', inName: 'Ultrasónico HC-SR04', vOut: '2.78 V', outTxt: 'ECO · TIEMPO DE VUELO',
    desc: 'El eco regresa y el tiempo de vuelo se convierte en señal de distancia.',
  },
];

const AX: React.CSSProperties = { '--c': 'var(--ch-intro)' } as React.CSSProperties;

export default function SignalVisualizer() {
  const [mag, setMag] = useState(0);
  const [sweep, setSweep] = useState(0);
  const [armed, setArmed] = useState(false);
  const raf = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const m = MAGNITUDES[mag];

  useEffect(() => {
    setSweep(0);
    if (reduce) {
      setSweep(1);
      setArmed(true);
      return;
    }
    const t0 = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setSweep(eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setArmed(true);
    };
    setArmed(false);
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [mag, reduce]);

  const W = 400, H = 200;
  const waveIn = makeWave(m.wave);
  const fullIn = toPath(waveIn, W, H);
  const cut = Math.max(1, Math.floor(waveIn.length * sweep));
  const partial = toPath(waveIn.slice(0, cut), W, H);
  const last = waveIn[cut - 1];

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag">
        <span>MONITOR DE SEÑAL · CANAL MAESTRO</span>
        <span className="live">EN VIVO</span>
      </div>
      <div className="panel-inner col" style={{ gap: 16 }}>

        <div className="row" style={{ marginBottom: 0 }}>
          {MAGNITUDES.map((x, i) => (
            <button
              key={x.id}
              className={`btn ${i === mag ? 'is-active' : ''}`}
              style={AX}
              onClick={() => setMag(i)}
              aria-pressed={i === mag}
            >
              {x.simbolo} {x.label}
            </button>
          ))}
        </div>

        <div className="sim-stage graticule" style={{ padding: '12px 12px 0' }}>
          <div className="stage-cap">
            <span>CH-IN · {m.inName}</span>
            <span>SP01/OSC-01</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Señal de entrada de ${m.label}`} style={{ width: '100%', height: 'auto' }}>
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={'h' + f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgba(120,150,190,.09)" strokeWidth="1" />
            ))}
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={'v' + f} y1="0" y2={H} x1={W * f} x2={W * f} stroke="rgba(120,150,190,.09)" strokeWidth="1" />
            ))}
            <line x1="0" x2={W} y1={H / 2} y2={H / 2} stroke="rgba(120,150,190,.18)" strokeWidth="1" strokeDasharray="4 4" />
            <path d={fullIn} fill="none" stroke="rgba(125,211,252,.12)" strokeWidth="1.5" />
            <path d={partial} fill="none" stroke="var(--trace)" strokeWidth="2" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgba(125,211,252,.7))' }} />
            {sweep < 1 && cut > 0 && (
              <circle cx={last[0] * W} cy={H / 2 - last[1] * H * 0.36 * 2} r="3.5" fill="var(--trace)" />
            )}
            <line x1={sweep * W} x2={sweep * W} y1="0" y2={H} stroke="rgba(244,114,182,.4)" strokeWidth="1" />
          </svg>
        </div>

        <div className="row mono-label" style={{ justifyContent: 'space-between', color: 'var(--ink-dim)', fontSize: 11 }}>
          <span style={{ flex: 1, textAlign: 'center' }}>{m.read} {m.unit}</span>
          <span style={{ color: 'var(--ink-faint)' }}>→</span>
          <span
            className="mono"
            style={{
              flex: 1, textAlign: 'center', border: '1px solid var(--line)', borderRadius: 4,
              padding: '6px 8px', background: 'var(--bg-deep)', color: 'var(--ch-intro)',
              letterSpacing: '.14em',
              boxShadow: armed ? '0 0 18px rgba(155,140,255,.35)' : undefined,
              transition: 'box-shadow .4s',
            }}
          >SENSOR</span>
          <span style={{ color: 'var(--ink-faint)' }}>→</span>
          <span style={{ flex: 1, textAlign: 'center', color: 'var(--ch-intro)' }}>{m.vOut}</span>
        </div>

        <div className="readout" style={AX}>
          <div className="lbl">SALIDA ELÉCTRICA · {m.label}</div>
          <div className="val">{m.vOut} <span style={{ fontSize: '.65em', color: 'var(--ink-dim)' }}>{m.outTxt}</span></div>
        </div>
        <p className="sim-note" style={{ marginTop: 0 }}>{m.desc}</p>
      </div>
    </div>
  );
}
