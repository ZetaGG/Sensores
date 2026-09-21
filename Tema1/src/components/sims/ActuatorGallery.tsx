import { useEffect, useRef, useState } from 'react';

/** Galería de tipos de actuador con ficha técnica en ventana modal. */

interface ActuatorInfo {
  id: string;
  name: string;
  icon: string;
  category: 'Eléctrico' | 'Neumático' | 'Hidráulico' | 'Mecánico' | 'Señalización';
  energy: string;
  principle: string;
  formula: string;
  formulaLabel: string;
  uses: string[];
  advantages: string[];
  limits: string;
  color: string;
}

const ACTUATORS: ActuatorInfo[] = [
  {
    id: 'motor-dc', name: 'Motor DC', icon: '⚙', category: 'Eléctrico', energy: 'Energía eléctrica',
    principle: 'La corriente en la bobina del rotor, dentro del campo del estator, genera una fuerza (F = B·I·L) que produce giro. El conmutador invierte la corriente cada media vuelta para mantener el movimiento.',
    formula: 'n ∝ V · T ∝ I', formulaLabel: 'VELOCIDAD Y PAR',
    uses: ['Cintas transportadoras', 'Robótica educativa', 'Ventiladores', 'Posicionamiento con encoder'],
    advantages: ['Velocidad regulable por tensión o PWM', 'Par de arranque alto', 'Control de sentido invirtiendo polaridad'],
    limits: 'las escobillas se desgastan y generan chispas; requiere mantenimiento periódico.',
    color: 'var(--act-elec)',
  },
  {
    id: 'motor-ac', name: 'Motor AC de inducción', icon: '↻', category: 'Eléctrico', energy: 'Energía eléctrica trifásica',
    principle: 'Las tres fases del estator crean un campo magnético giratorio. Ese campo induce corrientes en la jaula del rotor, que lo persiguen con un pequeño deslizamiento.',
    formula: 'n = 120·f / p', formulaLabel: 'VELOCIDAD SÍNCRONA',
    uses: ['Bombas y ventiladores', 'Compresores', 'Transportadores', 'Máquinas-herramienta'],
    advantages: ['Robusto y sin escobillas', 'Económico y de larga vida', 'Velocidad variable con variador (VFD)'],
    limits: 'sin variador de frecuencia su velocidad es casi fija; el arranque directo consume mucha corriente.',
    color: 'var(--act-elec)',
  },
  {
    id: 'stepper', name: 'Motor paso a paso', icon: '⌗', category: 'Eléctrico', energy: 'Pulsos digitales',
    principle: 'Cada pulso energiza una secuencia de bobinas y el rotor avanza un ángulo fijo. Es posicionamiento en lazo abierto: no necesita sensor para saber dónde está.',
    formula: 'θ = 360° / N · 1.8° → N = 200 pasos/vuelta', formulaLabel: 'ÁNGULO DE PASO',
    uses: ['Impresoras 3D', 'CNC y fresadoras', 'Escáneres', 'Dosificación de precisión'],
    advantages: ['Posición exacta sin encoder', 'Fácil de gobernar con un microcontrolador', 'Alto par a baja velocidad'],
    limits: 'el par cae al subir la velocidad y puede perder pasos si se exige demasiado.',
    color: 'var(--act-elec)',
  },
  {
    id: 'valvula', name: 'Válvula solenoide', icon: '⌇', category: 'Neumático', energy: 'Eléctrica → neumática',
    principle: 'Una bobina solenoide mueve el carrete de la válvula al recibir corriente. Según sus vías y posiciones (3/2, 5/2) dirige el aire a un lado u otro del cilindro.',
    formula: '3/2 simple efecto · 5/2 doble efecto', formulaLabel: 'CONFIGURACIÓN',
    uses: ['Cilindros neumáticos', 'Automatización de puertas', 'Dosificación de fluidos', 'Riego'],
    advantages: ['Conmuta con una señal eléctrica débil', 'Respuesta rápida', 'Integrable en PLC'],
    limits: 'necesita aire limpio y seco; el solenoide puede calentarse si queda energizado mucho tiempo.',
    color: 'var(--act-neum)',
  },
  {
    id: 'cil-neumatico', name: 'Cilindro neumático', icon: '⇔', category: 'Neumático', energy: 'Aire comprimido',
    principle: 'El aire a presión empuja el pistón dentro del tubo. De simple efecto lleva un solo puerto y un resorte que devuelve; de doble efecto lleva dos puertos y trabaja en ambos sentidos.',
    formula: 'F = P × A', formulaLabel: 'FUERZA DEL PISTÓN',
    uses: ['Prensas ligeras', 'Sujeción de piezas', 'Embalaje', 'Actuadores de puerta'],
    advantages: ['Rápido y limpio', 'Barato y seguro (no hay chispas)', 'Fácil de controlar con válvulas'],
    limits: 'el aire es compresible: posicionar a media carrera es impreciso y la fuerza es moderada.',
    color: 'var(--act-neum)',
  },
  {
    id: 'cil-hidraulico', name: 'Cilindro hidráulico', icon: '⇚', category: 'Hidráulico', energy: 'Aceite a presión',
    principle: 'El aceite a alta presión empuja un pistón de gran sección. Por el principio de Pascal, una pequeña fuerza sobre el émbolo de la bomba se multiplica en el cilindro.',
    formula: 'F = P × A · A = π·r²', formulaLabel: 'FUERZA HIDRÁULICA',
    uses: ['Excavadoras', 'Prensas industriales', 'Elevadores', 'Inyección de plástico'],
    advantages: ['Fuerza enorme en poco espacio', 'Movimiento suave y preciso', 'Autolubricado'],
    limits: 'necesita grupo hidráulico, filtros y aceite; las fugas son sucias y peligrosas a alta presión.',
    color: 'var(--act-hidr)',
  },
  {
    id: 'motobomba', name: 'Motobomba', icon: '⛽', category: 'Hidráulico', energy: 'Eléctrica → hidráulica',
    principle: 'Un motor eléctrico gira una bomba (engranajes, paletas o pistones) que aspira aceite del depósito y lo entrega a presión al circuito. Es la fuente de energía del sistema.',
    formula: 'Q = v × A · P = F / A', formulaLabel: 'CAUDAL Y PRESIÓN',
    uses: ['Circuitos hidráulicos', 'Suministro de agua', 'Riego y achique', 'Sistemas de refrigeración'],
    advantages: ['Genera el caudal y la presión de todo el circuito', 'Arranque y paro automatizables', 'Diversas tecnologías de bomba'],
    limits: 'consume energía de forma continua, genera calor y ruido; exige filtración y mantenimiento.',
    color: 'var(--act-hidr)',
  },
  {
    id: 'mecanico', name: 'Actuador mecánico', icon: '⟳', category: 'Mecánico', energy: 'Fuerza humana o de motor',
    principle: 'Transmite movimiento mediante elementos mecánicos: leva, husillo, piñón-cremallera, biela-manivela o poleas. No convierte energía, la transforma en otra geometría de movimiento.',
    formula: 'i = ω_entrada / ω_salida', formulaLabel: 'RELACIÓN DE TRANSMISIÓN',
    uses: ['Husillos de elevación', 'Puertas correderas', 'Tornillos de banco', 'Mecanismos de leva'],
    advantages: ['Sin fluido ni electricidad directa', 'Muy robusto y preciso', 'Multiplica fuerza con poco recorrido'],
    limits: 'desgaste mecánico, requiere lubricación y no permite regulación eléctrica fina.',
    color: 'var(--act-intro)',
  },
  {
    id: 'piloto', name: 'Piloto (lámpara indicadora)', icon: '◉', category: 'Señalización', energy: 'Energía eléctrica',
    principle: 'Convierte una señal eléctrica (típicamente 24 V DC) en luz. Comunica el estado de la máquina al operario: marcha, paro, fallo o advertencia.',
    formula: 'Verde = marcha · Rojo = paro/fallo', formulaLabel: 'CÓDIGO DE COLOR',
    uses: ['Tableros de control', 'Cuadros de maniobra', 'Indicadores de línea', 'Señalización de alarmas'],
    advantages: ['Estado legible de un vistazo', 'LED de bajo consumo y larga vida', 'Alto contraste e IP de intemperie'],
    limits: 'depende del color y puede ser invisible para personas con daltonismo: acompáñalo con texto o forma.',
    color: 'var(--act-senal)',
  },
  {
    id: 'zumbador', name: 'Zumbador (buzzer)', icon: '◈', category: 'Señalización', energy: 'Energía eléctrica',
    principle: 'Un cristal piezoeléctrico o un electroimán vibra a una frecuencia audible y genera sonido. La frecuencia define el tono y el patrón de pulsos define el mensaje.',
    formula: 'f = 2–4 kHz típico · dB = nivel sonoro', formulaLabel: 'TONO Y VOLUMEN',
    uses: ['Alarmas de proceso', 'Aviso de marcha atrás', 'Confirmación de teclado', 'Detectores de humo'],
    advantages: ['Avisa aunque el operario no mire el panel', 'Barato y de bajo consumo', 'Patrones intermitentes distinguibles'],
    limits: 'molesto en exceso y poco informativo por sí solo: se combina con piloto o pantalla.',
    color: 'var(--act-senal)',
  },
];

export default function ActuatorGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = () => {
    const idx = open;
    setOpen(null);
    if (idx !== null) triggers.current[idx]?.focus();
  };

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const item = open !== null ? ACTUATORS[open] : null;

  return (
    <div className="panel" style={{ '--c': 'var(--act-intro)' } as React.CSSProperties}>
      <div className="panel-tag">
        <span>CATÁLOGO DE ACTUADORES · CLIC PARA ABRIR FICHA</span>
        <span>{ACTUATORS.length} TIPOS</span>
      </div>
      <div className="panel-inner">
        <div className="grid-3">
          {ACTUATORS.map((a, i) => (
            <button
              key={a.id}
              ref={(el) => { triggers.current[i] = el; }}
              className="panel act-card"
              style={{ '--c': a.color } as React.CSSProperties}
              onClick={() => setOpen(i)}
              aria-haspopup="dialog"
              aria-label={`Ver ficha de ${a.name}`}
            >
              <div className="panel-inner">
                <span className="act-ico">{a.icon}</span>
                <strong className="act-name">{a.name}</strong>
                <span className="act-cat">{a.category.toUpperCase()} · {a.energy.toUpperCase()}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--c)', letterSpacing: '.12em', marginTop: 4 }}>ABRIR FICHA ▸</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {item && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div
            className="panel modal"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`act-modal-title-${item.id}`}
            style={{ '--c': item.color } as React.CSSProperties}
          >
            <div className="panel-tag">
              <span>{item.category.toUpperCase()} · {item.energy.toUpperCase()}</span>
              <span>FICHA TÉCNICA</span>
            </div>
            <div className="panel-inner col" style={{ gap: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                <div className="row" style={{ gap: 12, flexWrap: 'nowrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: item.color }}>{item.icon}</span>
                  <h3 id={`act-modal-title-${item.id}`} style={{ fontSize: 22 }}>{item.name}</h3>
                </div>
                <button ref={closeRef} className="btn" onClick={close} aria-label="Cerrar ficha">✕ CERRAR</button>
              </div>

              <p className="text-dim" style={{ fontSize: 14.5, maxWidth: 'none' }}>{item.principle}</p>

              <div className="readout" style={{ '--c': item.color } as React.CSSProperties}>
                <div className="lbl">{item.formulaLabel}</div>
                <div className="val" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>{item.formula}</div>
              </div>

              <div className="grid-2">
                <div className="col" style={{ gap: 6 }}>
                  <span className="mono-label">USOS TÍPICOS</span>
                  <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-dim)', fontSize: 13.5, lineHeight: 1.7 }}>
                    {item.uses.map((u) => <li key={u}>{u}</li>)}
                  </ul>
                </div>
                <div className="col" style={{ gap: 6 }}>
                  <span className="mono-label">VENTAJAS</span>
                  <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-dim)', fontSize: 13.5, lineHeight: 1.7 }}>
                    {item.advantages.map((v) => <li key={v}>{v}</li>)}
                  </ul>
                </div>
              </div>

              <p className="sim-note" style={{ marginTop: 0 }}>
                <b style={{ color: 'var(--warn)' }}>Ojo con… </b>{item.limits}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="no-js-gallery-details">
        <h3>Catálogo de actuadores</h3>
        {ACTUATORS.map((actuator) => (
          <details key={actuator.id}>
            <summary>{actuator.name}</summary>
            <p>{actuator.principle}</p>
            <p className="mono">{actuator.formulaLabel}: {actuator.formula}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
