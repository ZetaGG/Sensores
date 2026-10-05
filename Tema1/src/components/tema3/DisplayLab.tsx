import { useState } from 'react';
import { MCU_DISPLAYS, type DisplayKind } from '../../data/microcontroladores.ts';

const SEGMENTS: Record<string, number[]> = {
  '0': [0, 1, 2, 3, 4, 5], '1': [1, 2], '2': [0, 1, 6, 4, 3], '3': [0, 1, 6, 2, 3],
  '4': [5, 6, 1, 2], '5': [0, 5, 6, 2, 3], '6': [0, 5, 6, 4, 2, 3], '7': [0, 1, 2],
  '8': [0, 1, 2, 3, 4, 5, 6], '9': [0, 1, 2, 3, 5, 6], '-': [6],
};
const SEGMENT_LINES = [
  [15, 10, 45, 10], [48, 13, 48, 42], [48, 48, 48, 77], [15, 80, 45, 80],
  [12, 48, 12, 77], [12, 13, 12, 42], [15, 45, 45, 45],
];

function SevenSegment({ value }: { value: string }) {
  const chars = value.replace(/[^0-9.-]/g, '').slice(0, 5).split('');
  return (
    <svg viewBox={`0 0 ${chars.length * 62 + 8} 90`} role="img" aria-label={`Display LED de siete segmentos: ${value}`} className="mcu-seven-svg">
      {(chars.length ? chars : ['0']).map((char, digitIndex) => char === '.'
        ? <circle key={`dot-${digitIndex}`} cx={digitIndex * 62 + 54} cy="79" r="4" className="mcu-seven-dot is-lit" />
        : <g key={`${char}-${digitIndex}`} transform={`translate(${digitIndex * 62},0)`}>
            {SEGMENT_LINES.map(([x1, y1, x2, y2], segmentIndex) => (
              <line key={segmentIndex} x1={x1} y1={y1} x2={x2} y2={y2} className={SEGMENTS[char]?.includes(segmentIndex) ? 'is-lit' : ''} />
            ))}
          </g>)}
    </svg>
  );
}

export default function DisplayLab() {
  const [displayId, setDisplayId] = useState<DisplayKind['id']>('seven');
  const [reading, setReading] = useState(42.7);
  const display = MCU_DISPLAYS.find((item) => item.id === displayId) ?? MCU_DISPLAYS[0];
  const textReading = reading.toFixed(1);

  return (
    <div className="panel" style={{ '--c': 'var(--mcu-display)' } as React.CSSProperties}>
      <div className="panel-tag"><span>VISUALIZACIÓN · EXPLORADOR DE DISPLAYS</span><span>{display.name.toUpperCase()}</span></div>
      <div className="panel-inner col" style={{ gap: 16 }}>
        <div className="seg" role="group" aria-label="Seleccionar tecnología de display">
          {MCU_DISPLAYS.map((item) => (
            <button key={item.id} className={`btn ${displayId === item.id ? 'is-active' : ''}`} style={{ '--c': 'var(--mcu-display)' } as React.CSSProperties} aria-pressed={displayId === item.id} onClick={() => setDisplayId(item.id)}>{item.name}</button>
          ))}
        </div>

        <div className={`mcu-display-preview display-${display.id}`}>
          <div className="mcu-display-cap"><span className="mono-label">PANEL DE SALIDA</span><span className="mono">SENSOR → MCU → DISPLAY</span></div>
          {display.id === 'seven' && <div className="mcu-seven-frame"><SevenSegment value={textReading} /></div>}
          {display.id === 'lcd' && <div className="mcu-lcd-frame" role="img" aria-label={`LCD de caracteres: temperatura ${textReading} grados y ventilador ${reading >= 60 ? 'encendido' : 'apagado'}`}><span>TEMP: {textReading} C</span><span>FAN: {reading >= 60 ? 'ON ' : 'OFF'}  SET: 60 C</span></div>}
          {display.id === 'oled' && <div className="mcu-oled-frame" role="img" aria-label={`Pantalla OLED con temperatura ${textReading} grados`}><span className="mono-label">PROCESO · EN VIVO</span><strong>{textReading}<small>°C</small></strong><span className="mcu-oled-bar"><i style={{ width: `${Math.min(100, reading)}%` }} /></span><span className="mono">SALIDA FAN · {reading >= 60 ? 'ACTIVA' : 'EN ESPERA'}</span></div>}
          {display.id === 'epaper' && <div className="mcu-epaper-frame" role="img" aria-label={`Papel electrónico con temperatura ${textReading} grados`}><span>ESTACIÓN 01</span><strong>{textReading} °C</strong><span>{reading >= 60 ? 'VENTILACIÓN ACTIVA' : 'ESTADO NORMAL'}</span></div>}
        </div>

        <div className="row mcu-display-controls" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button className="btn" style={{ '--c': 'var(--mcu-display)' } as React.CSSProperties} aria-label="Disminuir lectura simulada" onClick={() => setReading((value) => Math.max(0, Number((value - 0.5).toFixed(1))))}>− 0.5 °C</button>
          <button className="btn" style={{ '--c': 'var(--mcu-display)' } as React.CSSProperties} aria-label="Aumentar lectura simulada" onClick={() => setReading((value) => Math.min(99.9, Number((value + 0.5).toFixed(1))))}>+ 0.5 °C</button>
          <span className="hint-chip">DATO SIMULADO · {textReading} °C</span>
        </div>

        <div className="grid-3">
          <div className="mcu-display-info"><span className="mono-label">PRINCIPIO</span><p>{display.principle}</p></div>
          <div className="mcu-display-info"><span className="mono-label">FORTALEZA</span><p>{display.strengths}</p></div>
          <div className="mcu-display-info"><span className="mono-label">INTERFAZ / CUIDADO</span><p>{display.interface} {display.tradeoff}</p></div>
        </div>
      </div>
    </div>
  );
}
