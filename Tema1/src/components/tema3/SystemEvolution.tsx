import { useMemo, useState } from 'react';

export default function SystemEvolution() {
  const [temperature, setTemperature] = useState(42);
  const [setpoint, setSetpoint] = useState(60);
  const adcCode = useMemo(() => Math.round((temperature / 100) * 4095), [temperature]);
  const cooling = temperature >= setpoint;
  const alarm = temperature >= setpoint + 15;

  return (
    <div className="panel mcu-evolution" style={{ '--c': 'var(--mcu-intro)' } as React.CSSProperties}>
      <div className="panel-tag">
        <span>CADENA PROGRAMABLE · ENTRADA → PROCESAMIENTO → SALIDA</span>
        <span className="live">SIMULACIÓN</span>
      </div>
      <div className="panel-inner col" style={{ gap: 18 }}>
        <div className="mcu-flow" aria-label="Sensor de temperatura a microcontrolador a salidas">
          <div className="mcu-flow-node" style={{ '--c': 'var(--ch-temp)' } as React.CSSProperties}>
            <span className="mono-label">01 · ENTRADA</span>
            <strong>Sensor de temperatura</strong>
            <span className="mcu-big-value">{temperature} °C</span>
            <span className="mono">Señal analógica simulada</span>
          </div>
          <span className="mcu-flow-arrow" aria-hidden="true">→</span>
          <div className="mcu-flow-node mcu-core-node" style={{ '--c': 'var(--mcu-core)' } as React.CSSProperties}>
            <span className="mono-label">02 · PROCESAMIENTO</span>
            <strong>Microcontrolador</strong>
            <span className="mcu-core-chip" aria-hidden="true">µC</span>
            <span className="mono">ADC {adcCode}/4095 · compara con {setpoint} °C</span>
          </div>
          <span className="mcu-flow-arrow" aria-hidden="true">→</span>
          <div className="mcu-flow-node" style={{ '--c': 'var(--mcu-display)' } as React.CSSProperties}>
            <span className="mono-label">03 · SALIDA</span>
            <strong>LCD + ventilador</strong>
            <span className={`mcu-output-lamp${cooling ? ' is-on' : ''}`} aria-label={cooling ? 'Ventilador encendido' : 'Ventilador apagado'} />
            <span className="mono">LCD: {temperature} °C · FAN {cooling ? 'ON' : 'OFF'}</span>
          </div>
        </div>

        <div className="grid-2 mcu-controls">
          <label className="col" style={{ gap: 7 }}>
            <span className="mono-label">TEMPERATURA DEL PROCESO · {temperature} °C</span>
            <input type="range" min="0" max="100" value={temperature} aria-label="Temperatura simulada del proceso" onChange={(event) => setTemperature(Number(event.currentTarget.value))} style={{ '--c': 'var(--ch-temp)', '--fill': `${temperature}%` } as React.CSSProperties} />
          </label>
          <label className="col" style={{ gap: 7 }}>
            <span className="mono-label">CONSIGNA DEL CONTROL · {setpoint} °C</span>
            <input type="range" min="20" max="85" value={setpoint} aria-label="Temperatura de consigna" onChange={(event) => setSetpoint(Number(event.currentTarget.value))} style={{ '--c': 'var(--mcu-core)', '--fill': `${((setpoint - 20) / 65) * 100}%` } as React.CSSProperties} />
          </label>
        </div>

        <div className={`mcu-decision${alarm ? ' is-alarm' : cooling ? ' is-active' : ''}`} role="status" aria-live="polite">
          <span className="mono-label">DECISIÓN DEL PROGRAMA</span>
          <strong>{alarm ? 'ALARMA: ventilador al máximo y aviso en pantalla' : cooling ? 'Temperatura sobre consigna: activa el ventilador' : 'Temperatura bajo consigna: ventilador en espera'}</strong>
          <span className="mono">Ejemplo didáctico: escala ADC normalizada a 0–100 °C; no representa la calibración de un sensor real.</span>
        </div>

        <p className="sim-note" style={{ marginTop: 0 }}>
          <b>La evolución de los temas:</b> el sensor aporta la medición; el firmware del microcontrolador lee y procesa el dato; las salidas actualizan el display y ordenan al actuador. Si la carga necesita más corriente o una tensión diferente, se intercala un driver adecuado.
        </p>
      </div>
    </div>
  );
}
