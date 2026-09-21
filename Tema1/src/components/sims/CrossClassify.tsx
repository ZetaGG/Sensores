import { useState } from 'react';

const SALIDA = ['Analógica', 'Digital'] as const;
const CONTACTO = ['Con contacto', 'Sin contacto'] as const;

const EXAMPLES: Record<string, { name: string; desc: string; icon: string }> = {
  'Analógica|Con contacto': { name: 'Potenciómetro', icon: '⏦', desc: 'Un cursor mecánico recorre una resistencia: el contacto físico varía la resistencia de forma continua.' },
  'Analógica|Sin contacto': { name: 'Termopar / LDR', icon: '◍', desc: 'Sin fricción: la temperatura o la luz modifican la señal eléctrica de forma continua y proporcional.' },
  'Digital|Con contacto': { name: 'Fin de carrera', icon: '⇋', desc: 'Un interruptor mecánico que solo sabe dos cosas: accionado o no accionado.' },
  'Digital|Sin contacto': { name: 'Fotocélula IR', icon: '◪', desc: 'Detecta por luz sin tocar el objeto: su salida es un estado ON/OFF. Ideal para alta velocidad.' },
};

const AX = { '--c': 'var(--ch-intro)' } as React.CSSProperties;

export default function CrossClassify() {
  const [s, setS] = useState<(typeof SALIDA)[number]>('Analógica');
  const [c, setC] = useState<(typeof CONTACTO)[number]>('Con contacto');
  const ex = EXAMPLES[`${s}|${c}`];

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag"><span>CLASIFICADOR CRUZADO</span><span>2 EJES · 4 COMBINACIONES</span></div>
      <div className="panel-inner col" style={{ gap: 16 }}>
        <div className="grid-2">
          <div className="col" style={{ gap: 8 }}>
            <span className="mono-label">SEÑAL DE SALIDA</span>
            <div className="row">
              {SALIDA.map((x) => (
                <button key={x} className={`btn ${s === x ? 'is-active' : ''}`} style={AX} onClick={() => setS(x)} aria-pressed={s === x}>
                  {x === 'Analógica' ? '◉' : '◻'} {x}
                </button>
              ))}
            </div>
          </div>
          <div className="col" style={{ gap: 8 }}>
            <span className="mono-label">MODO DE DETECCIÓN</span>
            <div className="row">
              {CONTACTO.map((x) => (
                <button key={x} className={`btn ${c === x ? 'is-active' : ''}`} style={AX} onClick={() => setC(x)} aria-pressed={c === x}>
                  {x === 'Con contacto' ? '⛓' : '⟡'} {x}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sim-stage graticule row" style={{ padding: 22 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'var(--ch-intro)' }}>{ex.icon}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>{ex.name}</div>
            <p style={{ color: 'var(--ink-dim)', fontSize: 13.5, marginTop: 4 }}>{ex.desc}</p>
          </div>
        </div>

        <p className="sim-note" style={{ marginTop: 0 }}>
          <b>Úsalo así:</b> cualquier sensor real cae en una de estas cuatro casillas al cruzar ambos ejes.
        </p>
      </div>
    </div>
  );
}