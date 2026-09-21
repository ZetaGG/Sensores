import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { rotorRpm as calculateRotorRpm, synchronousRpm } from './actuatorPhysics';
import StepperView from './StepperView';

/** Banco de motores: DC, AC de inducción y paso a paso, con comparador. */

type Tab = 'dc' | 'ac' | 'stepper';

const TABS: { id: Tab; label: string }[] = [
  { id: 'dc', label: 'MOTOR DC' },
  { id: 'ac', label: 'MOTOR AC' },
  { id: 'stepper', label: 'PASO A PASO' },
];

const COMPARE: { metric: string; dc: string; ac: string; stepper: string }[] = [
  { metric: 'Control de velocidad', dc: 'Continuo por tensión / PWM', ac: 'Requiere variador (VFD)', stepper: 'Por frecuencia de pulsos' },
  { metric: 'Posición', dc: 'Necesita encoder', ac: 'Necesita encoder', stepper: 'Exacta en lazo abierto' },
  { metric: 'Mantenimiento', dc: 'Escobillas', ac: 'Muy bajo', stepper: 'Bajo' },
  { metric: 'Par a baja velocidad', dc: 'Alto', ac: 'Medio', stepper: 'Alto' },
  { metric: 'Costo típico', dc: 'Bajo', ac: 'Medio', stepper: 'Medio' },
  { metric: 'Uso característico', dc: 'Máquinas pequeñas', ac: 'Bombas, ventiladores', stepper: 'CNC, impresoras 3D' },
];

function DCView() {
  const [voltage, setVoltage] = useState(12);
  const [load, setLoad] = useState(50);
  const [dir, setDir] = useState<1 | -1>(1);
  const reduce = useReducedMotion();
  const rpm = Math.round(voltage * 100);
  const dur = rpm > 0 ? Math.max(0.12, 320 / rpm) : 0;
  const running = rpm > 0 && !reduce;
  const torque = Math.round((voltage / 24) * load);

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="sim-stage graticule" style={{ padding: '12px 12px 0' }}>
        <div className="stage-cap"><span>MÁQUINA DC · ARMADURA + CAMPO</span><span>{dir === 1 ? 'HORARIO ▸' : '◂ ANTIHORARIO'}</span></div>
        <svg viewBox="0 0 400 220" role="img" aria-label={`Motor DC girando a ${rpm} rpm`} style={{ width: '100%', height: 'auto' }}>
          <rect x="80" y="30" width="34" height="160" rx="4" fill="#2a1f3d" stroke="#6b5bd6" />
          <rect x="286" y="30" width="34" height="160" rx="4" fill="#2a1f3d" stroke="#6b5bd6" />
          <text x="97" y="24" fill="#b794ff" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">N</text>
          <text x="303" y="24" fill="#b794ff" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">S</text>

          <g transform="translate(200,110)">
            <circle r="66" fill="none" stroke="var(--line)" strokeWidth="2" />
            <circle r="52" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
            <g className={running ? (dir === 1 ? 'spin' : 'spin-rev') : ''} style={{ animationDuration: `${dur}s` }}>
              <rect x="-42" y="-8" width="84" height="16" rx="3" fill="#ffd166" opacity="0.85" />
              <rect x="-8" y="-42" width="16" height="84" rx="3" fill="#ffd166" opacity="0.55" />
              <circle r="10" fill="#0b1526" stroke="#ffd166" strokeWidth="2" />
              <circle r="3" fill="#ffd166" />
            </g>
          </g>

          <line x1="114" y1="110" x2="148" y2="110" stroke="#ffd166" strokeWidth="2" className={running ? 'flow' : ''} />
          <line x1="252" y1="110" x2="286" y2="110" stroke="#ffd166" strokeWidth="2" className={running ? 'flow' : ''} />
          <text x="200" y="206" fill="var(--ink-faint)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
            {running ? `ROTOR GIRANDO · ${rpm} rpm` : 'ROTOR DETENIDO'}
          </text>
        </svg>
      </div>

      <div className="grid-2" style={{ gap: 16, alignItems: 'end' }}>
        <label className="col" style={{ gap: 4 }}>
          <span className="mono-label">TENSIÓN DE ARMADURA · {voltage} V</span>
          <input
            type="range" min={0} max={24} step={1} value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            aria-label="Tensión del motor DC en voltios"
            style={{ '--c': 'var(--act-elec)', '--fill': `${(voltage / 24) * 100}%` } as React.CSSProperties}
          />
        </label>
        <label className="col" style={{ gap: 4 }}>
          <span className="mono-label">CARGA MECÁNICA · {load} %</span>
          <input
            type="range" min={0} max={100} step={5} value={load}
            onChange={(e) => setLoad(Number(e.target.value))}
            aria-label="Carga mecánica del motor DC en porcentaje"
            style={{ '--c': 'var(--act-elec)', '--fill': `${load}%` } as React.CSSProperties}
          />
        </label>
        <button
          className={`btn ${dir === -1 ? 'is-active' : ''}`}
          style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}
          onClick={() => setDir((d) => (d === 1 ? -1 : 1))}
          aria-pressed={dir === -1}
        >
          ⇄ INVERTIR POLARIDAD
        </button>
      </div>

      <div className="grid-3">
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">VELOCIDAD</div><div className="val">{rpm} <span style={{ fontSize: '.6em' }}>rpm</span></div>
        </div>
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">SENTIDO</div><div className="val" style={{ fontSize: 20 }}>{dir === 1 ? 'HORARIO' : 'ANTIHOR.'}</div>
        </div>
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">ÍNDICE DE PAR · MODELO</div><div className="val">{torque} <span style={{ fontSize: '.6em' }}>%</span></div>
        </div>
      </div>
      <p className="sim-note" style={{ marginTop: 0 }}>
        <b>n ∝ V; T ∝ I.</b> La tensión fija principalmente la velocidad y la carga determina la corriente y el par disponible en este modelo relativo. Al invertir la polaridad cambia el sentido de giro.
      </p>
    </div>
  );
}

function ACView() {
  const [freq, setFreq] = useState(50);
  const [poles, setPoles] = useState(4);
  const [phase, setPhase] = useState(0);
  const reduce = useReducedMotion();
  const sync = Math.round(synchronousRpm(freq, poles));
  const rotorRpm = Math.round(calculateRotorRpm(sync));
  const slip = sync - rotorRpm;
  const electricalPeriod = Math.max(0.36, 0.84 * (50 / freq));
  const rotorDuration = Math.max(0.3, (electricalPeriod * (poles / 2)) / 0.96);

  useEffect(() => {
    setPhase(0);
    if (reduce) return;
    const ms = Math.max(90, (electricalPeriod * 1000) / 3);
    const id = window.setInterval(() => setPhase((p) => (p + 1) % 3), ms);
    return () => window.clearInterval(id);
  }, [electricalPeriod, poles, freq, reduce]);

  const coils = [
    { x: 200, y: 50, c: '#4cc9f0' },
    { x: 252, y: 140, c: '#ffd166' },
    { x: 148, y: 140, c: '#f472b6' },
  ];

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="sim-stage graticule" style={{ padding: '12px 12px 0' }}>
        <div className="stage-cap"><span>CAMPO GIRATORIO · TRIFÁSICO</span><span>{freq} Hz · {poles} POLOS</span></div>
        <svg viewBox="0 0 400 220" role="img" aria-label={`Campo giratorio de motor AC a ${freq} Hz, ${poles} polos, fase ${['U', 'V', 'W'][phase]}, rotor a ${rotorRpm} rpm`} style={{ width: '100%', height: 'auto' }}>
          <circle cx="200" cy="110" r="74" fill="none" stroke="var(--line)" strokeWidth="2" />
          {coils.map((coil, i) => (
            <g key={i} className={phase === i ? 'coil-on' : ''} style={{ '--c': coil.c } as React.CSSProperties}>
              <circle cx={coil.x} cy={coil.y} r="17" fill={phase === i ? coil.c : '#0f1b30'} stroke={coil.c} strokeWidth="2" opacity={phase === i ? 1 : 0.45} />
              <text x={coil.x} y={coil.y + 4} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill={phase === i ? '#04070d' : coil.c}>
                {['U', 'V', 'W'][i]}
              </text>
            </g>
          ))}
          <g transform="translate(200,110)" key={`${freq}-${poles}`}>
            <g className={reduce ? '' : 'spin'} style={{ '--rot': `${rotorDuration}s` } as React.CSSProperties}>
              <circle r="46" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
              <path d="M0,-42 L10,0 L0,42 L-10,0 Z" fill="#ffd166" opacity="0.85" />
              <circle r="7" fill="#04070d" stroke="#ffd166" strokeWidth="2" />
            </g>
          </g>
          <text x="200" y="206" fill="var(--ink-faint)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
            ROTOR SIGUE AL CAMPO · ANIMACIÓN NO A ESCALA
          </text>
        </svg>
      </div>

      <div className="row" style={{ gap: 16, alignItems: 'flex-end' }}>
        <label className="col grow" style={{ gap: 4 }}>
          <span className="mono-label">FRECUENCIA · {freq} Hz</span>
          <input
            type="range" min={20} max={70} step={5} value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            aria-label="Frecuencia del motor AC en hercios"
            style={{ '--c': 'var(--act-elec)', '--fill': `${((freq - 20) / 50) * 100}%` } as React.CSSProperties}
          />
        </label>
        <div className="seg" role="group" aria-label="Número de polos">
          {[2, 4, 6].map((p) => (
            <button key={p} className={`btn ${poles === p ? 'is-active' : ''}`} style={{ '--c': 'var(--act-elec)' } as React.CSSProperties} aria-pressed={poles === p} onClick={() => setPoles(p)}>
              {p} POLOS
            </button>
          ))}
        </div>
      </div>

      <div className="grid-4">
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">VELOCIDAD SÍNCRONA</div><div className="val">{sync} <span style={{ fontSize: '.6em' }}>rpm</span></div>
        </div>
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">VELOCIDAD DEL ROTOR</div><div className="val">{rotorRpm} <span style={{ fontSize: '.6em' }}>rpm</span></div>
        </div>
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">DESLIZAMIENTO (~4 %)</div><div className="val">{slip} <span style={{ fontSize: '.6em' }}>rpm</span></div>
        </div>
        <div className="readout" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
          <div className="lbl">FÓRMULA</div><div className="val" style={{ fontSize: 18 }}>120·f / p</div>
        </div>
      </div>
      <p className="sim-note" style={{ marginTop: 0 }}>
        <b>Motor de inducción.</b> El campo giratorio arrastra la jaula del rotor; con un variador de frecuencia (VFD) se regula la velocidad cambiando <span className="mono">f</span>.
      </p>
    </div>
  );
}

export default function MotorLab() {
  const [tab, setTab] = useState<Tab>('dc');

  const moveTab = (index: number, direction: 1 | -1) => {
    const next = (index + direction + TABS.length) % TABS.length;
    const nextTab = TABS[next].id;
    setTab(nextTab);
    window.requestAnimationFrame(() => document.getElementById(`motor-tab-${nextTab}`)?.focus());
  };

  return (
    <div className="panel" style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}>
      <div className="panel-tag">
        <span>BANCO DE MOTORES · ACT-02</span>
        <span className="live">EN VIVO</span>
      </div>
      <div className="panel-inner col" style={{ gap: 18 }}>
        <div className="seg" role="tablist" aria-label="Tipo de motor">
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`motor-tab-${t.id}`}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls="motor-panel"
              tabIndex={tab === t.id ? 0 : -1}
              className={`btn ${tab === t.id ? 'is-active' : ''}`}
              style={{ '--c': 'var(--act-elec)' } as React.CSSProperties}
              onClick={() => setTab(t.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') { event.preventDefault(); moveTab(TABS.findIndex((item) => item.id === t.id), 1); }
                if (event.key === 'ArrowLeft') { event.preventDefault(); moveTab(TABS.findIndex((item) => item.id === t.id), -1); }
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id="motor-panel" role="tabpanel" aria-labelledby={`motor-tab-${tab}`} tabIndex={0}>
          {tab === 'dc' && <DCView />}
          {tab === 'ac' && <ACView />}
          {tab === 'stepper' && <StepperView />}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr><th>Criterio</th><th style={{ color: tab === 'dc' ? 'var(--act-elec)' : undefined }}>Motor DC</th><th style={{ color: tab === 'ac' ? 'var(--act-elec)' : undefined }}>Motor AC</th><th style={{ color: tab === 'stepper' ? 'var(--act-elec)' : undefined }}>Paso a paso</th></tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.metric}>
                  <td><strong>{r.metric}</strong></td>
                  <td style={tab === 'dc' ? { color: 'var(--ink)' } : undefined}>{r.dc}</td>
                  <td style={tab === 'ac' ? { color: 'var(--ink)' } : undefined}>{r.ac}</td>
                  <td style={tab === 'stepper' ? { color: 'var(--ink)' } : undefined}>{r.stepper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
