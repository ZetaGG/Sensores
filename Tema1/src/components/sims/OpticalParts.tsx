import { useState } from 'react';

const PARTS = [
  { id: 'f', icon: '▾', name: 'FUENTE (EMISOR)', rol: 'LED o láser que genera el haz de luz.', det: 'Generalmente luz visible o infrarroja. En sensores industriales emite en ráfagas para distinguirse de la luz ambiental.' },
  { id: 'l1', icon: '◍', name: 'LENTES', rol: 'Concentran el haz y el retorno.', det: 'Pequeñas lentes ópticas en emisor y receptor focalizan la luz y amplían el alcance del sistema.' },
  { id: 'r', icon: '◎', name: 'RECEPTOR', rol: 'Fotodiodo o fototransistor.', det: 'Convierte la luz que le llega en corriente. Es la parte más sensible del sensor y suele limitar su vida útil.' },
  { id: 'c', icon: '∿', name: 'CIRCUITO DE SALIDA', rol: 'Amplifica y adapta la señal.', det: 'Toma la minúscula señal del receptor y la convierte en una salida que el PLC o microcontrolador entienda (NPN/PNP, 0-10V, 4-20mA).' },
];

const AX = { '--c': 'var(--ch-optico)' } as React.CSSProperties;
const STEP = { id: 'gap', lbl: 'HAZ DE LUZ', icon: '⤍' };

const chain: { id: string; lbl: string; icon: string }[] = [
  { id: 'f', lbl: 'FUENTE', icon: '▾' },
  { id: 'l1', lbl: 'LENTE', icon: '◍' },
  STEP,
  { id: 'r', lbl: 'RECEPTOR', icon: '◎' },
  { id: 'c', lbl: 'SALIDA', icon: '∿' },
];

export default function OpticalParts() {
  const [sel, setSel] = useState('f');
  const p = PARTS.find((pp) => pp.id === sel)!;

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag"><span>DESPIECE · COMPONENTES DEL SENSOR ÓPTICO</span><span>TOCA CADA PARTE</span></div>
      <div className="panel-inner col" style={{ gap: 16 }}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          {PARTS.map((pp) => (
            <button key={pp.id} className={`btn ${sel === pp.id ? 'is-active' : ''}`} style={AX} onClick={() => setSel(pp.id)} aria-pressed={sel === pp.id}>
              {pp.icon} {pp.name}
            </button>
          ))}
        </div>

        <div className="sim-stage graticule row" style={{ padding: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {chain.map((s, i) => (
            <div key={s.id} className="row" style={{ gap: 0 }}>
              <button
                type="button"
                className="optical-part"
                style={{
                  cursor: s.id === 'gap' ? 'default' : 'pointer',
                  textAlign: 'center', padding: '12px 10px', minWidth: 86, borderRadius: 6,
                  border: `1px solid ${sel === s.id ? 'var(--ch-optico)' : '#1c2a3f'}`,
                  background: sel === s.id ? 'rgba(255,176,32,.09)' : '#0c1524',
                  boxShadow: sel === s.id ? '0 0 16px rgba(255,176,32,.25)' : 'none',
                  transition: 'all .2s',
                }}
                onClick={() => s.id !== 'gap' && setSel(s.id)}
                disabled={s.id === 'gap'}
                aria-pressed={s.id === 'gap' ? undefined : sel === s.id}
                aria-label={s.id === 'gap' ? 'Haz de luz' : `Seleccionar ${s.lbl}`}
              >
                <div style={{ fontSize: 20, color: 'var(--ch-optico)' }}>{s.icon}</div>
                <div className="mono" style={{ fontSize: 9.5, letterSpacing: '.1em', color: 'var(--ink-dim)' }}>{s.lbl}</div>
              </button>
              {i < 4 && <span style={{ margin: '0 6px', color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>→</span>}
            </div>
          ))}
        </div>

        <div className="row" style={{ alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: 'var(--ch-optico)' }}>{p.icon}</span>
          <div>
            <div className="mono" style={{ fontWeight: 600, letterSpacing: '.04em', fontSize: 13 }}>{p.name}</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-dim)', marginTop: 2 }}>{p.rol} <span className="mono" style={{ color: 'var(--ink-faint)', fontSize: 11 }}>—</span> {p.det}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
