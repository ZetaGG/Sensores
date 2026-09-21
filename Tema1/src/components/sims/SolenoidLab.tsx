import { useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export default function SolenoidLab() {
  const [energized, setEnergized] = useState(false);
  const reduce = useReducedMotion();
  const plungerOffset = energized ? 42 : 0;

  return (
    <div className="panel" style={{ '--c': 'var(--act-neum)' } as React.CSSProperties}>
      <div className="panel-tag">
        <span>LABORATORIO DE VÁLVULA SOLENOIDE · ACT-03</span>
        <span className="live">{energized ? 'BOBINA ENERGIZADA' : 'BOBINA DESENERGIZADA'}</span>
      </div>
      <div className="panel-inner col" style={{ gap: 16 }}>
        <div className="sim-stage graticule" style={{ padding: '12px 12px 0' }}>
          <div className="stage-cap">
            <span>BOBINA → CAMPO → ÉMBOLO → FLUJO</span>
            <span>{energized ? 'PASO ABIERTO' : 'PASO CERRADO'}</span>
          </div>
          <svg viewBox="0 0 720 270" role="img" aria-label={`Válvula solenoide ${energized ? 'activada: el émbolo abre el paso del fluido' : 'desactivada: el émbolo cierra el paso del fluido'}`} style={{ width: '100%', height: 'auto' }}>
            <text x="104" y="40" textAnchor="middle" className="mono" style={{ fill: 'var(--act-neum)', fontSize: 11 }}>BOBINA</text>
            <g className={energized ? 'solenoid-coil is-on' : 'solenoid-coil'}>
              {[0, 1, 2, 3, 4].map((index) => (
                <rect key={index} x={55 + index * 20} y="72" width="13" height="106" rx="5" />
              ))}
            </g>
            <text x="360" y="40" textAnchor="middle" className="mono" style={{ fill: 'var(--trace)', fontSize: 11 }}>CAMPO MAGNÉTICO</text>
            {energized && (
              <g className={reduce ? 'solenoid-field' : 'solenoid-field is-on'} fill="none" stroke="var(--trace)" strokeWidth="2">
                <path d="M175 82 C240 45 300 45 354 82" />
                <path d="M175 168 C240 205 300 205 354 168" />
                <path d="M188 96 C240 72 290 72 340 96" />
                <path d="M188 154 C240 178 290 178 340 154" />
              </g>
            )}
            <text x="458" y="40" textAnchor="middle" className="mono" style={{ fill: 'var(--ink-faint)', fontSize: 11 }}>ÉMBOLO / NÚCLEO</text>
            <rect x="320" y="98" width="170" height="54" rx="7" fill="#0f1b30" stroke="var(--line)" strokeWidth="2" />
            <g style={{ transform: `translateX(${plungerOffset}px)`, transition: reduce ? 'none' : 'transform .45s cubic-bezier(.3,.8,.3,1)' }}>
              <rect x="335" y="107" width="84" height="36" rx="5" fill={energized ? 'var(--act-neum)' : '#5e7392'} opacity="0.9" />
              <text x="377" y="130" textAnchor="middle" className="mono" style={{ fill: '#07101d', fontSize: 10 }}>{energized ? 'ATRAÍDO' : 'RETENIDO'}</text>
            </g>
            <text x="608" y="40" textAnchor="middle" className="mono" style={{ fill: energized ? 'var(--ok)' : 'var(--ink-faint)', fontSize: 11 }}>PASO DEL FLUIDO</text>
            <path d="M515 125 H680" stroke={energized ? 'var(--ok)' : '#33465f'} strokeWidth="10" strokeLinecap="round" strokeDasharray={energized ? '16 12' : '0'} className={energized && !reduce ? 'solenoid-flow' : ''} />
            <path d="M514 112 V138" stroke="#33465f" strokeWidth="3" />
            <text x="590" y="165" textAnchor="middle" className="mono" style={{ fill: energized ? 'var(--ok)' : 'var(--ink-faint)', fontSize: 11 }}>{energized ? 'FLUJO ABIERTO' : 'FLUJO BLOQUEADO'}</text>
          </svg>
        </div>

        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button className={`btn ${energized ? 'is-active' : ''}`} style={{ '--c': 'var(--act-neum)' } as React.CSSProperties} aria-pressed={energized} onClick={() => setEnergized(true)}>
            ⚡ ENERGIZAR BOBINA
          </button>
          <button className={`btn ${!energized ? 'is-active' : ''}`} style={{ '--c': 'var(--act-neum)' } as React.CSSProperties} aria-pressed={!energized} onClick={() => setEnergized(false)}>
            ◌ DESENERGIZAR
          </button>
          <span className="hint-chip">24 V DC · VÁLVULA 3/2</span>
        </div>

        <div className="grid-3">
          <div className="readout" style={{ '--c': 'var(--act-neum)' } as React.CSSProperties}>
            <div className="lbl">BOBINA</div><div className="val" style={{ fontSize: 18 }}>{energized ? 'ACTIVA' : 'INACTIVA'}</div>
          </div>
          <div className="readout" style={{ '--c': 'var(--trace)' } as React.CSSProperties}>
            <div className="lbl">ÉMBOLO</div><div className="val" style={{ fontSize: 18 }}>{energized ? 'ATRAÍDO' : 'RETENIDO'}</div>
          </div>
          <div className="readout" style={{ '--c': 'var(--ok)' } as React.CSSProperties}>
            <div className="lbl">FLUIDO</div><div className="val" style={{ fontSize: 18 }}>{energized ? 'PASANDO' : 'BLOQUEADO'}</div>
          </div>
        </div>

        <p className="sim-note" aria-live="polite" style={{ marginTop: 0 }}>
          <b>{energized ? 'Bobina energizada.' : 'Bobina desenergizada.'}</b>{' '}
          {energized ? 'El campo magnético atrae el émbolo y conecta el paso del fluido.' : 'El émbolo permanece en reposo y bloquea el paso del fluido.'}
        </p>
      </div>
    </div>
  );
}
