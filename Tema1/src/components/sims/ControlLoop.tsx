import { useMemo, useState } from 'react';
import {
  CONTROL_SCENARIOS,
  type ControlActuatorId,
  type ControlScenarioData,
  type ControlSensorId,
} from '../../data/actuadores.ts';

/**
 * Cadena completa SENSOR → CONTROLADOR → ACTUADOR.
 * El usuario navega escenarios industriales predefinidos o
 * combina libremente los tres eslabones en modo manual.
 */

type SensorId = ControlSensorId;
type ControllerId = 'arduino' | 'plc';
type ActuatorId = ControlActuatorId;

interface Sensor {
  id: SensorId;
  name: string;
  icon: string;
  magnitude: string;
  reading: string;
  signal: string;
}

interface Controller {
  id: ControllerId;
  name: string;
  icon: string;
  detail: string;
}

interface Actuator {
  id: ActuatorId;
  name: string;
  icon: string;
  action: string;
}

type Scenario = ControlScenarioData;

const SENSORS: Sensor[] = [
  { id: 'temp', name: 'Sensor de temperatura', icon: '◍', magnitude: 'Temperatura', reading: '82.4 °C', signal: '1.62 V · analógica' },
  { id: 'inductivo', name: 'Sensor inductivo', icon: '⍟', magnitude: 'Pieza metálica', reading: 'METAL', signal: '24 V DC · digital' },
  { id: 'pres', name: 'Sensor de presión', icon: '◔', magnitude: 'Presión', reading: '9.1 bar', signal: '3.05 V · analógica' },
  { id: 'prox', name: 'Sensor de proximidad', icon: '⍟', magnitude: 'Presencia de pieza', reading: 'PIEZA', signal: '24 V DC · digital' },
  { id: 'nivel', name: 'Sensor de nivel', icon: 'ⵄ', magnitude: 'Nivel del tanque', reading: '32 %', signal: '2.40 V · analógica' },
];

const CONTROLLERS: Controller[] = [
  { id: 'arduino', name: 'Arduino / microcontrolador', icon: '▣', detail: 'Lógica programable, lazos sencillos y bajo costo.' },
  { id: 'plc', name: 'PLC industrial', icon: '▤', detail: 'Robusto, muchas E/S, pensado para planta.' },
];

const ACTUATORS: Actuator[] = [
  { id: 'valvula', name: 'Válvula solenoide', icon: '⌇', action: 'Abre o cierra el paso del fluido.' },
  { id: 'motor', name: 'Motor DC / motobomba', icon: '⚙', action: 'Gira y mueve la carga o impulsa el fluido.' },
  { id: 'cilindro', name: 'Cilindro de doble efecto', icon: '⇔', action: 'Extiende y retrae el vástago.' },
  { id: 'zumbador', name: 'Zumbador', icon: '◈', action: 'Emite la alarma sonora.' },
  { id: 'piloto', name: 'Piloto (lámpara)', icon: '◉', action: 'Enciende la indicación visual.' },
  { id: 'ventilador', name: 'Ventilador de extracción', icon: '✣', action: 'Extrae el aire caliente del gabinete.' },
  { id: 'motor-cinta', name: 'Motor de banda transportadora', icon: '⇉', action: 'Mueve la pieza a la siguiente estación.' },
];

const SCENARIOS: Scenario[] = CONTROL_SCENARIOS;

const AX = { '--c': 'var(--act-intro)' } as React.CSSProperties;

interface StageCardProps {
  role: string;
  icon: string;
  name: string;
  detail: string;
  reading: string;
  readingLabel: string;
  color: string;
  hot: boolean;
}

function StageCard({ role, icon, name, detail, reading, readingLabel, color, hot }: StageCardProps) {
  return (
    <div className={`loop-stage${hot ? ' is-hot' : ''}`} style={{ '--c': color } as React.CSSProperties}>
      <span className="ls-role">{role}</span>
      <div className="row" style={{ gap: 10, flexWrap: 'nowrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color }}>{icon}</span>
        <strong className="ls-name">{name}</strong>
      </div>
      <p className="ls-detail" style={{ maxWidth: 'none' }}>{detail}</p>
      <div className="readout" style={{ '--c': color, marginTop: 'auto' } as React.CSSProperties}>
        <div className="lbl">{readingLabel}</div>
        <div className="val" style={{ fontSize: 'clamp(16px, 2.4vw, 20px)' }}>{reading}</div>
      </div>
    </div>
  );
}

export default function ControlLoop() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [sensorId, setSensorId] = useState<SensorId>(SCENARIOS[0].sensor);
  const [controllerId, setControllerId] = useState<ControllerId>(SCENARIOS[0].controller);
  const [actuatorId, setActuatorId] = useState<ActuatorId>(SCENARIOS[0].actuator);
  const [custom, setCustom] = useState(false);

  const sensor = useMemo(() => SENSORS.find((s) => s.id === sensorId)!, [sensorId]);
  const controller = useMemo(() => CONTROLLERS.find((c) => c.id === controllerId)!, [controllerId]);
  const actuator = useMemo(() => ACTUATORS.find((a) => a.id === actuatorId)!, [actuatorId]);

  const loadScenario = (i: number) => {
    const s = SCENARIOS[i];
    setScenarioIdx(i);
    setSensorId(s.sensor);
    setControllerId(s.controller);
    setActuatorId(s.actuator);
    setCustom(false);
  };

  const step = (dir: 1 | -1) => loadScenario((scenarioIdx + dir + SCENARIOS.length) % SCENARIOS.length);

  const pick = <T extends string>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setCustom(true);
  };

  const scenario = custom ? null : SCENARIOS[scenarioIdx];
  const condition = scenario ? scenario.condition : `Señal de ${sensor.magnitude.toLowerCase()} frente a consigna`;
  const action = scenario ? scenario.action : actuator.action;

  return (
    <div className="panel" style={AX}>
      <div className="panel-tag">
        <span>LAZO DE CONTROL · SENSOR → CONTROLADOR → ACTUADOR</span>
        <span className="live">{custom ? 'CADENA MANUAL' : 'ESCENARIO INDUSTRIAL'}</span>
      </div>
      <div className="panel-inner col" style={{ gap: 18 }}>

        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="seg" role="group" aria-label="Escenarios industriales predefinidos">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                className={`btn ${!custom && i === scenarioIdx ? 'is-active' : ''}`}
                style={AX}
                aria-pressed={!custom && i === scenarioIdx}
                onClick={() => loadScenario(i)}
              >
                {s.name}
              </button>
            ))}
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn" onClick={() => step(-1)} aria-label="Escenario anterior">←</button>
            <button className="btn" onClick={() => step(1)} aria-label="Escenario siguiente">→</button>
          </div>
        </div>

        <div className="loop-grid">
          <StageCard
            role="01 · SENSOR" icon={sensor.icon} name={sensor.name}
            detail={`Convierte ${sensor.magnitude.toLowerCase()} en una señal eléctrica.`}
            reading={sensor.reading} readingLabel={`LECTURA · ${sensor.signal}`}
            color="var(--ch-pres)" hot
          />
          <div className="loop-arrow" aria-hidden="true"><span className="wire"></span><span>▸</span></div>
          <StageCard
            role="02 · CONTROLADOR" icon={controller.icon} name={controller.name}
            detail={controller.detail}
            reading={condition} readingLabel="DECISIÓN · COMPARA CON LA CONSIGNA"
            color="var(--act-intro)" hot
          />
          <div className="loop-arrow" aria-hidden="true"><span className="wire"></span><span>▸</span></div>
          <StageCard
            role="03 · ACTUADOR" icon={actuator.icon} name={actuator.name}
            detail={actuator.action}
            reading={action} readingLabel="ACCIÓN · TRABAJO SOBRE EL PROCESO"
            color="var(--act-elec)" hot
          />
        </div>

        <div className="row" style={{ alignItems: 'flex-start', gap: 18 }}>
          <div className="col grow" style={{ gap: 8 }}>
            <span className="mono-label">SENSOR</span>
            <div className="seg" role="group" aria-label="Elegir sensor">
              {SENSORS.map((s) => (
                <button key={s.id} className={`btn ${s.id === sensorId ? 'is-active' : ''}`} style={{ '--c': 'var(--ch-pres)' } as React.CSSProperties} aria-pressed={s.id === sensorId} onClick={() => pick<SensorId>(setSensorId)(s.id)}>
                  {s.icon} {s.magnitude}
                </button>
              ))}
            </div>
          </div>
          <div className="col grow" style={{ gap: 8 }}>
            <span className="mono-label">CONTROLADOR</span>
            <div className="seg" role="group" aria-label="Elegir controlador">
              {CONTROLLERS.map((c) => (
                <button key={c.id} className={`btn ${c.id === controllerId ? 'is-active' : ''}`} style={AX} aria-pressed={c.id === controllerId} onClick={() => pick<ControllerId>(setControllerId)(c.id)}>
                  {c.icon} {c.id === 'plc' ? 'PLC' : 'Arduino'}
                </button>
              ))}
            </div>
          </div>
          <div className="col grow" style={{ gap: 8 }}>
            <span className="mono-label">ACTUADOR</span>
            <div className="seg" role="group" aria-label="Elegir actuador">
              {ACTUATORS.map((a) => (
                <button key={a.id} className={`btn ${a.id === actuatorId ? 'is-active' : ''}`} style={{ '--c': 'var(--act-elec)' } as React.CSSProperties} aria-pressed={a.id === actuatorId} onClick={() => pick<ActuatorId>(setActuatorId)(a.id)}>
                  {a.icon} {a.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

         <p className="sim-note" style={{ marginTop: 0 }}>
           {scenario ? <b>{scenario.detail} </b> : <b>Cadena personalizada: </b>}
           El sensor mide la magnitud física, el controlador la compara con la consigna y el actuador
           ejecuta el trabajo sobre el proceso. El ciclo se repite mientras la máquina esté en marcha.
         </p>
         {scenario && (
           <p className="sim-note" style={{ marginTop: 0 }}>
             <b>RESULTADO DEL PROCESO · </b>{scenario.result}
           </p>
         )}
       </div>
    </div>
  );
}
