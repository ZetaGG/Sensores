import { useState, useRef } from 'react';

type Sensor = 'mec' | 'ind' | 'cap' | 'fot' | 'ult' | 'mag';
type Mat = 'metal' | 'plast' | 'vidrio' | 'madera' | 'iman' | 'agua';

const SENSORS: { id: Sensor; label: string; prin: string; maxim: number }[] = [
  { id: 'mec', label: 'FIN DE CARRERA', prin: 'CONTACTO FÍSICO', maxim: 155 },
  { id: 'ind', label: 'INDUCTIVO', prin: 'CAMPO MAGNÉTICO OSCILANTE', maxim: 270 },
  { id: 'cap', label: 'CAPACITIVO', prin: 'CAMPO ELÉCTRICO', maxim: 240 },
  { id: 'fot', label: 'FOTOELÉCTRICO', prin: 'HAZ DE LUZ IR', maxim: 330 },
  { id: 'ult', label: 'ULTRASÓNICO', prin: 'ECO DE SONIDO', maxim: 380 },
  { id: 'mag', label: 'MAGNÉTICO', prin: 'CAMPO DE IMÁN', maxim: 310 },
];

const MATERIALS: { id: Mat; label: string; fill: string; stroke: string }[] = [
  { id: 'metal', label: 'METAL', fill: '#8b9bb4', stroke: '#c7d3e4' },
  { id: 'plast', label: 'PLÁSTICO', fill: '#e07a3f', stroke: '#ffb020' },
  { id: 'vidrio', label: 'VIDRIO', fill: '#2e4a63', stroke: '#7dd3fc' },
  { id: 'madera', label: 'MADERA', fill: '#8a6238', stroke: '#c9a227' },
  { id: 'iman', label: 'IMÁN', fill: '#a0405a', stroke: '#f472b6' },
  { id: 'agua', label: 'AGUA', fill: '#1c4f6e', stroke: '#38bdf8' },
];

const OBJ_W = 52, OBJ_H = 54;
const VIEW = { W: 720, H: 300 };
const AX = { '--c': 'var(--ch-prox)' } as React.CSSProperties;

export default function ProximityLab() {
  const [sensor, setSensor] = useState<Sensor>('ind');
  const [mat, setMat] = useState<Mat>('metal');
  const [x, setX] = useState(420);
  const stageRef = useRef<HTMLDivElement>(null);

  const S = SENSORS.find((s) => s.id === sensor)!;
  const M = MATERIALS.find((m) => m.id === mat)!;

  let range = S.maxim;
  if (sensor === 'cap' && mat !== 'metal' && mat !== 'agua') range = 200;
  if (sensor === 'ind' && mat !== 'metal') range = -1;
  if (sensor === 'mag' && mat !== 'iman') range = -1;

  const det = sensor === 'mec' ? x < range : (range > 0 && x < range);
  const dist = Math.max(0, Math.min(500, Math.round(((x - 84) / (VIEW.W - 170)) * 500)));

  const drag = (clientX: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    setX(Math.min(VIEW.W - 90, Math.max(100, (clientX - r.left) * (VIEW.W / r.width))));
  };

  const fc = sensor === 'ind' ? '#3ddc84' : sensor === 'cap' ? '#9b8cff' : sensor === 'fot' ? '#ffb020' : sensor === 'ult' ? '#7dd3fc' : sensor === 'mag' ? '#38bdf8' : '#8fa3bc';

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag">
        <span>BANCO 05 · PROXIMIDAD — SELECTOR DE SENSOR × MATERIAL</span>
        <span>{det ? '● DETECTADO' : '○ SIN DETECCIÓN'}</span>
      </div>
      <div className="panel-inner col" style={{ gap: 16 }}>

        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          {SENSORS.map((s) => (
            <button key={s.id} className={`btn ${sensor === s.id ? 'is-active' : ''}`} style={AX} onClick={() => setSensor(s.id)} aria-pressed={sensor === s.id}>
              {s.label}
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
            <line x1="16" y1="252" x2={VIEW.W - 16} y2="252" stroke="#22304a" strokeWidth="3" />
            {[90, 170, 250, 330, 410, 490, 570, 650].map((rx) => (
              <circle key={rx} cx={rx} cy="248" r="4" fill="#0f1b30" stroke="#22304a" strokeWidth="1.5" />
            ))}

            {range > 0 && (
              <g>
                <line x1={range} y1="60" x2={range} y2="250" stroke={fc} strokeWidth="1" strokeDasharray="5 5" opacity="0.7" />
                <text x={range + 6} y="72" className="mono" style={{ fill: fc, fontSize: 10 }}>ALCANCE ~{(range / 3).toFixed(0)}cm</text>
              </g>
            )}

            {sensor === 'ind' && (
              <g stroke="#3ddc84" fill="none" strokeWidth="1.5" className="field-lines" opacity="0.8">
                {[0, 12, 24].map((dy) => (
                  <ellipse key={dy} cx="110" cy={185 + dy * 2} rx={140 - dy * 2} ry={42 + dy} />
                ))}
              </g>
            )}
            {sensor === 'cap' && (
              <g stroke="#9b8cff" fill="none" strokeWidth="1.5" className="field-lines" opacity="0.85">
                {[0, 10, 20].map((dy) => (
                  <ellipse key={dy} cx="118" cy={175 + dy * 3} rx={150 - dy * 3} ry={55 + dy} />
                ))}
              </g>
            )}
            {sensor === 'fot' && (
              <polygon className="zone-detect" points={`92,150 ${range + 60},46 ${range + 60},256`} />
            )}
            {sensor === 'ult' && (
              <g>
                {[1, 2, 3, 4].map((i) => (
                  <circle key={i} cx="110" cy="180" r={18 + i * 34} fill="none" stroke="#7dd3fc" strokeWidth="1"
                    opacity={0.6 - i * 0.1} className={i <= 2 ? 'wave-rings' : ''}
                    style={i <= 2 ? { transformOrigin: '110px 180px' } : undefined} />
                ))}
              </g>
            )}
            {sensor === 'mag' && (
              <g stroke="#38bdf8" fill="none" strokeWidth="1.5" className="field-lines" opacity="0.8">
                {[0, 11, 22].map((dy) => (
                  <ellipse key={dy} cx="120" cy={170 + dy * 3} rx={150 - dy * 4} ry={50 + dy} />
                ))}
              </g>
            )}

            <rect x="38" y="120" width="46" height={sensor === 'mec' ? 70 : 90} rx="5" fill="#0f1b30"
              stroke={sensor === 'mec' ? '#8fa3bc' : fc} strokeWidth="2" />
            <circle cx="61" cy={sensor === 'mec' ? 158 : 165} r="8" fill="#22304a"
              stroke={sensor === 'mec' ? '#8fa3bc' : fc} strokeWidth="1.5" />
            {sensor === 'mec' && (
              <g style={{ transform: `rotate(${det ? -34 : 22}deg)`, transformOrigin: '84px 224px', transition: 'transform .3s' }}>
                <line x1="84" y1="224" x2="118" y2="196" stroke="#8fa3bc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="118" cy="196" r="6" fill="#0f1b30" stroke="#8fa3bc" strokeWidth="2" />
              </g>
            )}
            <text x="34" y="110" className="mono" style={{ fill: sensor === 'mec' ? '#8fa3bc' : fc, fontSize: 9.5, letterSpacing: '.1em' }}>{S.label}</text>

            <g style={{ cursor: 'grab' }}>
              <ellipse cx={x + OBJ_W / 2} cy="250" rx="30" ry="5" fill="rgba(0,0,0,.5)" />
              <rect x={x} y={252 - OBJ_H} width={OBJ_W} height={OBJ_H} rx="5" fill={M.fill}
                stroke={M.stroke} strokeWidth="2" opacity={mat === 'vidrio' ? 0.55 : 1} className={det ? 'pulse' : ''} />
              {mat === 'iman' && (
                <g transform={`translate(${x + 10},${252 - OBJ_H + 8})`}>
                  <rect width="18" height="18" rx="2" fill="#e11d48" />
                  <rect x="18" width="18" height="18" rx="2" fill="#164e63" />
                  <text x="8" y="13" className="mono" style={{ fill: '#fff', fontSize: 8 }}>N</text>
                  <text x="26" y="13" className="mono" style={{ fill: '#fff', fontSize: 8 }}>S</text>
                </g>
              )}
              {mat === 'agua' && (
                <g transform={`translate(${x + 8},${252 - OBJ_H + 8})`}>
                  <path d="M0 14 Q 9 -6 18 14 Z" fill="#38bdf8" opacity="0.85" />
                  {[4, 10, 16].map((xx) => (
                    <line key={xx} x1={xx} y1="16" x2={xx} y2="30" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" />
                  ))}
                </g>
              )}
              {det && (
                <circle cx={x + OBJ_W / 2} cy="214" r="12" fill="none" stroke="#3ddc84" strokeWidth="1.5"
                  className="wave-rings" style={{ transformOrigin: `${x + OBJ_W / 2}px 214px` }} />
              )}
              <text x={x + OBJ_W / 2} y="278" textAnchor="middle" className="mono obj-label" style={{ fill: M.stroke }}>{M.label}</text>
            </g>
          </svg>
        </div>

        <div className="grid-2">
          <div className="readout" style={AX}>
            <div className="lbl">ESTADO</div>
            <div className="val" style={{ color: det ? 'var(--ok)' : 'var(--err)', textShadow: `0 0 12px ${det ? 'rgba(61,220,132,.55)' : 'rgba(255,90,60,.55)'}` }}>
              {det ? '● DETECTADO' : '○ SIN DETECCIÓN'}
            </div>
          </div>
          <div className="readout" style={AX}>
            <div className="lbl">DISTANCIA ESTIMADA</div>
            <div className="val">{dist} mm</div>
          </div>
        </div>

        <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="mono-label" style={{ marginRight: 4 }}>MATERIAL:</span>
          {MATERIALS.map((m) => (
            <button key={m.id} className={`btn ${mat === m.id ? 'is-active' : ''}`} style={AX} onClick={() => setMat(m.id)} aria-pressed={mat === m.id}>
              {m.label}
            </button>
          ))}
          <input
            type="range" min="100" max="640" value={x}
            style={{ '--c': 'var(--ch-prox)', '--fill': `${((x - 100) / 540) * 100}%`, flex: 1, minWidth: 180 } as React.CSSProperties}
            onChange={(e) => setX(Number(e.target.value))}
            aria-label="Posición del objeto"
          />
        </div>

        <p className="sim-note">
          <b>{S.label} · {S.prin}.</b>{' '}
          {sensor === 'ind' && (mat === 'metal' ? ' El campo oscilante detecta al metal: ¡señal!' : ' Solo reacciona a metales. ¡Cambia el material!')}
          {sensor === 'cap' && (mat === 'metal' || mat === 'agua' ? ' El agua y el metal tienen alta constante dieléctrica.' : ' Los materiales no conductores funcionan con menor alcance.')}
          {sensor === 'fot' && ' El objeto refleja el haz infrarrojo: casi cualquier sólido opaco. '}
          {sensor === 'ult' && ' Eco regresa de cualquier superficie que refleje sonido: sólidos y líquidos. '}
          {sensor === 'mag' && (mat === 'iman' ? ' El imán permanente acciona la conmutación magnética.' : ' Solo responde a imanes. ¿Qué objeto es magnético?')}
          {sensor === 'mec' && (det ? '¡Contacto! El brazo conmuta.' : ' Acerca el objeto hasta tocar el brazo mecánico.')}
        </p>
      </div>
    </div>
  );
}
