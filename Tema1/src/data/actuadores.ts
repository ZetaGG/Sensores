import type { QuizQuestion } from '../components/sims/Quiz.tsx';

/** Banco de repaso del Tema II — Actuadores. */

export type ControlSensorId = 'temp' | 'inductivo' | 'pres' | 'prox' | 'nivel';
export type ControlActuatorId = 'valvula' | 'motor' | 'cilindro' | 'zumbador' | 'piloto' | 'ventilador' | 'motor-cinta';

export type ControlScenarioId =
  | 'temperature-fan'
  | 'inductive-belt'
  | 'pressure-valve'
  | 'nivel-bomba'
  | 'temp-valvula'
  | 'prox-cilindro'
  | 'pres-alarma'
  | 'marcha-piloto';

export interface ControlScenarioData {
  id: ControlScenarioId;
  name: string;
  sensor: ControlSensorId;
  controller: 'arduino' | 'plc';
  actuator: ControlActuatorId;
  condition: string;
  action: string;
  detail: string;
  result: string;
}

export const CONTROL_SCENARIOS: ControlScenarioData[] = [
  {
    id: 'temperature-fan',
    name: 'Temperatura → Controlador → Ventilador',
    sensor: 'temp',
    controller: 'plc',
    actuator: 'ventilador',
    condition: 'Temperatura > 75 °C',
    action: 'Activa el ventilador de extracción',
    detail: 'Control térmico de gabinete: el PLC enciende el ventilador cuando la temperatura supera el límite.',
    result: 'El gabinete pierde calor y la temperatura vuelve al rango seguro.',
  },
  {
    id: 'inductive-belt',
    name: 'Inductivo → Controlador → Motor de banda',
    sensor: 'inductivo',
    controller: 'plc',
    actuator: 'motor-cinta',
    condition: 'Pieza metálica detectada',
    action: 'Arranca el motor de la banda transportadora',
    detail: 'Transporte de piezas: el sensor inductivo confirma el metal y el PLC inicia la banda.',
    result: 'La pieza avanza a la siguiente estación de proceso.',
  },
  {
    id: 'pressure-valve',
    name: 'Presión → Controlador → Válvula',
    sensor: 'pres',
    controller: 'arduino',
    actuator: 'valvula',
    condition: 'Presión > 9 bar',
    action: 'Abre la válvula solenoide de alivio',
    detail: 'Seguridad de línea: una sobrepresión acciona la válvula para liberar el fluido.',
    result: 'La presión disminuye hasta regresar al rango de operación.',
  },
  {
    id: 'nivel-bomba',
    name: 'Nivel → PLC → Motobomba',
    sensor: 'nivel',
    controller: 'plc',
    actuator: 'motor',
    condition: 'Nivel < 60 %',
    action: 'Arranca la motobomba de llenado',
    detail: 'Control de nivel en tanque: el PLC mantiene el agua entre consignas arrancando y parando la bomba.',
    result: 'El tanque recupera su nivel de trabajo.',
  },
  {
    id: 'temp-valvula',
    name: 'Temperatura → Arduino → Válvula',
    sensor: 'temp',
    controller: 'arduino',
    actuator: 'valvula',
    condition: 'Temperatura > 75 °C',
    action: 'Abre la válvula de enfriamiento',
    detail: 'Lazo de climatización: el refrigerante entra cuando el proceso se calienta.',
    result: 'El refrigerante retira calor del proceso.',
  },
  {
    id: 'prox-cilindro',
    name: 'Proximidad → PLC → Cilindro',
    sensor: 'prox',
    controller: 'plc',
    actuator: 'cilindro',
    condition: 'Pieza detectada',
    action: 'Extiende el cilindro de doble efecto',
    detail: 'Estación de embalaje: el sensor confirma la pieza y el cilindro la empuja a la cinta de salida.',
    result: 'La pieza es empujada a la cinta de salida.',
  },
  {
    id: 'pres-alarma',
    name: 'Presión → Arduino → Zumbador',
    sensor: 'pres',
    controller: 'arduino',
    actuator: 'zumbador',
    condition: 'Presión > 9 bar',
    action: 'Activa la alarma sonora',
    detail: 'Seguridad de línea neumática: una sobrepresión dispara el zumbador para avisar al operario.',
    result: 'El operario recibe un aviso de sobrepresión.',
  },
  {
    id: 'marcha-piloto',
    name: 'Proximidad → PLC → Piloto',
    sensor: 'prox',
    controller: 'plc',
    actuator: 'piloto',
    condition: 'Línea en marcha',
    action: 'Enciende el piloto verde de estado',
    detail: 'Señalización de máquina: el piloto comunica el estado del proceso sin pantalla.',
    result: 'El estado de la máquina se comunica visualmente.',
  },
];

export const SELECTION_CRITERIA = [
  { id: 'power', icon: '⚡', title: 'Potencia', description: 'Debe entregar la fuerza, el torque o el caudal que exige la carga.' },
  { id: 'controllability', icon: '⌘', title: 'Controlabilidad', description: 'La orden debe poder regularse con el controlador disponible.' },
  { id: 'size', icon: '◇', title: 'Peso y volumen', description: 'El conjunto debe caber en la máquina sin añadir masa innecesaria.' },
  { id: 'precision', icon: '◎', title: 'Precisión', description: 'La repetibilidad y la exactitud deben corresponder al proceso.' },
  { id: 'speed', icon: '⏱', title: 'Velocidad', description: 'El actuador debe completar el recorrido o ciclo dentro del tiempo requerido.' },
  { id: 'maintenance', icon: '⌁', title: 'Mantenimiento', description: 'Se considera desgaste, lubricación, filtros, fugas y facilidad de servicio.' },
  { id: 'cost', icon: '$', title: 'Costo', description: 'Se compara compra, instalación, consumo y repuestos durante la vida útil.' },
] as const;

export type SelectionCriterionId = typeof SELECTION_CRITERIA[number]['id'];

export interface ActuatorChallenge {
  id: string;
  situation: string;
  detail: string;
  options: { id: string; label: string }[];
  correct: string;
  explanation: string;
  criteria: SelectionCriterionId[];
}

export const ACTUATOR_CHALLENGES: ActuatorChallenge[] = [
  {
    id: 'positioned-conveyor',
    situation: 'Necesito mover una banda transportadora con posiciones controladas.',
    detail: 'La carga debe detenerse en puntos repetibles y el controlador trabaja con pulsos digitales.',
    options: [
      { id: 'stepper', label: 'Motor paso a paso' },
      { id: 'buzzer', label: 'Zumbador' },
      { id: 'single-cylinder', label: 'Cilindro neumático simple efecto' },
    ],
    correct: 'stepper',
    explanation: 'El motor paso a paso convierte cada pulso en un ángulo definido y permite posicionar la banda en lazo abierto.',
    criteria: ['controllability', 'precision', 'speed'],
  },
  {
    id: 'heavy-press',
    situation: 'Necesito presionar una pieza con mucha fuerza y movimiento lento.',
    detail: 'La máquina tiene espacio limitado y requiere movimiento suave bajo carga.',
    options: [
      { id: 'hydraulic-cylinder', label: 'Cilindro hidráulico' },
      { id: 'pilot', label: 'Piloto luminoso' },
      { id: 'dc-motor', label: 'Motor DC pequeño' },
    ],
    correct: 'hydraulic-cylinder',
    explanation: 'La presión del aceite multiplicada por el área del pistón produce mucha fuerza con control suave.',
    criteria: ['power', 'precision', 'size'],
  },
  {
    id: 'liquid-flow',
    situation: 'Necesito abrir y cerrar el paso de un líquido desde un PLC.',
    detail: 'La orden es binaria y el fluido debe quedar bloqueado cuando se retira la energía.',
    options: [
      { id: 'solenoid-valve', label: 'Válvula solenoide' },
      { id: 'ac-motor', label: 'Motor AC' },
      { id: 'mechanical-lever', label: 'Palanca mecánica' },
    ],
    correct: 'solenoid-valve',
    explanation: 'La bobina convierte la orden eléctrica en el desplazamiento del émbolo que abre o cierra el paso.',
    criteria: ['controllability', 'maintenance', 'cost'],
  },
];

export const QUIZ_ACTUADORES: QuizQuestion[] = [
  {
    q: 'Un actuador es, dentro del lazo de control, el elemento que…',
    opts: ['Mide la variable del proceso', 'Transforma energía en movimiento o acción física', 'Almacena el programa del PLC', 'Solo indica el estado con una luz'],
    ans: 1,
    why: 'El actuador es el "músculo" del sistema: recibe la orden del controlador y la convierte en trabajo (movimiento, fuerza o señalización).',
  },
  {
    q: '¿Qué hace el controlador con la señal que llega del sensor?',
    opts: ['La almacena en disco', 'La compara con la consigna y decide la acción', 'La convierte directamente en presión', 'La ignora hasta el final del turno'],
    ans: 1,
    why: 'El controlador compara la variable medida con el valor deseado (consigna) y emite la orden al actuador.',
  },
  {
    q: 'La energía que utiliza un cilindro neumático es…',
    opts: ['Aceite a alta presión', 'Aire comprimido', 'Corriente trifásica', 'Vapor de agua'],
    ans: 1,
    why: 'La neumática trabaja con aire comprimido, normalmente entre 4 y 8 bar. Limpio y rápido, pero compresible y de fuerza limitada.',
  },
  {
    q: 'La principal ventaja de los actuadores hidráulicos es…',
    opts: ['Usan aire gratuito', 'Máxima fuerza por unidad de tamaño', 'No necesitan mantenimiento', 'Son los más limpios'],
    ans: 1,
    why: 'El aceite es prácticamente incompresible y se maneja a 70–350 bar: enorme fuerza y control preciso en poco espacio.',
  },
  {
    q: 'Para invertir el sentido de giro de un motor DC hay que…',
    opts: ['Cambiar la frecuencia de red', 'Invertir la polaridad de la alimentación', 'Aumentar la tensión al doble', 'Quitar el rotor'],
    ans: 1,
    why: 'El par depende de la interacción entre campo y corriente; al invertir la polaridad cambia el signo de la corriente y gira al revés.',
  },
  {
    q: 'En un motor DC, la velocidad es aproximadamente proporcional a…',
    opts: ['La tensión aplicada', 'El peso del eje', 'La humedad del aire', 'El número de escobillas'],
    ans: 0,
    why: 'Velocidad ∝ tensión de armadura. Por eso el control por PWM regula la velocidad variando el voltaje medio.',
  },
  {
    q: 'La velocidad síncrona de un motor de inducción depende de…',
    opts: ['La presión del aceite', 'La frecuencia y el número de polos', 'El color del bobinado', 'La carga del vástago'],
    ans: 1,
    why: 'n = 120·f / p. Con 50 Hz y 2 polos: 3000 rpm. Con un variador (VFD) se regula la frecuencia y con ella la velocidad.',
  },
  {
    q: 'Un motor paso a paso con paso de 1.8° necesita, por vuelta…',
    opts: ['100 pasos', '180 pasos', '200 pasos', '360 pasos'],
    ans: 2,
    why: '360° / 1.8° = 200 pasos por revolución. Convierte cada pulso digital en un desplazamiento angular exacto.',
  },
  {
    q: 'Una válvula 3/2 se emplea típicamente con…',
    opts: ['Un cilindro de simple efecto', 'Un cilindro de doble efecto', 'Una motobomba', 'Un motor trifásico'],
    ans: 0,
    why: '3 vías y 2 posiciones: alimenta, cierra y desfoga un solo lado del pistón; el resorte devuelve el cilindro de simple efecto.',
  },
  {
    q: 'Una válvula 5/2 permite gobernar…',
    opts: ['Solo un piloto', 'Un cilindro de doble efecto (avance y retroceso)', 'La frecuencia del zumbador', 'La presión de red'],
    ans: 1,
    why: 'Con 5 vías y 2 posiciones controla ambos lados del pistón: una posición extiende y la otra retrae.',
  },
  {
    q: 'En un cilindro, si se duplica el diámetro del pistón, la fuerza…',
    opts: ['Se duplica', 'Se mantiene igual', 'Se cuadruplica', 'Se reduce a la mitad'],
    ans: 2,
    why: 'F = P × A y A = π·r². Al duplicar el diámetro el área se multiplica por 4, y con la misma presión también la fuerza.',
  },
  {
    q: 'El zumbador (buzzer) pertenece a los actuadores de…',
    opts: ['Movimiento continuo', 'Señalización audible', 'Potencia hidráulica', 'Posicionamiento preciso'],
    ans: 1,
    why: 'No mueve cargas: transforma una señal eléctrica en sonido para avisar al operario (alarmas, confirmaciones).',
  },
  {
    q: 'La motobomba es un actuador que convierte energía mecánica en…',
    opts: ['Energía luminosa', 'Energía hidráulica (caudal y presión)', 'Señal digital', 'Campo magnético'],
    ans: 1,
    why: 'El motor eléctrico mueve una bomba que entrega caudal a presión; es la fuente de energía de todo sistema hidráulico.',
  },
  {
    q: 'Si se requiere fuerza enorme y movimiento muy lento y preciso, conviene un actuador…',
    opts: ['Hidráulico', 'Zumbador', 'Piloto', 'Neumático de simple efecto'],
    ans: 0,
    why: 'La hidráulica domina fuerza y control fino a baja velocidad; la neumática es rápida y limpia pero difícil de posicionar.',
  },
];

export const RESULTADOS_ACTUADORES: [string, string, string] = [
  'Dominas los actuadores. Repasa las fórmulas de fuerza y las válvulas para afinar la selección.',
  'Vas bien. Vuelve a los canales ACT-02 a ACT-04 y opera los simuladores de motores y cilindros.',
  'Repasa el lazo de control y las familias de actuadores: la teoría se entiende moviendo los simuladores.',
];
