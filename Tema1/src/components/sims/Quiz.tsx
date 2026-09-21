import { useEffect, useRef, useState } from 'react';

export type QuizQuestion = { q: string; opts: string[]; ans: number; why: string };

const DEFAULT_BANK: QuizQuestion[] = [
  { q: 'Un sensor es un dispositivo que…', opts: ['Genera movimiento a partir de una señal', 'Produce una señal relacionada con la magnitud que mide', 'Almacena datos de proceso', 'Amplifica potencia eléctrica'], ans: 1, why: 'El sensor transforma una magnitud física (temperatura, luz, presión…) en una señal utilizable por el sistema de control.' },
  { q: 'Según la antología, la relación entre sensor y transductor es:', opts: ['Son conceptos opuestos', 'El transductor mide y el sensor actúa', 'Los sensores son transductores: todo sensor convierte una magnitud en señal', 'Solo los digitales son transductores'], ans: 2, why: 'El transductor es el elemento que experimenta un cambio relacionado con una magnitud física; el sensor es ese transductor orientado a medir.' },
  { q: '¿Qué configuración óptica alcanza la mayor distancia de detección?', opts: ['Reflectivo difuso (12–300 mm)', 'Retro-reflectivo (1–3 m)', 'Barrera de luz (hasta 20–270 m)', 'Todas igual'], ans: 2, why: 'En barrera, emisor y receptor separados: el haz corre sin necesidad de reflexión y alcanza cientos de metros.' },
  { q: 'En el modo retro-reflectivo, ¿qué devuelve el haz al receptor?', opts: ['El propio objeto', 'Un espejo reflector', 'El emisor', 'La luz ambiental'], ans: 1, why: 'Emisor y receptor van en el mismo cuerpo; el haz viaja a un espejo y regresa. Al interrumpirlo se detecta.' },
  { q: 'Un termistor NTC, al aumentar la temperatura…', opts: ['Aumenta su resistencia', 'Disminuye su resistencia', 'Genera voltaje', 'Conmuta a ON'], ans: 1, why: 'NTC = Negative Temperature Coefficient: la resistencia baja al calentar. Muy sensible (~200 Ω/°C) en rangos cortos.' },
  { q: 'Un RTD Pt100 a 0 °C presenta una resistencia de:', opts: ['0 Ω', '100 Ω', '1000 Ω', '10 kΩ'], ans: 1, why: 'Pt100: platino, 100 Ω a 0 °C, casi lineal, hasta ~850 °C. Pasa corriente y mides el voltaje para conocer R.' },
  { q: 'El termopar genera su señal gracias al efecto:', opts: ['Peltier', 'Seebeck', 'Fotovoltaico', 'Hall'], ans: 1, why: 'Dos metales distintos unidos: la unión caliente genera un pequeño voltaje termoeléctrico (Seebeck) proporcional a la temperatura.' },
  { q: 'El tubo de Bourdon pertenece a los sensores de presión…', opts: ['de medida directa', 'elásticos', 'electromecánicos', 'neumáticos'], ans: 1, why: 'Es un elemento elástico: se deforma con la presión y ese movimiento acciona la aguja o una galga.' },
  { q: '¿Qué sensor de proximidad detecta SOLO metales?', opts: ['Capacitivo', 'Ultrasónico', 'Inductivo', 'Fotoeléctrico'], ans: 2, why: 'El inductivo genera un campo magnético oscilante que solo perturban los metales (férricos y no férricos).' },
  { q: 'Para detectar arena o grano sin contacto usarías un sensor…', opts: ['Inductivo', 'Capacitivo', 'Magnético', 'Solo mecánico'], ans: 1, why: 'El capacitivo detecta cualquier material por su constante dieléctrica (incluidos sólidos en polvo o grano).' },
  { q: 'La presión absoluta se mide respecto a…', opts: ['La atmósfera', 'Otro punto del proceso', 'El vacío total', 'El nivel del mar'], ans: 2, why: 'Absoluta = contra el vacío. La sobrepresión resta la atmósfera (~101 kPa); la diferencial compara dos puntos.' },
  { q: 'Las galgas extensiométricas pertenecen a los sensores de presión…', opts: ['Mecánicos directos', 'Elásticos', 'Electromecánicos', 'Primarios'], ans: 2, why: 'Deforman un elemento cuya resistencia varía; son el puente entre lo mecánico y la señal eléctrica.' },
];

const DEFAULT_RESULTS: [string, string, string] = [
  'Dominas el banco. Revisa los rangos y alcances de cada canal para afinar.',
  'Vas bien. Repasa los modos de detección ópticos y los tipos de presión.',
  'Vuelve a operar los bancos 02–05: la teoría se aprende moviendo las piezas.',
];

interface QuizProps {
  /** Banco de preguntas. Si se omite, usa el del Tema I. */
  bank?: QuizQuestion[];
  /** Color de acento (token CSS). */
  accent?: string;
  /** Etiqueta superior del panel. */
  tag?: string;
  /** Mensajes de resultado para [alto, medio, bajo] acierto. */
  results?: [string, string, string];
}

export default function Quiz({
  bank = DEFAULT_BANK,
  accent = 'var(--ch-quiz)',
  tag = 'TEST DE REPASO · 8 PREGUNTAS ALEATORIAS',
  results = DEFAULT_RESULTS,
}: QuizProps) {
  // Arranque determinista para que SSR e hidratación coincidan;
  // el barajado real se hace en el cliente tras montar.
  const [qs, setQs] = useState<QuizQuestion[]>(() => bank.slice(0, 8));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const focusQuestionAfterRestart = useRef(false);

  const AX = { '--c': accent } as React.CSSProperties;
  const q = qs[i];

  useEffect(() => {
    setQs([...bank].sort(() => Math.random() - 0.5).slice(0, 8));
    // Solo al montar: baraja una vez, no en cada cambio de estado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (done) resultRef.current?.focus();
    else if ((i > 0 || focusQuestionAfterRestart.current) && picked === null) {
      questionRef.current?.focus();
      focusQuestionAfterRestart.current = false;
    }
  }, [done, i, picked]);

  const answer = (oi: number) => {
    if (picked !== null) return;
    setPicked(oi);
    if (oi === q.ans) setScore((s) => s + 1);
  };

  const next = () => {
    if (i + 1 >= qs.length) setDone(true);
    else { setI(i + 1); setPicked(null); }
  };

  const restart = () => {
    setQs([...bank].sort(() => Math.random() - 0.5).slice(0, 8));
    setI(0); setPicked(null); setScore(0); setDone(false);
    focusQuestionAfterRestart.current = true;
  };

  const pct = done ? Math.round((score / qs.length) * 100) : Math.round((i / qs.length) * 100);
  const ratio = score / qs.length;

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag">
        <span>{tag}</span>
        <span>{done ? `RESULTADO: ${score}/${qs.length}` : `PREGUNTA ${i + 1}/${qs.length}`}</span>
      </div>
      <div className="panel-inner col" style={{ gap: 16 }}>
        <div style={{ height: 4, background: '#1c2a3f', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: accent, transition: 'width .3s', boxShadow: `0 0 8px ${accent}` }} />
        </div>

        {!done ? (
          <>
            <h3 ref={questionRef} tabIndex={-1} style={{ fontSize: 20, fontWeight: 600 }}>{q.q}</h3>
            <div className="col" style={{ gap: 10 }}>
              {q.opts.map((o, oi) => {
                let cls = 'quiz-opt';
                if (picked !== null) {
                  if (oi === q.ans) cls += ' right';
                  else if (oi === picked) cls += ' wrong';
                }
                return (
                  <button key={oi} className={cls} onClick={() => answer(oi)} disabled={picked !== null}>
                    <span className="mono" style={{ opacity: 0.6, marginRight: 8 }}>{String.fromCharCode(65 + oi)}</span>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="col" style={{ gap: 12, alignItems: 'flex-start' }}>
                <p className="sim-note" role="status" aria-live="polite" style={{ marginTop: 0, color: picked === q.ans ? 'var(--ok)' : 'var(--warn)' }}>
                  {picked === q.ans ? '✓ Correcto. ' : '✗ Incorrecto. '}
                  <b>{q.why}</b>
                </p>
                <button className="btn is-active" style={AX} onClick={next}>
                  {i + 1 >= qs.length ? 'VER RESULTADO →' : 'SIGUIENTE →'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div ref={resultRef} tabIndex={-1} className="col txt-center" role="status" aria-live="polite" style={{ alignItems: 'center', gap: 14, padding: '18px 0' }}>
            <div className="mono" style={{
              fontSize: 'clamp(44px, 7vw, 64px)', fontWeight: 700,
              color: ratio >= 0.75 ? 'var(--ok)' : ratio >= 0.5 ? 'var(--warn)' : 'var(--err)',
            }}>
              {score}/{qs.length}
            </div>
            <p style={{ fontSize: 15, color: 'var(--ink-dim)', maxWidth: '44ch' }}>
              {ratio >= 0.75 ? results[0] : ratio >= 0.5 ? results[1] : results[2]}
            </p>
            <button className="btn is-active" style={AX} onClick={restart}>REPETIR TEST</button>
          </div>
        )}
      </div>
    </div>
  );
}
