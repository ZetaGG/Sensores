import { useMemo, useState } from 'react';

type EncoderMode = 'incremental' | 'absolute';
const QUADRATURE = ['00', '01', '11', '10'];

export default function EncoderLab() {
  const [mode, setMode] = useState<EncoderMode>('incremental');
  const [shaftDegrees, setShaftDegrees] = useState(0);
  const [pulsesPerTurn, setPulsesPerTurn] = useState(24);
  const [zeroDegrees, setZeroDegrees] = useState(0);
  const [countedPulses, setCountedPulses] = useState(0);
  const [referenceLost, setReferenceLost] = useState(false);
  const incrementalEstimate = ((zeroDegrees + (countedPulses / pulsesPerTurn) * 360) % 360 + 360) % 360;
  const absoluteCode = useMemo(() => Math.round((shaftDegrees / 360) * (2 ** 12 - 1)), [shaftDegrees]);
  const phaseIndex = ((countedPulses % 4) + 4) % 4;
  const direction = countedPulses === 0 ? 'EN REPOSO' : countedPulses > 0 ? 'HORARIO' : 'ANTIHORARIO';

  const jog = (directionSign: 1 | -1) => {
    const movement = mode === 'incremental' ? 360 / pulsesPerTurn : 15;
    setShaftDegrees((angle) => (angle + directionSign * movement + 360) % 360);
    if (mode === 'incremental') setCountedPulses((count) => count + directionSign);
  };

  const setHome = () => {
    setZeroDegrees(shaftDegrees);
    setCountedPulses(0);
    setReferenceLost(false);
  };

  const simulatePowerLoss = () => {
    if (mode === 'incremental') {
      setCountedPulses(0);
      setReferenceLost(true);
    }
  };

  return (
    <div className="panel" style={{ '--c': 'var(--mcu-encoder)' } as React.CSSProperties}>
      <div className="panel-tag"><span>CODIFICADOR DE POSICIÓN · REALIMENTACIÓN AL MCU</span><span>{mode === 'incremental' ? 'PULSOS A/B' : 'CÓDIGO ABSOLUTO'}</span></div>
      <div className="panel-inner col" style={{ gap: 16 }}>
        <div className="seg" role="group" aria-label="Tipo de codificador">
          <button className={`btn ${mode === 'incremental' ? 'is-active' : ''}`} style={{ '--c': 'var(--mcu-encoder)' } as React.CSSProperties} aria-pressed={mode === 'incremental'} onClick={() => { setMode('incremental'); setCountedPulses(0); setZeroDegrees(shaftDegrees); setReferenceLost(false); }}>INCREMENTAL · CUADRATURA</button>
          <button className={`btn ${mode === 'absolute' ? 'is-active' : ''}`} style={{ '--c': 'var(--mcu-encoder)' } as React.CSSProperties} aria-pressed={mode === 'absolute'} onClick={() => { setMode('absolute'); setReferenceLost(false); }}>ABSOLUTO · 12 BITS</button>
        </div>

        <div className="mcu-encoder-stage">
          <div className="mcu-encoder-dial" aria-hidden="true"><div className="mcu-encoder-needle" style={{ transform: `rotate(${shaftDegrees}deg)` }} /><span>SHAFT</span></div>
          <div className="mcu-encoder-readout">
            <span className="mono-label">POSICIÓN DEL EJE</span>
            <strong>{mode === 'absolute' ? `${shaftDegrees.toString().padStart(3, '0')}°` : referenceLost ? '---' : `${incrementalEstimate.toFixed(0).padStart(3, '0')}°`}</strong>
            {mode === 'incremental'
              ? <span className="mono">Cuenta desde HOME · {countedPulses} pulsos · {direction}</span>
              : <span className="mono">Código ilustrativo · {absoluteCode} / 4095 (12-bit)</span>}
            {mode === 'incremental' && <div className="mcu-quadrature"><span>ESTADO CUADRATURA A/B</span><strong>A/B · {QUADRATURE[phaseIndex]}</strong><i style={{ '--phase': phaseIndex } as React.CSSProperties} /></div>}
          </div>
        </div>

        <div className="grid-2">
          <label className="col" style={{ gap: 6 }}>
            <span className="mono-label">RESOLUCIÓN INCREMENTAL · {pulsesPerTurn} PULSOS/VUELTA</span>
            <input type="range" min="12" max="96" step="12" value={pulsesPerTurn} aria-label="Resolución del encoder incremental en pulsos por vuelta" onChange={(event) => setPulsesPerTurn(Number(event.currentTarget.value))} style={{ '--c': 'var(--mcu-encoder)', '--fill': `${((pulsesPerTurn - 12) / 84) * 100}%` } as React.CSSProperties} />
          </label>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button className="btn" style={{ '--c': 'var(--mcu-encoder)' } as React.CSSProperties} onClick={() => jog(-1)} aria-label="Girar eje en sentido antihorario">↺ −{mode === 'incremental' ? (360 / pulsesPerTurn).toFixed(0) : '15'}°</button>
            <button className="btn" style={{ '--c': 'var(--mcu-encoder)' } as React.CSSProperties} onClick={() => jog(1)} aria-label="Girar eje en sentido horario">↻ +{mode === 'incremental' ? (360 / pulsesPerTurn).toFixed(0) : '15'}°</button>
            <button className="btn" onClick={setHome}>FIJAR HOME</button>
            {mode === 'incremental' && <button className="btn" onClick={simulatePowerLoss}>SIMULAR CORTE</button>}
          </div>
        </div>

        {referenceLost && <p className="mcu-memory-answer is-hint" role="status">Con el contador incremental reiniciado, el eje físico conserva su ángulo pero el sistema perdió la referencia: debe volver a HOME. Un encoder absoluto entrega un código de posición sin contar desde el último arranque.</p>}
        <p className="sim-note" style={{ marginTop: 0 }}><b>Qué recibe el controlador:</b> el incremental produce pulsos; dos canales A/B desfasados ayudan a estimar sentido y movimiento relativo. El absoluto entrega un código asociado a la posición. El número de bits y el comportamiento concreto dependen del encoder elegido.</p>
      </div>
    </div>
  );
}
