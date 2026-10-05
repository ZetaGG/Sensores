import { useState } from 'react';
import { MCU_MEMORIES } from '../../data/microcontroladores.ts';

const TASKS = [
  { id: 'firmware', label: 'Guardar el programa', memory: 'flash' },
  { id: 'temporary', label: 'Mantener una lectura durante el cálculo', memory: 'sram' },
  { id: 'calibration', label: 'Conservar calibración al apagar', memory: 'eeprom' },
  { id: 'boot', label: 'Ejecutar código fijo de arranque', memory: 'rom' },
] as const;

export default function MemoryWorkbench() {
  const [selectedId, setSelectedId] = useState<string>('eeprom');
  const [taskId, setTaskId] = useState<(typeof TASKS)[number]['id']>('calibration');
  const selected = MCU_MEMORIES.find((memory) => memory.id === selectedId) ?? MCU_MEMORIES[0];
  const task = TASKS.find((item) => item.id === taskId) ?? TASKS[0];

  return (
    <div className="panel" style={{ '--c': 'var(--mcu-memory)' } as React.CSSProperties}>
      <div className="panel-tag"><span>MEMORIA · MAPA DE TRABAJO DEL MCU</span><span>VOLÁTIL / NO VOLÁTIL</span></div>
      <div className="panel-inner col" style={{ gap: 16 }}>
        <div className="grid-3 mcu-memory-grid" role="group" aria-label="Seleccionar tipo de memoria">
          {MCU_MEMORIES.map((memory) => (
            <button key={memory.id} className={`mcu-memory-tile${selectedId === memory.id ? ' is-selected' : ''}`} style={{ '--c': 'var(--mcu-memory)' } as React.CSSProperties} aria-pressed={selectedId === memory.id} onClick={() => setSelectedId(memory.id)}>
              <span className="mono-label">{memory.volatility.toUpperCase()}</span>
              <strong>{memory.name}</strong>
              <span className="mono">{memory.role}</span>
            </button>
          ))}
        </div>

        <div className="grid-2" style={{ alignItems: 'stretch' }}>
          <div className="mcu-memory-detail">
            <span className="mono-label">MEMORIA SELECCIONADA</span>
            <h3>{selected.name} · {selected.volatility}</h3>
            <p>{selected.role}</p>
            <div className="readout" style={{ '--c': 'var(--mcu-memory)' } as React.CSSProperties}>
              <div className="lbl">EJEMPLO EN UN SISTEMA</div><div className="val" style={{ fontSize: 15 }}>{selected.example}</div>
            </div>
          </div>
          <div className="mcu-memory-detail is-task">
            <span className="mono-label">PRUEBA DE ELECCIÓN</span>
            <label className="col" style={{ gap: 8 }}>
              <span className="mcu-question">¿Dónde guardarías…?</span>
              <select value={taskId} onChange={(event) => setTaskId(event.currentTarget.value as typeof taskId)} aria-label="Elegir tarea de memoria">
                {TASKS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <div className={`mcu-memory-answer${selectedId === task.memory ? ' is-correct' : ' is-hint'}`} role="status" aria-live="polite">
              {selectedId === task.memory
                ? `Correcto: ${MCU_MEMORIES.find((memory) => memory.id === task.memory)?.name} es la opción conceptual adecuada.`
                : `Pista: para esta tarea se suele elegir ${MCU_MEMORIES.find((memory) => memory.id === task.memory)?.name}. Selecciónala en el mapa.`}
            </div>
          </div>
        </div>
        <p className="sim-note" style={{ marginTop: 0 }}><b>El diseño depende del dispositivo:</b> no todos los MCU tienen EEPROM dedicada; algunos guardan datos en Flash o emulan EEPROM. Consultar datasheet para capacidad, retención y ciclos de escritura.</p>
      </div>
    </div>
  );
}
