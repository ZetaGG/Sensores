import { a as __exportAll, i as createComponent, n as useReducedMotion, r as $$BaseLayout, t as Quiz } from "./Quiz_CdbE6qnb.mjs";
import { a as renderComponent, d as renderTemplate, f as maybeRenderHead, m as addAttribute } from "./server_B7faeoIi.mjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/data/actuadores.ts
var CONTROL_SCENARIOS = [
	{
		id: "temperature-fan",
		name: "Temperatura → Controlador → Ventilador",
		sensor: "temp",
		controller: "plc",
		actuator: "ventilador",
		condition: "Temperatura > 75 °C",
		action: "Activa el ventilador de extracción",
		detail: "Control térmico de gabinete: el PLC enciende el ventilador cuando la temperatura supera el límite.",
		result: "El gabinete pierde calor y la temperatura vuelve al rango seguro."
	},
	{
		id: "inductive-belt",
		name: "Inductivo → Controlador → Motor de banda",
		sensor: "inductivo",
		controller: "plc",
		actuator: "motor-cinta",
		condition: "Pieza metálica detectada",
		action: "Arranca el motor de la banda transportadora",
		detail: "Transporte de piezas: el sensor inductivo confirma el metal y el PLC inicia la banda.",
		result: "La pieza avanza a la siguiente estación de proceso."
	},
	{
		id: "pressure-valve",
		name: "Presión → Controlador → Válvula",
		sensor: "pres",
		controller: "arduino",
		actuator: "valvula",
		condition: "Presión > 9 bar",
		action: "Abre la válvula solenoide de alivio",
		detail: "Seguridad de línea: una sobrepresión acciona la válvula para liberar el fluido.",
		result: "La presión disminuye hasta regresar al rango de operación."
	},
	{
		id: "nivel-bomba",
		name: "Nivel → PLC → Motobomba",
		sensor: "nivel",
		controller: "plc",
		actuator: "motor",
		condition: "Nivel < 60 %",
		action: "Arranca la motobomba de llenado",
		detail: "Control de nivel en tanque: el PLC mantiene el agua entre consignas arrancando y parando la bomba.",
		result: "El tanque recupera su nivel de trabajo."
	},
	{
		id: "temp-valvula",
		name: "Temperatura → Arduino → Válvula",
		sensor: "temp",
		controller: "arduino",
		actuator: "valvula",
		condition: "Temperatura > 75 °C",
		action: "Abre la válvula de enfriamiento",
		detail: "Lazo de climatización: el refrigerante entra cuando el proceso se calienta.",
		result: "El refrigerante retira calor del proceso."
	},
	{
		id: "prox-cilindro",
		name: "Proximidad → PLC → Cilindro",
		sensor: "prox",
		controller: "plc",
		actuator: "cilindro",
		condition: "Pieza detectada",
		action: "Extiende el cilindro de doble efecto",
		detail: "Estación de embalaje: el sensor confirma la pieza y el cilindro la empuja a la cinta de salida.",
		result: "La pieza es empujada a la cinta de salida."
	},
	{
		id: "pres-alarma",
		name: "Presión → Arduino → Zumbador",
		sensor: "pres",
		controller: "arduino",
		actuator: "zumbador",
		condition: "Presión > 9 bar",
		action: "Activa la alarma sonora",
		detail: "Seguridad de línea neumática: una sobrepresión dispara el zumbador para avisar al operario.",
		result: "El operario recibe un aviso de sobrepresión."
	},
	{
		id: "marcha-piloto",
		name: "Proximidad → PLC → Piloto",
		sensor: "prox",
		controller: "plc",
		actuator: "piloto",
		condition: "Línea en marcha",
		action: "Enciende el piloto verde de estado",
		detail: "Señalización de máquina: el piloto comunica el estado del proceso sin pantalla.",
		result: "El estado de la máquina se comunica visualmente."
	}
];
var SELECTION_CRITERIA = [
	{
		id: "power",
		icon: "⚡",
		title: "Potencia",
		description: "Debe entregar la fuerza, el torque o el caudal que exige la carga."
	},
	{
		id: "controllability",
		icon: "⌘",
		title: "Controlabilidad",
		description: "La orden debe poder regularse con el controlador disponible."
	},
	{
		id: "size",
		icon: "◇",
		title: "Peso y volumen",
		description: "El conjunto debe caber en la máquina sin añadir masa innecesaria."
	},
	{
		id: "precision",
		icon: "◎",
		title: "Precisión",
		description: "La repetibilidad y la exactitud deben corresponder al proceso."
	},
	{
		id: "speed",
		icon: "⏱",
		title: "Velocidad",
		description: "El actuador debe completar el recorrido o ciclo dentro del tiempo requerido."
	},
	{
		id: "maintenance",
		icon: "⌁",
		title: "Mantenimiento",
		description: "Se considera desgaste, lubricación, filtros, fugas y facilidad de servicio."
	},
	{
		id: "cost",
		icon: "$",
		title: "Costo",
		description: "Se compara compra, instalación, consumo y repuestos durante la vida útil."
	}
];
var ACTUATOR_CHALLENGES = [
	{
		id: "positioned-conveyor",
		situation: "Necesito mover una banda transportadora con posiciones controladas.",
		detail: "La carga debe detenerse en puntos repetibles y el controlador trabaja con pulsos digitales.",
		options: [
			{
				id: "stepper",
				label: "Motor paso a paso"
			},
			{
				id: "buzzer",
				label: "Zumbador"
			},
			{
				id: "single-cylinder",
				label: "Cilindro neumático simple efecto"
			}
		],
		correct: "stepper",
		explanation: "El motor paso a paso convierte cada pulso en un ángulo definido y permite posicionar la banda en lazo abierto.",
		criteria: [
			"controllability",
			"precision",
			"speed"
		]
	},
	{
		id: "heavy-press",
		situation: "Necesito presionar una pieza con mucha fuerza y movimiento lento.",
		detail: "La máquina tiene espacio limitado y requiere movimiento suave bajo carga.",
		options: [
			{
				id: "hydraulic-cylinder",
				label: "Cilindro hidráulico"
			},
			{
				id: "pilot",
				label: "Piloto luminoso"
			},
			{
				id: "dc-motor",
				label: "Motor DC pequeño"
			}
		],
		correct: "hydraulic-cylinder",
		explanation: "La presión del aceite multiplicada por el área del pistón produce mucha fuerza con control suave.",
		criteria: [
			"power",
			"precision",
			"size"
		]
	},
	{
		id: "liquid-flow",
		situation: "Necesito abrir y cerrar el paso de un líquido desde un PLC.",
		detail: "La orden es binaria y el fluido debe quedar bloqueado cuando se retira la energía.",
		options: [
			{
				id: "solenoid-valve",
				label: "Válvula solenoide"
			},
			{
				id: "ac-motor",
				label: "Motor AC"
			},
			{
				id: "mechanical-lever",
				label: "Palanca mecánica"
			}
		],
		correct: "solenoid-valve",
		explanation: "La bobina convierte la orden eléctrica en el desplazamiento del émbolo que abre o cierra el paso.",
		criteria: [
			"controllability",
			"maintenance",
			"cost"
		]
	}
];
var QUIZ_ACTUADORES = [
	{
		q: "Un actuador es, dentro del lazo de control, el elemento que…",
		opts: [
			"Mide la variable del proceso",
			"Transforma energía en movimiento o acción física",
			"Almacena el programa del PLC",
			"Solo indica el estado con una luz"
		],
		ans: 1,
		why: "El actuador es el \"músculo\" del sistema: recibe la orden del controlador y la convierte en trabajo (movimiento, fuerza o señalización)."
	},
	{
		q: "¿Qué hace el controlador con la señal que llega del sensor?",
		opts: [
			"La almacena en disco",
			"La compara con la consigna y decide la acción",
			"La convierte directamente en presión",
			"La ignora hasta el final del turno"
		],
		ans: 1,
		why: "El controlador compara la variable medida con el valor deseado (consigna) y emite la orden al actuador."
	},
	{
		q: "La energía que utiliza un cilindro neumático es…",
		opts: [
			"Aceite a alta presión",
			"Aire comprimido",
			"Corriente trifásica",
			"Vapor de agua"
		],
		ans: 1,
		why: "La neumática trabaja con aire comprimido, normalmente entre 4 y 8 bar. Limpio y rápido, pero compresible y de fuerza limitada."
	},
	{
		q: "La principal ventaja de los actuadores hidráulicos es…",
		opts: [
			"Usan aire gratuito",
			"Máxima fuerza por unidad de tamaño",
			"No necesitan mantenimiento",
			"Son los más limpios"
		],
		ans: 1,
		why: "El aceite es prácticamente incompresible y se maneja a 70–350 bar: enorme fuerza y control preciso en poco espacio."
	},
	{
		q: "Para invertir el sentido de giro de un motor DC hay que…",
		opts: [
			"Cambiar la frecuencia de red",
			"Invertir la polaridad de la alimentación",
			"Aumentar la tensión al doble",
			"Quitar el rotor"
		],
		ans: 1,
		why: "El par depende de la interacción entre campo y corriente; al invertir la polaridad cambia el signo de la corriente y gira al revés."
	},
	{
		q: "En un motor DC, la velocidad es aproximadamente proporcional a…",
		opts: [
			"La tensión aplicada",
			"El peso del eje",
			"La humedad del aire",
			"El número de escobillas"
		],
		ans: 0,
		why: "Velocidad ∝ tensión de armadura. Por eso el control por PWM regula la velocidad variando el voltaje medio."
	},
	{
		q: "La velocidad síncrona de un motor de inducción depende de…",
		opts: [
			"La presión del aceite",
			"La frecuencia y el número de polos",
			"El color del bobinado",
			"La carga del vástago"
		],
		ans: 1,
		why: "n = 120·f / p. Con 50 Hz y 2 polos: 3000 rpm. Con un variador (VFD) se regula la frecuencia y con ella la velocidad."
	},
	{
		q: "Un motor paso a paso con paso de 1.8° necesita, por vuelta…",
		opts: [
			"100 pasos",
			"180 pasos",
			"200 pasos",
			"360 pasos"
		],
		ans: 2,
		why: "360° / 1.8° = 200 pasos por revolución. Convierte cada pulso digital en un desplazamiento angular exacto."
	},
	{
		q: "Una válvula 3/2 se emplea típicamente con…",
		opts: [
			"Un cilindro de simple efecto",
			"Un cilindro de doble efecto",
			"Una motobomba",
			"Un motor trifásico"
		],
		ans: 0,
		why: "3 vías y 2 posiciones: alimenta, cierra y desfoga un solo lado del pistón; el resorte devuelve el cilindro de simple efecto."
	},
	{
		q: "Una válvula 5/2 permite gobernar…",
		opts: [
			"Solo un piloto",
			"Un cilindro de doble efecto (avance y retroceso)",
			"La frecuencia del zumbador",
			"La presión de red"
		],
		ans: 1,
		why: "Con 5 vías y 2 posiciones controla ambos lados del pistón: una posición extiende y la otra retrae."
	},
	{
		q: "En un cilindro, si se duplica el diámetro del pistón, la fuerza…",
		opts: [
			"Se duplica",
			"Se mantiene igual",
			"Se cuadruplica",
			"Se reduce a la mitad"
		],
		ans: 2,
		why: "F = P × A y A = π·r². Al duplicar el diámetro el área se multiplica por 4, y con la misma presión también la fuerza."
	},
	{
		q: "El zumbador (buzzer) pertenece a los actuadores de…",
		opts: [
			"Movimiento continuo",
			"Señalización audible",
			"Potencia hidráulica",
			"Posicionamiento preciso"
		],
		ans: 1,
		why: "No mueve cargas: transforma una señal eléctrica en sonido para avisar al operario (alarmas, confirmaciones)."
	},
	{
		q: "La motobomba es un actuador que convierte energía mecánica en…",
		opts: [
			"Energía luminosa",
			"Energía hidráulica (caudal y presión)",
			"Señal digital",
			"Campo magnético"
		],
		ans: 1,
		why: "El motor eléctrico mueve una bomba que entrega caudal a presión; es la fuente de energía de todo sistema hidráulico."
	},
	{
		q: "Si se requiere fuerza enorme y movimiento muy lento y preciso, conviene un actuador…",
		opts: [
			"Hidráulico",
			"Zumbador",
			"Piloto",
			"Neumático de simple efecto"
		],
		ans: 0,
		why: "La hidráulica domina fuerza y control fino a baja velocidad; la neumática es rápida y limpia pero difícil de posicionar."
	}
];
var RESULTADOS_ACTUADORES = [
	"Dominas los actuadores. Repasa las fórmulas de fuerza y las válvulas para afinar la selección.",
	"Vas bien. Vuelve a los canales ACT-02 a ACT-04 y opera los simuladores de motores y cilindros.",
	"Repasa el lazo de control y las familias de actuadores: la teoría se entiende moviendo los simuladores."
];
//#endregion
//#region src/components/sims/ControlLoop.tsx
var SENSORS = [
	{
		id: "temp",
		name: "Sensor de temperatura",
		icon: "◍",
		magnitude: "Temperatura",
		reading: "82.4 °C",
		signal: "1.62 V · analógica"
	},
	{
		id: "inductivo",
		name: "Sensor inductivo",
		icon: "⍟",
		magnitude: "Pieza metálica",
		reading: "METAL",
		signal: "24 V DC · digital"
	},
	{
		id: "pres",
		name: "Sensor de presión",
		icon: "◔",
		magnitude: "Presión",
		reading: "9.1 bar",
		signal: "3.05 V · analógica"
	},
	{
		id: "prox",
		name: "Sensor de proximidad",
		icon: "⍟",
		magnitude: "Presencia de pieza",
		reading: "PIEZA",
		signal: "24 V DC · digital"
	},
	{
		id: "nivel",
		name: "Sensor de nivel",
		icon: "ⵄ",
		magnitude: "Nivel del tanque",
		reading: "32 %",
		signal: "2.40 V · analógica"
	}
];
var CONTROLLERS = [{
	id: "arduino",
	name: "Arduino / microcontrolador",
	icon: "▣",
	detail: "Lógica programable, lazos sencillos y bajo costo."
}, {
	id: "plc",
	name: "PLC industrial",
	icon: "▤",
	detail: "Robusto, muchas E/S, pensado para planta."
}];
var ACTUATORS$1 = [
	{
		id: "valvula",
		name: "Válvula solenoide",
		icon: "⌇",
		action: "Abre o cierra el paso del fluido."
	},
	{
		id: "motor",
		name: "Motor DC / motobomba",
		icon: "⚙",
		action: "Gira y mueve la carga o impulsa el fluido."
	},
	{
		id: "cilindro",
		name: "Cilindro de doble efecto",
		icon: "⇔",
		action: "Extiende y retrae el vástago."
	},
	{
		id: "zumbador",
		name: "Zumbador",
		icon: "◈",
		action: "Emite la alarma sonora."
	},
	{
		id: "piloto",
		name: "Piloto (lámpara)",
		icon: "◉",
		action: "Enciende la indicación visual."
	},
	{
		id: "ventilador",
		name: "Ventilador de extracción",
		icon: "✣",
		action: "Extrae el aire caliente del gabinete."
	},
	{
		id: "motor-cinta",
		name: "Motor de banda transportadora",
		icon: "⇉",
		action: "Mueve la pieza a la siguiente estación."
	}
];
var SCENARIOS = CONTROL_SCENARIOS;
var AX$2 = { "--c": "var(--act-intro)" };
function StageCard({ role, icon, name, detail, reading, readingLabel, color, hot }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `loop-stage${hot ? " is-hot" : ""}`,
		style: { "--c": color },
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "ls-role",
				children: role
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "row",
				style: {
					gap: 10,
					flexWrap: "nowrap"
				},
				children: [/* @__PURE__ */ jsx("span", {
					style: {
						fontFamily: "var(--font-display)",
						fontSize: 26,
						color
					},
					children: icon
				}), /* @__PURE__ */ jsx("strong", {
					className: "ls-name",
					children: name
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "ls-detail",
				style: { maxWidth: "none" },
				children: detail
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "readout",
				style: {
					"--c": color,
					marginTop: "auto"
				},
				children: [/* @__PURE__ */ jsx("div", {
					className: "lbl",
					children: readingLabel
				}), /* @__PURE__ */ jsx("div", {
					className: "val",
					style: { fontSize: "clamp(16px, 2.4vw, 20px)" },
					children: reading
				})]
			})
		]
	});
}
function ControlLoop() {
	const [scenarioIdx, setScenarioIdx] = useState(0);
	const [sensorId, setSensorId] = useState(SCENARIOS[0].sensor);
	const [controllerId, setControllerId] = useState(SCENARIOS[0].controller);
	const [actuatorId, setActuatorId] = useState(SCENARIOS[0].actuator);
	const [custom, setCustom] = useState(false);
	const sensor = useMemo(() => SENSORS.find((s) => s.id === sensorId), [sensorId]);
	const controller = useMemo(() => CONTROLLERS.find((c) => c.id === controllerId), [controllerId]);
	const actuator = useMemo(() => ACTUATORS$1.find((a) => a.id === actuatorId), [actuatorId]);
	const loadScenario = (i) => {
		const s = SCENARIOS[i];
		setScenarioIdx(i);
		setSensorId(s.sensor);
		setControllerId(s.controller);
		setActuatorId(s.actuator);
		setCustom(false);
	};
	const step = (dir) => loadScenario((scenarioIdx + dir + SCENARIOS.length) % SCENARIOS.length);
	const pick = (setter) => (v) => {
		setter(v);
		setCustom(true);
	};
	const scenario = custom ? null : SCENARIOS[scenarioIdx];
	const condition = scenario ? scenario.condition : `Señal de ${sensor.magnitude.toLowerCase()} frente a consigna`;
	const action = scenario ? scenario.action : actuator.action;
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX$2,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "LAZO DE CONTROL · SENSOR → CONTROLADOR → ACTUADOR" }), /* @__PURE__ */ jsx("span", {
				className: "live",
				children: custom ? "CADENA MANUAL" : "ESCENARIO INDUSTRIAL"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 18 },
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: { justifyContent: "space-between" },
					children: [/* @__PURE__ */ jsx("div", {
						className: "seg",
						role: "group",
						"aria-label": "Escenarios industriales predefinidos",
						children: SCENARIOS.map((s, i) => /* @__PURE__ */ jsx("button", {
							className: `btn ${!custom && i === scenarioIdx ? "is-active" : ""}`,
							style: AX$2,
							"aria-pressed": !custom && i === scenarioIdx,
							onClick: () => loadScenario(i),
							children: s.name
						}, s.id))
					}), /* @__PURE__ */ jsxs("div", {
						className: "row",
						style: { gap: 6 },
						children: [/* @__PURE__ */ jsx("button", {
							className: "btn",
							onClick: () => step(-1),
							"aria-label": "Escenario anterior",
							children: "←"
						}), /* @__PURE__ */ jsx("button", {
							className: "btn",
							onClick: () => step(1),
							"aria-label": "Escenario siguiente",
							children: "→"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "loop-grid",
					children: [
						/* @__PURE__ */ jsx(StageCard, {
							role: "01 · SENSOR",
							icon: sensor.icon,
							name: sensor.name,
							detail: `Convierte ${sensor.magnitude.toLowerCase()} en una señal eléctrica.`,
							reading: sensor.reading,
							readingLabel: `LECTURA · ${sensor.signal}`,
							color: "var(--ch-pres)",
							hot: true
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "loop-arrow",
							"aria-hidden": "true",
							children: [/* @__PURE__ */ jsx("span", { className: "wire" }), /* @__PURE__ */ jsx("span", { children: "▸" })]
						}),
						/* @__PURE__ */ jsx(StageCard, {
							role: "02 · CONTROLADOR",
							icon: controller.icon,
							name: controller.name,
							detail: controller.detail,
							reading: condition,
							readingLabel: "DECISIÓN · COMPARA CON LA CONSIGNA",
							color: "var(--act-intro)",
							hot: true
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "loop-arrow",
							"aria-hidden": "true",
							children: [/* @__PURE__ */ jsx("span", { className: "wire" }), /* @__PURE__ */ jsx("span", { children: "▸" })]
						}),
						/* @__PURE__ */ jsx(StageCard, {
							role: "03 · ACTUADOR",
							icon: actuator.icon,
							name: actuator.name,
							detail: actuator.action,
							reading: action,
							readingLabel: "ACCIÓN · TRABAJO SOBRE EL PROCESO",
							color: "var(--act-elec)",
							hot: true
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: {
						alignItems: "flex-start",
						gap: 18
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "col grow",
							style: { gap: 8 },
							children: [/* @__PURE__ */ jsx("span", {
								className: "mono-label",
								children: "SENSOR"
							}), /* @__PURE__ */ jsx("div", {
								className: "seg",
								role: "group",
								"aria-label": "Elegir sensor",
								children: SENSORS.map((s) => /* @__PURE__ */ jsxs("button", {
									className: `btn ${s.id === sensorId ? "is-active" : ""}`,
									style: { "--c": "var(--ch-pres)" },
									"aria-pressed": s.id === sensorId,
									onClick: () => pick(setSensorId)(s.id),
									children: [
										s.icon,
										" ",
										s.magnitude
									]
								}, s.id))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col grow",
							style: { gap: 8 },
							children: [/* @__PURE__ */ jsx("span", {
								className: "mono-label",
								children: "CONTROLADOR"
							}), /* @__PURE__ */ jsx("div", {
								className: "seg",
								role: "group",
								"aria-label": "Elegir controlador",
								children: CONTROLLERS.map((c) => /* @__PURE__ */ jsxs("button", {
									className: `btn ${c.id === controllerId ? "is-active" : ""}`,
									style: AX$2,
									"aria-pressed": c.id === controllerId,
									onClick: () => pick(setControllerId)(c.id),
									children: [
										c.icon,
										" ",
										c.id === "plc" ? "PLC" : "Arduino"
									]
								}, c.id))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col grow",
							style: { gap: 8 },
							children: [/* @__PURE__ */ jsx("span", {
								className: "mono-label",
								children: "ACTUADOR"
							}), /* @__PURE__ */ jsx("div", {
								className: "seg",
								role: "group",
								"aria-label": "Elegir actuador",
								children: ACTUATORS$1.map((a) => /* @__PURE__ */ jsxs("button", {
									className: `btn ${a.id === actuatorId ? "is-active" : ""}`,
									style: { "--c": "var(--act-elec)" },
									"aria-pressed": a.id === actuatorId,
									onClick: () => pick(setActuatorId)(a.id),
									children: [
										a.icon,
										" ",
										a.name.split(" ")[0]
									]
								}, a.id))
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					style: { marginTop: 0 },
					children: [scenario ? /* @__PURE__ */ jsxs("b", { children: [scenario.detail, " "] }) : /* @__PURE__ */ jsx("b", { children: "Cadena personalizada: " }), "El sensor mide la magnitud física, el controlador la compara con la consigna y el actuador ejecuta el trabajo sobre el proceso. El ciclo se repite mientras la máquina esté en marcha."]
				}),
				scenario && /* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					style: { marginTop: 0 },
					children: [/* @__PURE__ */ jsx("b", { children: "RESULTADO DEL PROCESO · " }), scenario.result]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/ActuatorGallery.tsx
var ACTUATORS = [
	{
		id: "motor-dc",
		name: "Motor DC",
		icon: "⚙",
		category: "Eléctrico",
		energy: "Energía eléctrica",
		principle: "La corriente en la bobina del rotor, dentro del campo del estator, genera una fuerza (F = B·I·L) que produce giro. El conmutador invierte la corriente cada media vuelta para mantener el movimiento.",
		formula: "n ∝ V · T ∝ I",
		formulaLabel: "VELOCIDAD Y PAR",
		uses: [
			"Cintas transportadoras",
			"Robótica educativa",
			"Ventiladores",
			"Posicionamiento con encoder"
		],
		advantages: [
			"Velocidad regulable por tensión o PWM",
			"Par de arranque alto",
			"Control de sentido invirtiendo polaridad"
		],
		limits: "las escobillas se desgastan y generan chispas; requiere mantenimiento periódico.",
		color: "var(--act-elec)"
	},
	{
		id: "motor-ac",
		name: "Motor AC de inducción",
		icon: "↻",
		category: "Eléctrico",
		energy: "Energía eléctrica trifásica",
		principle: "Las tres fases del estator crean un campo magnético giratorio. Ese campo induce corrientes en la jaula del rotor, que lo persiguen con un pequeño deslizamiento.",
		formula: "n = 120·f / p",
		formulaLabel: "VELOCIDAD SÍNCRONA",
		uses: [
			"Bombas y ventiladores",
			"Compresores",
			"Transportadores",
			"Máquinas-herramienta"
		],
		advantages: [
			"Robusto y sin escobillas",
			"Económico y de larga vida",
			"Velocidad variable con variador (VFD)"
		],
		limits: "sin variador de frecuencia su velocidad es casi fija; el arranque directo consume mucha corriente.",
		color: "var(--act-elec)"
	},
	{
		id: "stepper",
		name: "Motor paso a paso",
		icon: "⌗",
		category: "Eléctrico",
		energy: "Pulsos digitales",
		principle: "Cada pulso energiza una secuencia de bobinas y el rotor avanza un ángulo fijo. Es posicionamiento en lazo abierto: no necesita sensor para saber dónde está.",
		formula: "θ = 360° / N · 1.8° → N = 200 pasos/vuelta",
		formulaLabel: "ÁNGULO DE PASO",
		uses: [
			"Impresoras 3D",
			"CNC y fresadoras",
			"Escáneres",
			"Dosificación de precisión"
		],
		advantages: [
			"Posición exacta sin encoder",
			"Fácil de gobernar con un microcontrolador",
			"Alto par a baja velocidad"
		],
		limits: "el par cae al subir la velocidad y puede perder pasos si se exige demasiado.",
		color: "var(--act-elec)"
	},
	{
		id: "valvula",
		name: "Válvula solenoide",
		icon: "⌇",
		category: "Neumático",
		energy: "Eléctrica → neumática",
		principle: "Una bobina solenoide mueve el carrete de la válvula al recibir corriente. Según sus vías y posiciones (3/2, 5/2) dirige el aire a un lado u otro del cilindro.",
		formula: "3/2 simple efecto · 5/2 doble efecto",
		formulaLabel: "CONFIGURACIÓN",
		uses: [
			"Cilindros neumáticos",
			"Automatización de puertas",
			"Dosificación de fluidos",
			"Riego"
		],
		advantages: [
			"Conmuta con una señal eléctrica débil",
			"Respuesta rápida",
			"Integrable en PLC"
		],
		limits: "necesita aire limpio y seco; el solenoide puede calentarse si queda energizado mucho tiempo.",
		color: "var(--act-neum)"
	},
	{
		id: "cil-neumatico",
		name: "Cilindro neumático",
		icon: "⇔",
		category: "Neumático",
		energy: "Aire comprimido",
		principle: "El aire a presión empuja el pistón dentro del tubo. De simple efecto lleva un solo puerto y un resorte que devuelve; de doble efecto lleva dos puertos y trabaja en ambos sentidos.",
		formula: "F = P × A",
		formulaLabel: "FUERZA DEL PISTÓN",
		uses: [
			"Prensas ligeras",
			"Sujeción de piezas",
			"Embalaje",
			"Actuadores de puerta"
		],
		advantages: [
			"Rápido y limpio",
			"Barato y seguro (no hay chispas)",
			"Fácil de controlar con válvulas"
		],
		limits: "el aire es compresible: posicionar a media carrera es impreciso y la fuerza es moderada.",
		color: "var(--act-neum)"
	},
	{
		id: "cil-hidraulico",
		name: "Cilindro hidráulico",
		icon: "⇚",
		category: "Hidráulico",
		energy: "Aceite a presión",
		principle: "El aceite a alta presión empuja un pistón de gran sección. Por el principio de Pascal, una pequeña fuerza sobre el émbolo de la bomba se multiplica en el cilindro.",
		formula: "F = P × A · A = π·r²",
		formulaLabel: "FUERZA HIDRÁULICA",
		uses: [
			"Excavadoras",
			"Prensas industriales",
			"Elevadores",
			"Inyección de plástico"
		],
		advantages: [
			"Fuerza enorme en poco espacio",
			"Movimiento suave y preciso",
			"Autolubricado"
		],
		limits: "necesita grupo hidráulico, filtros y aceite; las fugas son sucias y peligrosas a alta presión.",
		color: "var(--act-hidr)"
	},
	{
		id: "motobomba",
		name: "Motobomba",
		icon: "⛽",
		category: "Hidráulico",
		energy: "Eléctrica → hidráulica",
		principle: "Un motor eléctrico gira una bomba (engranajes, paletas o pistones) que aspira aceite del depósito y lo entrega a presión al circuito. Es la fuente de energía del sistema.",
		formula: "Q = v × A · P = F / A",
		formulaLabel: "CAUDAL Y PRESIÓN",
		uses: [
			"Circuitos hidráulicos",
			"Suministro de agua",
			"Riego y achique",
			"Sistemas de refrigeración"
		],
		advantages: [
			"Genera el caudal y la presión de todo el circuito",
			"Arranque y paro automatizables",
			"Diversas tecnologías de bomba"
		],
		limits: "consume energía de forma continua, genera calor y ruido; exige filtración y mantenimiento.",
		color: "var(--act-hidr)"
	},
	{
		id: "mecanico",
		name: "Actuador mecánico",
		icon: "⟳",
		category: "Mecánico",
		energy: "Fuerza humana o de motor",
		principle: "Transmite movimiento mediante elementos mecánicos: leva, husillo, piñón-cremallera, biela-manivela o poleas. No convierte energía, la transforma en otra geometría de movimiento.",
		formula: "i = ω_entrada / ω_salida",
		formulaLabel: "RELACIÓN DE TRANSMISIÓN",
		uses: [
			"Husillos de elevación",
			"Puertas correderas",
			"Tornillos de banco",
			"Mecanismos de leva"
		],
		advantages: [
			"Sin fluido ni electricidad directa",
			"Muy robusto y preciso",
			"Multiplica fuerza con poco recorrido"
		],
		limits: "desgaste mecánico, requiere lubricación y no permite regulación eléctrica fina.",
		color: "var(--act-intro)"
	},
	{
		id: "piloto",
		name: "Piloto (lámpara indicadora)",
		icon: "◉",
		category: "Señalización",
		energy: "Energía eléctrica",
		principle: "Convierte una señal eléctrica (típicamente 24 V DC) en luz. Comunica el estado de la máquina al operario: marcha, paro, fallo o advertencia.",
		formula: "Verde = marcha · Rojo = paro/fallo",
		formulaLabel: "CÓDIGO DE COLOR",
		uses: [
			"Tableros de control",
			"Cuadros de maniobra",
			"Indicadores de línea",
			"Señalización de alarmas"
		],
		advantages: [
			"Estado legible de un vistazo",
			"LED de bajo consumo y larga vida",
			"Alto contraste e IP de intemperie"
		],
		limits: "depende del color y puede ser invisible para personas con daltonismo: acompáñalo con texto o forma.",
		color: "var(--act-senal)"
	},
	{
		id: "zumbador",
		name: "Zumbador (buzzer)",
		icon: "◈",
		category: "Señalización",
		energy: "Energía eléctrica",
		principle: "Un cristal piezoeléctrico o un electroimán vibra a una frecuencia audible y genera sonido. La frecuencia define el tono y el patrón de pulsos define el mensaje.",
		formula: "f = 2–4 kHz típico · dB = nivel sonoro",
		formulaLabel: "TONO Y VOLUMEN",
		uses: [
			"Alarmas de proceso",
			"Aviso de marcha atrás",
			"Confirmación de teclado",
			"Detectores de humo"
		],
		advantages: [
			"Avisa aunque el operario no mire el panel",
			"Barato y de bajo consumo",
			"Patrones intermitentes distinguibles"
		],
		limits: "molesto en exceso y poco informativo por sí solo: se combina con piloto o pantalla.",
		color: "var(--act-senal)"
	}
];
function ActuatorGallery() {
	const [open, setOpen] = useState(null);
	const triggers = useRef([]);
	const closeRef = useRef(null);
	const dialogRef = useRef(null);
	const close = () => {
		const idx = open;
		setOpen(null);
		if (idx !== null) triggers.current[idx]?.focus();
	};
	useEffect(() => {
		if (open === null) return;
		const onKey = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				close();
				return;
			}
			if (e.key !== "Tab") return;
			const focusable = dialogRef.current?.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
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
		document.addEventListener("keydown", onKey);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeRef.current?.focus();
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prevOverflow;
		};
	}, [open]);
	const item = open !== null ? ACTUATORS[open] : null;
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: { "--c": "var(--act-intro)" },
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "panel-tag",
				children: [/* @__PURE__ */ jsx("span", { children: "CATÁLOGO DE ACTUADORES · CLIC PARA ABRIR FICHA" }), /* @__PURE__ */ jsxs("span", { children: [ACTUATORS.length, " TIPOS"] })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "panel-inner",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid-3",
					children: ACTUATORS.map((a, i) => /* @__PURE__ */ jsx("button", {
						ref: (el) => {
							triggers.current[i] = el;
						},
						className: "panel act-card",
						style: { "--c": a.color },
						onClick: () => setOpen(i),
						"aria-haspopup": "dialog",
						"aria-label": `Ver ficha de ${a.name}`,
						children: /* @__PURE__ */ jsxs("div", {
							className: "panel-inner",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "act-ico",
									children: a.icon
								}),
								/* @__PURE__ */ jsx("strong", {
									className: "act-name",
									children: a.name
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "act-cat",
									children: [
										a.category.toUpperCase(),
										" · ",
										a.energy.toUpperCase()
									]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "mono",
									style: {
										fontSize: 10,
										color: "var(--c)",
										letterSpacing: ".12em",
										marginTop: 4
									},
									children: "ABRIR FICHA ▸"
								})
							]
						})
					}, a.id))
				})
			}),
			item && /* @__PURE__ */ jsx("div", {
				className: "modal-backdrop",
				onMouseDown: (e) => {
					if (e.target === e.currentTarget) close();
				},
				children: /* @__PURE__ */ jsxs("div", {
					className: "panel modal",
					ref: dialogRef,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": `act-modal-title-${item.id}`,
					style: { "--c": item.color },
					children: [/* @__PURE__ */ jsxs("div", {
						className: "panel-tag",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							item.category.toUpperCase(),
							" · ",
							item.energy.toUpperCase()
						] }), /* @__PURE__ */ jsx("span", { children: "FICHA TÉCNICA" })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "panel-inner col",
						style: { gap: 14 },
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "row",
								style: {
									justifyContent: "space-between",
									flexWrap: "nowrap"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									className: "row",
									style: {
										gap: 12,
										flexWrap: "nowrap"
									},
									children: [/* @__PURE__ */ jsx("span", {
										style: {
											fontFamily: "var(--font-display)",
											fontSize: 34,
											color: item.color
										},
										children: item.icon
									}), /* @__PURE__ */ jsx("h3", {
										id: `act-modal-title-${item.id}`,
										style: { fontSize: 22 },
										children: item.name
									})]
								}), /* @__PURE__ */ jsx("button", {
									ref: closeRef,
									className: "btn",
									onClick: close,
									"aria-label": "Cerrar ficha",
									children: "✕ CERRAR"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-dim",
								style: {
									fontSize: 14.5,
									maxWidth: "none"
								},
								children: item.principle
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "readout",
								style: { "--c": item.color },
								children: [/* @__PURE__ */ jsx("div", {
									className: "lbl",
									children: item.formulaLabel
								}), /* @__PURE__ */ jsx("div", {
									className: "val",
									style: { fontSize: "clamp(18px, 3vw, 24px)" },
									children: item.formula
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "col",
									style: { gap: 6 },
									children: [/* @__PURE__ */ jsx("span", {
										className: "mono-label",
										children: "USOS TÍPICOS"
									}), /* @__PURE__ */ jsx("ul", {
										style: {
											margin: 0,
											paddingLeft: 18,
											color: "var(--ink-dim)",
											fontSize: 13.5,
											lineHeight: 1.7
										},
										children: item.uses.map((u) => /* @__PURE__ */ jsx("li", { children: u }, u))
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "col",
									style: { gap: 6 },
									children: [/* @__PURE__ */ jsx("span", {
										className: "mono-label",
										children: "VENTAJAS"
									}), /* @__PURE__ */ jsx("ul", {
										style: {
											margin: 0,
											paddingLeft: 18,
											color: "var(--ink-dim)",
											fontSize: 13.5,
											lineHeight: 1.7
										},
										children: item.advantages.map((v) => /* @__PURE__ */ jsx("li", { children: v }, v))
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "sim-note",
								style: { marginTop: 0 },
								children: [/* @__PURE__ */ jsx("b", {
									style: { color: "var(--warn)" },
									children: "Ojo con… "
								}), item.limits]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "no-js-gallery-details",
				children: [/* @__PURE__ */ jsx("h3", { children: "Catálogo de actuadores" }), ACTUATORS.map((actuator) => /* @__PURE__ */ jsxs("details", { children: [
					/* @__PURE__ */ jsx("summary", { children: actuator.name }),
					/* @__PURE__ */ jsx("p", { children: actuator.principle }),
					/* @__PURE__ */ jsxs("p", {
						className: "mono",
						children: [
							actuator.formulaLabel,
							": ",
							actuator.formula
						]
					})
				] }, actuator.id))]
			})
		]
	});
}
//#endregion
//#region src/components/sims/challengeLogic.ts
function isChallengeCorrect(challenge, selectedId) {
	return challenge.correct === selectedId;
}
//#endregion
//#region src/components/sims/ActuatorChallenge.tsx
function ActuatorChallenge() {
	const [challengeIndex, setChallengeIndex] = useState(0);
	const [selectedId, setSelectedId] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const promptRef = useRef(null);
	const challenge = ACTUATOR_CHALLENGES[challengeIndex];
	const correct = selectedId !== null && isChallengeCorrect(challenge, selectedId);
	useEffect(() => {
		if (challengeIndex > 0) window.requestAnimationFrame(() => promptRef.current?.focus());
	}, [challengeIndex]);
	const next = () => {
		setChallengeIndex((current) => (current + 1) % ACTUATOR_CHALLENGES.length);
		setSelectedId(null);
		setSubmitted(false);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "panel challenge",
		style: { "--c": "var(--act-sel)" },
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "SELECCIONA EL ACTUADOR CORRECTO" }), /* @__PURE__ */ jsxs("span", { children: [
				"RETO ",
				challengeIndex + 1,
				"/",
				ACTUATOR_CHALLENGES.length
			] })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "challenge-prompt",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "mono-label",
							children: "SITUACIÓN INDUSTRIAL"
						}),
						/* @__PURE__ */ jsx("h3", {
							ref: promptRef,
							tabIndex: -1,
							style: { margin: 0 },
							children: challenge.situation
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-dim",
							style: {
								margin: 0,
								maxWidth: "none"
							},
							children: challenge.detail
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "challenge-options",
					role: "radiogroup",
					"aria-label": "Opciones de actuador",
					children: challenge.options.map((option) => {
						const isSelected = selectedId === option.id;
						const isCorrect = submitted && option.id === challenge.correct;
						return /* @__PURE__ */ jsxs("label", {
							className: `challenge-option${isSelected ? " is-selected" : ""}${isCorrect ? " is-correct" : ""}${submitted && isSelected && !isCorrect ? " is-wrong" : ""}`,
							children: [
								/* @__PURE__ */ jsx("input", {
									type: "radio",
									name: `actuator-challenge-${challenge.id}`,
									value: option.id,
									checked: isSelected,
									disabled: submitted,
									onChange: () => setSelectedId(option.id)
								}),
								/* @__PURE__ */ jsx("span", {
									className: "mono",
									children: String.fromCharCode(65 + challenge.options.indexOf(option))
								}),
								/* @__PURE__ */ jsx("span", { children: option.label })
							]
						}, option.id);
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: {
						gap: 10,
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsx("button", {
						className: "btn is-active",
						style: { "--c": "var(--act-sel)" },
						disabled: !selectedId || submitted,
						onClick: () => setSubmitted(true),
						children: "COMPROBAR RESPUESTA"
					}), submitted && /* @__PURE__ */ jsx("button", {
						className: "btn",
						style: { "--c": "var(--act-sel)" },
						onClick: next,
						children: "SIGUIENTE SITUACIÓN →"
					})]
				}),
				submitted && /* @__PURE__ */ jsxs("div", {
					className: `challenge-feedback ${correct ? "is-correct" : "is-wrong"}`,
					role: "status",
					"aria-live": "polite",
					children: [
						/* @__PURE__ */ jsx("strong", { children: correct ? "✓ Elección adecuada" : "✗ Revisa la selección" }),
						/* @__PURE__ */ jsx("p", { children: correct ? challenge.explanation : `La opción recomendada es ${challenge.options.find((option) => option.id === challenge.correct)?.label}. ${challenge.explanation}` }),
						/* @__PURE__ */ jsx("div", {
							className: "challenge-criteria",
							children: challenge.criteria.map((criterion) => /* @__PURE__ */ jsx("span", {
								className: "chip",
								children: SELECTION_CRITERIA.find((item) => item.id === criterion)?.title
							}, criterion))
						})
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/actuatorPhysics.ts
/** Pure calculations shared by the actuator simulators and their tests. */
function pistonAreaCm2(diameterMm) {
	return Math.PI * (diameterMm / 20) ** 2;
}
function rodAreaCm2(pistonDiameterMm, diameterRatio = .4) {
	return pistonAreaCm2(pistonDiameterMm * diameterRatio);
}
function actuatorForceN(pressureBar, areaCm2) {
	return pressureBar * areaCm2 * 10;
}
function hydraulicVelocityMps(flowLitersPerMinute, areaCm2) {
	return flowLitersPerMinute * 1e3 / areaCm2 / 100 / 60;
}
function hydraulicPowerKw(pressureBar, flowLitersPerMinute) {
	return pressureBar * flowLitersPerMinute / 600;
}
function synchronousRpm(frequencyHz, poles) {
	return 120 * frequencyHz / poles;
}
function rotorRpm(synchronousSpeed, slipRatio = .04) {
	return synchronousSpeed * (1 - slipRatio);
}
function normalizeAngle(angle) {
	return Number(((angle % 360 + 360) % 360).toFixed(1));
}
function stepperAngle(steps, angleStep, direction = 1) {
	return normalizeAngle(steps * angleStep * direction);
}
function stepperPhaseIndex(steps, direction = 1) {
	return (steps * direction % 4 + 4) % 4;
}
function stepperPulseIntervalMs(pulsesPerSecond) {
	return 1e3 / Math.max(.1, pulsesPerSecond);
}
//#endregion
//#region src/components/sims/StepperView.tsx
var COIL_COLORS = [
	"#4cc9f0",
	"#ffd166",
	"#f472b6",
	"#34d399"
];
var COIL_LABELS = [
	"A",
	"B",
	"C",
	"D"
];
var COIL_POSITIONS = [
	{
		x: 200,
		y: 36
	},
	{
		x: 274,
		y: 110
	},
	{
		x: 200,
		y: 184
	},
	{
		x: 126,
		y: 110
	}
];
function StepperView() {
	const [angleStep, setAngleStep] = useState(1.8);
	const [steps, setSteps] = useState(0);
	const [direction, setDirection] = useState(1);
	const [pulsesPerSecond, setPulsesPerSecond] = useState(2);
	const [running, setRunning] = useState(false);
	const reduce = useReducedMotion();
	const pulse = () => setSteps((current) => current + direction);
	useEffect(() => {
		if (!running || reduce) return;
		const interval = stepperPulseIntervalMs(pulsesPerSecond);
		const id = window.setInterval(pulse, interval);
		return () => window.clearInterval(id);
	}, [
		direction,
		pulsesPerSecond,
		reduce,
		running
	]);
	useEffect(() => {
		if (reduce) setRunning(false);
	}, [reduce]);
	const perRev = Math.round(360 / angleStep);
	const coil = stepperPhaseIndex(steps);
	const realAngle = stepperAngle(steps, angleStep);
	const visualAngle = steps * angleStep;
	return /* @__PURE__ */ jsxs("div", {
		className: "col",
		style: { gap: 16 },
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "sim-stage graticule",
				style: { padding: "12px 12px 0" },
				children: [/* @__PURE__ */ jsxs("div", {
					className: "stage-cap",
					children: [/* @__PURE__ */ jsx("span", { children: "SECUENCIA DE BOBINAS A · B · C · D" }), /* @__PURE__ */ jsxs("span", { children: [
						steps,
						" PULSOS · ",
						direction === 1 ? "HORARIO" : "ANTIHORARIO"
					] })]
				}), /* @__PURE__ */ jsxs("svg", {
					viewBox: "0 0 400 220",
					role: "img",
					"aria-label": `Motor paso a paso, ${direction === 1 ? "horario" : "antihorario"}, ${steps} pulsos, ángulo real ${realAngle} grados`,
					style: {
						width: "100%",
						height: "auto"
					},
					children: [
						COIL_COLORS.map((color, index) => {
							const position = COIL_POSITIONS[index];
							const active = coil === index;
							return /* @__PURE__ */ jsxs("g", {
								className: active ? "coil-on" : "",
								style: { "--c": color },
								children: [/* @__PURE__ */ jsx("rect", {
									x: position.x - 20,
									y: position.y - 15,
									width: "40",
									height: "30",
									rx: "4",
									fill: active ? color : "#0f1b30",
									stroke: color,
									strokeWidth: "2",
									opacity: active ? 1 : .4
								}), /* @__PURE__ */ jsx("text", {
									x: position.x,
									y: position.y + 4,
									textAnchor: "middle",
									fontSize: "11",
									fontFamily: "var(--font-mono)",
									fill: active ? "#04070d" : color,
									children: COIL_LABELS[index]
								})]
							}, COIL_LABELS[index]);
						}),
						/* @__PURE__ */ jsx("g", {
							transform: "translate(200,110)",
							children: /* @__PURE__ */ jsxs("g", {
								className: "rotor-step",
								style: {
									transform: `rotate(${visualAngle}deg)`,
									transformOrigin: "center",
									transformBox: "fill-box"
								},
								children: [
									/* @__PURE__ */ jsx("circle", {
										r: "44",
										fill: "#0f1b30",
										stroke: "#33465f",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ jsx("rect", {
										x: "-34",
										y: "-7",
										width: "68",
										height: "14",
										rx: "3",
										fill: "#b794ff",
										opacity: "0.85"
									}),
									/* @__PURE__ */ jsx("circle", {
										r: "6",
										fill: "#04070d",
										stroke: "#b794ff",
										strokeWidth: "2"
									})
								]
							})
						}),
						/* @__PURE__ */ jsxs("text", {
							x: "200",
							y: "206",
							fill: "var(--ink-faint)",
							fontSize: "10",
							fontFamily: "var(--font-mono)",
							textAnchor: "middle",
							children: [
								"FASE ",
								COIL_LABELS[coil],
								" · ÁNGULO REAL ",
								realAngle,
								"° · ",
								perRev,
								" PASOS / VUELTA"
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "row",
				style: {
					gap: 12,
					alignItems: "flex-end",
					flexWrap: "wrap"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "seg",
						role: "group",
						"aria-label": "Ángulo de paso",
						children: [
							1.8,
							.9,
							7.5
						].map((value) => /* @__PURE__ */ jsxs("button", {
							className: `btn ${angleStep === value ? "is-active" : ""}`,
							style: { "--c": "var(--act-elec)" },
							"aria-pressed": angleStep === value,
							onClick: () => {
								setAngleStep(value);
								setSteps(0);
								setRunning(false);
							},
							children: [value, "°/PASO"]
						}, value))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "seg",
						role: "group",
						"aria-label": "Dirección del motor paso a paso",
						children: [/* @__PURE__ */ jsx("button", {
							className: `btn ${direction === 1 ? "is-active" : ""}`,
							style: { "--c": "var(--act-elec)" },
							"aria-pressed": direction === 1,
							onClick: () => setDirection(1),
							children: "↻ HORARIO"
						}), /* @__PURE__ */ jsx("button", {
							className: `btn ${direction === -1 ? "is-active" : ""}`,
							style: { "--c": "var(--act-elec)" },
							"aria-pressed": direction === -1,
							onClick: () => setDirection(-1),
							children: "↺ ANTIHORARIO"
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						className: "btn",
						style: { "--c": "var(--act-elec)" },
						onClick: pulse,
						children: [direction === 1 ? "▸" : "◂", " 1 PULSO"]
					}),
					/* @__PURE__ */ jsx("button", {
						className: `btn ${running ? "is-active" : ""}`,
						style: { "--c": "var(--act-elec)" },
						"aria-pressed": running,
						disabled: reduce,
						onClick: () => setRunning((current) => !current),
						children: reduce ? "▶ AUTO · REDUCIDO" : running ? "❚❚ DETENER" : "▶ AUTO"
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn",
						onClick: () => {
							setRunning(false);
							setSteps(0);
						},
						children: "↺ RESET"
					})
				]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "col",
				style: { gap: 4 },
				children: [/* @__PURE__ */ jsxs("span", {
					className: "mono-label",
					children: [
						"VELOCIDAD · ",
						pulsesPerSecond,
						" PULSOS/S"
					]
				}), /* @__PURE__ */ jsx("input", {
					type: "range",
					min: "1",
					max: "12",
					step: "1",
					value: pulsesPerSecond,
					onChange: (event) => setPulsesPerSecond(Number(event.target.value)),
					"aria-label": "Velocidad del motor paso a paso en pulsos por segundo",
					style: {
						"--c": "var(--act-elec)",
						"--fill": `${(pulsesPerSecond - 1) / 11 * 100}%`
					}
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "ÁNGULO DE PASO"
						}), /* @__PURE__ */ jsxs("div", {
							className: "val",
							children: [angleStep, "°"]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "PASOS POR VUELTA"
						}), /* @__PURE__ */ jsx("div", {
							className: "val",
							children: perRev
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "ÁNGULO REAL"
						}), /* @__PURE__ */ jsxs("div", {
							className: "val",
							children: [realAngle, "°"]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "sim-note",
				style: { marginTop: 0 },
				children: [
					/* @__PURE__ */ jsx("b", { children: "Modelo visual simplificado." }),
					" Cada pulso avanza ",
					angleStep,
					"° en la dirección seleccionada y activa la siguiente bobina; la velocidad automática controla los pulsos por segundo."
				]
			})
		]
	});
}
//#endregion
//#region src/components/sims/MotorLab.tsx
var TABS = [
	{
		id: "dc",
		label: "MOTOR DC"
	},
	{
		id: "ac",
		label: "MOTOR AC"
	},
	{
		id: "stepper",
		label: "PASO A PASO"
	}
];
var COMPARE = [
	{
		metric: "Control de velocidad",
		dc: "Continuo por tensión / PWM",
		ac: "Requiere variador (VFD)",
		stepper: "Por frecuencia de pulsos"
	},
	{
		metric: "Posición",
		dc: "Necesita encoder",
		ac: "Necesita encoder",
		stepper: "Exacta en lazo abierto"
	},
	{
		metric: "Mantenimiento",
		dc: "Escobillas",
		ac: "Muy bajo",
		stepper: "Bajo"
	},
	{
		metric: "Par a baja velocidad",
		dc: "Alto",
		ac: "Medio",
		stepper: "Alto"
	},
	{
		metric: "Costo típico",
		dc: "Bajo",
		ac: "Medio",
		stepper: "Medio"
	},
	{
		metric: "Uso característico",
		dc: "Máquinas pequeñas",
		ac: "Bombas, ventiladores",
		stepper: "CNC, impresoras 3D"
	}
];
function DCView() {
	const [voltage, setVoltage] = useState(12);
	const [load, setLoad] = useState(50);
	const [dir, setDir] = useState(1);
	const reduce = useReducedMotion();
	const rpm = Math.round(voltage * 100);
	const dur = rpm > 0 ? Math.max(.12, 320 / rpm) : 0;
	const running = rpm > 0 && !reduce;
	const torque = Math.round(voltage / 24 * load);
	return /* @__PURE__ */ jsxs("div", {
		className: "col",
		style: { gap: 16 },
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "sim-stage graticule",
				style: { padding: "12px 12px 0" },
				children: [/* @__PURE__ */ jsxs("div", {
					className: "stage-cap",
					children: [/* @__PURE__ */ jsx("span", { children: "MÁQUINA DC · ARMADURA + CAMPO" }), /* @__PURE__ */ jsx("span", { children: dir === 1 ? "HORARIO ▸" : "◂ ANTIHORARIO" })]
				}), /* @__PURE__ */ jsxs("svg", {
					viewBox: "0 0 400 220",
					role: "img",
					"aria-label": `Motor DC girando a ${rpm} rpm`,
					style: {
						width: "100%",
						height: "auto"
					},
					children: [
						/* @__PURE__ */ jsx("rect", {
							x: "80",
							y: "30",
							width: "34",
							height: "160",
							rx: "4",
							fill: "#2a1f3d",
							stroke: "#6b5bd6"
						}),
						/* @__PURE__ */ jsx("rect", {
							x: "286",
							y: "30",
							width: "34",
							height: "160",
							rx: "4",
							fill: "#2a1f3d",
							stroke: "#6b5bd6"
						}),
						/* @__PURE__ */ jsx("text", {
							x: "97",
							y: "24",
							fill: "#b794ff",
							fontSize: "12",
							fontFamily: "var(--font-mono)",
							textAnchor: "middle",
							children: "N"
						}),
						/* @__PURE__ */ jsx("text", {
							x: "303",
							y: "24",
							fill: "#b794ff",
							fontSize: "12",
							fontFamily: "var(--font-mono)",
							textAnchor: "middle",
							children: "S"
						}),
						/* @__PURE__ */ jsxs("g", {
							transform: "translate(200,110)",
							children: [
								/* @__PURE__ */ jsx("circle", {
									r: "66",
									fill: "none",
									stroke: "var(--line)",
									strokeWidth: "2"
								}),
								/* @__PURE__ */ jsx("circle", {
									r: "52",
									fill: "#0f1b30",
									stroke: "#33465f",
									strokeWidth: "2"
								}),
								/* @__PURE__ */ jsxs("g", {
									className: running ? dir === 1 ? "spin" : "spin-rev" : "",
									style: { animationDuration: `${dur}s` },
									children: [
										/* @__PURE__ */ jsx("rect", {
											x: "-42",
											y: "-8",
											width: "84",
											height: "16",
											rx: "3",
											fill: "#ffd166",
											opacity: "0.85"
										}),
										/* @__PURE__ */ jsx("rect", {
											x: "-8",
											y: "-42",
											width: "16",
											height: "84",
											rx: "3",
											fill: "#ffd166",
											opacity: "0.55"
										}),
										/* @__PURE__ */ jsx("circle", {
											r: "10",
											fill: "#0b1526",
											stroke: "#ffd166",
											strokeWidth: "2"
										}),
										/* @__PURE__ */ jsx("circle", {
											r: "3",
											fill: "#ffd166"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "114",
							y1: "110",
							x2: "148",
							y2: "110",
							stroke: "#ffd166",
							strokeWidth: "2",
							className: running ? "flow" : ""
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "252",
							y1: "110",
							x2: "286",
							y2: "110",
							stroke: "#ffd166",
							strokeWidth: "2",
							className: running ? "flow" : ""
						}),
						/* @__PURE__ */ jsx("text", {
							x: "200",
							y: "206",
							fill: "var(--ink-faint)",
							fontSize: "10",
							fontFamily: "var(--font-mono)",
							textAnchor: "middle",
							children: running ? `ROTOR GIRANDO · ${rpm} rpm` : "ROTOR DETENIDO"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid-2",
				style: {
					gap: 16,
					alignItems: "end"
				},
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "col",
						style: { gap: 4 },
						children: [/* @__PURE__ */ jsxs("span", {
							className: "mono-label",
							children: [
								"TENSIÓN DE ARMADURA · ",
								voltage,
								" V"
							]
						}), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: 0,
							max: 24,
							step: 1,
							value: voltage,
							onChange: (e) => setVoltage(Number(e.target.value)),
							"aria-label": "Tensión del motor DC en voltios",
							style: {
								"--c": "var(--act-elec)",
								"--fill": `${voltage / 24 * 100}%`
							}
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "col",
						style: { gap: 4 },
						children: [/* @__PURE__ */ jsxs("span", {
							className: "mono-label",
							children: [
								"CARGA MECÁNICA · ",
								load,
								" %"
							]
						}), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: 0,
							max: 100,
							step: 5,
							value: load,
							onChange: (e) => setLoad(Number(e.target.value)),
							"aria-label": "Carga mecánica del motor DC en porcentaje",
							style: {
								"--c": "var(--act-elec)",
								"--fill": `${load}%`
							}
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						className: `btn ${dir === -1 ? "is-active" : ""}`,
						style: { "--c": "var(--act-elec)" },
						onClick: () => setDir((d) => d === 1 ? -1 : 1),
						"aria-pressed": dir === -1,
						children: "⇄ INVERTIR POLARIDAD"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "VELOCIDAD"
						}), /* @__PURE__ */ jsxs("div", {
							className: "val",
							children: [
								rpm,
								" ",
								/* @__PURE__ */ jsx("span", {
									style: { fontSize: ".6em" },
									children: "rpm"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "SENTIDO"
						}), /* @__PURE__ */ jsx("div", {
							className: "val",
							style: { fontSize: 20 },
							children: dir === 1 ? "HORARIO" : "ANTIHOR."
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "ÍNDICE DE PAR · MODELO"
						}), /* @__PURE__ */ jsxs("div", {
							className: "val",
							children: [
								torque,
								" ",
								/* @__PURE__ */ jsx("span", {
									style: { fontSize: ".6em" },
									children: "%"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "sim-note",
				style: { marginTop: 0 },
				children: [/* @__PURE__ */ jsx("b", { children: "n ∝ V; T ∝ I." }), " La tensión fija principalmente la velocidad y la carga determina la corriente y el par disponible en este modelo relativo. Al invertir la polaridad cambia el sentido de giro."]
			})
		]
	});
}
function ACView() {
	const [freq, setFreq] = useState(50);
	const [poles, setPoles] = useState(4);
	const [phase, setPhase] = useState(0);
	const reduce = useReducedMotion();
	const sync = Math.round(synchronousRpm(freq, poles));
	const rotorRpm$1 = Math.round(rotorRpm(sync));
	const slip = sync - rotorRpm$1;
	const electricalPeriod = Math.max(.36, .84 * (50 / freq));
	const rotorDuration = Math.max(.3, electricalPeriod * (poles / 2) / .96);
	useEffect(() => {
		setPhase(0);
		if (reduce) return;
		const ms = Math.max(90, electricalPeriod * 1e3 / 3);
		const id = window.setInterval(() => setPhase((p) => (p + 1) % 3), ms);
		return () => window.clearInterval(id);
	}, [
		electricalPeriod,
		poles,
		freq,
		reduce
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "col",
		style: { gap: 16 },
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "sim-stage graticule",
				style: { padding: "12px 12px 0" },
				children: [/* @__PURE__ */ jsxs("div", {
					className: "stage-cap",
					children: [/* @__PURE__ */ jsx("span", { children: "CAMPO GIRATORIO · TRIFÁSICO" }), /* @__PURE__ */ jsxs("span", { children: [
						freq,
						" Hz · ",
						poles,
						" POLOS"
					] })]
				}), /* @__PURE__ */ jsxs("svg", {
					viewBox: "0 0 400 220",
					role: "img",
					"aria-label": `Campo giratorio de motor AC a ${freq} Hz, ${poles} polos, fase ${[
						"U",
						"V",
						"W"
					][phase]}, rotor a ${rotorRpm$1} rpm`,
					style: {
						width: "100%",
						height: "auto"
					},
					children: [
						/* @__PURE__ */ jsx("circle", {
							cx: "200",
							cy: "110",
							r: "74",
							fill: "none",
							stroke: "var(--line)",
							strokeWidth: "2"
						}),
						[
							{
								x: 200,
								y: 50,
								c: "#4cc9f0"
							},
							{
								x: 252,
								y: 140,
								c: "#ffd166"
							},
							{
								x: 148,
								y: 140,
								c: "#f472b6"
							}
						].map((coil, i) => /* @__PURE__ */ jsxs("g", {
							className: phase === i ? "coil-on" : "",
							style: { "--c": coil.c },
							children: [/* @__PURE__ */ jsx("circle", {
								cx: coil.x,
								cy: coil.y,
								r: "17",
								fill: phase === i ? coil.c : "#0f1b30",
								stroke: coil.c,
								strokeWidth: "2",
								opacity: phase === i ? 1 : .45
							}), /* @__PURE__ */ jsx("text", {
								x: coil.x,
								y: coil.y + 4,
								textAnchor: "middle",
								fontSize: "11",
								fontFamily: "var(--font-mono)",
								fill: phase === i ? "#04070d" : coil.c,
								children: [
									"U",
									"V",
									"W"
								][i]
							})]
						}, i)),
						/* @__PURE__ */ jsx("g", {
							transform: "translate(200,110)",
							children: /* @__PURE__ */ jsxs("g", {
								className: reduce ? "" : "spin",
								style: { "--rot": `${rotorDuration}s` },
								children: [
									/* @__PURE__ */ jsx("circle", {
										r: "46",
										fill: "#0f1b30",
										stroke: "#33465f",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ jsx("path", {
										d: "M0,-42 L10,0 L0,42 L-10,0 Z",
										fill: "#ffd166",
										opacity: "0.85"
									}),
									/* @__PURE__ */ jsx("circle", {
										r: "7",
										fill: "#04070d",
										stroke: "#ffd166",
										strokeWidth: "2"
									})
								]
							})
						}, `${freq}-${poles}`),
						/* @__PURE__ */ jsx("text", {
							x: "200",
							y: "206",
							fill: "var(--ink-faint)",
							fontSize: "10",
							fontFamily: "var(--font-mono)",
							textAnchor: "middle",
							children: "ROTOR SIGUE AL CAMPO · ANIMACIÓN NO A ESCALA"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "row",
				style: {
					gap: 16,
					alignItems: "flex-end"
				},
				children: [/* @__PURE__ */ jsxs("label", {
					className: "col grow",
					style: { gap: 4 },
					children: [/* @__PURE__ */ jsxs("span", {
						className: "mono-label",
						children: [
							"FRECUENCIA · ",
							freq,
							" Hz"
						]
					}), /* @__PURE__ */ jsx("input", {
						type: "range",
						min: 20,
						max: 70,
						step: 5,
						value: freq,
						onChange: (e) => setFreq(Number(e.target.value)),
						"aria-label": "Frecuencia del motor AC en hercios",
						style: {
							"--c": "var(--act-elec)",
							"--fill": `${(freq - 20) / 50 * 100}%`
						}
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "seg",
					role: "group",
					"aria-label": "Número de polos",
					children: [
						2,
						4,
						6
					].map((p) => /* @__PURE__ */ jsxs("button", {
						className: `btn ${poles === p ? "is-active" : ""}`,
						style: { "--c": "var(--act-elec)" },
						"aria-pressed": poles === p,
						onClick: () => setPoles(p),
						children: [p, " POLOS"]
					}, p))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "VELOCIDAD SÍNCRONA"
						}), /* @__PURE__ */ jsxs("div", {
							className: "val",
							children: [
								sync,
								" ",
								/* @__PURE__ */ jsx("span", {
									style: { fontSize: ".6em" },
									children: "rpm"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "VELOCIDAD DEL ROTOR"
						}), /* @__PURE__ */ jsxs("div", {
							className: "val",
							children: [
								rotorRpm$1,
								" ",
								/* @__PURE__ */ jsx("span", {
									style: { fontSize: ".6em" },
									children: "rpm"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "DESLIZAMIENTO (~4 %)"
						}), /* @__PURE__ */ jsxs("div", {
							className: "val",
							children: [
								slip,
								" ",
								/* @__PURE__ */ jsx("span", {
									style: { fontSize: ".6em" },
									children: "rpm"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: { "--c": "var(--act-elec)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "FÓRMULA"
						}), /* @__PURE__ */ jsx("div", {
							className: "val",
							style: { fontSize: 18 },
							children: "120·f / p"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "sim-note",
				style: { marginTop: 0 },
				children: [
					/* @__PURE__ */ jsx("b", { children: "Motor de inducción." }),
					" El campo giratorio arrastra la jaula del rotor; con un variador de frecuencia (VFD) se regula la velocidad cambiando ",
					/* @__PURE__ */ jsx("span", {
						className: "mono",
						children: "f"
					}),
					"."
				]
			})
		]
	});
}
function MotorLab() {
	const [tab, setTab] = useState("dc");
	const moveTab = (index, direction) => {
		const nextTab = TABS[(index + direction + TABS.length) % TABS.length].id;
		setTab(nextTab);
		window.requestAnimationFrame(() => document.getElementById(`motor-tab-${nextTab}`)?.focus());
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: { "--c": "var(--act-elec)" },
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "BANCO DE MOTORES · ACT-02" }), /* @__PURE__ */ jsx("span", {
				className: "live",
				children: "EN VIVO"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 18 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "seg",
					role: "tablist",
					"aria-label": "Tipo de motor",
					children: TABS.map((t) => /* @__PURE__ */ jsx("button", {
						id: `motor-tab-${t.id}`,
						role: "tab",
						"aria-selected": tab === t.id,
						"aria-controls": "motor-panel",
						tabIndex: tab === t.id ? 0 : -1,
						className: `btn ${tab === t.id ? "is-active" : ""}`,
						style: { "--c": "var(--act-elec)" },
						onClick: () => setTab(t.id),
						onKeyDown: (event) => {
							if (event.key === "ArrowRight") {
								event.preventDefault();
								moveTab(TABS.findIndex((item) => item.id === t.id), 1);
							}
							if (event.key === "ArrowLeft") {
								event.preventDefault();
								moveTab(TABS.findIndex((item) => item.id === t.id), -1);
							}
						},
						children: t.label
					}, t.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					id: "motor-panel",
					role: "tabpanel",
					"aria-labelledby": `motor-tab-${tab}`,
					tabIndex: 0,
					children: [
						tab === "dc" && /* @__PURE__ */ jsx(DCView, {}),
						tab === "ac" && /* @__PURE__ */ jsx(ACView, {}),
						tab === "stepper" && /* @__PURE__ */ jsx(StepperView, {})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					style: { overflowX: "auto" },
					children: /* @__PURE__ */ jsxs("table", {
						className: "tbl",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", { children: "Criterio" }),
							/* @__PURE__ */ jsx("th", {
								style: { color: tab === "dc" ? "var(--act-elec)" : void 0 },
								children: "Motor DC"
							}),
							/* @__PURE__ */ jsx("th", {
								style: { color: tab === "ac" ? "var(--act-elec)" : void 0 },
								children: "Motor AC"
							}),
							/* @__PURE__ */ jsx("th", {
								style: { color: tab === "stepper" ? "var(--act-elec)" : void 0 },
								children: "Paso a paso"
							})
						] }) }), /* @__PURE__ */ jsx("tbody", { children: COMPARE.map((r) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("strong", { children: r.metric }) }),
							/* @__PURE__ */ jsx("td", {
								style: tab === "dc" ? { color: "var(--ink)" } : void 0,
								children: r.dc
							}),
							/* @__PURE__ */ jsx("td", {
								style: tab === "ac" ? { color: "var(--ink)" } : void 0,
								children: r.ac
							}),
							/* @__PURE__ */ jsx("td", {
								style: tab === "stepper" ? { color: "var(--ink)" } : void 0,
								children: r.stepper
							})
						] }, r.metric)) })]
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/PneumaticLab.tsx
var AX$1 = { "--c": "var(--act-neum)" };
var STROKE_MIN = 25;
function PneumaticLab() {
	const [mode, setMode] = useState("doble");
	const [extended, setExtended] = useState(false);
	const [stroke, setStroke] = useState(150);
	const [bore, setBore] = useState(32);
	const [pressure, setPressure] = useState(6);
	const areaPiston = pistonAreaCm2(bore);
	const areaRod = rodAreaCm2(bore);
	const forceAdvance = actuatorForceN(pressure, areaPiston);
	const forceRetract = actuatorForceN(pressure, areaPiston - areaRod);
	const switchMode = (m) => {
		setMode(m);
		setExtended(false);
	};
	const valveLabel = mode === "doble" ? "5/2" : "3/2";
	const travelPx = 14 + (stroke - STROKE_MIN) / 275 * 82;
	const pistonOffset = extended ? travelPx : 0;
	const rodLen = 130;
	const airWidth = 30 + (extended ? travelPx : 0);
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX$1,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "BANCO NEUMÁTICO · CILINDRO + VÁLVULA SOLENOIDE" }), /* @__PURE__ */ jsxs("span", {
				className: "live",
				children: [pressure.toFixed(1), " bar"]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 18 },
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: { justifyContent: "space-between" },
					children: [/* @__PURE__ */ jsxs("div", {
						className: "seg",
						role: "group",
						"aria-label": "Tipo de cilindro",
						children: [/* @__PURE__ */ jsx("button", {
							className: `btn ${mode === "simple" ? "is-active" : ""}`,
							style: AX$1,
							"aria-pressed": mode === "simple",
							onClick: () => switchMode("simple"),
							children: "SIMPLE EFECTO"
						}), /* @__PURE__ */ jsx("button", {
							className: `btn ${mode === "doble" ? "is-active" : ""}`,
							style: AX$1,
							"aria-pressed": mode === "doble",
							onClick: () => switchMode("doble"),
							children: "DOBLE EFECTO"
						})]
					}), /* @__PURE__ */ jsxs("span", {
						className: "chip",
						children: ["VÁLVULA ", valveLabel]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "sim-stage graticule",
					style: { padding: "12px 12px 0" },
					children: [/* @__PURE__ */ jsxs("div", {
						className: "stage-cap",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							"CILINDRO · Ø",
							bore,
							" mm · CARRERA ",
							stroke,
							" mm"
						] }), /* @__PURE__ */ jsx("span", { children: extended ? "VÁSTAGO EXTENDIDO" : "VÁSTAGO RETRAÍDO" })]
					}), /* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 480 190",
						role: "img",
						"aria-label": `Cilindro neumático de ${mode === "simple" ? "simple" : "doble"} efecto ${extended ? "extendido" : "retraído"}`,
						style: {
							width: "100%",
							height: "auto"
						},
						children: [
							/* @__PURE__ */ jsx("rect", {
								x: "30",
								y: "60",
								width: "16",
								height: "70",
								fill: "#1c2a3f"
							}),
							/* @__PURE__ */ jsx("rect", {
								x: "46",
								y: "58",
								width: "180",
								height: "74",
								rx: "6",
								fill: "#0f1b30",
								stroke: "#33465f",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ jsx("rect", {
								x: "50",
								y: "62",
								width: airWidth,
								height: "66",
								fill: "#34d399",
								opacity: "0.14",
								style: { transition: "width .5s cubic-bezier(.3,.8,.3,1)" }
							}),
							/* @__PURE__ */ jsxs("g", {
								style: {
									transform: `translateX(${pistonOffset}px)`,
									transition: "transform .5s cubic-bezier(.3,.8,.3,1)"
								},
								children: [
									/* @__PURE__ */ jsx("rect", {
										x: "82",
										y: "60",
										width: "16",
										height: "70",
										rx: "3",
										fill: "#34d399"
									}),
									/* @__PURE__ */ jsx("rect", {
										x: "96",
										y: "86",
										width: rodLen,
										height: "18",
										rx: "3",
										fill: "#8fa3bc"
									}),
									/* @__PURE__ */ jsx("rect", {
										x: 214,
										y: "80",
										width: "12",
										height: "30",
										rx: "3",
										fill: "#5e7392"
									})
								]
							}),
							mode === "simple" && /* @__PURE__ */ jsx("path", {
								d: "M226 95 q8 -16 16 0 q8 16 16 0 q8 -16 16 0",
								fill: "none",
								stroke: "#5e7392",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ jsx("line", {
								x1: "20",
								y1: "80",
								x2: "46",
								y2: "80",
								stroke: "#34d399",
								strokeWidth: "3",
								className: extended ? "flow" : ""
							}),
							/* @__PURE__ */ jsx("text", {
								x: "10",
								y: "70",
								fill: "#34d399",
								fontSize: "10",
								fontFamily: "var(--font-mono)",
								children: "P·A"
							}),
							mode === "doble" && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("line", {
								x1: "20",
								y1: "110",
								x2: "46",
								y2: "110",
								stroke: extended ? "#5e7392" : "#34d399",
								strokeWidth: "3",
								className: extended ? "" : "flow"
							}), /* @__PURE__ */ jsx("text", {
								x: "2",
								y: "130",
								fill: extended ? "#5e7392" : "#34d399",
								fontSize: "10",
								fontFamily: "var(--font-mono)",
								children: "P·B"
							})] }),
							/* @__PURE__ */ jsx("text", {
								x: "240",
								y: "40",
								fill: "var(--ink-faint)",
								fontSize: "10",
								fontFamily: "var(--font-mono)",
								children: extended ? "AVANCE · F = P × A" : "RETROCESO · F = P × (A − a)"
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: { gap: 12 },
					children: [mode === "doble" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
						className: `btn ${extended ? "is-active" : ""}`,
						style: AX$1,
						"aria-pressed": extended,
						onClick: () => setExtended(true),
						children: "▸ EXTENDER (AVANCE)"
					}), /* @__PURE__ */ jsx("button", {
						className: `btn ${!extended ? "is-active" : ""}`,
						style: AX$1,
						"aria-pressed": !extended,
						onClick: () => setExtended(false),
						children: "◂ RETRAER (RETROCESO)"
					})] }) : /* @__PURE__ */ jsx("button", {
						className: `btn ${extended ? "is-active" : ""}`,
						style: AX$1,
						"aria-pressed": extended,
						onClick: () => setExtended((e) => !e),
						children: extended ? "⚡ SOLENOIDE ENERGIZADO" : "⚡ ENERGIZAR SOLENOIDE"
					}), /* @__PURE__ */ jsx("span", {
						className: "hint-chip",
						children: mode === "doble" ? "5/2 · MEMORIA NEUMÁTICA" : "3/2 · RETORNO POR RESORTE"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid-3",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "col",
							style: { gap: 4 },
							children: [/* @__PURE__ */ jsxs("span", {
								className: "mono-label",
								children: [
									"PRESIÓN · ",
									pressure.toFixed(1),
									" bar"
								]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: 3,
								max: 8,
								step: .5,
								value: pressure,
								onChange: (e) => setPressure(Number(e.target.value)),
								"aria-label": "Presión de aire en bar",
								style: {
									"--c": "var(--act-neum)",
									"--fill": `${(pressure - 3) / 5 * 100}%`
								}
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "col",
							style: { gap: 4 },
							children: [/* @__PURE__ */ jsxs("span", {
								className: "mono-label",
								children: [
									"DIÁMETRO PISTÓN · Ø",
									bore,
									" mm"
								]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: 16,
								max: 63,
								step: 1,
								value: bore,
								onChange: (e) => setBore(Number(e.target.value)),
								"aria-label": "Diámetro del pistón en milímetros",
								style: {
									"--c": "var(--act-neum)",
									"--fill": `${(bore - 16) / 47 * 100}%`
								}
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "col",
							style: { gap: 4 },
							children: [/* @__PURE__ */ jsxs("span", {
								className: "mono-label",
								children: [
									"CARRERA · ",
									stroke,
									" mm"
								]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: 25,
								max: 300,
								step: 5,
								value: stroke,
								onChange: (e) => setStroke(Number(e.target.value)),
								"aria-label": "Carrera del cilindro en milímetros",
								style: {
									"--c": "var(--act-neum)",
									"--fill": `${(stroke - 25) / 275 * 100}%`
								}
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: AX$1,
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "ÁREA PISTÓN"
							}), /* @__PURE__ */ jsxs("div", {
								className: "val",
								style: { fontSize: 20 },
								children: [
									areaPiston.toFixed(2),
									" ",
									/* @__PURE__ */ jsx("span", {
										style: { fontSize: ".6em" },
										children: "cm²"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: AX$1,
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "FUERZA AVANCE"
							}), /* @__PURE__ */ jsxs("div", {
								className: "val",
								style: { fontSize: 20 },
								children: [
									Math.round(forceAdvance),
									" ",
									/* @__PURE__ */ jsx("span", {
										style: { fontSize: ".6em" },
										children: "N"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: AX$1,
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "FUERZA RETROCESO"
							}), /* @__PURE__ */ jsxs("div", {
								className: "val",
								style: { fontSize: 20 },
								children: [
									mode === "doble" ? Math.round(forceRetract) : "—",
									" ",
									/* @__PURE__ */ jsx("span", {
										style: { fontSize: ".6em" },
										children: mode === "doble" ? "N" : ""
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: AX$1,
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "ESTADO"
							}), /* @__PURE__ */ jsx("div", {
								className: "val",
								style: { fontSize: 18 },
								children: extended ? "EXTENDIDO" : "RETRAÍDO"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					style: { marginTop: 0 },
					children: [
						/* @__PURE__ */ jsx("b", { children: "Simple efecto:" }),
						" un solo puerto y retorno por resorte (válvula 3/2). ",
						/* @__PURE__ */ jsx("b", { children: "Doble efecto:" }),
						" dos puertos y fuerza en ambos sentidos (válvula 5/2); el retroceso resta el área del vástago."
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/SolenoidLab.tsx
function SolenoidLab() {
	const [energized, setEnergized] = useState(false);
	const reduce = useReducedMotion();
	const plungerOffset = energized ? 42 : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: { "--c": "var(--act-neum)" },
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "LABORATORIO DE VÁLVULA SOLENOIDE · ACT-03" }), /* @__PURE__ */ jsx("span", {
				className: "live",
				children: energized ? "BOBINA ENERGIZADA" : "BOBINA DESENERGIZADA"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "sim-stage graticule",
					style: { padding: "12px 12px 0" },
					children: [/* @__PURE__ */ jsxs("div", {
						className: "stage-cap",
						children: [/* @__PURE__ */ jsx("span", { children: "BOBINA → CAMPO → ÉMBOLO → FLUJO" }), /* @__PURE__ */ jsx("span", { children: energized ? "PASO ABIERTO" : "PASO CERRADO" })]
					}), /* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 720 270",
						role: "img",
						"aria-label": `Válvula solenoide ${energized ? "activada: el émbolo abre el paso del fluido" : "desactivada: el émbolo cierra el paso del fluido"}`,
						style: {
							width: "100%",
							height: "auto"
						},
						children: [
							/* @__PURE__ */ jsx("text", {
								x: "104",
								y: "40",
								textAnchor: "middle",
								className: "mono",
								style: {
									fill: "var(--act-neum)",
									fontSize: 11
								},
								children: "BOBINA"
							}),
							/* @__PURE__ */ jsx("g", {
								className: energized ? "solenoid-coil is-on" : "solenoid-coil",
								children: [
									0,
									1,
									2,
									3,
									4
								].map((index) => /* @__PURE__ */ jsx("rect", {
									x: 55 + index * 20,
									y: "72",
									width: "13",
									height: "106",
									rx: "5"
								}, index))
							}),
							/* @__PURE__ */ jsx("text", {
								x: "360",
								y: "40",
								textAnchor: "middle",
								className: "mono",
								style: {
									fill: "var(--trace)",
									fontSize: 11
								},
								children: "CAMPO MAGNÉTICO"
							}),
							energized && /* @__PURE__ */ jsxs("g", {
								className: reduce ? "solenoid-field" : "solenoid-field is-on",
								fill: "none",
								stroke: "var(--trace)",
								strokeWidth: "2",
								children: [
									/* @__PURE__ */ jsx("path", { d: "M175 82 C240 45 300 45 354 82" }),
									/* @__PURE__ */ jsx("path", { d: "M175 168 C240 205 300 205 354 168" }),
									/* @__PURE__ */ jsx("path", { d: "M188 96 C240 72 290 72 340 96" }),
									/* @__PURE__ */ jsx("path", { d: "M188 154 C240 178 290 178 340 154" })
								]
							}),
							/* @__PURE__ */ jsx("text", {
								x: "458",
								y: "40",
								textAnchor: "middle",
								className: "mono",
								style: {
									fill: "var(--ink-faint)",
									fontSize: 11
								},
								children: "ÉMBOLO / NÚCLEO"
							}),
							/* @__PURE__ */ jsx("rect", {
								x: "320",
								y: "98",
								width: "170",
								height: "54",
								rx: "7",
								fill: "#0f1b30",
								stroke: "var(--line)",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ jsxs("g", {
								style: {
									transform: `translateX(${plungerOffset}px)`,
									transition: reduce ? "none" : "transform .45s cubic-bezier(.3,.8,.3,1)"
								},
								children: [/* @__PURE__ */ jsx("rect", {
									x: "335",
									y: "107",
									width: "84",
									height: "36",
									rx: "5",
									fill: energized ? "var(--act-neum)" : "#5e7392",
									opacity: "0.9"
								}), /* @__PURE__ */ jsx("text", {
									x: "377",
									y: "130",
									textAnchor: "middle",
									className: "mono",
									style: {
										fill: "#07101d",
										fontSize: 10
									},
									children: energized ? "ATRAÍDO" : "RETENIDO"
								})]
							}),
							/* @__PURE__ */ jsx("text", {
								x: "608",
								y: "40",
								textAnchor: "middle",
								className: "mono",
								style: {
									fill: energized ? "var(--ok)" : "var(--ink-faint)",
									fontSize: 11
								},
								children: "PASO DEL FLUIDO"
							}),
							/* @__PURE__ */ jsx("path", {
								d: "M515 125 H680",
								stroke: energized ? "var(--ok)" : "#33465f",
								strokeWidth: "10",
								strokeLinecap: "round",
								strokeDasharray: energized ? "16 12" : "0",
								className: energized && !reduce ? "solenoid-flow" : ""
							}),
							/* @__PURE__ */ jsx("path", {
								d: "M514 112 V138",
								stroke: "#33465f",
								strokeWidth: "3"
							}),
							/* @__PURE__ */ jsx("text", {
								x: "590",
								y: "165",
								textAnchor: "middle",
								className: "mono",
								style: {
									fill: energized ? "var(--ok)" : "var(--ink-faint)",
									fontSize: 11
								},
								children: energized ? "FLUJO ABIERTO" : "FLUJO BLOQUEADO"
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: {
						gap: 10,
						flexWrap: "wrap"
					},
					children: [
						/* @__PURE__ */ jsx("button", {
							className: `btn ${energized ? "is-active" : ""}`,
							style: { "--c": "var(--act-neum)" },
							"aria-pressed": energized,
							onClick: () => setEnergized(true),
							children: "⚡ ENERGIZAR BOBINA"
						}),
						/* @__PURE__ */ jsx("button", {
							className: `btn ${!energized ? "is-active" : ""}`,
							style: { "--c": "var(--act-neum)" },
							"aria-pressed": !energized,
							onClick: () => setEnergized(false),
							children: "◌ DESENERGIZAR"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "hint-chip",
							children: "24 V DC · VÁLVULA 3/2"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: { "--c": "var(--act-neum)" },
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "BOBINA"
							}), /* @__PURE__ */ jsx("div", {
								className: "val",
								style: { fontSize: 18 },
								children: energized ? "ACTIVA" : "INACTIVA"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: { "--c": "var(--trace)" },
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "ÉMBOLO"
							}), /* @__PURE__ */ jsx("div", {
								className: "val",
								style: { fontSize: 18 },
								children: energized ? "ATRAÍDO" : "RETENIDO"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: { "--c": "var(--ok)" },
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "FLUIDO"
							}), /* @__PURE__ */ jsx("div", {
								className: "val",
								style: { fontSize: 18 },
								children: energized ? "PASANDO" : "BLOQUEADO"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					"aria-live": "polite",
					style: { marginTop: 0 },
					children: [
						/* @__PURE__ */ jsx("b", { children: energized ? "Bobina energizada." : "Bobina desenergizada." }),
						" ",
						energized ? "El campo magnético atrae el émbolo y conecta el paso del fluido." : "El émbolo permanece en reposo y bloquea el paso del fluido."
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/HydraulicLab.tsx
/** ACT-04 · Circuito hidráulico: motobomba, presión y cilindro. F = P × A. */
var AX = { "--c": "var(--act-hidr)" };
var STROKE_METERS = .4;
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
function HydraulicLab() {
	const [pumpOn, setPumpOn] = useState(true);
	const [direction, setDirection] = useState(1);
	const [pressure, setPressure] = useState(120);
	const [bore, setBore] = useState(80);
	const [flow, setFlow] = useState(20);
	const [pos, setPos] = useState(0);
	const reduce = useReducedMotion();
	const areaPiston = pistonAreaCm2(bore);
	const areaRod = rodAreaCm2(bore);
	const forceAdvance = actuatorForceN(pressure, areaPiston);
	const forceRetract = actuatorForceN(pressure, areaPiston - areaRod);
	const force = pumpOn ? direction === 1 ? forceAdvance : forceRetract : 0;
	const velocity = hydraulicVelocityMps(flow, direction === 1 ? areaPiston : areaPiston - areaRod);
	const activeVelocity = pumpOn ? velocity : 0;
	const power = pumpOn ? hydraulicPowerKw(pressure, flow) : 0;
	const pumpDuration = Math.max(.35, Math.min(1.2, 12 / Math.max(flow, 1)));
	const needleAngle = -135 + (pressure - 20) / 230 * 270;
	const pistonX = 286 + pos * 104;
	const positionRef = useRef(pos);
	useEffect(() => {
		positionRef.current = pos;
	}, [pos]);
	useEffect(() => {
		if (!pumpOn || reduce) return;
		let frame = 0;
		let previous = performance.now();
		const advance = (now) => {
			const deltaTime = Math.min((now - previous) / 1e3, .1);
			previous = now;
			const delta = velocity / STROKE_METERS * deltaTime * direction;
			const next = clamp(positionRef.current + delta, 0, 1);
			positionRef.current = next;
			setPos(next);
			if (direction === 1 ? next < 1 : next > 0) frame = window.requestAnimationFrame(advance);
		};
		frame = window.requestAnimationFrame(advance);
		return () => window.cancelAnimationFrame(frame);
	}, [
		pumpOn,
		direction,
		velocity,
		reduce
	]);
	const changeDirection = (nextDirection) => {
		setDirection(nextDirection);
		if (reduce && pumpOn) {
			const next = clamp(positionRef.current + nextDirection * .1, 0, 1);
			positionRef.current = next;
			setPos(next);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "BANCO HIDRÁULICO · MOTOBOMPA + CILINDRO" }), /* @__PURE__ */ jsx("span", {
				className: "live",
				children: pumpOn ? "BOMBA EN MARCHA" : "BOMBA DETENIDA"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 18 },
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "sim-stage graticule",
					style: { padding: "12px 12px 0" },
					children: [/* @__PURE__ */ jsxs("div", {
						className: "stage-cap",
						children: [/* @__PURE__ */ jsx("span", { children: "CIRCUITO · DEPÓSITO → BOMBA → VÁLVULA → CILINDRO" }), /* @__PURE__ */ jsxs("span", { children: [
							pressure,
							" bar · ",
							flow,
							" L/min"
						] })]
					}), /* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 560 200",
						role: "img",
						"aria-label": "Circuito hidráulico con motobomba y cilindro",
						style: {
							width: "100%",
							height: "auto"
						},
						children: [
							/* @__PURE__ */ jsx("rect", {
								x: "24",
								y: "120",
								width: "96",
								height: "56",
								rx: "4",
								fill: "#0f1b30",
								stroke: "#33465f",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ jsx("path", {
								d: "M30 150 q12 -8 24 0 q12 8 24 0 q12 -8 24 0",
								fill: "none",
								stroke: "#4cc9f0",
								strokeWidth: "2",
								opacity: "0.6"
							}),
							/* @__PURE__ */ jsx("text", {
								x: "72",
								y: "192",
								fill: "var(--ink-faint)",
								fontSize: "10",
								fontFamily: "var(--font-mono)",
								textAnchor: "middle",
								children: "DEPÓSITO"
							}),
							/* @__PURE__ */ jsxs("g", {
								transform: "translate(72,66)",
								children: [/* @__PURE__ */ jsx("circle", {
									r: "22",
									fill: "#0f1b30",
									stroke: "#4cc9f0",
									strokeWidth: "2"
								}), /* @__PURE__ */ jsx("g", {
									className: pumpOn && !reduce ? "spin" : "",
									style: { "--rot": `${pumpDuration}s` },
									children: /* @__PURE__ */ jsx("path", {
										d: "M0 -14 L12 0 L0 14 L-12 0 Z",
										fill: "#4cc9f0",
										opacity: "0.8"
									})
								})]
							}),
							/* @__PURE__ */ jsx("text", {
								x: "72",
								y: "26",
								fill: "#4cc9f0",
								fontSize: "10",
								fontFamily: "var(--font-mono)",
								textAnchor: "middle",
								children: "MOTOR"
							}),
							/* @__PURE__ */ jsx("text", {
								x: "72",
								y: "104",
								fill: "var(--ink-faint)",
								fontSize: "9",
								fontFamily: "var(--font-mono)",
								textAnchor: "middle",
								children: "BOMBA"
							}),
							/* @__PURE__ */ jsx("path", {
								d: "M72 120 L72 88",
								stroke: "#4cc9f0",
								strokeWidth: "3",
								className: pumpOn ? "flow" : ""
							}),
							/* @__PURE__ */ jsx("path", {
								d: "M94 66 L150 66 L150 100 L210 100",
								fill: "none",
								stroke: "#4cc9f0",
								strokeWidth: "3",
								className: pumpOn ? "flow" : ""
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "180",
								cy: "100",
								r: "14",
								fill: "#04070d",
								stroke: "#4cc9f0",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ jsx("g", {
								className: "needle",
								style: {
									transform: `rotate(${needleAngle}deg)`,
									transformOrigin: "180px 100px",
									transformBox: "view-box"
								},
								children: /* @__PURE__ */ jsx("line", {
									x1: "180",
									y1: "100",
									x2: "180",
									y2: "91",
									stroke: "#fb923c",
									strokeWidth: "2"
								})
							}),
							/* @__PURE__ */ jsxs("text", {
								x: "180",
								y: "130",
								fill: "var(--ink-faint)",
								fontSize: "9",
								fontFamily: "var(--font-mono)",
								textAnchor: "middle",
								children: [pressure, " bar"]
							}),
							/* @__PURE__ */ jsx("rect", {
								x: "210",
								y: "84",
								width: "34",
								height: "32",
								rx: "3",
								fill: "#0f1b30",
								stroke: "#4cc9f0",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ jsx("path", {
								d: direction === 1 ? "M214 100 H236 M230 94 L236 100 L230 106" : "M240 100 H218 M224 94 L218 100 L224 106",
								stroke: "#4cc9f0",
								strokeWidth: "2",
								fill: "none"
							}),
							/* @__PURE__ */ jsx("text", {
								x: "227",
								y: "78",
								fill: "var(--ink-faint)",
								fontSize: "9",
								fontFamily: "var(--font-mono)",
								textAnchor: "middle",
								children: "4/3"
							}),
							/* @__PURE__ */ jsx("rect", {
								x: "270",
								y: "76",
								width: "170",
								height: "48",
								rx: "6",
								fill: "#0f1b30",
								stroke: "#33465f",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ jsx("rect", {
								x: "274",
								y: "80",
								width: Math.max(0, pistonX - 274),
								height: "40",
								fill: "#4cc9f0",
								opacity: "0.16"
							}),
							/* @__PURE__ */ jsxs("g", {
								style: { transform: `translateX(${pistonX - 286}px)` },
								children: [/* @__PURE__ */ jsx("rect", {
									x: "286",
									y: "78",
									width: "14",
									height: "44",
									rx: "3",
									fill: "#4cc9f0"
								}), /* @__PURE__ */ jsx("rect", {
									x: "300",
									y: "92",
									width: "120",
									height: "16",
									rx: "3",
									fill: "#8fa3bc"
								})]
							}),
							/* @__PURE__ */ jsx("path", {
								d: "M244 100 L270 100",
								stroke: "#4cc9f0",
								strokeWidth: "3",
								className: pumpOn ? `flow ${direction === -1 ? "flow-reverse" : ""}` : ""
							}),
							/* @__PURE__ */ jsxs("text", {
								x: "355",
								y: "150",
								fill: "var(--ink-faint)",
								fontSize: "10",
								fontFamily: "var(--font-mono)",
								textAnchor: "middle",
								children: [
									"CILINDRO Ø",
									bore,
									" mm · CARRERA 400 mm"
								]
							}),
							/* @__PURE__ */ jsx("path", {
								d: "M440 124 L440 170 L72 170",
								fill: "none",
								stroke: "#4cc9f0",
								strokeWidth: "2",
								opacity: "0.45"
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: { gap: 12 },
					children: [
						/* @__PURE__ */ jsx("button", {
							className: `btn ${pumpOn ? "is-active" : ""}`,
							style: AX,
							"aria-pressed": pumpOn,
							onClick: () => setPumpOn((p) => !p),
							children: pumpOn ? "⏻ BOMBA ON" : "⏻ BOMBA OFF"
						}),
						/* @__PURE__ */ jsx("button", {
							className: `btn ${direction === 1 ? "is-active" : ""}`,
							style: AX,
							"aria-pressed": direction === 1,
							onClick: () => changeDirection(1),
							children: "▸ AVANZAR"
						}),
						/* @__PURE__ */ jsx("button", {
							className: `btn ${direction === -1 ? "is-active" : ""}`,
							style: AX,
							"aria-pressed": direction === -1,
							onClick: () => changeDirection(-1),
							children: "◂ RETROCEDER"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "hint-chip",
							children: [
								"POSICIÓN ",
								Math.round(pos * 100),
								" %"
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid-3",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "col",
							style: { gap: 4 },
							children: [/* @__PURE__ */ jsxs("span", {
								className: "mono-label",
								children: [
									"PRESIÓN · ",
									pressure,
									" bar"
								]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: 20,
								max: 250,
								step: 5,
								value: pressure,
								onChange: (e) => setPressure(Number(e.target.value)),
								"aria-label": "Presión hidráulica en bar",
								style: {
									"--c": "var(--act-hidr)",
									"--fill": `${(pressure - 20) / 230 * 100}%`
								}
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "col",
							style: { gap: 4 },
							children: [/* @__PURE__ */ jsxs("span", {
								className: "mono-label",
								children: [
									"DIÁMETRO · Ø",
									bore,
									" mm"
								]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: 40,
								max: 160,
								step: 5,
								value: bore,
								onChange: (e) => setBore(Number(e.target.value)),
								"aria-label": "Diámetro del pistón hidráulico",
								style: {
									"--c": "var(--act-hidr)",
									"--fill": `${(bore - 40) / 120 * 100}%`
								}
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "col",
							style: { gap: 4 },
							children: [/* @__PURE__ */ jsxs("span", {
								className: "mono-label",
								children: [
									"CAUDAL · ",
									flow,
									" L/min"
								]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: 5,
								max: 60,
								step: 1,
								value: flow,
								onChange: (e) => setFlow(Number(e.target.value)),
								"aria-label": "Caudal de la bomba en litros por minuto",
								style: {
									"--c": "var(--act-hidr)",
									"--fill": `${(flow - 5) / 55 * 100}%`
								}
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: AX,
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "ÁREA PISTÓN"
							}), /* @__PURE__ */ jsxs("div", {
								className: "val",
								style: { fontSize: 19 },
								children: [
									areaPiston.toFixed(1),
									" ",
									/* @__PURE__ */ jsx("span", {
										style: { fontSize: ".6em" },
										children: "cm²"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: AX,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "lbl",
								children: ["FUERZA ", direction === 1 ? "AVANCE" : "RETROCESO"]
							}), /* @__PURE__ */ jsxs("div", {
								className: "val",
								style: { fontSize: 19 },
								children: [
									Math.round(force / 1e3),
									" ",
									/* @__PURE__ */ jsx("span", {
										style: { fontSize: ".6em" },
										children: "kN"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: AX,
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "VELOCIDAD v = Q / A"
							}), /* @__PURE__ */ jsxs("div", {
								className: "val",
								style: { fontSize: 19 },
								children: [
									activeVelocity.toFixed(2),
									" ",
									/* @__PURE__ */ jsx("span", {
										style: { fontSize: ".6em" },
										children: "m/s"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: AX,
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "POTENCIA HIDRÁULICA"
							}), /* @__PURE__ */ jsxs("div", {
								className: "val",
								style: { fontSize: 19 },
								children: [
									power.toFixed(1),
									" ",
									/* @__PURE__ */ jsx("span", {
										style: { fontSize: ".6em" },
										children: "kW"
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					style: { marginTop: 0 },
					children: [
						/* @__PURE__ */ jsx("b", { children: "Ley de Pascal:" }),
						" la presión se transmite íntegra en el aceite. En avance entrega ",
						Math.round(forceAdvance / 9.81),
						" kgf y en retroceso ",
						Math.round(forceRetract / 9.81),
						" kgf; el caudal y el diámetro fijan la velocidad de la carrera."
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/SignalingLab.tsx
var PILOT_COLORS = [
	{
		id: "verde",
		name: "VERDE",
		hex: "#3ddc84",
		meaning: "Marcha · funcionamiento normal"
	},
	{
		id: "rojo",
		name: "ROJO",
		hex: "#ff5a3c",
		meaning: "Paro · fallo o emergencia"
	},
	{
		id: "ambar",
		name: "ÁMBAR",
		hex: "#ffb020",
		meaning: "Advertencia · precaución"
	},
	{
		id: "azul",
		name: "AZUL",
		hex: "#4cc9f0",
		meaning: "Información · mando obligatorio"
	}
];
function wavePath(cycles, W, H) {
	const pts = [];
	for (let i = 0; i <= 120; i++) {
		const t = i / 120;
		const y = H / 2 - Math.sin(t * Math.PI * 2 * cycles) * (H * .34);
		pts.push(`${i === 0 ? "M" : "L"}${(t * W).toFixed(1)},${y.toFixed(1)}`);
	}
	return pts.join("");
}
function SignalingLab() {
	const [lampOn, setLampOn] = useState(true);
	const [color, setColor] = useState(PILOT_COLORS[0]);
	const [buzzOn, setBuzzOn] = useState(false);
	const [freq, setFreq] = useState(2400);
	const [intermittent, setIntermittent] = useState(false);
	const db = Math.round(60 + freq / 4e3 * 25);
	const cycles = Math.max(2, Math.round(freq / 1e3 * 3));
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: { "--c": "var(--act-senal)" },
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "BANCO DE SEÑALIZACIÓN · PILOTO + ZUMBADOR" }), /* @__PURE__ */ jsx("span", {
				className: "live",
				children: "24 V DC"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "col",
					style: { gap: 14 },
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "mono-label",
							children: "PILOTO · LÁMPARA INDICADORA"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "sim-stage graticule",
							style: { padding: "12px 12px 0" },
							children: [/* @__PURE__ */ jsxs("div", {
								className: "stage-cap",
								children: [/* @__PURE__ */ jsx("span", { children: "INDICADOR DE ESTADO" }), /* @__PURE__ */ jsx("span", { children: lampOn ? "ENCENDIDO" : "APAGADO" })]
							}), /* @__PURE__ */ jsxs("svg", {
								viewBox: "0 0 260 170",
								role: "img",
								"aria-label": `Piloto ${color.name} ${lampOn ? "encendido" : "apagado"}`,
								style: {
									width: "100%",
									height: "auto"
								},
								children: [
									/* @__PURE__ */ jsx("rect", {
										x: "80",
										y: "120",
										width: "100",
										height: "30",
										rx: "4",
										fill: "#0f1b30",
										stroke: "#33465f",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ jsx("rect", {
										x: "112",
										y: "96",
										width: "36",
										height: "28",
										fill: "#1c2a3f"
									}),
									/* @__PURE__ */ jsx("circle", {
										cx: "130",
										cy: "66",
										r: "34",
										fill: lampOn ? color.hex : "#16233a",
										stroke: color.hex,
										strokeWidth: "2",
										opacity: lampOn ? .95 : .5,
										style: lampOn ? { filter: `drop-shadow(0 0 16px ${color.hex})` } : void 0
									}),
									/* @__PURE__ */ jsx("circle", {
										cx: "118",
										cy: "54",
										r: "9",
										fill: "#ffffff",
										opacity: lampOn ? .35 : .08
									}),
									lampOn && /* @__PURE__ */ jsxs("g", {
										className: `wave-rings${intermittent ? " buzz-intermittent" : ""}`,
										stroke: color.hex,
										fill: "none",
										strokeWidth: "2",
										children: [/* @__PURE__ */ jsx("circle", {
											cx: "130",
											cy: "66",
											r: "34"
										}), /* @__PURE__ */ jsx("circle", {
											cx: "130",
											cy: "66",
											r: "34",
											style: { animationDelay: ".5s" }
										})]
									}),
									/* @__PURE__ */ jsx("text", {
										x: "130",
										y: "162",
										fill: "var(--ink-faint)",
										fontSize: "10",
										fontFamily: "var(--font-mono)",
										textAnchor: "middle",
										children: lampOn ? "LED · 24 V DC · 2 W" : "SIN TENSIÓN"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "row",
							style: { gap: 8 },
							children: /* @__PURE__ */ jsx("button", {
								className: `btn ${lampOn ? "is-active" : ""}`,
								style: { "--c": color.hex },
								"aria-pressed": lampOn,
								onClick: () => setLampOn((v) => !v),
								children: lampOn ? "⏻ APAGAR PILOTO" : "⏻ ENCENDER PILOTO"
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "seg",
							role: "group",
							"aria-label": "Color del piloto",
							children: PILOT_COLORS.map((c) => /* @__PURE__ */ jsxs("button", {
								className: `btn ${color.id === c.id ? "is-active" : ""}`,
								style: { "--c": c.hex },
								"aria-pressed": color.id === c.id,
								onClick: () => setColor(c),
								children: [/* @__PURE__ */ jsx("span", {
									className: "dot-sm",
									style: { background: c.hex }
								}), c.name]
							}, c.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: { "--c": color.hex },
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "SIGNIFICADO DEL COLOR"
							}), /* @__PURE__ */ jsx("div", {
								className: "val",
								style: { fontSize: 16 },
								children: color.meaning
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "col",
					style: { gap: 14 },
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "mono-label",
							children: "ZUMBADOR · AVISO SONORO"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "sim-stage graticule",
							style: { padding: "12px 12px 0" },
							children: [/* @__PURE__ */ jsxs("div", {
								className: "stage-cap",
								children: [/* @__PURE__ */ jsx("span", { children: "OSCILADOR PIEZOELÉCTRICO" }), /* @__PURE__ */ jsx("span", { children: buzzOn ? "SONANDO" : "EN SILENCIO" })]
							}), /* @__PURE__ */ jsxs("svg", {
								viewBox: "0 0 260 170",
								role: "img",
								"aria-label": `Zumbador ${buzzOn ? `sonando a ${freq} hercios` : "apagado"}`,
								style: {
									width: "100%",
									height: "auto"
								},
								children: [
									/* @__PURE__ */ jsx("rect", {
										x: "86",
										y: "52",
										width: "60",
										height: "60",
										rx: "6",
										fill: "#0f1b30",
										stroke: "#fb923c",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ jsx("circle", {
										cx: "116",
										cy: "82",
										r: "9",
										fill: "#fb923c",
										opacity: buzzOn ? 1 : .3
									}),
									buzzOn && /* @__PURE__ */ jsxs("g", {
										className: "wave-rings",
										stroke: "#fb923c",
										fill: "none",
										strokeWidth: "2",
										children: [
											/* @__PURE__ */ jsx("circle", {
												cx: "116",
												cy: "82",
												r: "20"
											}),
											/* @__PURE__ */ jsx("circle", {
												cx: "116",
												cy: "82",
												r: "20",
												style: { animationDelay: ".35s" }
											}),
											/* @__PURE__ */ jsx("circle", {
												cx: "116",
												cy: "82",
												r: "20",
												style: { animationDelay: ".7s" }
											})
										]
									}),
									/* @__PURE__ */ jsx("path", {
										d: wavePath(cycles, 220, 40),
										transform: "translate(20,118)",
										fill: "none",
										stroke: "#fb923c",
										strokeWidth: "2",
										opacity: buzzOn ? .95 : .25,
										className: buzzOn && intermittent ? "buzz-intermittent" : void 0
									}),
									/* @__PURE__ */ jsx("text", {
										x: "130",
										y: "164",
										fill: "var(--ink-faint)",
										fontSize: "10",
										fontFamily: "var(--font-mono)",
										textAnchor: "middle",
										children: buzzOn ? `${freq} Hz · ${intermittent ? "INTERMITENTE" : "CONTINUO"}` : "SIN SEÑAL"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "row",
							style: { gap: 8 },
							children: [/* @__PURE__ */ jsx("button", {
								className: `btn ${buzzOn ? "is-active" : ""}`,
								style: { "--c": "var(--act-senal)" },
								"aria-pressed": buzzOn,
								onClick: () => setBuzzOn((v) => !v),
								children: buzzOn ? "⏹ SILENCIAR" : "▶ ACTIVAR ZUMBADOR"
							}), /* @__PURE__ */ jsx("button", {
								className: `btn ${intermittent ? "is-active" : ""}`,
								style: { "--c": "var(--act-senal)" },
								"aria-pressed": intermittent,
								onClick: () => setIntermittent((v) => !v),
								children: intermittent ? "≈ INTERMITENTE" : "— CONTINUO"
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "col",
							style: { gap: 4 },
							children: [/* @__PURE__ */ jsxs("span", {
								className: "mono-label",
								children: [
									"FRECUENCIA · ",
									freq,
									" Hz"
								]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: 500,
								max: 4e3,
								step: 100,
								value: freq,
								onChange: (e) => setFreq(Number(e.target.value)),
								"aria-label": "Frecuencia del zumbador en hercios",
								style: {
									"--c": "var(--act-senal)",
									"--fill": `${(freq - 500) / 3500 * 100}%`
								}
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "readout",
								style: { "--c": "var(--act-senal)" },
								children: [/* @__PURE__ */ jsx("div", {
									className: "lbl",
									children: "NIVEL SONORO"
								}), /* @__PURE__ */ jsxs("div", {
									className: "val",
									style: { fontSize: 19 },
									children: [
										buzzOn ? db : 0,
										" ",
										/* @__PURE__ */ jsx("span", {
											style: { fontSize: ".6em" },
											children: "dB"
										})
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "readout",
								style: { "--c": "var(--act-senal)" },
								children: [/* @__PURE__ */ jsx("div", {
									className: "lbl",
									children: "PATRÓN"
								}), /* @__PURE__ */ jsx("div", {
									className: "val",
									style: { fontSize: 17 },
									children: buzzOn ? intermittent ? "INTERMITENTE" : "CONTINUO" : "APAGADO"
								})]
							})]
						})
					]
				})]
			}), /* @__PURE__ */ jsxs("p", {
				className: "sim-note",
				children: [
					"El ",
					/* @__PURE__ */ jsx("b", { children: "piloto" }),
					" comunica visualmente (color = significado) y el ",
					/* @__PURE__ */ jsx("b", { children: "zumbador" }),
					" avisa aunque nadie mire el tablero. Por accesibilidad, el color del piloto debe acompañarse de texto o forma, y el zumbador se reserva para alarmas realmente importantes."
				]
			})]
		})]
	});
}
//#endregion
//#region src/components/sims/ActuatorCompare.tsx
var PROFILES = [
	{
		id: "electrico",
		name: "ELÉCTRICO",
		icon: "⚡",
		color: "var(--act-elec)",
		energy: "Red eléctrica / batería",
		summary: "Motores y solenoides que convierten energía eléctrica en movimiento o conmutación. Precisos, limpios y fáciles de controlar con electrónica de potencia.",
		pros: [
			"Control fino con PWM o variador",
			"Fácil de integrar en PLC",
			"Sin fluidos ni fugas",
			"Alta eficiencia"
		],
		cons: [
			"Relación fuerza/tamaño baja",
			"Riesgo eléctrico",
			"Puede sobrecalentarse"
		],
		apps: [
			"Cintas transportadoras",
			"Robótica",
			"Bombas y ventiladores",
			"Puertas automáticas"
		],
		scores: {
			power: 3,
			controllability: 5,
			size: 3,
			precision: 5,
			speed: 4,
			maintenance: 4,
			cost: 4
		}
	},
	{
		id: "neumatico",
		name: "NEUMÁTICO",
		icon: "☁",
		color: "var(--act-neum)",
		energy: "Aire comprimido (4–8 bar)",
		summary: "Cilindros y válvulas movidos por aire comprimido. Muy rápidos y limpios, ideales para movimientos simples de avance/retroceso en automatización.",
		pros: [
			"Rápido y repetitivo",
			"Barato y seguro",
			"Sin chispas (atmósferas inflamables)",
			"Componentes sencillos"
		],
		cons: [
			"Aire compresible: poca precisión de posición",
			"Fuerza moderada",
			"Ruido y consumo del compresor"
		],
		apps: [
			"Embalaje",
			"Sujeción de piezas",
			"Prensas ligeras",
			"Automatización de puertas"
		],
		scores: {
			power: 3,
			controllability: 3,
			size: 4,
			precision: 2,
			speed: 5,
			maintenance: 3,
			cost: 5
		}
	},
	{
		id: "hidraulico",
		name: "HIDRÁULICO",
		icon: "⬤",
		color: "var(--act-hidr)",
		energy: "Aceite a presión (70–350 bar)",
		summary: "Cilindros y motores movidos por aceite a alta presión. La mayor fuerza por tamaño y un control suave incluso a velocidades muy bajas.",
		pros: [
			"Fuerza enorme en poco espacio",
			"Movimiento suave y preciso",
			"Autolubricado y duradero",
			"Control de cargas pesadas"
		],
		cons: [
			"Instalación cara y voluminosa",
			"Fugas sucias y riesgo de incendio",
			"Requiere filtración y mantenimiento"
		],
		apps: [
			"Excavadoras y maquinaria pesada",
			"Prensas industriales",
			"Inyección de plástico",
			"Elevadores"
		],
		scores: {
			power: 5,
			controllability: 4,
			size: 2,
			precision: 4,
			speed: 3,
			maintenance: 2,
			cost: 2
		}
	}
];
var ROWS = [
	{
		metric: "Potencia",
		values: {
			electrico: "Baja–media",
			neumatico: "Media",
			hidraulico: "Muy alta"
		}
	},
	{
		metric: "Controlabilidad",
		values: {
			electrico: "PWM, VFD o encoder",
			neumatico: "Válvulas 3/2 y 5/2",
			hidraulico: "Válvulas proporcionales"
		}
	},
	{
		metric: "Peso y volumen",
		values: {
			electrico: "Compacto",
			neumatico: "Ligero",
			hidraulico: "Grupo voluminoso"
		}
	},
	{
		metric: "Precisión",
		values: {
			electrico: "Alta con encoder",
			neumatico: "Baja a media carrera",
			hidraulico: "Media–alta"
		}
	},
	{
		metric: "Velocidad",
		values: {
			electrico: "Alta y regulable",
			neumatico: "Muy alta",
			hidraulico: "Media"
		}
	},
	{
		metric: "Mantenimiento",
		values: {
			electrico: "Escobillas / rodamientos",
			neumatico: "Filtros y lubricación",
			hidraulico: "Aceite, filtros y fugas"
		}
	},
	{
		metric: "Costo",
		values: {
			electrico: "Bajo–medio",
			neumatico: "Medio",
			hidraulico: "Alto"
		}
	}
];
function ActuatorCompare() {
	const [kind, setKind] = useState("neumatico");
	const active = PROFILES.find((p) => p.id === kind);
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: { "--c": active.color },
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "COMPARADOR · ELÉCTRICO / NEUMÁTICO / HIDRÁULICO" }), /* @__PURE__ */ jsx("span", { children: "ACT-02 · ACT-03 · ACT-04" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 18 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "seg",
					role: "group",
					"aria-label": "Familia de actuador",
					children: PROFILES.map((p) => /* @__PURE__ */ jsxs("button", {
						className: `btn ${kind === p.id ? "is-active" : ""}`,
						style: { "--c": p.color },
						"aria-pressed": kind === p.id,
						onClick: () => setKind(p.id),
						children: [
							p.icon,
							" ",
							p.name
						]
					}, p.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid-2",
					style: { alignItems: "start" },
					children: [/* @__PURE__ */ jsxs("div", {
						className: "col",
						style: { gap: 12 },
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "row",
								style: { gap: 10 },
								children: [/* @__PURE__ */ jsx("span", {
									style: {
										fontFamily: "var(--font-display)",
										fontSize: 30,
										color: active.color
									},
									children: active.icon
								}), /* @__PURE__ */ jsxs("div", {
									className: "col",
									style: { gap: 0 },
									children: [/* @__PURE__ */ jsx("strong", {
										style: {
											fontFamily: "var(--font-display)",
											letterSpacing: ".05em"
										},
										children: active.name
									}), /* @__PURE__ */ jsx("span", {
										className: "mono",
										style: {
											fontSize: 11,
											color: "var(--ink-faint)"
										},
										children: active.energy
									})]
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-dim",
								style: {
									fontSize: 14,
									maxWidth: "none"
								},
								children: active.summary
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid-2",
								style: { gap: 12 },
								children: [/* @__PURE__ */ jsxs("div", {
									className: "col",
									style: { gap: 6 },
									children: [/* @__PURE__ */ jsx("span", {
										className: "mono-label",
										style: { color: "var(--ok)" },
										children: "VENTAJAS"
									}), /* @__PURE__ */ jsx("ul", {
										style: {
											margin: 0,
											paddingLeft: 16,
											fontSize: 12.5,
											color: "var(--ink-dim)",
											lineHeight: 1.7
										},
										children: active.pros.map((x) => /* @__PURE__ */ jsx("li", { children: x }, x))
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "col",
									style: { gap: 6 },
									children: [/* @__PURE__ */ jsx("span", {
										className: "mono-label",
										style: { color: "var(--warn)" },
										children: "LIMITACIONES"
									}), /* @__PURE__ */ jsx("ul", {
										style: {
											margin: 0,
											paddingLeft: 16,
											fontSize: 12.5,
											color: "var(--ink-dim)",
											lineHeight: 1.7
										},
										children: active.cons.map((x) => /* @__PURE__ */ jsx("li", { children: x }, x))
									})]
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "col",
						style: { gap: 12 },
						children: [SELECTION_CRITERIA.map((criterion) => /* @__PURE__ */ jsxs("div", {
							className: "col",
							style: { gap: 4 },
							children: [/* @__PURE__ */ jsxs("div", {
								className: "row",
								style: { justifyContent: "space-between" },
								children: [/* @__PURE__ */ jsx("span", {
									className: "mono-label",
									children: criterion.title
								}), /* @__PURE__ */ jsxs("span", {
									className: "mono",
									style: {
										fontSize: 10,
										color: "var(--ink-faint)"
									},
									children: [active.scores[criterion.id], "/5"]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "meter",
								style: { "--c": active.color },
								children: /* @__PURE__ */ jsx("span", { style: { width: `${active.scores[criterion.id] / 5 * 100}%` } })
							})]
						}, criterion.id)), /* @__PURE__ */ jsxs("div", {
							className: "readout",
							style: { "--c": active.color },
							children: [/* @__PURE__ */ jsx("div", {
								className: "lbl",
								children: "APLICACIONES TÍPICAS"
							}), /* @__PURE__ */ jsx("div", {
								className: "val",
								style: {
									fontSize: 14,
									lineHeight: 1.5
								},
								children: active.apps.join(" · ")
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					style: { overflowX: "auto" },
					children: /* @__PURE__ */ jsxs("table", {
						className: "tbl",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsx("th", { children: "Criterio" }), PROFILES.map((p) => /* @__PURE__ */ jsx("th", {
							style: { color: kind === p.id ? p.color : void 0 },
							children: p.name
						}, p.id))] }) }), /* @__PURE__ */ jsx("tbody", { children: ROWS.map((r) => /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("strong", { children: r.metric }) }), PROFILES.map((p) => /* @__PURE__ */ jsx("td", {
							style: kind === p.id ? { color: "var(--ink)" } : void 0,
							children: r.values[p.id]
						}, p.id))] }, r.metric)) })]
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/pages/tema-2.astro
var tema_2_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Tema2,
	file: () => $$file,
	url: () => $$url
});
var $$Tema2 = createComponent(($$result, $$props, $$slots) => {
	const lazo = [
		{
			icon: "◉",
			lbl: "Sensor",
			sub: "mide la variable física"
		},
		{
			icon: "▣",
			lbl: "Controlador",
			sub: "compara con la consigna"
		},
		{
			icon: "⚙",
			lbl: "Actuador",
			sub: "convierte energía en acción"
		},
		{
			icon: "⬢",
			lbl: "Proceso",
			sub: "la variable manipulada cambia"
		}
	];
	const funciones = [
		{
			sym: "⚡",
			t: "Transformar energía",
			d: "Convierte energía eléctrica, neumática o hidráulica en movimiento, fuerza o una señal física."
		},
		{
			sym: "⇄",
			t: "Ejecutar la orden",
			d: "Recibe la señal del controlador y actúa sobre el proceso: abre, cierra, mueve, gira o avisa."
		},
		{
			sym: "⤢",
			t: "Amplificar potencia",
			d: "Una señal débil de mando (24 V, unos mA) gobierna fuerzas enormes mediante válvulas o relés."
		},
		{
			sym: "⛨",
			t: "Posición de fallo",
			d: "Define qué hace el sistema al perder energía: cerrar, abrir o quedarse quieto. Es una decisión de seguridad."
		}
	];
	const clasificacion = [
		{
			icon: "⚡",
			t: "Eléctricos",
			d: "Motores DC y AC, motores paso a paso, solenoides y electroválvulas. Limpios, precisos y fáciles de controlar con electrónica."
		},
		{
			icon: "☁",
			t: "Neumáticos",
			d: "Cilindros y motores de aire comprimido. Rápidos, baratos y seguros en atmósferas inflamables; fuerza moderada y poca precisión de posición."
		},
		{
			icon: "⬤",
			t: "Hidráulicos",
			d: "Cilindros y motores movidos por aceite a alta presión. Máxima fuerza por tamaño y control suave, a cambio de instalación cara y mantenimiento."
		},
		{
			icon: "⟳",
			t: "Mecánicos",
			d: "Levas, husillos, piñón-cremallera y bielas. No generan energía: transforman el movimiento y multiplican fuerza con precisión."
		}
	];
	const electricos = [
		{
			icon: "⚙",
			t: "Motor DC",
			d: "Velocidad proporcional a la tensión y sentido conmutable invirtiendo la polaridad. Par de arranque alto; desgasta escobillas."
		},
		{
			icon: "↻",
			t: "Motor AC",
			d: "Campo magnético giratorio que arrastra la jaula del rotor. Robusto y sin escobillas; la velocidad se regula con variador (VFD)."
		},
		{
			icon: "⌗",
			t: "Motor paso a paso",
			d: "Cada pulso avanza un ángulo fijo (1.8° = 200 pasos/vuelta). Posicionamiento exacto en lazo abierto para CNC e impresoras."
		}
	];
	const neumaticos = [
		{
			icon: "→",
			t: "Simple efecto",
			d: "Un solo puerto: el aire empuja en un sentido y un resorte devuelve el vástago. Se gobierna con válvula 3/2. Más barato y sencillo."
		},
		{
			icon: "⇔",
			t: "Doble efecto",
			d: "Dos puertos: trabaja en ambos sentidos con válvula 5/2. La fuerza de retroceso resta el área del vástago. Es el estándar industrial."
		},
		{
			icon: "⌇",
			t: "Válvula solenoide",
			d: "Convierte una señal eléctrica en conmutación neumática. El número de vías y posiciones (3/2, 5/2) define qué cilindro puede gobernar."
		}
	];
	const hidraulicos = [
		{
			icon: "⇚",
			t: "Cilindro hidráulico",
			d: "El aceite a presión empuja un pistón de gran sección. Fuerza enorme, movimiento suave y control preciso incluso a baja velocidad."
		},
		{
			icon: "⛽",
			t: "Motobomba",
			d: "El motor eléctrico acciona la bomba que aspira aceite del depósito y lo entrega a presión. Es la fuente de energía del circuito."
		},
		{
			icon: "∿",
			t: "F = P × A",
			d: "La fuerza crece con la presión y con el área del pistón; el caudal fija la velocidad (v = Q/A). Duplicar el diámetro cuadruplica la fuerza."
		}
	];
	const mecanicos = [
		{
			icon: "↔",
			t: "Movimiento lineal",
			d: "El mecanismo transforma giro o fuerza en un desplazamiento recto para empujar, elevar, sujetar o posicionar. Ejemplos: husillo, cremallera y biela."
		},
		{
			icon: "⟳",
			t: "Movimiento rotativo",
			d: "La salida gira alrededor de un eje y transmite torque mediante engranajes, poleas, ejes o levas. Se usa para mezclar, transportar o accionar una bomba."
		},
		{
			icon: "⌗",
			t: "Elevación, traslación y posicionamiento",
			d: "Un mecanismo mecánico adapta recorrido, velocidad y fuerza a la tarea: eleva una carga, traslada una pieza o la detiene en una posición repetible."
		}
	];
	const modosHidraulicos = [
		{
			icon: "→",
			t: "Simple efecto",
			d: "La presión actúa en una cámara y el retorno ocurre por resorte, gravedad o la carga. Produce movimiento lineal en un sentido y requiere un puerto de trabajo."
		},
		{
			icon: "⇔",
			t: "Doble acción",
			d: "La válvula alterna presión entre las dos cámaras del cilindro para controlar avance y retroceso. La fuerza útil cambia por el área del vástago."
		},
		{
			icon: "↻",
			t: "Motor hidráulico rotativo",
			d: "El caudal de aceite produce giro continuo y la presión determina el torque. Se utiliza en ruedas, mezcladoras, cabrestantes y transmisiones de maquinaria pesada."
		}
	];
	const senalizacion = [{
		icon: "◉",
		t: "Piloto",
		d: "Lámpara indicadora de estado. El color tiene significado normativo: verde marcha, rojo paro o fallo, ámbar advertencia, azul información."
	}, {
		icon: "◈",
		t: "Zumbador",
		d: "Alarma sonora piezoeléctrica o electromagnética. El tono (frecuencia) y el patrón (continuo o intermitente) distinguen cada aviso."
	}];
	const aplicaciones = [
		{
			t: "Bandas transportadoras",
			d: "Un motor AC con reductor mantiene el movimiento continuo; un paso a paso detiene la pieza en posiciones controladas.",
			icon: "⇉"
		},
		{
			t: "Robots industriales",
			d: "Servos, motores paso a paso y actuadores lineales posicionan brazos y ejes con repetibilidad.",
			icon: "⌬"
		},
		{
			t: "Sistemas de bombeo",
			d: "Motobombas eléctricas o hidráulicas entregan caudal para riego, refrigeración y procesos.",
			icon: "⛽"
		},
		{
			t: "Control de líquidos",
			d: "Las válvulas solenoides abren, cierran o dosifican el flujo bajo una orden del controlador.",
			icon: "⌇"
		},
		{
			t: "Electroválvulas",
			d: "Una bobina convierte una señal eléctrica en el movimiento del carrete neumático o hidráulico.",
			icon: "⌇"
		},
		{
			t: "Sistemas de alarmas",
			d: "Pilotos y zumbadores comunican paro, fallo, advertencia y estados de seguridad.",
			icon: "◈"
		},
		{
			t: "Ventiladores y extractores",
			d: "Motores DC o AC mueven aire para enfriar gabinetes, ventilar áreas y extraer gases.",
			icon: "✣"
		},
		{
			t: "Mezcladoras",
			d: "Motores eléctricos o hidráulicos entregan torque continuo para homogeneizar líquidos y sólidos.",
			icon: "⟳"
		},
		{
			t: "Sistemas de posicionamiento",
			d: "Paso a paso, servomotor y husillo convierten pulsos en recorridos medibles.",
			icon: "⌗"
		},
		{
			t: "Procesos automatizados",
			d: "El lazo sensor-controlador-actuador coordina transporte, sujeción, corte, llenado y empaquetado.",
			icon: "▣"
		},
		{
			t: "Prensas industriales",
			d: "Cilindros hidráulicos aplican cientos de toneladas sobre la pieza.",
			icon: "⬒"
		},
		{
			t: "Inyección de plástico",
			d: "Hidráulica de alta presión cierra el molde e inyecta material a gran velocidad.",
			icon: "⬓"
		},
		{
			t: "Envasado",
			d: "Cilindros neumáticos rápidos empujan, cortan y sellan envases.",
			icon: "▣"
		},
		{
			t: "Puertas automáticas",
			d: "Motor DC o cilindro neumático trabaja con sensores de seguridad y finales de carrera.",
			icon: "⇥"
		},
		{
			t: "HVAC y proceso",
			d: "Actuadores eléctricos y válvulas solenoide regulan caudal, presión y temperatura.",
			icon: "≋"
		},
		{
			t: "Dosificación",
			d: "Motobombas y válvulas entregan volúmenes exactos de líquido por ciclo.",
			icon: "⛽"
		}
	];
	const glosario = [
		{
			t: "Actuador",
			d: "Dispositivo que convierte energía en movimiento o acción física siguiendo la orden de un controlador."
		},
		{
			t: "Servomotor",
			d: "Motor con realimentación (encoder) que corrige su posición o velocidad de forma continua."
		},
		{
			t: "Solenoide",
			d: "Bobina que genera un campo magnético y desplaza un núcleo al energizarse; base de válvulas y relés."
		},
		{
			t: "Electroválvula",
			d: "Válvula accionada por un solenoide que dirige el aire o el aceite según su número de vías y posiciones."
		},
		{
			t: "Válvula 3/2",
			d: "Tres vías y dos posiciones: alimenta, cierra y desfoga un solo lado del pistón. Típica de simple efecto."
		},
		{
			t: "Válvula 5/2",
			d: "Cinco vías y dos posiciones: gobierna ambos lados de un cilindro de doble efecto (avance y retroceso)."
		},
		{
			t: "Simple efecto",
			d: "Cilindro que empuja en un sentido y retorna por resorte. Un solo puerto de aire."
		},
		{
			t: "Doble efecto",
			d: "Cilindro que trabaja en ambos sentidos con dos puertos; la fuerza de retroceso descuenta el vástago."
		},
		{
			t: "Caudal",
			d: "Volumen de fluido que entrega la bomba por unidad de tiempo (L/min). Fija la velocidad del cilindro."
		},
		{
			t: "Presión",
			d: "Fuerza por unidad de superficie. En hidráulica se maneja en bar (1 bar ≈ 1 kgf/cm²)."
		},
		{
			t: "PWM",
			d: "Modulación por ancho de pulso: regula la tensión media y con ella la velocidad del motor DC."
		},
		{
			t: "Variador (VFD)",
			d: "Equipo que cambia la frecuencia y tensión de alimentación para regular la velocidad de un motor AC."
		},
		{
			t: "Relación de transmisión",
			d: "Cociente entre la velocidad de entrada y la de salida en un mecanismo de engranajes o poleas."
		},
		{
			t: "Lazo abierto / cerrado",
			d: "En abierto no se comprueba el resultado; en cerrado un sensor realimenta y corrige la acción."
		}
	];
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "theme": "tema-2" }, { "default": ($$result) => renderTemplate`  ${maybeRenderHead($$result)}<section class="hero"> <div class="container hero-grid"> <div> <p class="eyebrow rv" style="margin-bottom:18px">SISTEMAS PROGRAMABLES · TEMA II · ANTOLOGÍA UNIDAD 2</p> <h1 class="hero-title rv" style="--d:.05s"> <span class="t1">ACTUADORES</span><br> <span class="t2">EN ACCIÓN</span> </h1> <p class="hero-lede rv" style="--d:.12s">
El sensor mira; el actuador <strong>hace</strong>. Este banco es el músculo del sistema programable:
          opera motores, cilindros, válvulas y alarmas, y mira cómo una señal débil se convierte en fuerza real.
</p> <div class="hero-actions rv" style="--d:.18s"> <a class="btn is-active" style="--c:var(--act-intro);display:inline-block" href="#act01">▼ ENTRAR AL BANCO</a> <a class="btn" style="display:inline-block" href="#act06">IR A SELECCIÓN</a> </div> <div class="sim-legend rv" style="--d:.24s;margin-top:26px"> <span><i style="background:var(--act-intro)"></i>ACT-01 Actuador</span> <span><i style="background:var(--act-elec)"></i>ACT-02 Eléctricos</span> <span><i style="background:var(--act-neum)"></i>ACT-03 Neumáticos</span> <span><i style="background:var(--act-hidr)"></i>ACT-04 Hidráulicos</span> <span><i style="background:var(--act-senal)"></i>ACT-05 Señalización</span> </div> </div> <div class="rv" style="--d:.1s"> <div class="panel" style="--c:var(--act-intro)"> <div class="panel-tag"><span>LAZO DE CONTROL</span><span>SENSOR → ACTUADOR</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:0"> ${lazo.map((f, i) => renderTemplate`<div class="col" style="gap:0"> <div class="row" style="gap:12px;padding:9px 0"> <span style="font-size:24px;color:var(--act-intro);font-family:var(--font-display);width:30px;text-align:center">${f.icon}</span> <div class="col" style="gap:0"> <strong style="font-family:var(--font-display);letter-spacing:.04em">${f.lbl}</strong> <span class="mono" style="font-size:11px;color:var(--ink-faint)">${f.sub}</span> </div> </div> ${i < lazo.length - 1 && renderTemplate`<div class="wire-v" style="--c:var(--act-intro);margin-left:15px;height:20px;align-self:flex-start"></div>`} </div>`)} <a class="btn is-active" style="--c:var(--act-intro);display:inline-block;margin-top:16px;align-self:flex-start" href="#act01">PROBAR EL LAZO COMPLETO →</a> </div> </div> </div> </div> </section>  <section class="section" id="act01" style="--c: var(--act-intro)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">ACT-01 · DEFINICIÓN</span> <h2 class="channel-title">El actuador</h2> </div> <p class="channel-sub rv">
Un actuador es el <strong>elemento que transforma la energía en una acción física</strong> sobre el proceso:
        movimiento, fuerza, luz o sonido. Es el músculo del lazo de control — recibe la orden del controlador y
        la ejecuta. Sin actuador, el programa solo observa; con él, <em>modifica el mundo</em>.
</p> <div class="grid-4 rv" style="margin-bottom:clamp(24px,4vw,40px)"> ${lazo.map((f, i) => renderTemplate`<div class="panel"> <div class="panel-tag"><span>${String(i + 1).padStart(2, "0")}/04</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:4px;padding:16px"> <span style="font-size:24px;color:var(--act-intro);font-family:var(--font-display)">${f.icon}</span> <strong style="font-family:var(--font-display);letter-spacing:.03em">${f.lbl}</strong> <span class="mono" style="font-size:11px;color:var(--ink-faint)">${f.sub}</span> </div> </div>`)} </div> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)"> ${renderComponent($$result, "ControlLoop", ControlLoop, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/ControlLoop.tsx",
		"client:component-export": "default"
	})} </div> <h3 class="mono rv" style="font-size:12px;letter-spacing:.22em;color:var(--act-intro);margin:clamp(32px,5vw,48px) 0 18px">QUÉ HACE UN ACTUADOR · GIRA LAS TARJETAS</h3> <div class="grid-4 rv" style="margin-bottom:clamp(32px,5vw,48px)"> ${funciones.map((c) => renderTemplate`<button type="button" class="flip"${addAttribute(`Función del actuador: ${c.t}. ${c.d}`, "aria-label")} onclick="this.classList.toggle('flipped')"> <div class="flip-in"> <div class="flip-face" style="--c:var(--act-intro)"> <span class="sym">${c.sym}</span> <strong style="font-family:var(--font-display);letter-spacing:.05em;font-size:16px">${c.t}</strong> <span class="mono" style="font-size:10px;color:var(--ink-faint);letter-spacing:.16em">TOCA PARA VER</span> </div> <div class="flip-face flip-back" style="--c:var(--act-intro)"> <p style="font-size:13px;color:var(--ink-dim)">${c.d}</p> </div> </div> </button>`)} </div> <h3 class="mono rv" style="font-size:12px;letter-spacing:.22em;color:var(--act-intro);margin-bottom:18px">CLASIFICACIÓN POR ENERGÍA</h3> <div class="grid-4 rv" style="margin-bottom:clamp(32px,5vw,48px)"> ${clasificacion.map((c) => renderTemplate`<div class="panel" style="--c:var(--act-intro)"> <div class="panel-tag"><span>${c.icon}</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px;padding:16px"> <strong style="font-family:var(--font-display);letter-spacing:.04em;font-size:16px">${c.t}</strong> <p style="font-size:13px;color:var(--ink-dim)">${c.d}</p> </div> </div>`)} </div> <div class="rv">${renderComponent($$result, "ActuatorGallery", ActuatorGallery, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/ActuatorGallery.tsx",
		"client:component-export": "default"
	})}</div> <h3 class="mono rv" style="font-size:12px;letter-spacing:.22em;color:var(--act-intro);margin:clamp(32px,5vw,48px) 0 18px">ACTUADORES MECÁNICOS · LINEAL Y ROTATIVO</h3> <div class="grid-3 rv"> ${mecanicos.map((m) => renderTemplate`<div class="panel" style="--c:var(--act-intro)"> <div class="panel-tag"><span>${m.icon}</span><span>MOVIMIENTO</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px;padding:16px"> <strong style="font-family:var(--font-display);letter-spacing:.04em;font-size:16px">${m.t}</strong> <p style="font-size:13px;color:var(--ink-dim)">${m.d}</p> </div> </div>`)} </div> </div> </section>  <section class="section" id="act02" style="--c: var(--act-elec)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">ACT-02 · ACTUADORES ELÉCTRICOS</span> <h2 class="channel-title">Electricidad en movimiento</h2> </div> <p class="channel-sub rv">
Los actuadores eléctricos convierten la energía de la red o de una batería en giro, empuje o conmutación.
        Son <strong>limpios, precisos y fáciles de gobernar con electrónica de potencia</strong>; su límite es la
        relación entre fuerza y tamaño. Opera los tres motores del banco y compara.
</p> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "MotorLab", MotorLab, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/MotorLab.tsx",
		"client:component-export": "default"
	})}</div> <div class="grid-3 rv"> ${electricos.map((e) => renderTemplate`<div class="panel" style="--c:var(--act-elec)"> <div class="panel-tag"><span>${e.icon}</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px;padding:16px"> <strong style="font-family:var(--font-display);letter-spacing:.04em;font-size:16px">${e.t}</strong> <p style="font-size:13px;color:var(--ink-dim)">${e.d}</p> </div> </div>`)} </div> </div> </section>  <section class="section" id="act03" style="--c: var(--act-neum)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">ACT-03 · ACTUADORES NEUMÁTICOS</span> <h2 class="channel-title">Aire que empuja</h2> </div> <p class="channel-sub rv">
La neumática trabaja con aire comprimido, normalmente entre <strong>4 y 8 bar</strong>. Es rápida, limpia,
        barata y segura incluso en atmósferas inflamables; su talón de Aquiles es que el aire es compresible, así
        que <em>posicionar a media carrera es impreciso</em> y la fuerza queda moderada.
</p> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "PneumaticLab", PneumaticLab, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/PneumaticLab.tsx",
		"client:component-export": "default"
	})}</div> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "SolenoidLab", SolenoidLab, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/SolenoidLab.tsx",
		"client:component-export": "default"
	})}</div> <div class="grid-3 rv"> ${neumaticos.map((e) => renderTemplate`<div class="panel" style="--c:var(--act-neum)"> <div class="panel-tag"><span>${e.icon}</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px;padding:16px"> <strong style="font-family:var(--font-display);letter-spacing:.04em;font-size:16px">${e.t}</strong> <p style="font-size:13px;color:var(--ink-dim)">${e.d}</p> </div> </div>`)} </div> </div> </section>  <section class="section" id="act04" style="--c: var(--act-hidr)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">ACT-04 · ACTUADORES HIDRÁULICOS</span> <h2 class="channel-title">La fuerza del aceite</h2> </div> <p class="channel-sub rv">
La hidráulica maneja aceite a <strong>20–250 bar en este banco didáctico</strong>. Como el líquido es prácticamente incompresible,
        el principio de Pascal permite obtener <strong>fuerzas enormes en espacios pequeños</strong> con un control
        suave y preciso. El precio: instalación costosa, fugas sucias y mantenimiento exigente.
</p> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "HydraulicLab", HydraulicLab, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/HydraulicLab.tsx",
		"client:component-export": "default"
	})}</div> <h3 class="mono rv" style="font-size:12px;letter-spacing:.22em;color:var(--act-hidr);margin-bottom:18px">MODOS DE ACTUACIÓN HIDRÁULICA</h3> <div class="grid-3 rv" style="margin-bottom:clamp(32px,5vw,48px)"> ${modosHidraulicos.map((mode) => renderTemplate`<div class="panel" style="--c:var(--act-hidr)"> <div class="panel-tag"><span>${mode.icon}</span><span>CONFIGURACIÓN</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px;padding:16px"> <strong style="font-family:var(--font-display);letter-spacing:.04em;font-size:16px">${mode.t}</strong> <p style="font-size:13px;color:var(--ink-dim)">${mode.d}</p> </div> </div>`)} </div> <div class="grid-3 rv"> ${hidraulicos.map((e) => renderTemplate`<div class="panel" style="--c:var(--act-hidr)"> <div class="panel-tag"><span>${e.icon}</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px;padding:16px"> <strong style="font-family:var(--font-display);letter-spacing:.04em;font-size:16px">${e.t}</strong> <p style="font-size:13px;color:var(--ink-dim)">${e.d}</p> </div> </div>`)} </div> </div> </section>  <section class="section" id="act05" style="--c: var(--act-senal)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">ACT-05 · SEÑALIZACIÓN</span> <h2 class="channel-title">Avisar también es actuar</h2> </div> <p class="channel-sub rv">
No todos los actuadores mueven cargas: los de señalización <strong>transforman una señal eléctrica en luz o
        sonido</strong> para informar al operario. Son la interfaz entre la máquina y la persona, y muchas veces la
        última barrera de seguridad.
</p> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "SignalingLab", SignalingLab, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/SignalingLab.tsx",
		"client:component-export": "default"
	})}</div> <div class="grid-2 rv"> ${senalizacion.map((e) => renderTemplate`<div class="panel" style="--c:var(--act-senal)"> <div class="panel-tag"><span>${e.icon}</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px;padding:16px"> <strong style="font-family:var(--font-display);letter-spacing:.04em;font-size:16px">${e.t}</strong> <p style="font-size:13.5px;color:var(--ink-dim)">${e.d}</p> </div> </div>`)} </div> </div> </section>  <section class="section" id="act06" style="--c: var(--act-sel)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">ACT-06 · SELECCIÓN Y APLICACIONES</span> <h2 class="channel-title">Elegir el músculo correcto</h2> </div> <p class="channel-sub rv">
No existe el mejor actuador, sino el más adecuado para cada tarea. Antes de comprar hay que responder a
        siete preguntas. Gira cada tarjeta para ver el criterio completo.
</p> <h3 class="mono rv" style="font-size:12px;letter-spacing:.22em;color:var(--act-sel);margin-bottom:18px">CRITERIOS DE SELECCIÓN · 7 CRITERIOS</h3> <div class="grid-4 rv" style="margin-bottom:clamp(32px,5vw,48px)"> ${SELECTION_CRITERIA.map((c) => renderTemplate`<button type="button" class="flip"${addAttribute(`Criterio de selección: ${c.title}. ${c.description}`, "aria-label")} onclick="this.classList.toggle('flipped')"> <div class="flip-in"> <div class="flip-face" style="--c:var(--act-sel)"> <span class="sym">${c.icon}</span> <strong style="font-family:var(--font-display);letter-spacing:.05em;font-size:16px">${c.title}</strong> <span class="mono" style="font-size:10px;color:var(--ink-faint);letter-spacing:.16em">TOCA PARA VER</span> </div> <div class="flip-face flip-back" style="--c:var(--act-sel)"> <p style="font-size:12.5px;color:var(--ink-dim)">${c.description}</p> </div> </div> </button>`)} </div> <div class="rv" style="margin-bottom:clamp(32px,5vw,48px)"> ${renderComponent($$result, "ActuatorChallenge", ActuatorChallenge, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/ActuatorChallenge.tsx",
		"client:component-export": "default"
	})} </div> <div class="rv" style="margin-bottom:clamp(32px,5vw,48px)">${renderComponent($$result, "ActuatorCompare", ActuatorCompare, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/ActuatorCompare.tsx",
		"client:component-export": "default"
	})}</div> <h3 class="mono rv" style="font-size:12px;letter-spacing:.22em;color:var(--act-sel);margin-bottom:18px">APLICACIONES INDUSTRIALES REALES</h3> <div class="grid-3 rv" style="margin-bottom:clamp(32px,5vw,48px)"> ${aplicaciones.map((a) => renderTemplate`<div class="panel" style="--c:var(--act-sel)"> <div class="panel-tag"><span>${a.icon}</span><span>APLICACIÓN</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px;padding:16px"> <strong style="font-family:var(--font-display);letter-spacing:.04em;font-size:16px">${a.t}</strong> <p style="font-size:13px;color:var(--ink-dim)">${a.d}</p> </div> </div>`)} </div> <div class="grid-2" style="align-items:start"> <div class="rv"> ${renderComponent($$result, "Quiz", Quiz, {
		"client:visible": true,
		"bank": QUIZ_ACTUADORES,
		"accent": "var(--act-sel)",
		"tag": "TEST DE REPASO · TEMA II · 8 PREGUNTAS",
		"results": RESULTADOS_ACTUADORES,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/Quiz.tsx",
		"client:component-export": "default"
	})} </div> <div class="rv"> <div class="panel" style="--c:var(--act-sel)"> <div class="panel-tag"><span>GLOSARIO DE ACTUADORES</span><span>${glosario.length} TÉRMINOS</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:10px;padding:18px"> ${glosario.map((g) => renderTemplate`<details class="acc"> <summary>${g.t}</summary> <div class="acc-body"><p>${g.d}</p></div> </details>`)} </div> </div> </div> </div> <div class="rv" style="margin-top:clamp(40px,6vw,64px);text-align:center"> <div class="panel" style="background:var(--bg-deep)"> <div class="panel-inner" style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px 24px"> <div style="font-family:var(--font-display);font-size:clamp(20px,3vw,30px);color:var(--act-sel)">SENSOR MIDE · CONTROLADOR DECIDE · ACTUADOR ACTÚA</div> <p style="color:var(--ink-dim);max-width:56ch">
Ese es el lazo completo de un sistema programable. El sensor convierte el mundo físico en señal,
              el controlador la interpreta y el actuador <strong style="color:var(--ink)">devuelve la acción al mundo</strong>.
              Dominar los actuadores es dominar la mitad que <em>hace</em>.
</p> <a class="btn is-active" style="--c:var(--act-sel);display:inline-block;margin-top:6px" href="#top">↑ SUBIR AL INICIO</a> </div> </div> </div> </div> </section> ` })}`;
}, "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/pages/tema-2.astro", void 0);
var $$file = "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/pages/tema-2.astro";
var $$url = "/tema-2";
//#endregion
//#region \0virtual:astro:page:src/pages/tema-2@_@astro
var page = () => tema_2_exports;
//#endregion
export { page };
