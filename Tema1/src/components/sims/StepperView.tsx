import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { stepperAngle, stepperPhaseIndex, stepperPulseIntervalMs, type StepDirection } from './actuatorPhysics';

const COIL_COLORS = ['#4cc9f0', '#ffd166', '#f472b6', '#34d399'];
const COIL_LABELS = ['A', 'B', 'C', 'D'];
const COIL_POSITIONS = [
  { x: 200, y: 36 },
  { x: 274, y: 110 },
  { x: 200, y: 184 },
  { x: 126, y: 110 },
];

export default function StepperView() {
  const [angleStep, setAngleStep] = useState(1.8);
  const [steps, setSteps] = useState(0);
  const [direction, setDirection] = useState<StepDirection>(1);
  const [pulsesPerSecond, setPulsesPerSecond] = useState(2);
  const [running, setRunning] = useState(false);
  const reduce = useReducedMotion();

  const pulse = () => setSteps((current) => current + direction);

  useEffect(() => {
    if (!running || reduce) return;
    const interval = stepperPulseIntervalMs(pulsesPerSecond);
    const id = window.setInterval(pulse, interval);
    return () => window.clearInterval(id);
  }, [direction, pulsesPerSecond, reduce, running]);

  useEffect(() => {
    if (reduce) setRunning(false);
  }, [reduce]);

  const perRev = Math.round(360 / angleStep);
  const coil = stepperPhaseIndex(steps);
  const realAngle = stepperAngle(steps, angleStep);
  const visualAngle = steps * angleStep;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="sim-stage graticule" style={{ padding: '12px 12px 0' }}>
        <div className="stage-cap">
          <span>SECUENCIA DE BOBINAS A · B · C · D</span>
          <span>{steps} PULSOS · {direction === 1 ? 'HORARIO' : 'ANTIHORARIO'}</span>
        </div>
        <svg
          viewBox="0 0 400 220"
          role="img"
          aria-label={`Motor paso a paso, ${direction === 1 ? 'horario' : 'antihorario'}, ${steps} pulsos, ángulo real ${realAngle} grados`}
          style={{ width: '100%', height: 'auto' }}
        >
          {COIL_COLORS.map((color, index) => {
            const position = COIL_POSITIONS[index];
            const active = coil === index;
            return (
              <g key={COIL_LABELS[index]} className={active ? 'coil-on' : ''} style={{ '--c': color } as React.CSSProperties}>
                <rect x={position.x - 20} y={position.y - 15} width="40" height="30" rx="4" fill={active ? color : '#0f1b30'} stroke={color} strokeWidth="2" opacity={active ? 1 : 0.4} />
                <text x={position.x} y={position.y + 4} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill={active ? '#04070d' : color}>
                  {COIL_LABELS[index]}
                </text>
              </g>
            );
          })}
          <g transform="translate(200,110)">
            <g className="rotor-step" style={{ transform: `rotate(${visualAngle}deg)`, transformOrigin: 'center', transformBox: 'fill-box' } as React.CSSProperties}>
              <circle r="44" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
              <rect x="-34" y="-7" width="68" height="14" rx="3" fill="#b794ff" opacity="0.85" />
              <circle r="6" fill="#04070d" stroke="#b794ff" strokeWidth="2" />
            </g>
          </g>
          <text x="200" y="206" fill="var(--ink-faint)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
            FASE {COIL_LABELS[coil]} · ÁNGULO REAL {realAngle}° · {perRev} PASOS / VUELTA
          </text>
        </svg>
      </div>

      <div className="row" style={{ gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div className="seg" role="group" aria-label="Ángulo de paso">
          {[1.8, 0.9, 7.5].map((value) => (
            <button key={value} className={`btn ${angleStep === value ? 'is-active' : ''}`} style={{ '--c': 'var(--act-elec)' } as React.CSSProperties} aria-pressed={angleStep === value} onClick={() => { setAngleStep(value); setSteps(0); setRunning(false); }}>
              {value}°/PASO
            </button>
          ))}
        </div>
        <div className="seg" role="group" aria-label="Dirección del motor paso a paso">
          <button className={`btn ${direction === 1 ? 'is-active' : ''}`} style={{ '--c': 'var(--act-elec)' } as React.CSSProperties} aria-pressed={direction === 1} onClick={() => setDirection(1)}>
            ↻ HORARIO
          </button>
          <button className={`btn ${direction === -1 ? 'is-active' : ''}`} style={{ '--c': 'var(--act-elec)' } as React.CSSProperties} aria-pressed={direction === -1} onClick={() => setDirection(-1)}>
            ↺ ANTIHORARIO
          </button>
        </div>
        <button className="btn" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties} onClick={pulse}>
          {direction === 1 ? '▸' : '◂'} 1 PULSO
        </button>
        <button className={`btn ${running ? 'is-active' : ''}`} style={{ '--c': 'var(--act-elec)' } as React.CSSProperties} aria-pressed={running} disabled={reduce} onClick={() => setRunning((current) => !current)}>
          {reduce ? '▶ AUTO · REDUCIDO' : running ? '❚❚ DETENER' : '▶ AUTO'}
        </button>
        <button className="btn" onClick={() => { setRunning(false); setSteps(0); }}>↺ RESET</button>
      </div>

      <label className="col" style={{ gap: 4 }}>
        <span className="mono-label">VELOCIDAD · {pulsesPerSecond} PULSOS/S</span>
        <input type="range" min="1" max="12" step="1" value={pulsesPerSecond} onChange={(event) => setPulsesPerSecond(Number(event.target.value))} aria-label="Velocidad del motor paso a paso en pulsos por segundo" style={{ '--c': 'var(--act-elec)', '--fill': `${((pulsesPerSecond - 1) / 11) * 100}%` } as React.CSSProperties} />
      </label>

      <div className="grid-3">
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">ÁNGULO DE PASO</div><div className="val">{angleStep}°</div>
        </div>
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">PASOS POR VUELTA</div><div className="val">{perRev}</div>
        </div>
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">ÁNGULO REAL</div><div className="val">{realAngle}°</div>
        </div>
      </div>
      <p className="sim-note" style={{ marginTop: 0 }}>
        <b>Modelo visual simplificado.</b> Cada pulso avanza {angleStep}° en la dirección seleccionada y activa la siguiente bobina; la velocidad automática controla los pulsos por segundo.
      </p>
    </div>
  );
}
