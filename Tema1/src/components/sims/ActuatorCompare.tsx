import { useState } from 'react';
import { SELECTION_CRITERIA, type SelectionCriterionId } from '../../data/actuadores.ts';

/** Comparador interactivo: actuadores eléctricos vs neumáticos vs hidráulicos. */

type Kind = 'electrico' | 'neumatico' | 'hidraulico';

interface Profile {
  id: Kind;
  name: string;
  icon: string;
  color: string;
  energy: string;
  summary: string;
  pros: string[];
  cons: string[];
  apps: string[];
  scores: Record<SelectionCriterionId, number>;
}

const PROFILES: Profile[] = [
  {
    id: 'electrico', name: 'ELÉCTRICO', icon: '⚡', color: 'var(--act-elec)', energy: 'Red eléctrica / batería',
    summary: 'Motores y solenoides que convierten energía eléctrica en movimiento o conmutación. Precisos, limpios y fáciles de controlar con electrónica de potencia.',
    pros: ['Control fino con PWM o variador', 'Fácil de integrar en PLC', 'Sin fluidos ni fugas', 'Alta eficiencia'],
    cons: ['Relación fuerza/tamaño baja', 'Riesgo eléctrico', 'Puede sobrecalentarse'],
    apps: ['Cintas transportadoras', 'Robótica', 'Bombas y ventiladores', 'Puertas automáticas'],
    scores: { power: 3, controllability: 5, size: 3, precision: 5, speed: 4, maintenance: 4, cost: 4 },
  },
  {
    id: 'neumatico', name: 'NEUMÁTICO', icon: '☁', color: 'var(--act-neum)', energy: 'Aire comprimido (4–8 bar)',
    summary: 'Cilindros y válvulas movidos por aire comprimido. Muy rápidos y limpios, ideales para movimientos simples de avance/retroceso en automatización.',
    pros: ['Rápido y repetitivo', 'Barato y seguro', 'Sin chispas (atmósferas inflamables)', 'Componentes sencillos'],
    cons: ['Aire compresible: poca precisión de posición', 'Fuerza moderada', 'Ruido y consumo del compresor'],
    apps: ['Embalaje', 'Sujeción de piezas', 'Prensas ligeras', 'Automatización de puertas'],
    scores: { power: 3, controllability: 3, size: 4, precision: 2, speed: 5, maintenance: 3, cost: 5 },
  },
  {
    id: 'hidraulico', name: 'HIDRÁULICO', icon: '⬤', color: 'var(--act-hidr)', energy: 'Aceite a presión (70–350 bar)',
    summary: 'Cilindros y motores movidos por aceite a alta presión. La mayor fuerza por tamaño y un control suave incluso a velocidades muy bajas.',
    pros: ['Fuerza enorme en poco espacio', 'Movimiento suave y preciso', 'Autolubricado y duradero', 'Control de cargas pesadas'],
    cons: ['Instalación cara y voluminosa', 'Fugas sucias y riesgo de incendio', 'Requiere filtración y mantenimiento'],
    apps: ['Excavadoras y maquinaria pesada', 'Prensas industriales', 'Inyección de plástico', 'Elevadores'],
    scores: { power: 5, controllability: 4, size: 2, precision: 4, speed: 3, maintenance: 2, cost: 2 },
  },
];

const ROWS: { metric: string; values: Record<Kind, string> }[] = [
  { metric: 'Potencia', values: { electrico: 'Baja–media', neumatico: 'Media', hidraulico: 'Muy alta' } },
  { metric: 'Controlabilidad', values: { electrico: 'PWM, VFD o encoder', neumatico: 'Válvulas 3/2 y 5/2', hidraulico: 'Válvulas proporcionales' } },
  { metric: 'Peso y volumen', values: { electrico: 'Compacto', neumatico: 'Ligero', hidraulico: 'Grupo voluminoso' } },
  { metric: 'Precisión', values: { electrico: 'Alta con encoder', neumatico: 'Baja a media carrera', hidraulico: 'Media–alta' } },
  { metric: 'Velocidad', values: { electrico: 'Alta y regulable', neumatico: 'Muy alta', hidraulico: 'Media' } },
  { metric: 'Mantenimiento', values: { electrico: 'Escobillas / rodamientos', neumatico: 'Filtros y lubricación', hidraulico: 'Aceite, filtros y fugas' } },
  { metric: 'Costo', values: { electrico: 'Bajo–medio', neumatico: 'Medio', hidraulico: 'Alto' } },
];

export default function ActuatorCompare() {
  const [kind, setKind] = useState<Kind>('neumatico');
  const active = PROFILES.find((p) => p.id === kind)!;

  return (
    <div className="panel" style={{ '--c': active.color } as React.CSSProperties}>
      <div className="panel-tag">
        <span>COMPARADOR · ELÉCTRICO / NEUMÁTICO / HIDRÁULICO</span>
        <span>ACT-02 · ACT-03 · ACT-04</span>
      </div>
      <div className="panel-inner col" style={{ gap: 18 }}>

        <div className="seg" role="group" aria-label="Familia de actuador">
          {PROFILES.map((p) => (
            <button key={p.id} className={`btn ${kind === p.id ? 'is-active' : ''}`} style={{ '--c': p.color } as React.CSSProperties} aria-pressed={kind === p.id} onClick={() => setKind(p.id)}>
              {p.icon} {p.name}
            </button>
          ))}
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="col" style={{ gap: 12 }}>
            <div className="row" style={{ gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: active.color }}>{active.icon}</span>
              <div className="col" style={{ gap: 0 }}>
                <strong style={{ fontFamily: 'var(--font-display)', letterSpacing: '.05em' }}>{active.name}</strong>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{active.energy}</span>
              </div>
            </div>
            <p className="text-dim" style={{ fontSize: 14, maxWidth: 'none' }}>{active.summary}</p>
            <div className="grid-2" style={{ gap: 12 }}>
              <div className="col" style={{ gap: 6 }}>
                <span className="mono-label" style={{ color: 'var(--ok)' }}>VENTAJAS</span>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: 'var(--ink-dim)', lineHeight: 1.7 }}>
                  {active.pros.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div className="col" style={{ gap: 6 }}>
                <span className="mono-label" style={{ color: 'var(--warn)' }}>LIMITACIONES</span>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: 'var(--ink-dim)', lineHeight: 1.7 }}>
                  {active.cons.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="col" style={{ gap: 12 }}>
            {SELECTION_CRITERIA.map((criterion) => (
              <div key={criterion.id} className="col" style={{ gap: 4 }}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="mono-label">{criterion.title}</span>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{active.scores[criterion.id]}/5</span>
                </div>
                <div className="meter" style={{ '--c': active.color } as React.CSSProperties}>
                  <span style={{ width: `${(active.scores[criterion.id] / 5) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className="readout" style={{ '--c': active.color } as React.CSSProperties}>
              <div className="lbl">APLICACIONES TÍPICAS</div>
              <div className="val" style={{ fontSize: 14, lineHeight: 1.5 }}>{active.apps.join(' · ')}</div>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Criterio</th>
                {PROFILES.map((p) => (
                  <th key={p.id} style={{ color: kind === p.id ? p.color : undefined }}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.metric}>
                  <td><strong>{r.metric}</strong></td>
                  {PROFILES.map((p) => (
                    <td key={p.id} style={kind === p.id ? { color: 'var(--ink)' } : undefined}>{r.values[p.id]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
