import { useState, useRef, useEffect } from 'react';

type Mode = 'barrera' | 'reflex' | 'difuso';

const MODES: { id: Mode; label: string; range: string; note: string }[] = [
  { id: 'barrera', label: 'BARRERA DE LUZ', range: 'hasta 20–270 m', note: 'Emisor y receptor enfrentados. El objeto corta el haz. Alineación crítica. Ideal para accesos y cintas.' },
  { id: 'reflex', label: 'RETRO-REFLECTIVO', range: '1–3 m', note: 'Emisor y receptor en el mismo cuerpo; un espejo reflector devuelve el haz. Popular y barato, un solo cableado.' },
  { id: 'difuso', label: 'REFLECTIVO DIFUSO', range: '12–300 mm', note: 'Sin espejo: el propio objeto refleja la luz. Distancia corta, pero no necesitas acceder a ambos lados.' },
];

const VIEW = { W: 720, H: 300 };
const OBJ_W = 56, OBJ_H = 58;

function detected(mode: Mode, x: number): boolean {
  if (mode === 'barrera') return x > 120 && x < 600;
  if (mode === 'reflex') return x > 200 && x < 560;
  return x < 430;
}

const AX = { '--c': 'var(--ch-optico)' } as React.CSSProperties;

export default function OpticalModes() {
  const [mode, setMode] = useState<Mode>('barrera');
  const [x, setX] = useState(340);
  const [hits, setHits] = useState(0);
  const prevDet = useRef<boolean | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const M = MODES.find((m) => m.id === mode)!;
  const det = detected(mode, x);

  useEffect(() => {
    if (prevDet.current === false && det === true && mode !== 'difuso') {
      setHits((h) => h + 1);
    }
    prevDet.current = det;
  }, [det, mode]);

  const drag = (clientX: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    setX(Math.min(VIEW.W - 90, Math.max(50, (clientX - r.left) * (VIEW.W / r.width))));
  };

  const beamColor = det ? '#7dd3fc' : '#ff5a3c';
  const beamClass = `beam ${det ? '' : 'beam-cut'}`;

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag">
        <span>BANCO 02 · SENSORES ÓPTICOS — MODO DE DETECCIÓN</span>
        <span>ARRÁSTRALA · {det ? 'HAZ ROMPIDO ► DETECTA' : 'HAZ COMPLETO'}</span>
      </div>
      <div className="panel-inner col" style={{ gap: 16 }}>

        <div className="row">
          {MODES.map((m) => (
            <button key={m.id} className={`btn ${mode === m.id ? 'is-active' : ''}`} style={AX} onClick={() => setMode(m.id)} aria-pressed={mode === m.id}>
              {m.label}
            </button>
          ))}
        </div>

        <div ref={stageRef} className="sim-stage graticule drag-zone" style={{ touchAction: 'none' }}>
          <svg
            viewBox={`0 0 ${VIEW.W} ${VIEW.H}`}
            style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none' }}
            onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); drag(e.clientX); }}
            onPointerMove={(e) => { if (e.buttons > 0) drag(e.clientX); }}
          >
            <line x1="20" y1="252" x2={VIEW.W - 20} y2="252" stroke="#22304a" strokeWidth="2" />
            {[100, 190, 280, 370, 460, 550, 640].map((rx) => (
              <circle key={rx} cx={rx} cy="248" r="5" fill="#0f1b30" stroke="#22304a" strokeWidth="1.5" />
            ))}

            {mode === 'difuso' && (
              <g>
                <polygon className="zone-detect" points={`80,150 ${VIEW.W - 40},40 ${VIEW.W - 40},260`} />
                <text x={VIEW.W - 56} y="30" style={{ fill: '#8fa3bc', fontSize: 11 }} className="mono">ZONA ~300mm</text>
              </g>
            )}

            {mode === 'reflex' && (
              <g>
                <rect x="640" y="120" width="34" height="110" rx="3" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
                {[140, 165, 190, 215].map((yy) => (
                  <line key={yy} x1="644" y1={yy} x2="670" y2={yy} stroke="#ffb020" strokeWidth="1" opacity="0.5" />
                ))}
                <text x="622" y="112" style={{ fill: '#8fa3bc', fontSize: 10 }} className="mono">ESPEJO</text>
              </g>
            )}

            {mode === 'barrera' && (
              <g>
                <rect x="660" y="150" width="40" height="80" rx="4" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
                <circle cx="668" cy="190" r="7" fill="#22304a" stroke={det ? '#ff5a3c' : '#3ddc84'} strokeWidth="1.5" />
                <text x="655" y="242" style={{ fill: '#8fa3bc', fontSize: 10 }} className="mono">R</text>
              </g>
            )}

            <g>
              <rect x="40" y="140" width="52" height="100" rx="5" fill="#0f1b30" stroke="#33465f" strokeWidth="2" />
              <circle cx="64" cy={mode === 'barrera' ? 190 : 170} r="8" fill="#22304a" stroke="#ffb020" strokeWidth="1.5" />
              <text x="28" y="252" style={{ fill: '#8fa3bc', fontSize: 10 }} className="mono">{mode === 'barrera' ? 'E' : 'E · R'}</text>
            </g>

            {mode === 'barrera' && (
              <line x1="96" y1="190" x2="656" y2="190" stroke={beamColor} strokeWidth="2.5" className={beamClass} />
            )}
            {mode === 'reflex' && (
              <g>
                <line x1="96" y1="160" x2="636" y2="150" stroke={beamColor} strokeWidth="2" className={beamClass} />
                <line x1="636" y1="150" x2="100" y2="196" stroke={beamColor} strokeWidth="2" className={beamClass} opacity="0.8" />
              </g>
            )}
            {mode === 'difuso' && (
              <g>
                <line x1="84" y1="170" x2={Math.min(x, VIEW.W - 40)} y2="150" stroke={beamColor} strokeWidth="1.5" className={beamClass} />
                <line x1="84" y1="170" x2={Math.min(x, VIEW.W - 40)} y2="210" stroke={beamColor} strokeWidth="1.5" className={beamClass} opacity="0.7" />
                {det && <line x1={x} y1="160" x2="92" y2="196" stroke={beamColor} strokeWidth="1.5" className={beamClass} opacity="0.6" />}
              </g>
            )}

            <g style={{ cursor: 'grab' }}
              onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); drag(e.clientX); }}
              onPointerMove={(e) => { if (e.buttons > 0) drag(e.clientX); }}
            >
              <ellipse cx={x + OBJ_W / 2} cy="250" rx="34" ry="5" fill="rgba(0,0,0,.5)" />
              <rect
                x={x} y={252 - OBJ_H} width={OBJ_W} height={OBJ_H} rx="4"
                fill={det ? '#1a2b45' : '#11203a'}
                stroke={det ? '#ff5a3c' : '#33465f'} strokeWidth="2"
                className={det ? 'pulse' : ''}
              />
              <line x1={x + 14} y1={252 - OBJ_H + 8} x2={x + 14} y2="250" stroke="#33465f" strokeWidth="2" />
              <line x1={x + 28} y1={252 - OBJ_H + 8} x2={x + 28} y2="250" stroke="#33465f" strokeWidth="2" />
              <line x1={x + 42} y1={252 - OBJ_H + 8} x2={x + 42} y2="250" stroke="#33465f" strokeWidth="2" />
              {det && (
                <circle cx={x + OBJ_W / 2} cy="216" r="12" fill="none" stroke="#ff5a3c" strokeWidth="1.5" className="wave-rings" style={{ transformOrigin: `${x + OBJ_W / 2}px 216px` }} />
              )}
            </g>
          </svg>
        </div>

        <div className="row" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center' }}>
          <input
            type="range" min="50" max="640" value={x}
            style={{ '--c': 'var(--ch-optico)', '--fill': `${((x - 50) / 590) * 100}%` } as React.CSSProperties}
            onChange={(e) => setX(Number(e.target.value))}
            aria-label="Posición de la pieza"
          />
          <div className="readout" style={AX}>
            <div className="lbl">{mode === 'barrera' ? 'HAZ' : mode === 'reflex' ? 'RETORNO DEL HAZ' : 'REFLEXIÓN DEL OBJETO'}</div>
            <div className="val">{det ? 'INTERRUMPIDO — DETECTA' : 'COMPLETO — SIN DETECCIÓN'}</div>
          </div>
        </div>

        <div className="sim-legend">
          <span><i style={{ background: '#7dd3fc' }}></i>Haz de luz</span>
          <span><i style={{ background: '#ff5a3c' }}></i>Detección (haz roto)</span>
          <span><i className="dot-sm" style={{ background: 'var(--ok)' }}></i>Piezas contadas: <b className="mono" style={{ color: 'var(--ink)' }}>{hits}</b></span>
        </div>

        <p className="sim-note">
          <b>{M.label} · {M.range}.</b> {M.note}
        </p>
      </div>
    </div>
  );
}