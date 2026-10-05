import { useState } from 'react';
import { MCU_FAMILIES } from '../../data/microcontroladores.ts';

const DATA_WIDTHS = [8, 16, 32] as const;

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return `${bytes / 1_073_741_824} GiB`;
  if (bytes >= 1_048_576) return `${bytes / 1_048_576} MiB`;
  if (bytes >= 1024) return `${bytes / 1024} KiB`;
  return `${bytes} B`;
}

export default function ArchitectureWorkbench() {
  const [familyId, setFamilyId] = useState(MCU_FAMILIES[0].id);
  const [dataWidth, setDataWidth] = useState<(typeof DATA_WIDTHS)[number]>(8);
  const [addressBits, setAddressBits] = useState(16);
  const family = MCU_FAMILIES.find((item) => item.id === familyId) ?? MCU_FAMILIES[0];
  const addressableBytes = 2 ** addressBits;

  return (
    <div className="panel" style={{ '--c': 'var(--mcu-core)' } as React.CSSProperties}>
      <div className="panel-tag"><span>ARQUITECTURA · EXPLORADOR DE FAMILIAS Y BUSES</span><span>MODELO CONCEPTUAL</span></div>
      <div className="panel-inner col" style={{ gap: 18 }}>
        <div className="seg" role="group" aria-label="Seleccionar familia de microcontrolador">
          {MCU_FAMILIES.map((item) => (
            <button key={item.id} className={`btn ${familyId === item.id ? 'is-active' : ''}`} style={{ '--c': 'var(--mcu-core)' } as React.CSSProperties} aria-pressed={familyId === item.id} onClick={() => setFamilyId(item.id)}>
              {item.name}
            </button>
          ))}
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="mcu-family-card">
            <span className="mono-label">FAMILIA · EJEMPLOS REPRESENTATIVOS</span>
            <h3>{family.name}</h3>
            <p className="text-dim">{family.overview}</p>
            <div className="readout" style={{ '--c': 'var(--mcu-core)' } as React.CSSProperties}>
              <div className="lbl">NÚCLEOS / SERIES</div><div className="val" style={{ fontSize: 17 }}>{family.core}</div>
            </div>
            <p className="sim-note" style={{ marginTop: 12 }}><b>Aplicaciones orientativas:</b> {family.fit}</p>
          </div>

          <div className="col" style={{ gap: 12 }}>
            <div className="readout" style={{ '--c': 'var(--mcu-core)' } as React.CSSProperties}>
              <div className="lbl">ANCHO NOMINAL DE NÚCLEO · MODELO DE DATOS</div>
              <div className="val" style={{ fontSize: 20 }}>{family.width}</div>
            </div>
            <div className="mcu-bus-visual" aria-label={`${dataWidth} bits de datos por transferencia y ${addressBits} bits de dirección teóricos`}>
              <span className="mono-label">EJEMPLO DE BUSES · CONFIGURABLE</span>
              <div className="mcu-bus-row"><span>DATOS</span><strong>{dataWidth} bits/transferencia</strong><span className="mcu-bus-lines" style={{ '--lines': dataWidth } as React.CSSProperties} aria-hidden="true" /></div>
              <div className="mcu-bus-row"><span>DIRECCIONES</span><strong>{addressBits} bits de dirección</strong><span className="mcu-bus-lines is-address" style={{ '--lines': Math.min(addressBits, 16) } as React.CSSProperties} aria-hidden="true" /></div>
              <div className="mcu-bus-controls seg" role="group" aria-label="Ancho ilustrativo de transferencia de datos">
                {DATA_WIDTHS.map((width) => <button key={width} className={`btn ${dataWidth === width ? 'is-active' : ''}`} style={{ '--c': 'var(--mcu-core)' } as React.CSSProperties} aria-pressed={dataWidth === width} onClick={() => setDataWidth(width)}>{width} bits datos</button>)}
              </div>
              <label className="col" style={{ gap: 5, marginTop: 12 }}>
                <span className="mono-label">ANCHO DE DIRECCIONES · {addressBits} bits</span>
                <input type="range" min="8" max="32" step="1" value={addressBits} aria-label="Ancho conceptual del espacio de direcciones" onChange={(event) => setAddressBits(Number(event.currentTarget.value))} style={{ '--c': 'var(--mcu-core)', '--fill': `${((addressBits - 8) / 24) * 100}%` } as React.CSSProperties} />
              </label>
              <div className="mcu-address-result"><span>ESPACIO TEÓRICO SI ES BYTE-ADDRESSABLE</span><strong>{formatBytes(addressableBytes)}</strong></div>
            </div>
          </div>
        </div>
        <p className="sim-note" style={{ marginTop: 0 }}><b>Importante:</b> “8/16/32 bits” suele describir el tamaño de datos que maneja el núcleo. No fija automáticamente la anchura de todos los buses internos o pines externos. En un sistema real, los buses pueden tener anchuras diferentes y el mapa de memoria puede reservar regiones o dejar huecos; el cálculo de direcciones mostrado es solo una simplificación.</p>
      </div>
    </div>
  );
}
