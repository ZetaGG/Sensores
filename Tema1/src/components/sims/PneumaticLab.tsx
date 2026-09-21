import { useState } from 'react';
import { actuatorForceN, pistonAreaCm2, rodAreaCm2 } from './actuatorPhysics';

/** ACT-03 · Cilindros neumáticos de simple y doble efecto + válvula solenoide. */

type Mode = 'simple' | 'doble';

const AX = { '--c': 'var(--act-neum)' } as React.CSSProperties;
const STROKE_MIN = 25;
const STROKE_MAX = 300;
const MAX_TRAVEL = 96;

export default function PneumaticLab() {
  const [mode, setMode] = useState<Mode>('doble');
  const [extended, setExtended] = useState(false);
  const [stroke, setStroke] = useState(150);
  const [bore, setBore] = useState(32);
  const [pressure, setPressure] = useState(6);

  const areaPiston = pistonAreaCm2(bore);
  const areaRod = rodAreaCm2(bore);
  const forceAdvance = actuatorForceN(pressure, areaPiston);
  const forceRetract = actuatorForceN(pressure, areaPiston - areaRod);

  const switchMode = (m: Mode) => { setMode(m); setExtended(false); };

  const valveLabel = mode === 'doble' ? '5/2' : '3/2';
  const strokeRatio = (stroke - STROKE_MIN) / (STROKE_MAX - STROKE_MIN);
  const travelPx = 14 + strokeRatio * (MAX_TRAVEL - 14);
  const pistonOffset = extended ? travelPx : 0;
  const rodLen = 130;
  const airWidth = 30 + (extended ? travelPx : 0);

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag">
        <span>BANCO NEUMÁTICO · CILINDRO + VÁLVULA SOLENOIDE</span>
        <span className="live">{pressure.toFixed(1)} bar</span>
      </div>
      <div className="panel-inner col" style={{ gap: 18 }}>

        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="seg" role="group" aria-label="Tipo de cilindro">
            <button className={`btn ${mode === 'simple' ? 'is-active' : ''}`} style={AX} aria-pressed={mode === 'simple'} onClick={() => switchMode('simple')}>SIMPLE EFECTO</button>
            <button className={`btn ${mode === 'doble' ? 'is-active' : ''}`} style={AX} aria-pressed={mode === 'doble'} onClick={() => switchMode('doble')}>DOBLE EFECTO</button>
          </div>
          <span className="chip">VÁLVULA {valveLabel}</span>
        </div>

        <div className="sim-stage graticule" style={{ padding: '12px 12px 0' }}>
          <div className="stage-cap">
            <span>CILINDRO · Ø{bore} mm · CARRERA {stroke} mm</span>
            <span>{extended ? 'VÁSTAGO EXTENDIDO' : 'VÁSTAGO RETRAÍDO'}</span>
          </div>
          <svg viewBox="0 0 480 190" role="img" aria-label={`Cilindro neumático de ${mode === 'simple' ? 'simple' : 'doble'} efecto ${extended ? 'extendido' : 'retraído'}`} style={{ width: '100%', height: 'auto' }}>
            {/* soporte */}
            <rect x="30" y="60" width="16" height="70" fill="#1c2a3f" />
            {/* camisa */}
            <rect x="46" y="58" width="180" height="74" rx="6" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
            {/* aire a presión */}
            <rect x="50" y="62" width={airWidth} height="66" fill="#34d399" opacity="0.14" style={{ transition: 'width .5s cubic-bezier(.3,.8,.3,1)' }} />
            {/* pistón + vástago */}
            <g style={{ transform: `translateX(${pistonOffset}px)`, transition: 'transform .5s cubic-bezier(.3,.8,.3,1)' }}>
              <rect x="82" y="60" width="16" height="70" rx="3" fill="#34d399" />
              <rect x="96" y="86" width={rodLen} height="18" rx="3" fill="#8fa3bc" />
              <rect x={96 + rodLen - 12} y="80" width="12" height="30" rx="3" fill="#5e7392" />
            </g>
            {/* resorte de retorno (simple efecto) */}
            {mode === 'simple' && (
              <path d="M226 95 q8 -16 16 0 q8 16 16 0 q8 -16 16 0" fill="none" stroke="#5e7392" strokeWidth="2" />
            )}
            {/* puertos */}
            <line x1="20" y1="80" x2="46" y2="80" stroke="#34d399" strokeWidth="3" className={extended ? 'flow' : ''} />
            <text x="10" y="70" fill="#34d399" fontSize="10" fontFamily="var(--font-mono)">P·A</text>
            {mode === 'doble' && (
              <>
                <line x1="20" y1="110" x2="46" y2="110" stroke={extended ? '#5e7392' : '#34d399'} strokeWidth="3" className={extended ? '' : 'flow'} />
                <text x="2" y="130" fill={extended ? '#5e7392' : '#34d399'} fontSize="10" fontFamily="var(--font-mono)">P·B</text>
              </>
            )}
            <text x="240" y="40" fill="var(--ink-faint)" fontSize="10" fontFamily="var(--font-mono)">
              {extended ? 'AVANCE · F = P × A' : 'RETROCESO · F = P × (A − a)'}
            </text>
          </svg>
        </div>

        <div className="row" style={{ gap: 12 }}>
          {mode === 'doble' ? (
            <>
              <button className={`btn ${extended ? 'is-active' : ''}`} style={AX} aria-pressed={extended} onClick={() => setExtended(true)}>▸ EXTENDER (AVANCE)</button>
              <button className={`btn ${!extended ? 'is-active' : ''}`} style={AX} aria-pressed={!extended} onClick={() => setExtended(false)}>◂ RETRAER (RETROCESO)</button>
            </>
          ) : (
            <button className={`btn ${extended ? 'is-active' : ''}`} style={AX} aria-pressed={extended} onClick={() => setExtended((e) => !e)}>
              {extended ? '⚡ SOLENOIDE ENERGIZADO' : '⚡ ENERGIZAR SOLENOIDE'}
            </button>
          )}
          <span className="hint-chip">{mode === 'doble' ? '5/2 · MEMORIA NEUMÁTICA' : '3/2 · RETORNO POR RESORTE'}</span>
        </div>

        <div className="grid-3">
          <label className="col" style={{ gap: 4 }}>
            <span className="mono-label">PRESIÓN · {pressure.toFixed(1)} bar</span>
            <input type="range" min={3} max={8} step={0.5} value={pressure} onChange={(e) => setPressure(Number(e.target.value))} aria-label="Presión de aire en bar" style={{ '--c': 'var(--act-neum)', '--fill': `${((pressure - 3) / 5) * 100}%` } as React.CSSProperties} />
          </label>
          <label className="col" style={{ gap: 4 }}>
            <span className="mono-label">DIÁMETRO PISTÓN · Ø{bore} mm</span>
            <input type="range" min={16} max={63} step={1} value={bore} onChange={(e) => setBore(Number(e.target.value))} aria-label="Diámetro del pistón en milímetros" style={{ '--c': 'var(--act-neum)', '--fill': `${((bore - 16) / 47) * 100}%` } as React.CSSProperties} />
          </label>
          <label className="col" style={{ gap: 4 }}>
            <span className="mono-label">CARRERA · {stroke} mm</span>
            <input type="range" min={25} max={300} step={5} value={stroke} onChange={(e) => setStroke(Number(e.target.value))} aria-label="Carrera del cilindro en milímetros" style={{ '--c': 'var(--act-neum)', '--fill': `${((stroke - 25) / 275) * 100}%` } as React.CSSProperties} />
          </label>
        </div>

        <div className="grid-4">
          <div className="readout" style={AX}><div className="lbl">ÁREA PISTÓN</div><div className="val" style={{ fontSize: 20 }}>{areaPiston.toFixed(2)} <span style={{ fontSize: '.6em' }}>cm²</span></div></div>
          <div className="readout" style={AX}><div className="lbl">FUERZA AVANCE</div><div className="val" style={{ fontSize: 20 }}>{Math.round(forceAdvance)} <span style={{ fontSize: '.6em' }}>N</span></div></div>
          <div className="readout" style={AX}><div className="lbl">FUERZA RETROCESO</div><div className="val" style={{ fontSize: 20 }}>{mode === 'doble' ? Math.round(forceRetract) : '—'} <span style={{ fontSize: '.6em' }}>{mode === 'doble' ? 'N' : ''}</span></div></div>
          <div className="readout" style={AX}><div className="lbl">ESTADO</div><div className="val" style={{ fontSize: 18 }}>{extended ? 'EXTENDIDO' : 'RETRAÍDO'}</div></div>
        </div>

        <p className="sim-note" style={{ marginTop: 0 }}>
          <b>Simple efecto:</b> un solo puerto y retorno por resorte (válvula 3/2). <b>Doble efecto:</b> dos puertos y fuerza en ambos sentidos (válvula 5/2); el retroceso resta el área del vástago.
        </p>
      </div>
    </div>
  );
}
