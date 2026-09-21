import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { actuatorForceN, hydraulicPowerKw, hydraulicVelocityMps, pistonAreaCm2, rodAreaCm2 } from './actuatorPhysics';

/** ACT-04 · Circuito hidráulico: motobomba, presión y cilindro. F = P × A. */

const AX = { '--c': 'var(--act-hidr)' } as React.CSSProperties;
const STROKE_METERS = 0.4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function HydraulicLab() {
  const [pumpOn, setPumpOn] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [pressure, setPressure] = useState(120);
  const [bore, setBore] = useState(80);
  const [flow, setFlow] = useState(20);
  const [pos, setPos] = useState(0);
  const reduce = useReducedMotion();

  const areaPiston = pistonAreaCm2(bore);
  const areaRod = rodAreaCm2(bore);
  const forceAdvance = actuatorForceN(pressure, areaPiston);
  const forceRetract = actuatorForceN(pressure, areaPiston - areaRod);
  const force = pumpOn ? (direction === 1 ? forceAdvance : forceRetract) : 0;
  const activeArea = direction === 1 ? areaPiston : areaPiston - areaRod;
  const velocity = hydraulicVelocityMps(flow, activeArea);
  const activeVelocity = pumpOn ? velocity : 0;
  const power = pumpOn ? hydraulicPowerKw(pressure, flow) : 0;
  const pumpDuration = Math.max(0.35, Math.min(1.2, 12 / Math.max(flow, 1)));
  const needleAngle = -135 + ((pressure - 20) / (250 - 20)) * 270;
  const pistonX = 286 + pos * 104;
  const positionRef = useRef(pos);

  useEffect(() => {
    positionRef.current = pos;
  }, [pos]);

  useEffect(() => {
    if (!pumpOn || reduce) return;

    let frame = 0;
    let previous = performance.now();
    const advance = (now: number) => {
      const deltaTime = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      const delta = (velocity / STROKE_METERS) * deltaTime * direction;
      const next = clamp(positionRef.current + delta, 0, 1);
      positionRef.current = next;
      setPos(next);

      const canContinue = direction === 1 ? next < 1 : next > 0;
      if (canContinue) frame = window.requestAnimationFrame(advance);
    };

    frame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(frame);
  }, [pumpOn, direction, velocity, reduce]);

  const changeDirection = (nextDirection: 1 | -1) => {
    setDirection(nextDirection);
    if (reduce && pumpOn) {
      const next = clamp(positionRef.current + nextDirection * 0.1, 0, 1);
      positionRef.current = next;
      setPos(next);
    }
  };

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag">
        <span>BANCO HIDRÁULICO · MOTOBOMPA + CILINDRO</span>
        <span className="live">{pumpOn ? 'BOMBA EN MARCHA' : 'BOMBA DETENIDA'}</span>
      </div>
      <div className="panel-inner col" style={{ gap: 18 }}>

        <div className="sim-stage graticule" style={{ padding: '12px 12px 0' }}>
          <div className="stage-cap">
            <span>CIRCUITO · DEPÓSITO → BOMBA → VÁLVULA → CILINDRO</span>
            <span>{pressure} bar · {flow} L/min</span>
          </div>
          <svg viewBox="0 0 560 200" role="img" aria-label="Circuito hidráulico con motobomba y cilindro" style={{ width: '100%', height: 'auto' }}>
            {/* depósito */}
            <rect x="24" y="120" width="96" height="56" rx="4" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
            <path d="M30 150 q12 -8 24 0 q12 8 24 0 q12 -8 24 0" fill="none" stroke="#4cc9f0" strokeWidth="2" opacity="0.6" />
            <text x="72" y="192" fill="var(--ink-faint)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">DEPÓSITO</text>

            {/* motor + bomba */}
            <g transform="translate(72,66)">
              <circle r="22" fill="#0f1b30" stroke="#4cc9f0" strokeWidth="2" />
              <g className={pumpOn && !reduce ? 'spin' : ''} style={{ '--rot': `${pumpDuration}s` } as React.CSSProperties}>
                <path d="M0 -14 L12 0 L0 14 L-12 0 Z" fill="#4cc9f0" opacity="0.8" />
              </g>
            </g>
            <text x="72" y="26" fill="#4cc9f0" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">MOTOR</text>
            <text x="72" y="104" fill="var(--ink-faint)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">BOMBA</text>

            {/* líneas */}
            <path d="M72 120 L72 88" stroke="#4cc9f0" strokeWidth="3" className={pumpOn ? 'flow' : ''} />
            <path d="M94 66 L150 66 L150 100 L210 100" fill="none" stroke="#4cc9f0" strokeWidth="3" className={pumpOn ? 'flow' : ''} />
            {/* manómetro */}
            <circle cx="180" cy="100" r="14" fill="#04070d" stroke="#4cc9f0" strokeWidth="2" />
            <g className="needle" style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '180px 100px', transformBox: 'view-box' } as React.CSSProperties}>
              <line x1="180" y1="100" x2="180" y2="91" stroke="#fb923c" strokeWidth="2" />
            </g>
            <text x="180" y="130" fill="var(--ink-faint)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">{pressure} bar</text>

            {/* válvula direccional */}
            <rect x="210" y="84" width="34" height="32" rx="3" fill="#0f1b30" stroke="#4cc9f0" strokeWidth="2" />
            <path d={direction === 1 ? 'M214 100 H236 M230 94 L236 100 L230 106' : 'M240 100 H218 M224 94 L218 100 L224 106'} stroke="#4cc9f0" strokeWidth="2" fill="none" />
            <text x="227" y="78" fill="var(--ink-faint)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">4/3</text>

            {/* cilindro */}
            <rect x="270" y="76" width="170" height="48" rx="6" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
            <rect x="274" y="80" width={Math.max(0, pistonX - 274)} height="40" fill="#4cc9f0" opacity="0.16" />
            <g style={{ transform: `translateX(${pistonX - 286}px)` }}>
              <rect x="286" y="78" width="14" height="44" rx="3" fill="#4cc9f0" />
              <rect x="300" y="92" width="120" height="16" rx="3" fill="#8fa3bc" />
            </g>
            <path d="M244 100 L270 100" stroke="#4cc9f0" strokeWidth="3" className={pumpOn ? `flow ${direction === -1 ? 'flow-reverse' : ''}` : ''} />
            <text x="355" y="150" fill="var(--ink-faint)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
              CILINDRO Ø{bore} mm · CARRERA 400 mm
            </text>

            {/* retorno */}
            <path d="M440 124 L440 170 L72 170" fill="none" stroke="#4cc9f0" strokeWidth="2" opacity="0.45" />
          </svg>
        </div>

        <div className="row" style={{ gap: 12 }}>
          <button className={`btn ${pumpOn ? 'is-active' : ''}`} style={AX} aria-pressed={pumpOn} onClick={() => setPumpOn((p) => !p)}>
            {pumpOn ? '⏻ BOMBA ON' : '⏻ BOMBA OFF'}
          </button>
           <button className={`btn ${direction === 1 ? 'is-active' : ''}`} style={AX} aria-pressed={direction === 1} onClick={() => changeDirection(1)}>▸ AVANZAR</button>
           <button className={`btn ${direction === -1 ? 'is-active' : ''}`} style={AX} aria-pressed={direction === -1} onClick={() => changeDirection(-1)}>◂ RETROCEDER</button>
           <span className="hint-chip">POSICIÓN {Math.round(pos * 100)} %</span>
        </div>

        <div className="grid-3">
          <label className="col" style={{ gap: 4 }}>
            <span className="mono-label">PRESIÓN · {pressure} bar</span>
            <input type="range" min={20} max={250} step={5} value={pressure} onChange={(e) => setPressure(Number(e.target.value))} aria-label="Presión hidráulica en bar" style={{ '--c': 'var(--act-hidr)', '--fill': `${((pressure - 20) / 230) * 100}%` } as React.CSSProperties} />
          </label>
          <label className="col" style={{ gap: 4 }}>
            <span className="mono-label">DIÁMETRO · Ø{bore} mm</span>
            <input type="range" min={40} max={160} step={5} value={bore} onChange={(e) => setBore(Number(e.target.value))} aria-label="Diámetro del pistón hidráulico" style={{ '--c': 'var(--act-hidr)', '--fill': `${((bore - 40) / 120) * 100}%` } as React.CSSProperties} />
          </label>
          <label className="col" style={{ gap: 4 }}>
            <span className="mono-label">CAUDAL · {flow} L/min</span>
            <input type="range" min={5} max={60} step={1} value={flow} onChange={(e) => setFlow(Number(e.target.value))} aria-label="Caudal de la bomba en litros por minuto" style={{ '--c': 'var(--act-hidr)', '--fill': `${((flow - 5) / 55) * 100}%` } as React.CSSProperties} />
          </label>
        </div>

        <div className="grid-4">
          <div className="readout" style={AX}><div className="lbl">ÁREA PISTÓN</div><div className="val" style={{ fontSize: 19 }}>{areaPiston.toFixed(1)} <span style={{ fontSize: '.6em' }}>cm²</span></div></div>
           <div className="readout" style={AX}><div className="lbl">FUERZA {direction === 1 ? 'AVANCE' : 'RETROCESO'}</div><div className="val" style={{ fontSize: 19 }}>{Math.round(force / 1000)} <span style={{ fontSize: '.6em' }}>kN</span></div></div>
           <div className="readout" style={AX}><div className="lbl">VELOCIDAD v = Q / A</div><div className="val" style={{ fontSize: 19 }}>{activeVelocity.toFixed(2)} <span style={{ fontSize: '.6em' }}>m/s</span></div></div>
          <div className="readout" style={AX}><div className="lbl">POTENCIA HIDRÁULICA</div><div className="val" style={{ fontSize: 19 }}>{power.toFixed(1)} <span style={{ fontSize: '.6em' }}>kW</span></div></div>
        </div>

        <p className="sim-note" style={{ marginTop: 0 }}>
          <b>Ley de Pascal:</b> la presión se transmite íntegra en el aceite. En avance entrega {Math.round(forceAdvance / 9.81)} kgf y en retroceso {Math.round(forceRetract / 9.81)} kgf; el caudal y el diámetro fijan la velocidad de la carrera.
        </p>
      </div>
    </div>
  );
}
