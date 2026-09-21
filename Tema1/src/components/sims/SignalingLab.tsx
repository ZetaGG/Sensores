import { useState } from 'react';

/** ACT-05 · Actuadores de señalización: piloto (lámpara) y zumbador (buzzer). */

interface PilotColor { id: string; name: string; hex: string; meaning: string }

const PILOT_COLORS: PilotColor[] = [
  { id: 'verde', name: 'VERDE', hex: '#3ddc84', meaning: 'Marcha · funcionamiento normal' },
  { id: 'rojo', name: 'ROJO', hex: '#ff5a3c', meaning: 'Paro · fallo o emergencia' },
  { id: 'ambar', name: 'ÁMBAR', hex: '#ffb020', meaning: 'Advertencia · precaución' },
  { id: 'azul', name: 'AZUL', hex: '#4cc9f0', meaning: 'Información · mando obligatorio' },
];

function wavePath(cycles: number, W: number, H: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const y = H / 2 - Math.sin(t * Math.PI * 2 * cycles) * (H * 0.34);
    pts.push(`${i === 0 ? 'M' : 'L'}${(t * W).toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join('');
}

export default function SignalingLab() {
  const [lampOn, setLampOn] = useState(true);
  const [color, setColor] = useState<PilotColor>(PILOT_COLORS[0]);
  const [buzzOn, setBuzzOn] = useState(false);
  const [freq, setFreq] = useState(2400);
  const [intermittent, setIntermittent] = useState(false);

  const db = Math.round(60 + (freq / 4000) * 25);
  const cycles = Math.max(2, Math.round((freq / 1000) * 3));

  return (
    <div className="panel" style={{ '--c': 'var(--act-senal)' } as React.CSSProperties}>
      <div className="panel-tag">
        <span>BANCO DE SEÑALIZACIÓN · PILOTO + ZUMBADOR</span>
        <span className="live">24 V DC</span>
      </div>
      <div className="panel-inner">
        <div className="grid-2">

          {/* ---------- PILOTO ---------- */}
          <div className="col" style={{ gap: 14 }}>
            <span className="mono-label">PILOTO · LÁMPARA INDICADORA</span>
            <div className="sim-stage graticule" style={{ padding: '12px 12px 0' }}>
              <div className="stage-cap"><span>INDICADOR DE ESTADO</span><span>{lampOn ? 'ENCENDIDO' : 'APAGADO'}</span></div>
              <svg viewBox="0 0 260 170" role="img" aria-label={`Piloto ${color.name} ${lampOn ? 'encendido' : 'apagado'}`} style={{ width: '100%', height: 'auto' }}>
                <rect x="80" y="120" width="100" height="30" rx="4" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
                <rect x="112" y="96" width="36" height="28" fill="#1c2a3f" />
                <circle cx="130" cy="66" r="34" fill={lampOn ? color.hex : '#16233a'} stroke={color.hex} strokeWidth="2" opacity={lampOn ? 0.95 : 0.5} style={lampOn ? { filter: `drop-shadow(0 0 16px ${color.hex})` } : undefined} />
                <circle cx="118" cy="54" r="9" fill="#ffffff" opacity={lampOn ? 0.35 : 0.08} />
                {lampOn && (
                  <g className={`wave-rings${intermittent ? ' buzz-intermittent' : ''}`} stroke={color.hex} fill="none" strokeWidth="2">
                    <circle cx="130" cy="66" r="34" />
                    <circle cx="130" cy="66" r="34" style={{ animationDelay: '.5s' }} />
                  </g>
                )}
                <text x="130" y="162" fill="var(--ink-faint)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
                  {lampOn ? 'LED · 24 V DC · 2 W' : 'SIN TENSIÓN'}
                </text>
              </svg>
            </div>

            <div className="row" style={{ gap: 8 }}>
              <button className={`btn ${lampOn ? 'is-active' : ''}`} style={{ '--c': color.hex } as React.CSSProperties} aria-pressed={lampOn} onClick={() => setLampOn((v) => !v)}>
                {lampOn ? '⏻ APAGAR PILOTO' : '⏻ ENCENDER PILOTO'}
              </button>
            </div>
            <div className="seg" role="group" aria-label="Color del piloto">
              {PILOT_COLORS.map((c) => (
                <button key={c.id} className={`btn ${color.id === c.id ? 'is-active' : ''}`} style={{ '--c': c.hex } as React.CSSProperties} aria-pressed={color.id === c.id} onClick={() => setColor(c)}>
                  <span className="dot-sm" style={{ background: c.hex }}></span>{c.name}
                </button>
              ))}
            </div>
            <div className="readout" style={{ '--c': color.hex } as React.CSSProperties}>
              <div className="lbl">SIGNIFICADO DEL COLOR</div>
              <div className="val" style={{ fontSize: 16 }}>{color.meaning}</div>
            </div>
          </div>

          {/* ---------- ZUMBADOR ---------- */}
          <div className="col" style={{ gap: 14 }}>
            <span className="mono-label">ZUMBADOR · AVISO SONORO</span>
            <div className="sim-stage graticule" style={{ padding: '12px 12px 0' }}>
              <div className="stage-cap"><span>OSCILADOR PIEZOELÉCTRICO</span><span>{buzzOn ? 'SONANDO' : 'EN SILENCIO'}</span></div>
              <svg viewBox="0 0 260 170" role="img" aria-label={`Zumbador ${buzzOn ? `sonando a ${freq} hercios` : 'apagado'}`} style={{ width: '100%', height: 'auto' }}>
                <rect x="86" y="52" width="60" height="60" rx="6" fill="#0f1b30" stroke="#fb923c" strokeWidth="2" />
                <circle cx="116" cy="82" r="9" fill="#fb923c" opacity={buzzOn ? 1 : 0.3} />
                {buzzOn && (
                  <g className="wave-rings" stroke="#fb923c" fill="none" strokeWidth="2">
                    <circle cx="116" cy="82" r="20" />
                    <circle cx="116" cy="82" r="20" style={{ animationDelay: '.35s' }} />
                    <circle cx="116" cy="82" r="20" style={{ animationDelay: '.7s' }} />
                  </g>
                )}
                  <path d={wavePath(cycles, 220, 40)} transform="translate(20,118)" fill="none" stroke="#fb923c" strokeWidth="2" opacity={buzzOn ? 0.95 : 0.25} className={buzzOn && intermittent ? 'buzz-intermittent' : undefined} />
                <text x="130" y="164" fill="var(--ink-faint)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
                  {buzzOn ? `${freq} Hz · ${intermittent ? 'INTERMITENTE' : 'CONTINUO'}` : 'SIN SEÑAL'}
                </text>
              </svg>
            </div>

            <div className="row" style={{ gap: 8 }}>
              <button className={`btn ${buzzOn ? 'is-active' : ''}`} style={{ '--c': 'var(--act-senal)' } as React.CSSProperties} aria-pressed={buzzOn} onClick={() => setBuzzOn((v) => !v)}>
                {buzzOn ? '⏹ SILENCIAR' : '▶ ACTIVAR ZUMBADOR'}
              </button>
              <button className={`btn ${intermittent ? 'is-active' : ''}`} style={{ '--c': 'var(--act-senal)' } as React.CSSProperties} aria-pressed={intermittent} onClick={() => setIntermittent((v) => !v)}>
                {intermittent ? '≈ INTERMITENTE' : '— CONTINUO'}
              </button>
            </div>
            <label className="col" style={{ gap: 4 }}>
              <span className="mono-label">FRECUENCIA · {freq} Hz</span>
              <input type="range" min={500} max={4000} step={100} value={freq} onChange={(e) => setFreq(Number(e.target.value))} aria-label="Frecuencia del zumbador en hercios" style={{ '--c': 'var(--act-senal)', '--fill': `${((freq - 500) / 3500) * 100}%` } as React.CSSProperties} />
            </label>
            <div className="grid-2">
              <div className="readout" style={{ '--c': 'var(--act-senal)' } as React.CSSProperties}><div className="lbl">NIVEL SONORO</div><div className="val" style={{ fontSize: 19 }}>{buzzOn ? db : 0} <span style={{ fontSize: '.6em' }}>dB</span></div></div>
              <div className="readout" style={{ '--c': 'var(--act-senal)' } as React.CSSProperties}><div className="lbl">PATRÓN</div><div className="val" style={{ fontSize: 17 }}>{buzzOn ? (intermittent ? 'INTERMITENTE' : 'CONTINUO') : 'APAGADO'}</div></div>
            </div>
          </div>
        </div>

        <p className="sim-note">
          El <b>piloto</b> comunica visualmente (color = significado) y el <b>zumbador</b> avisa aunque nadie mire el tablero. Por accesibilidad, el color del piloto debe acompañarse de texto o forma, y el zumbador se reserva para alarmas realmente importantes.
        </p>
      </div>
    </div>
  );
}
