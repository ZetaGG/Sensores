import { useState } from 'react';

type Card = { id: string; name: string; kind: 'analog' | 'digital'; hint: string; icon: string };

const CARDS: Card[] = [
  { id: 'pot', name: 'Potenciómetro', kind: 'analog', hint: 'resistencia continua según gira el eje', icon: '⏦' },
  { id: 'tc', name: 'Termopar', kind: 'analog', hint: 'voltaje continuo proporcional a la temperatura', icon: '◍' },
  { id: 'fin', name: 'Fin de carrera', kind: 'digital', hint: 'abierto/cerrado, sin estados intermedios', icon: '⇋' },
  { id: 'ldr', name: 'LDR', kind: 'analog', hint: 'resistencia variable con la intensidad de luz', icon: '◉' },
  { id: 'ir', name: 'Fotocélula IR', kind: 'digital', hint: 'salida binaria: detecta / no detecta', icon: '◪' },
  { id: 'gal', name: 'Galga extensiométrica', kind: 'analog', hint: 'resistencia proporcional a la deformación', icon: '∿' },
];

const BINS: { id: 'analog' | 'digital'; label: string; sub: string; icon: string }[] = [
  { id: 'analog', label: 'ANALÓGICO', sub: 'señal continua · infinitos valores', icon: '◉' },
  { id: 'digital', label: 'DIGITAL', sub: 'estados discretos · ON/OFF', icon: '◻' },
];

const AX = { '--c': 'var(--ch-intro)' } as React.CSSProperties;

export default function ClassifyGame() {
  const [assigned, setAssigned] = useState<Partial<Record<string, 'analog' | 'digital'>>>({});
  const [armed, setArmed] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const leftover = CARDS.filter((c) => !assigned[c.id]);
  const assignedList = (bin: string) => CARDS.filter((c) => assigned[c.id] === bin);
  const correct = CARDS.filter((c) => assigned[c.id] === c.kind).length;
  const done = leftover.length === 0;

  const place = (bin: 'analog' | 'digital') => {
    if (!armed || revealed) return;
    setAssigned((a) => ({ ...a, [armed]: bin }));
    setArmed(null);
  };

  const pullBack = (id: string) => {
    if (revealed) return;
    setAssigned((a) => { const n = { ...a }; delete n[id]; return n; });
  };

  const reset = () => { setAssigned({}); setArmed(null); setRevealed(false); };

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag"><span>BANCO 01 · CLASIFICACIÓN DE LA SEÑAL</span><span>{done ? `${correct}/${CARDS.length}` : '1 · ELIGE TARJETA — 2 · COLÓCALA EN UNA CATEGORÍA'}</span></div>
      <div className="panel-inner col" style={{ gap: 18 }}>

        <div className="row">
          <span className={`chip ${armed ? '' : ''}`} style={armed ? undefined : { opacity: 0.55 }}>
            {armed ? `SELECCIONADA: ${CARDS.find((c) => c.id === armed)?.name.toUpperCase()}` : 'TOCA UNA TARJETA PARA SELECCIONARLA'}
          </span>
          <span className="text-faint mono-label">→</span>
          <span className="chip">TOCA LA CATEGORÍA PARA COLOCARLA</span>
          {done && !revealed && (
            <button className="btn is-active" style={AX} onClick={() => setRevealed(true)}>VERIFICAR</button>
          )}
          {revealed && (
            <>
              <button className="btn" onClick={reset}>REINICIAR</button>
              <span className="mono" style={{ color: correct === CARDS.length ? 'var(--ok)' : 'var(--warn)', fontSize: 12 }}>
                {correct === CARDS.length ? '✓ 6/6 — CLASIFICACIÓN PERFECTA' : `${correct}/6 — LAS INCORRECTAS QUEDAN MARCADAS`}
              </span>
            </>
          )}
        </div>

        <div className="col" style={{ padding: 14, border: '1px dashed var(--line)', borderRadius: 'var(--radius)', gap: 10 }}>
          <span className="mono-label">BANDEJA DE COMPONENTES</span>
          {leftover.length === 0 && <span className="mono" style={{ fontSize: 12, color: 'var(--ink-dim)' }}>Vacía — todas clasificadas.</span>}
          <div className="row" style={{ gap: 10 }}>
            {leftover.map((c) => (
              <button
                key={c.id}
                className="quiz-opt grab"
                style={{
                  width: 'auto', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
                  ...(armed === c.id ? { borderColor: 'var(--ch-intro)', color: 'var(--ink)', background: 'rgba(155,140,255,.08)' } : {}),
                }}
                onClick={() => setArmed(revealed ? armed : (armed === c.id ? null : c.id))}
                aria-pressed={armed === c.id}
              >
                <span style={{ fontSize: 16 }}>{c.icon}</span>
                <span className="col" style={{ gap: 0, alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{c.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid-2">
          {BINS.map((b) => (
            <div
              key={b.id}
              className="quiz-opt"
              style={{
                minHeight: 110, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start',
                ...(armed ? { borderColor: 'var(--ch-intro)', borderStyle: 'dashed' } : {}),
              }}
            >
              <button type="button" className="bin-target" onClick={() => place(b.id)} disabled={revealed} aria-label={`Colocar tarjeta en categoría ${b.label}`}>
                <span className="mono" style={{ fontWeight: 700, letterSpacing: '.06em', fontSize: 13 }}>{b.icon} {b.label}</span>
                <span className="mono-label" style={{ fontSize: 10 }}>{b.sub}</span>
              </button>
              <div className="row" style={{ marginTop: 4, gap: 6 }} role="list" aria-label={`Tarjetas en ${b.label}`}>
                {assignedList(b.id).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="chip assigned-chip"
                    style={revealed ? (c.kind === b.id ? { color: 'var(--ok)', borderColor: 'var(--ok)' } : { color: 'var(--err)', borderColor: 'var(--err)' }) : undefined}
                    onClick={() => pullBack(c.id)}
                    disabled={revealed}
                    aria-label={`Devolver ${c.name} a la bandeja`}
                  >
                    {c.icon} {c.name} {revealed && (c.kind === b.id ? '✓' : '✗')}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="sim-note" style={{ marginTop: 0 }}>
          <b>Regla práctica:</b> si la señal puede tener <em>cualquier valor intermedio</em> (temperatura, luz, deformación),
          es analógica. Si solo conmuta entre <em>dos estados</em>, es digital.
        </p>
      </div>
    </div>
  );
}
