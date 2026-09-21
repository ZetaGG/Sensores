import { a as __exportAll, i as createComponent, n as useReducedMotion, r as $$BaseLayout, t as Quiz } from "./Quiz_CdbE6qnb.mjs";
import { a as renderComponent, d as renderTemplate, f as maybeRenderHead, m as addAttribute } from "./server_B7faeoIi.mjs";
import { useEffect, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/sims/SignalVisualizer.tsx
/** Genera puntos wave t->[-1,1] */
function makeWave(type, pts = 180) {
	const out = [];
	for (let i = 0; i < pts; i++) {
		const t = i / (pts - 1);
		let y = 0;
		switch (type) {
			case "sine":
				y = Math.sin(t * Math.PI * 2 * 2.5) * .4;
				break;
			case "square":
				y = Math.sin(t * Math.PI * 2 * 2) >= 0 ? .5 : -.5;
				break;
			case "steps":
				y = (Math.floor(t * 3) % 2 === 0 ? .35 : .65) - .5;
				break;
			case "saw":
				y = t * 2.5 % 1 * 2 - 1;
				y *= .5;
				break;
			case "echo": {
				const p = t * 4 % 1;
				y = Math.exp(-p * 6) * Math.sin(p * Math.PI * 10) * .8;
				y *= p < .08 ? 0 : 1;
				break;
			}
		}
		out.push([t, y]);
	}
	return out;
}
function toPath(pts, W, H, amp = .36) {
	return pts.map(([t, y], i) => `${i === 0 ? "M" : "L"}${(t * W).toFixed(1)},${(H / 2 - y * H * amp * 2).toFixed(1)}`).join("");
}
var MAGNITUDES = [
	{
		id: "luz",
		label: "LUZ",
		unit: "lux",
		read: "860",
		simbolo: "◉",
		wave: "square",
		inName: "Fotocélula",
		vOut: "5.0 V",
		outTxt: "NIVEL ALTO · DETECTADO",
		desc: "La luz incide y el sensor conmuta su salida digital."
	},
	{
		id: "temp",
		label: "TEMPERATURA",
		unit: "°C",
		read: "38.4",
		simbolo: "◍",
		wave: "sine",
		inName: "Termopar",
		vOut: "1.54 V",
		outTxt: "SEÑAL ANALÓGICA · mV/°C",
		desc: "El voltaje Seebeck varía de forma casi lineal con la temperatura."
	},
	{
		id: "pres",
		label: "PRESIÓN",
		unit: "kPa",
		read: "214",
		simbolo: "◔",
		wave: "steps",
		inName: "Galga extensiométrica",
		vOut: "3.21 V",
		outTxt: "ESCALONES DE PROCESO",
		desc: "Cada cambio de presión deforma el elemento y se traduce en voltaje."
	},
	{
		id: "dist",
		label: "DISTANCIA",
		unit: "mm",
		read: "425",
		simbolo: "◓",
		wave: "echo",
		inName: "Ultrasónico HC-SR04",
		vOut: "2.78 V",
		outTxt: "ECO · TIEMPO DE VUELO",
		desc: "El eco regresa y el tiempo de vuelo se convierte en señal de distancia."
	}
];
var AX$7 = { "--c": "var(--ch-intro)" };
function SignalVisualizer() {
	const [mag, setMag] = useState(0);
	const [sweep, setSweep] = useState(0);
	const [armed, setArmed] = useState(false);
	const raf = useRef(null);
	const reduce = useReducedMotion();
	const m = MAGNITUDES[mag];
	useEffect(() => {
		setSweep(0);
		if (reduce) {
			setSweep(1);
			setArmed(true);
			return;
		}
		const t0 = performance.now();
		const dur = 900;
		const tick = (now) => {
			const p = Math.min(1, (now - t0) / dur);
			const eased = 1 - Math.pow(1 - p, 3);
			setSweep(eased);
			if (p < 1) raf.current = requestAnimationFrame(tick);
			else setArmed(true);
		};
		setArmed(false);
		raf.current = requestAnimationFrame(tick);
		return () => {
			if (raf.current) cancelAnimationFrame(raf.current);
		};
	}, [mag, reduce]);
	const W = 400, H = 200;
	const waveIn = makeWave(m.wave);
	const fullIn = toPath(waveIn, W, H);
	const cut = Math.max(1, Math.floor(waveIn.length * sweep));
	const partial = toPath(waveIn.slice(0, cut), W, H);
	const last = waveIn[cut - 1];
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX$7,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "MONITOR DE SEÑAL · CANAL MAESTRO" }), /* @__PURE__ */ jsx("span", {
				className: "live",
				children: "EN VIVO"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "row",
					style: { marginBottom: 0 },
					children: MAGNITUDES.map((x, i) => /* @__PURE__ */ jsxs("button", {
						className: `btn ${i === mag ? "is-active" : ""}`,
						style: AX$7,
						onClick: () => setMag(i),
						"aria-pressed": i === mag,
						children: [
							x.simbolo,
							" ",
							x.label
						]
					}, x.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "sim-stage graticule",
					style: { padding: "12px 12px 0" },
					children: [/* @__PURE__ */ jsxs("div", {
						className: "stage-cap",
						children: [/* @__PURE__ */ jsxs("span", { children: ["CH-IN · ", m.inName] }), /* @__PURE__ */ jsx("span", { children: "SP01/OSC-01" })]
					}), /* @__PURE__ */ jsxs("svg", {
						viewBox: `0 0 ${W} ${H}`,
						role: "img",
						"aria-label": `Señal de entrada de ${m.label}`,
						style: {
							width: "100%",
							height: "auto"
						},
						children: [
							[
								.25,
								.5,
								.75
							].map((f) => /* @__PURE__ */ jsx("line", {
								x1: "0",
								x2: W,
								y1: H * f,
								y2: H * f,
								stroke: "rgba(120,150,190,.09)",
								strokeWidth: "1"
							}, "h" + f)),
							[
								.25,
								.5,
								.75
							].map((f) => /* @__PURE__ */ jsx("line", {
								y1: "0",
								y2: H,
								x1: W * f,
								x2: W * f,
								stroke: "rgba(120,150,190,.09)",
								strokeWidth: "1"
							}, "v" + f)),
							/* @__PURE__ */ jsx("line", {
								x1: "0",
								x2: W,
								y1: H / 2,
								y2: H / 2,
								stroke: "rgba(120,150,190,.18)",
								strokeWidth: "1",
								strokeDasharray: "4 4"
							}),
							/* @__PURE__ */ jsx("path", {
								d: fullIn,
								fill: "none",
								stroke: "rgba(125,211,252,.12)",
								strokeWidth: "1.5"
							}),
							/* @__PURE__ */ jsx("path", {
								d: partial,
								fill: "none",
								stroke: "var(--trace)",
								strokeWidth: "2",
								strokeLinecap: "round",
								style: { filter: "drop-shadow(0 0 6px rgba(125,211,252,.7))" }
							}),
							sweep < 1 && cut > 0 && /* @__PURE__ */ jsx("circle", {
								cx: last[0] * W,
								cy: H / 2 - last[1] * H * .36 * 2,
								r: "3.5",
								fill: "var(--trace)"
							}),
							/* @__PURE__ */ jsx("line", {
								x1: sweep * W,
								x2: sweep * W,
								y1: "0",
								y2: H,
								stroke: "rgba(244,114,182,.4)",
								strokeWidth: "1"
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row mono-label",
					style: {
						justifyContent: "space-between",
						color: "var(--ink-dim)",
						fontSize: 11
					},
					children: [
						/* @__PURE__ */ jsxs("span", {
							style: {
								flex: 1,
								textAlign: "center"
							},
							children: [
								m.read,
								" ",
								m.unit
							]
						}),
						/* @__PURE__ */ jsx("span", {
							style: { color: "var(--ink-faint)" },
							children: "→"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "mono",
							style: {
								flex: 1,
								textAlign: "center",
								border: "1px solid var(--line)",
								borderRadius: 4,
								padding: "6px 8px",
								background: "var(--bg-deep)",
								color: "var(--ch-intro)",
								letterSpacing: ".14em",
								boxShadow: armed ? "0 0 18px rgba(155,140,255,.35)" : void 0,
								transition: "box-shadow .4s"
							},
							children: "SENSOR"
						}),
						/* @__PURE__ */ jsx("span", {
							style: { color: "var(--ink-faint)" },
							children: "→"
						}),
						/* @__PURE__ */ jsx("span", {
							style: {
								flex: 1,
								textAlign: "center",
								color: "var(--ch-intro)"
							},
							children: m.vOut
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "readout",
					style: AX$7,
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lbl",
						children: ["SALIDA ELÉCTRICA · ", m.label]
					}), /* @__PURE__ */ jsxs("div", {
						className: "val",
						children: [
							m.vOut,
							" ",
							/* @__PURE__ */ jsx("span", {
								style: {
									fontSize: ".65em",
									color: "var(--ink-dim)"
								},
								children: m.outTxt
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "sim-note",
					style: { marginTop: 0 },
					children: m.desc
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/CrossClassify.tsx
var SALIDA = ["Analógica", "Digital"];
var CONTACTO = ["Con contacto", "Sin contacto"];
var EXAMPLES = {
	"Analógica|Con contacto": {
		name: "Potenciómetro",
		icon: "⏦",
		desc: "Un cursor mecánico recorre una resistencia: el contacto físico varía la resistencia de forma continua."
	},
	"Analógica|Sin contacto": {
		name: "Termopar / LDR",
		icon: "◍",
		desc: "Sin fricción: la temperatura o la luz modifican la señal eléctrica de forma continua y proporcional."
	},
	"Digital|Con contacto": {
		name: "Fin de carrera",
		icon: "⇋",
		desc: "Un interruptor mecánico que solo sabe dos cosas: accionado o no accionado."
	},
	"Digital|Sin contacto": {
		name: "Fotocélula IR",
		icon: "◪",
		desc: "Detecta por luz sin tocar el objeto: su salida es un estado ON/OFF. Ideal para alta velocidad."
	}
};
var AX$6 = { "--c": "var(--ch-intro)" };
function CrossClassify() {
	const [s, setS] = useState("Analógica");
	const [c, setC] = useState("Con contacto");
	const ex = EXAMPLES[`${s}|${c}`];
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX$6,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "CLASIFICADOR CRUZADO" }), /* @__PURE__ */ jsx("span", { children: "2 EJES · 4 COMBINACIONES" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "col",
						style: { gap: 8 },
						children: [/* @__PURE__ */ jsx("span", {
							className: "mono-label",
							children: "SEÑAL DE SALIDA"
						}), /* @__PURE__ */ jsx("div", {
							className: "row",
							children: SALIDA.map((x) => /* @__PURE__ */ jsxs("button", {
								className: `btn ${s === x ? "is-active" : ""}`,
								style: AX$6,
								onClick: () => setS(x),
								"aria-pressed": s === x,
								children: [
									x === "Analógica" ? "◉" : "◻",
									" ",
									x
								]
							}, x))
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "col",
						style: { gap: 8 },
						children: [/* @__PURE__ */ jsx("span", {
							className: "mono-label",
							children: "MODO DE DETECCIÓN"
						}), /* @__PURE__ */ jsx("div", {
							className: "row",
							children: CONTACTO.map((x) => /* @__PURE__ */ jsxs("button", {
								className: `btn ${c === x ? "is-active" : ""}`,
								style: AX$6,
								onClick: () => setC(x),
								"aria-pressed": c === x,
								children: [
									x === "Con contacto" ? "⛓" : "⟡",
									" ",
									x
								]
							}, x))
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "sim-stage graticule row",
					style: { padding: 22 },
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							fontFamily: "var(--font-display)",
							fontSize: 34,
							color: "var(--ch-intro)"
						},
						children: ex.icon
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "var(--font-display)",
							fontWeight: 600,
							fontSize: 17
						},
						children: ex.name
					}), /* @__PURE__ */ jsx("p", {
						style: {
							color: "var(--ink-dim)",
							fontSize: 13.5,
							marginTop: 4
						},
						children: ex.desc
					})] })]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					style: { marginTop: 0 },
					children: [/* @__PURE__ */ jsx("b", { children: "Úsalo así:" }), " cualquier sensor real cae en una de estas cuatro casillas al cruzar ambos ejes."]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/ClassifyGame.tsx
var CARDS = [
	{
		id: "pot",
		name: "Potenciómetro",
		kind: "analog",
		hint: "resistencia continua según gira el eje",
		icon: "⏦"
	},
	{
		id: "tc",
		name: "Termopar",
		kind: "analog",
		hint: "voltaje continuo proporcional a la temperatura",
		icon: "◍"
	},
	{
		id: "fin",
		name: "Fin de carrera",
		kind: "digital",
		hint: "abierto/cerrado, sin estados intermedios",
		icon: "⇋"
	},
	{
		id: "ldr",
		name: "LDR",
		kind: "analog",
		hint: "resistencia variable con la intensidad de luz",
		icon: "◉"
	},
	{
		id: "ir",
		name: "Fotocélula IR",
		kind: "digital",
		hint: "salida binaria: detecta / no detecta",
		icon: "◪"
	},
	{
		id: "gal",
		name: "Galga extensiométrica",
		kind: "analog",
		hint: "resistencia proporcional a la deformación",
		icon: "∿"
	}
];
var BINS = [{
	id: "analog",
	label: "ANALÓGICO",
	sub: "señal continua · infinitos valores",
	icon: "◉"
}, {
	id: "digital",
	label: "DIGITAL",
	sub: "estados discretos · ON/OFF",
	icon: "◻"
}];
var AX$5 = { "--c": "var(--ch-intro)" };
function ClassifyGame() {
	const [assigned, setAssigned] = useState({});
	const [armed, setArmed] = useState(null);
	const [revealed, setRevealed] = useState(false);
	const leftover = CARDS.filter((c) => !assigned[c.id]);
	const assignedList = (bin) => CARDS.filter((c) => assigned[c.id] === bin);
	const correct = CARDS.filter((c) => assigned[c.id] === c.kind).length;
	const done = leftover.length === 0;
	const place = (bin) => {
		if (!armed || revealed) return;
		setAssigned((a) => ({
			...a,
			[armed]: bin
		}));
		setArmed(null);
	};
	const pullBack = (id) => {
		if (revealed) return;
		setAssigned((a) => {
			const n = { ...a };
			delete n[id];
			return n;
		});
	};
	const reset = () => {
		setAssigned({});
		setArmed(null);
		setRevealed(false);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX$5,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "BANCO 01 · CLASIFICACIÓN DE LA SEÑAL" }), /* @__PURE__ */ jsx("span", { children: done ? `${correct}/${CARDS.length}` : "1 · ELIGE TARJETA — 2 · COLÓCALA EN UNA CATEGORÍA" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 18 },
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: `chip ${armed ? "" : ""}`,
							style: armed ? void 0 : { opacity: .55 },
							children: armed ? `SELECCIONADA: ${CARDS.find((c) => c.id === armed)?.name.toUpperCase()}` : "TOCA UNA TARJETA PARA SELECCIONARLA"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-faint mono-label",
							children: "→"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "chip",
							children: "TOCA LA CATEGORÍA PARA COLOCARLA"
						}),
						done && !revealed && /* @__PURE__ */ jsx("button", {
							className: "btn is-active",
							style: AX$5,
							onClick: () => setRevealed(true),
							children: "VERIFICAR"
						}),
						revealed && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
							className: "btn",
							onClick: reset,
							children: "REINICIAR"
						}), /* @__PURE__ */ jsx("span", {
							className: "mono",
							style: {
								color: correct === CARDS.length ? "var(--ok)" : "var(--warn)",
								fontSize: 12
							},
							children: correct === CARDS.length ? "✓ 6/6 — CLASIFICACIÓN PERFECTA" : `${correct}/6 — LAS INCORRECTAS QUEDAN MARCADAS`
						})] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "col",
					style: {
						padding: 14,
						border: "1px dashed var(--line)",
						borderRadius: "var(--radius)",
						gap: 10
					},
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "mono-label",
							children: "BANDEJA DE COMPONENTES"
						}),
						leftover.length === 0 && /* @__PURE__ */ jsx("span", {
							className: "mono",
							style: {
								fontSize: 12,
								color: "var(--ink-dim)"
							},
							children: "Vacía — todas clasificadas."
						}),
						/* @__PURE__ */ jsx("div", {
							className: "row",
							style: { gap: 10 },
							children: leftover.map((c) => /* @__PURE__ */ jsxs("button", {
								className: "quiz-opt grab",
								style: {
									width: "auto",
									padding: "10px 14px",
									display: "flex",
									alignItems: "center",
									gap: 8,
									...armed === c.id ? {
										borderColor: "var(--ch-intro)",
										color: "var(--ink)",
										background: "rgba(155,140,255,.08)"
									} : {}
								},
								onClick: () => setArmed(revealed ? armed : armed === c.id ? null : c.id),
								"aria-pressed": armed === c.id,
								children: [/* @__PURE__ */ jsx("span", {
									style: { fontSize: 16 },
									children: c.icon
								}), /* @__PURE__ */ jsxs("span", {
									className: "col",
									style: {
										gap: 0,
										alignItems: "flex-start"
									},
									children: [/* @__PURE__ */ jsx("span", {
										style: { fontWeight: 500 },
										children: c.name
									}), /* @__PURE__ */ jsx("span", {
										className: "mono",
										style: {
											fontSize: 10,
											color: "var(--ink-faint)"
										},
										children: c.hint
									})]
								})]
							}, c.id))
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid-2",
					children: BINS.map((b) => /* @__PURE__ */ jsxs("div", {
						className: "quiz-opt",
						style: {
							minHeight: 110,
							display: "flex",
							flexDirection: "column",
							gap: 6,
							alignItems: "flex-start",
							...armed ? {
								borderColor: "var(--ch-intro)",
								borderStyle: "dashed"
							} : {}
						},
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							className: "bin-target",
							onClick: () => place(b.id),
							disabled: revealed,
							"aria-label": `Colocar tarjeta en categoría ${b.label}`,
							children: [/* @__PURE__ */ jsxs("span", {
								className: "mono",
								style: {
									fontWeight: 700,
									letterSpacing: ".06em",
									fontSize: 13
								},
								children: [
									b.icon,
									" ",
									b.label
								]
							}), /* @__PURE__ */ jsx("span", {
								className: "mono-label",
								style: { fontSize: 10 },
								children: b.sub
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "row",
							style: {
								marginTop: 4,
								gap: 6
							},
							role: "list",
							"aria-label": `Tarjetas en ${b.label}`,
							children: assignedList(b.id).map((c) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "chip assigned-chip",
								style: revealed ? c.kind === b.id ? {
									color: "var(--ok)",
									borderColor: "var(--ok)"
								} : {
									color: "var(--err)",
									borderColor: "var(--err)"
								} : void 0,
								onClick: () => pullBack(c.id),
								disabled: revealed,
								"aria-label": `Devolver ${c.name} a la bandeja`,
								children: [
									c.icon,
									" ",
									c.name,
									" ",
									revealed && (c.kind === b.id ? "✓" : "✗")
								]
							}, c.id))
						})]
					}, b.id))
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					style: { marginTop: 0 },
					children: [
						/* @__PURE__ */ jsx("b", { children: "Regla práctica:" }),
						" si la señal puede tener ",
						/* @__PURE__ */ jsx("em", { children: "cualquier valor intermedio" }),
						" (temperatura, luz, deformación), es analógica. Si solo conmuta entre ",
						/* @__PURE__ */ jsx("em", { children: "dos estados" }),
						", es digital."
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/OpticalParts.tsx
var PARTS = [
	{
		id: "f",
		icon: "▾",
		name: "FUENTE (EMISOR)",
		rol: "LED o láser que genera el haz de luz.",
		det: "Generalmente luz visible o infrarroja. En sensores industriales emite en ráfagas para distinguirse de la luz ambiental."
	},
	{
		id: "l1",
		icon: "◍",
		name: "LENTES",
		rol: "Concentran el haz y el retorno.",
		det: "Pequeñas lentes ópticas en emisor y receptor focalizan la luz y amplían el alcance del sistema."
	},
	{
		id: "r",
		icon: "◎",
		name: "RECEPTOR",
		rol: "Fotodiodo o fototransistor.",
		det: "Convierte la luz que le llega en corriente. Es la parte más sensible del sensor y suele limitar su vida útil."
	},
	{
		id: "c",
		icon: "∿",
		name: "CIRCUITO DE SALIDA",
		rol: "Amplifica y adapta la señal.",
		det: "Toma la minúscula señal del receptor y la convierte en una salida que el PLC o microcontrolador entienda (NPN/PNP, 0-10V, 4-20mA)."
	}
];
var AX$4 = { "--c": "var(--ch-optico)" };
var chain = [
	{
		id: "f",
		lbl: "FUENTE",
		icon: "▾"
	},
	{
		id: "l1",
		lbl: "LENTE",
		icon: "◍"
	},
	{
		id: "gap",
		lbl: "HAZ DE LUZ",
		icon: "⤍"
	},
	{
		id: "r",
		lbl: "RECEPTOR",
		icon: "◎"
	},
	{
		id: "c",
		lbl: "SALIDA",
		icon: "∿"
	}
];
function OpticalParts() {
	const [sel, setSel] = useState("f");
	const p = PARTS.find((pp) => pp.id === sel);
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX$4,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "DESPIECE · COMPONENTES DEL SENSOR ÓPTICO" }), /* @__PURE__ */ jsx("span", { children: "TOCA CADA PARTE" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "row",
					style: {
						gap: 8,
						flexWrap: "wrap"
					},
					children: PARTS.map((pp) => /* @__PURE__ */ jsxs("button", {
						className: `btn ${sel === pp.id ? "is-active" : ""}`,
						style: AX$4,
						onClick: () => setSel(pp.id),
						"aria-pressed": sel === pp.id,
						children: [
							pp.icon,
							" ",
							pp.name
						]
					}, pp.id))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "sim-stage graticule row",
					style: {
						padding: 20,
						flexWrap: "wrap",
						justifyContent: "center"
					},
					children: chain.map((s, i) => /* @__PURE__ */ jsxs("div", {
						className: "row",
						style: { gap: 0 },
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							className: "optical-part",
							style: {
								cursor: s.id === "gap" ? "default" : "pointer",
								textAlign: "center",
								padding: "12px 10px",
								minWidth: 86,
								borderRadius: 6,
								border: `1px solid ${sel === s.id ? "var(--ch-optico)" : "#1c2a3f"}`,
								background: sel === s.id ? "rgba(255,176,32,.09)" : "#0c1524",
								boxShadow: sel === s.id ? "0 0 16px rgba(255,176,32,.25)" : "none",
								transition: "all .2s"
							},
							onClick: () => s.id !== "gap" && setSel(s.id),
							disabled: s.id === "gap",
							"aria-pressed": s.id === "gap" ? void 0 : sel === s.id,
							"aria-label": s.id === "gap" ? "Haz de luz" : `Seleccionar ${s.lbl}`,
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: 20,
									color: "var(--ch-optico)"
								},
								children: s.icon
							}), /* @__PURE__ */ jsx("div", {
								className: "mono",
								style: {
									fontSize: 9.5,
									letterSpacing: ".1em",
									color: "var(--ink-dim)"
								},
								children: s.lbl
							})]
						}), i < 4 && /* @__PURE__ */ jsx("span", {
							style: {
								margin: "0 6px",
								color: "var(--ink-faint)",
								fontFamily: "var(--font-mono)",
								fontSize: 14
							},
							children: "→"
						})]
					}, s.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: {
						alignItems: "center",
						gap: 14
					},
					children: [/* @__PURE__ */ jsx("span", {
						style: {
							fontFamily: "var(--font-display)",
							fontSize: 38,
							color: "var(--ch-optico)"
						},
						children: p.icon
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "mono",
						style: {
							fontWeight: 600,
							letterSpacing: ".04em",
							fontSize: 13
						},
						children: p.name
					}), /* @__PURE__ */ jsxs("p", {
						style: {
							fontSize: 13.5,
							color: "var(--ink-dim)",
							marginTop: 2
						},
						children: [
							p.rol,
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "mono",
								style: {
									color: "var(--ink-faint)",
									fontSize: 11
								},
								children: "—"
							}),
							" ",
							p.det
						]
					})] })]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/OpticalModes.tsx
var MODES = [
	{
		id: "barrera",
		label: "BARRERA DE LUZ",
		range: "hasta 20–270 m",
		note: "Emisor y receptor enfrentados. El objeto corta el haz. Alineación crítica. Ideal para accesos y cintas."
	},
	{
		id: "reflex",
		label: "RETRO-REFLECTIVO",
		range: "1–3 m",
		note: "Emisor y receptor en el mismo cuerpo; un espejo reflector devuelve el haz. Popular y barato, un solo cableado."
	},
	{
		id: "difuso",
		label: "REFLECTIVO DIFUSO",
		range: "12–300 mm",
		note: "Sin espejo: el propio objeto refleja la luz. Distancia corta, pero no necesitas acceder a ambos lados."
	}
];
var VIEW$1 = {
	W: 720,
	H: 300
};
var OBJ_W$1 = 56;
var OBJ_H$1 = 58;
function detected(mode, x) {
	if (mode === "barrera") return x > 120 && x < 600;
	if (mode === "reflex") return x > 200 && x < 560;
	return x < 430;
}
var AX$3 = { "--c": "var(--ch-optico)" };
function OpticalModes() {
	const [mode, setMode] = useState("barrera");
	const [x, setX] = useState(340);
	const [hits, setHits] = useState(0);
	const prevDet = useRef(null);
	const stageRef = useRef(null);
	const M = MODES.find((m) => m.id === mode);
	const det = detected(mode, x);
	useEffect(() => {
		if (prevDet.current === false && det === true && mode !== "difuso") setHits((h) => h + 1);
		prevDet.current = det;
	}, [det, mode]);
	const drag = (clientX) => {
		const r = stageRef.current?.getBoundingClientRect();
		if (!r) return;
		setX(Math.min(VIEW$1.W - 90, Math.max(50, (clientX - r.left) * (VIEW$1.W / r.width))));
	};
	const beamColor = det ? "#7dd3fc" : "#ff5a3c";
	const beamClass = `beam ${det ? "" : "beam-cut"}`;
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX$3,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "BANCO 02 · SENSORES ÓPTICOS — MODO DE DETECCIÓN" }), /* @__PURE__ */ jsxs("span", { children: ["ARRÁSTRALA · ", det ? "HAZ ROMPIDO ► DETECTA" : "HAZ COMPLETO"] })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "row",
					children: MODES.map((m) => /* @__PURE__ */ jsx("button", {
						className: `btn ${mode === m.id ? "is-active" : ""}`,
						style: AX$3,
						onClick: () => setMode(m.id),
						"aria-pressed": mode === m.id,
						children: m.label
					}, m.id))
				}),
				/* @__PURE__ */ jsx("div", {
					ref: stageRef,
					className: "sim-stage graticule drag-zone",
					style: { touchAction: "none" },
					children: /* @__PURE__ */ jsxs("svg", {
						viewBox: `0 0 ${VIEW$1.W} ${VIEW$1.H}`,
						style: {
							width: "100%",
							height: "auto",
							display: "block",
							touchAction: "none"
						},
						onPointerDown: (e) => {
							e.target.setPointerCapture?.(e.pointerId);
							drag(e.clientX);
						},
						onPointerMove: (e) => {
							if (e.buttons > 0) drag(e.clientX);
						},
						children: [
							/* @__PURE__ */ jsx("line", {
								x1: "20",
								y1: "252",
								x2: VIEW$1.W - 20,
								y2: "252",
								stroke: "#22304a",
								strokeWidth: "2"
							}),
							[
								100,
								190,
								280,
								370,
								460,
								550,
								640
							].map((rx) => /* @__PURE__ */ jsx("circle", {
								cx: rx,
								cy: "248",
								r: "5",
								fill: "#0f1b30",
								stroke: "#22304a",
								strokeWidth: "1.5"
							}, rx)),
							mode === "difuso" && /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("polygon", {
								className: "zone-detect",
								points: `80,150 ${VIEW$1.W - 40},40 ${VIEW$1.W - 40},260`
							}), /* @__PURE__ */ jsx("text", {
								x: VIEW$1.W - 56,
								y: "30",
								style: {
									fill: "#8fa3bc",
									fontSize: 11
								},
								className: "mono",
								children: "ZONA ~300mm"
							})] }),
							mode === "reflex" && /* @__PURE__ */ jsxs("g", { children: [
								/* @__PURE__ */ jsx("rect", {
									x: "640",
									y: "120",
									width: "34",
									height: "110",
									rx: "3",
									fill: "#0f1b30",
									stroke: "#33465f",
									strokeWidth: "2"
								}),
								[
									140,
									165,
									190,
									215
								].map((yy) => /* @__PURE__ */ jsx("line", {
									x1: "644",
									y1: yy,
									x2: "670",
									y2: yy,
									stroke: "#ffb020",
									strokeWidth: "1",
									opacity: "0.5"
								}, yy)),
								/* @__PURE__ */ jsx("text", {
									x: "622",
									y: "112",
									style: {
										fill: "#8fa3bc",
										fontSize: 10
									},
									className: "mono",
									children: "ESPEJO"
								})
							] }),
							mode === "barrera" && /* @__PURE__ */ jsxs("g", { children: [
								/* @__PURE__ */ jsx("rect", {
									x: "660",
									y: "150",
									width: "40",
									height: "80",
									rx: "4",
									fill: "#0f1b30",
									stroke: "#33465f",
									strokeWidth: "2"
								}),
								/* @__PURE__ */ jsx("circle", {
									cx: "668",
									cy: "190",
									r: "7",
									fill: "#22304a",
									stroke: det ? "#ff5a3c" : "#3ddc84",
									strokeWidth: "1.5"
								}),
								/* @__PURE__ */ jsx("text", {
									x: "655",
									y: "242",
									style: {
										fill: "#8fa3bc",
										fontSize: 10
									},
									className: "mono",
									children: "R"
								})
							] }),
							/* @__PURE__ */ jsxs("g", { children: [
								/* @__PURE__ */ jsx("rect", {
									x: "40",
									y: "140",
									width: "52",
									height: "100",
									rx: "5",
									fill: "#0f1b30",
									stroke: "#33465f",
									strokeWidth: "2"
								}),
								/* @__PURE__ */ jsx("circle", {
									cx: "64",
									cy: mode === "barrera" ? 190 : 170,
									r: "8",
									fill: "#22304a",
									stroke: "#ffb020",
									strokeWidth: "1.5"
								}),
								/* @__PURE__ */ jsx("text", {
									x: "28",
									y: "252",
									style: {
										fill: "#8fa3bc",
										fontSize: 10
									},
									className: "mono",
									children: mode === "barrera" ? "E" : "E · R"
								})
							] }),
							mode === "barrera" && /* @__PURE__ */ jsx("line", {
								x1: "96",
								y1: "190",
								x2: "656",
								y2: "190",
								stroke: beamColor,
								strokeWidth: "2.5",
								className: beamClass
							}),
							mode === "reflex" && /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("line", {
								x1: "96",
								y1: "160",
								x2: "636",
								y2: "150",
								stroke: beamColor,
								strokeWidth: "2",
								className: beamClass
							}), /* @__PURE__ */ jsx("line", {
								x1: "636",
								y1: "150",
								x2: "100",
								y2: "196",
								stroke: beamColor,
								strokeWidth: "2",
								className: beamClass,
								opacity: "0.8"
							})] }),
							mode === "difuso" && /* @__PURE__ */ jsxs("g", { children: [
								/* @__PURE__ */ jsx("line", {
									x1: "84",
									y1: "170",
									x2: Math.min(x, VIEW$1.W - 40),
									y2: "150",
									stroke: beamColor,
									strokeWidth: "1.5",
									className: beamClass
								}),
								/* @__PURE__ */ jsx("line", {
									x1: "84",
									y1: "170",
									x2: Math.min(x, VIEW$1.W - 40),
									y2: "210",
									stroke: beamColor,
									strokeWidth: "1.5",
									className: beamClass,
									opacity: "0.7"
								}),
								det && /* @__PURE__ */ jsx("line", {
									x1: x,
									y1: "160",
									x2: "92",
									y2: "196",
									stroke: beamColor,
									strokeWidth: "1.5",
									className: beamClass,
									opacity: "0.6"
								})
							] }),
							/* @__PURE__ */ jsxs("g", {
								style: { cursor: "grab" },
								onPointerDown: (e) => {
									e.target.setPointerCapture?.(e.pointerId);
									drag(e.clientX);
								},
								onPointerMove: (e) => {
									if (e.buttons > 0) drag(e.clientX);
								},
								children: [
									/* @__PURE__ */ jsx("ellipse", {
										cx: x + OBJ_W$1 / 2,
										cy: "250",
										rx: "34",
										ry: "5",
										fill: "rgba(0,0,0,.5)"
									}),
									/* @__PURE__ */ jsx("rect", {
										x,
										y: 194,
										width: OBJ_W$1,
										height: OBJ_H$1,
										rx: "4",
										fill: det ? "#1a2b45" : "#11203a",
										stroke: det ? "#ff5a3c" : "#33465f",
										strokeWidth: "2",
										className: det ? "pulse" : ""
									}),
									/* @__PURE__ */ jsx("line", {
										x1: x + 14,
										y1: 202,
										x2: x + 14,
										y2: "250",
										stroke: "#33465f",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ jsx("line", {
										x1: x + 28,
										y1: 202,
										x2: x + 28,
										y2: "250",
										stroke: "#33465f",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ jsx("line", {
										x1: x + 42,
										y1: 202,
										x2: x + 42,
										y2: "250",
										stroke: "#33465f",
										strokeWidth: "2"
									}),
									det && /* @__PURE__ */ jsx("circle", {
										cx: x + OBJ_W$1 / 2,
										cy: "216",
										r: "12",
										fill: "none",
										stroke: "#ff5a3c",
										strokeWidth: "1.5",
										className: "wave-rings",
										style: { transformOrigin: `${x + OBJ_W$1 / 2}px 216px` }
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: {
						display: "grid",
						gridTemplateColumns: "auto 1fr",
						gap: 16,
						alignItems: "center"
					},
					children: [/* @__PURE__ */ jsx("input", {
						type: "range",
						min: "50",
						max: "640",
						value: x,
						style: {
							"--c": "var(--ch-optico)",
							"--fill": `${(x - 50) / 590 * 100}%`
						},
						onChange: (e) => setX(Number(e.target.value)),
						"aria-label": "Posición de la pieza"
					}), /* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: AX$3,
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: mode === "barrera" ? "HAZ" : mode === "reflex" ? "RETORNO DEL HAZ" : "REFLEXIÓN DEL OBJETO"
						}), /* @__PURE__ */ jsx("div", {
							className: "val",
							children: det ? "INTERRUMPIDO — DETECTA" : "COMPLETO — SIN DETECCIÓN"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "sim-legend",
					children: [
						/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { style: { background: "#7dd3fc" } }), "Haz de luz"] }),
						/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { style: { background: "#ff5a3c" } }), "Detección (haz roto)"] }),
						/* @__PURE__ */ jsxs("span", { children: [
							/* @__PURE__ */ jsx("i", {
								className: "dot-sm",
								style: { background: "var(--ok)" }
							}),
							"Piezas contadas: ",
							/* @__PURE__ */ jsx("b", {
								className: "mono",
								style: { color: "var(--ink)" },
								children: hits
							})
						] })
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					children: [
						/* @__PURE__ */ jsxs("b", { children: [
							M.label,
							" · ",
							M.range,
							"."
						] }),
						" ",
						M.note
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/TemperatureLab.tsx
var TABS = [
	{
		id: "rtd",
		label: "RTD · Pt100",
		sub: "Resistencia de platino, casi lineal, precisa hasta 850 °C",
		rango: "-50 … 850 °C",
		min: -50,
		max: 850
	},
	{
		id: "ntc",
		label: "TERMISTOR NTC",
		sub: "Semiconductor: su resistencia BAJA al calentar",
		rango: "0 … 300 °C",
		min: 0,
		max: 300
	},
	{
		id: "ptc",
		label: "TERMISTOR PTC",
		sub: "Semiconductor: su resistencia SUBE al calentar",
		rango: "0 … 300 °C",
		min: 0,
		max: 300
	},
	{
		id: "tc",
		label: "TERMOPAR",
		sub: "Dos metales unidos: generan voltaje por efecto Seebeck",
		rango: "-200 … 1200 °C",
		min: -200,
		max: 1200
	}
];
function rt(T) {
	return 100 * (1 + .00385 * T);
}
function rntc(T) {
	return 1e4 * Math.exp(3950 * (1 / (T + 273.15) - 1 / 298.15));
}
function rptc(T) {
	return 100 + 85 * Math.max(0, T);
}
function vtc(T) {
	return 41e-6 * T;
}
function curve(tab, T) {
	switch (tab) {
		case "rtd": return {
			y: rt(T),
			label: "Ω"
		};
		case "ntc": return {
			y: rntc(T),
			label: "Ω"
		};
		case "ptc": return {
			y: rptc(T),
			label: "Ω"
		};
		case "tc": return {
			y: vtc(T),
			label: "mV"
		};
	}
}
function fmt(v, label) {
	if (label === "mV") return (v * 1e3).toFixed(2) + " mV";
	if (v >= 1e4) return (v / 1e3).toFixed(1) + " kΩ";
	if (v >= 1e3) return v.toFixed(0) + " Ω";
	return v.toFixed(1) + " Ω";
}
function rangeFor(tab) {
	const config = TABS.find((item) => item.id === tab);
	return [config.min, config.max];
}
function pointsFor(tab) {
	const [a, b] = rangeFor(tab);
	const pts = [];
	for (let i = 0; i <= 60; i++) {
		const T = a + (b - a) * i / 60;
		const raw = curve(tab, T).y;
		const y = curve(tab, 20).label === "mV" ? raw : Math.log10(raw + 1);
		pts.push([T, y]);
	}
	const ymin = Math.min(...pts.map((p) => p[1]));
	const ymax = Math.max(...pts.map((p) => p[1]));
	return pts.map(([T, y]) => [T, (y - ymin) / (ymax - ymin || 1)]);
}
var AX$2 = { "--c": "var(--ch-temp)" };
var GW = 380;
var GH = 200;
function TemperatureLab() {
	const [tab, setTab] = useState("ntc");
	const [T, setT] = useState(25);
	const tabMeta = TABS.find((t) => t.id === tab);
	const [a, b] = rangeFor(tab);
	const safeT = Math.min(b, Math.max(a, T));
	const { y, label } = curve(tab, safeT);
	useEffect(() => {
		setT((current) => Math.min(b, Math.max(a, current)));
	}, [a, b]);
	const fill = (safeT - a) / (b - a || 1);
	const over = T < a || T > b;
	const pts = pointsFor(tab);
	const path = pts.map(([tt, yy], i) => `${i === 0 ? "M" : "L"}${((tt - a) / (b - a) * GW).toFixed(1)},${(182 - yy * 154).toFixed(1)}`).join("");
	const px = Math.max(3, Math.min(377, (safeT - a) / (b - a) * GW));
	const idx = Math.min(pts.length - 1, Math.round((safeT - a) / (b - a) * (pts.length - 1)));
	const py = Math.max(3, Math.min(180, 182 - (pts[idx]?.[1] ?? 0) * 154));
	const ticks = Array.from({ length: 5 }, (_, index) => a + (b - a) * index / 4);
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX$2,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "BANCO 03 · TEMPERATURA" }), /* @__PURE__ */ jsxs("span", { children: [tabMeta.rango, " · DOMINIO DEL SENSOR"] })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "row",
					children: TABS.map((t) => /* @__PURE__ */ jsx("button", {
						className: `btn ${tab === t.id ? "is-active" : ""}`,
						style: AX$2,
						onClick: () => setTab(t.id),
						"aria-pressed": tab === t.id,
						children: t.label
					}, t.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "temperature-grid",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "sim-stage graticule col",
						style: {
							padding: "14px 10px",
							alignItems: "center",
							gap: 6
						},
						children: [/* @__PURE__ */ jsxs("svg", {
							viewBox: "0 0 90 250",
							style: {
								width: 80,
								height: "auto"
							},
							children: [
								/* @__PURE__ */ jsx("rect", {
									x: "38",
									y: "12",
									width: "15",
									height: "198",
									rx: "7",
									fill: "#0c1524",
									stroke: "#33465f",
									strokeWidth: "2"
								}),
								/* @__PURE__ */ jsx("rect", {
									x: "41.5",
									y: 212 - fill * 186,
									width: "8",
									height: 8 + fill * 186,
									rx: "4",
									fill: "#ff5a3c",
									style: { transition: "all .5s ease" }
								}),
								/* @__PURE__ */ jsx("circle", {
									cx: "45.5",
									cy: "228",
									r: "13",
									fill: "#ff5a3c",
									style: {
										filter: over || fill > .98 ? "drop-shadow(0 0 10px rgba(255,90,60,.8))" : void 0,
										transition: "filter .3s"
									}
								}),
								ticks.map((v) => {
									const yy = 212 - (v - a) / (b - a) * 186;
									return /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("line", {
										x1: "56",
										y1: yy,
										x2: "62",
										y2: yy,
										stroke: "#8fa3bc",
										strokeWidth: "1"
									}), /* @__PURE__ */ jsx("text", {
										x: "66",
										y: yy + 3,
										style: {
											fill: "#8fa3bc",
											fontSize: 8
										},
										className: "mono",
										children: Math.round(v)
									})] }, v.toFixed(1));
								}),
								/* @__PURE__ */ jsx("text", {
									x: "26",
									y: "250",
									style: {
										fill: "#8fa3bc",
										fontSize: 9
									},
									className: "mono",
									children: "°C"
								})
							]
						}), /* @__PURE__ */ jsx("span", {
							className: "mono",
							style: {
								fontSize: 11,
								color: "var(--ink-faint)"
							},
							children: over ? "FUERA DE ESCALA" : `${a} … ${b} °C`
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "col",
						style: { gap: 14 },
						children: [/* @__PURE__ */ jsxs("div", {
							className: "sim-stage graticule",
							style: { padding: 12 },
							children: [/* @__PURE__ */ jsxs("div", {
								className: "stage-cap",
								children: [/* @__PURE__ */ jsxs("span", { children: [tabMeta.label.toUpperCase(), " · RESPUESTA AL CAMBIO DE TEMP."] }), /* @__PURE__ */ jsxs("span", { children: [
									a,
									"° … ",
									b,
									"°"
								] })]
							}), /* @__PURE__ */ jsxs("svg", {
								viewBox: `0 0 ${GW} ${GH}`,
								style: {
									width: "100%",
									height: "auto"
								},
								role: "img",
								"aria-label": "Curva del sensor",
								children: [
									/* @__PURE__ */ jsx("line", {
										x1: "0",
										x2: GW,
										y1: 180,
										y2: 180,
										stroke: "rgba(120,150,190,.3)",
										strokeWidth: "1"
									}),
									[
										.25,
										.5,
										.75
									].map((f) => /* @__PURE__ */ jsx("line", {
										x1: GW * f,
										x2: GW * f,
										y1: "8",
										y2: 180,
										stroke: "rgba(120,150,190,.09)",
										strokeWidth: "1"
									}, f)),
									/* @__PURE__ */ jsx("path", {
										d: path,
										fill: "none",
										stroke: "var(--ch-temp)",
										strokeWidth: "2.5",
										strokeLinecap: "round",
										className: "trace-draw",
										style: { filter: "drop-shadow(0 0 6px rgba(255,90,60,.5))" }
									}),
									/* @__PURE__ */ jsx("circle", {
										cx: px,
										cy: py,
										r: "5",
										fill: "var(--ch-temp)",
										className: "lamp-glow"
									}),
									/* @__PURE__ */ jsx("line", {
										x1: px,
										x2: px,
										y1: "8",
										y2: 180,
										stroke: "rgba(255,90,60,.4)",
										strokeWidth: "1",
										strokeDasharray: "4 4"
									})
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid-2",
							style: { gap: 12 },
							children: [/* @__PURE__ */ jsxs("div", {
								className: "readout",
								style: AX$2,
								children: [/* @__PURE__ */ jsx("div", {
									className: "lbl",
									children: "TEMPERATURA"
								}), /* @__PURE__ */ jsxs("div", {
									className: "val",
									children: [safeT.toFixed(1), " °C"]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "readout",
								style: AX$2,
								children: [/* @__PURE__ */ jsx("div", {
									className: "lbl",
									children: "SALIDA DEL SENSOR"
								}), /* @__PURE__ */ jsx("div", {
									className: "val",
									children: fmt(y, label)
								})]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "row",
					children: /* @__PURE__ */ jsx("input", {
						type: "range",
						min: a,
						max: b,
						value: safeT,
						style: {
							"--c": "var(--ch-temp)",
							"--fill": `${fill * 100}%`,
							flex: 4,
							minWidth: 200
						},
						onChange: (e) => setT(Number(e.target.value)),
						"aria-label": "Temperatura"
					})
				}),
				tab === "tc" && /* @__PURE__ */ jsxs("div", {
					className: "sim-stage graticule row",
					style: {
						padding: 18,
						gap: 18,
						flexWrap: "wrap"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "row",
							style: { gap: 0 },
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										background: "#5b2c0e",
										color: "#f5d9a8",
										padding: "14px 18px",
										borderRadius: 4,
										textAlign: "center"
									},
									children: [/* @__PURE__ */ jsx("div", {
										className: "mono",
										style: { fontSize: 13 },
										children: "COBRE"
									}), /* @__PURE__ */ jsxs("div", {
										className: "mono",
										style: {
											fontSize: 24,
											fontWeight: 700
										},
										children: [Math.max(0, Math.round(T)), "°"]
									})]
								}),
								/* @__PURE__ */ jsx("div", { style: {
									width: 10,
									height: 10,
									background: "var(--ch-temp)",
									borderRadius: "50%",
									boxShadow: "0 0 12px var(--ch-temp)",
									animation: "pulse 1s infinite",
									margin: "0 -2px"
								} }),
								/* @__PURE__ */ jsxs("div", {
									style: {
										background: "#43464d",
										color: "#cdd3da",
										padding: "14px 18px",
										borderRadius: 4,
										textAlign: "center"
									},
									children: [/* @__PURE__ */ jsx("div", {
										className: "mono",
										style: { fontSize: 13 },
										children: "HIERRO"
									}), /* @__PURE__ */ jsxs("div", {
										className: "mono",
										style: {
											fontSize: 24,
											fontWeight: 700
										},
										children: [Math.max(0, Math.round(T)), "°"]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grow",
							style: {
								minWidth: 180,
								fontSize: 13.5,
								color: "var(--ink-dim)"
							},
							children: [
								/* @__PURE__ */ jsx("b", {
									style: { color: "var(--ink)" },
									children: "Efecto Seebeck:"
								}),
								" la unión caliente libera electrones que migran al metal frío. La diferencia de potencial resultante ",
								/* @__PURE__ */ jsxs("span", {
									className: "mono",
									style: { color: "var(--ch-temp)" },
									children: ["V ≈ ", fmt(y, label)]
								}),
								" se mide en un voltímetro. A más temperatura, más energía de los electrones (míralos agitarse)."
							]
						}),
						/* @__PURE__ */ jsxs("svg", {
							viewBox: "0 0 120 46",
							style: { width: 120 },
							children: [
								Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx("circle", {
									cx: 18 + i * 12,
									cy: 12,
									r: "2.2",
									fill: "#ffd9a0",
									style: { animation: `electron ${Math.max(.3, 1.6 - T / 500)}s ease-in-out ${i * .13}s infinite alternate` }
								}, i)),
								/* @__PURE__ */ jsx("rect", {
									x: "10",
									y: "22",
									width: "100",
									height: "3",
									rx: "1.5",
									fill: "#ff5a3c",
									opacity: ".7"
								}),
								/* @__PURE__ */ jsx("text", {
									x: "10",
									y: "42",
									style: {
										fill: "#8fa3bc",
										fontSize: 8
									},
									className: "mono",
									children: "JUNCIÓN CALIENTE →"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					children: [
						/* @__PURE__ */ jsxs("b", { children: [tabMeta.label, "."] }),
						" ",
						tabMeta.sub,
						". La lectura es lo que entregará al controlador."
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/PressureLab.tsx
var MTYPES = [
	{
		id: "rel",
		label: "SOBREPRESIÓN",
		sub: "Mide contra la presión atmosférica (~101 kPa). La del manómetro de tu inflador."
	},
	{
		id: "abs",
		label: "PRESIÓN ABSOLUTA",
		sub: "Mide contra el vacío total. Es la presión real del fluido, sin restar la atmósfera."
	},
	{
		id: "diff",
		label: "PRESIÓN DIFERENCIAL",
		sub: "Mide la diferencia entre dos puntos. Suele usarse para caudal por caída de presión."
	}
];
var P_MAX = 400;
function polar(cx, cy, r, deg) {
	const rad = deg * Math.PI / 180;
	return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}
var AX$1 = { "--c": "var(--ch-pres)" };
function PressureLab() {
	const [P, setP] = useState(150);
	const [type, setType] = useState("rel");
	const ang = 135 + P / P_MAX * 270;
	const absVal = P + 101.3;
	const diffOther = 60;
	const C = {
		x: 130,
		y: 128
	};
	const r = 44 + P / P_MAX * 70;
	const s = 150, e = 270 + P / P_MAX * 190;
	const bPath = (rIn, rOut) => {
		const [x1, y1] = polar(C.x, C.y, rOut, s);
		const [x2, y2] = polar(C.x, C.y, rOut, e);
		const [x3, y3] = polar(C.x, C.y, rIn, e);
		const [x4, y4] = polar(C.x, C.y, rIn, s);
		const large = e - s > 180 ? 1 : 0;
		return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rOut} ${rOut} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} A ${rIn} ${rIn} 0 ${large} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z`;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX$1,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "BANCO 04 · PRESIÓN" }), /* @__PURE__ */ jsxs("span", { children: ["UNIT: kPa · RANGO 0–", P_MAX] })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "row",
					children: MTYPES.map((t) => /* @__PURE__ */ jsx("button", {
						className: `btn ${type === t.id ? "is-active" : ""}`,
						style: AX$1,
						onClick: () => setType(t.id),
						"aria-pressed": type === t.id,
						children: t.label
					}, t.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "pressure-grid",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "sim-stage graticule col",
						style: {
							padding: 16,
							alignItems: "center",
							gap: 10
						},
						children: [/* @__PURE__ */ jsxs("svg", {
							viewBox: "0 0 260 170",
							style: {
								width: "min(300px,100%)",
								height: "auto"
							},
							children: [
								[
									{
										from: 135,
										to: 220,
										color: "rgba(255,176,32,.13)"
									},
									{
										from: 220,
										to: 345,
										color: "rgba(61,220,132,.13)"
									},
									{
										from: 345,
										to: 405,
										color: "rgba(255,90,60,.13)"
									}
								].map((z) => {
									const arc = (rad, f, t) => {
										const [x1, y1] = polar(130, 130, rad, f);
										const [x2, y2] = polar(130, 130, rad, t);
										const big = t - f > 180 ? 1 : 0;
										return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rad} ${rad} 0 ${big} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
									};
									return /* @__PURE__ */ jsx("path", {
										d: arc(92, z.from, z.to),
										fill: "none",
										stroke: z.color,
										strokeWidth: "16",
										strokeLinecap: "butt"
									}, z.from);
								}),
								Array.from({ length: 11 }).map((_, i) => {
									const a = 135 + i / 10 * 270;
									const [x1, y1] = polar(130, 130, 76, a);
									const [x2, y2] = polar(130, 130, 86, a);
									const [lx, ly] = polar(130, 130, 58, a);
									return /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("line", {
										x1,
										y1,
										x2,
										y2,
										stroke: "#8fa3bc",
										strokeWidth: "1.5"
									}), /* @__PURE__ */ jsx("text", {
										x: lx,
										y: ly + 3,
										textAnchor: "middle",
										className: "mono",
										style: {
											fill: "#8fa3bc",
											fontSize: 9
										},
										children: i * 40
									})] }, i);
								}),
								/* @__PURE__ */ jsx("text", {
									x: "130",
									y: "44",
									textAnchor: "middle",
									className: "mono",
									style: {
										fill: "#8fa3bc",
										fontSize: 9,
										letterSpacing: ".2em"
									},
									children: "kPa"
								}),
								/* @__PURE__ */ jsxs("g", {
									style: {
										transform: `translate(130px,130px) rotate(${ang}deg)`,
										transformOrigin: "0 0",
										transition: "transform .4s cubic-bezier(.3,.8,.3,1)"
									},
									children: [/* @__PURE__ */ jsx("line", {
										x1: "0",
										y1: "6",
										x2: "0",
										y2: "-78",
										stroke: "#38bdf8",
										strokeWidth: "2.5",
										strokeLinecap: "round",
										style: { filter: "drop-shadow(0 0 4px rgba(56,189,248,.8))" }
									}), /* @__PURE__ */ jsx("circle", {
										cx: "0",
										cy: "0",
										r: "7",
										fill: "#0f1b30",
										stroke: "#38bdf8",
										strokeWidth: "2"
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "row",
							style: {
								gap: 12,
								flexWrap: "wrap",
								justifyContent: "center"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "readout",
									style: {
										...AX$1,
										minWidth: 120
									},
									children: [/* @__PURE__ */ jsx("div", {
										className: "lbl",
										children: type === "abs" ? "PRESIÓN ABSOLUTA" : type === "diff" ? "PUERTO A" : "SOBREPRESIÓN"
									}), /* @__PURE__ */ jsxs("div", {
										className: "val",
										children: [type === "abs" ? absVal.toFixed(1) : P, " kPa"]
									})]
								}),
								type === "abs" && /* @__PURE__ */ jsxs("div", {
									className: "readout",
									style: {
										...AX$1,
										minWidth: 120
									},
									children: [/* @__PURE__ */ jsx("div", {
										className: "lbl",
										children: "EQUIVALE A SOBREPRESIÓN"
									}), /* @__PURE__ */ jsxs("div", {
										className: "val",
										children: [P, " kPa"]
									})]
								}),
								type === "diff" && /* @__PURE__ */ jsxs("div", {
									className: "readout",
									style: {
										...AX$1,
										minWidth: 120
									},
									children: [/* @__PURE__ */ jsx("div", {
										className: "lbl",
										children: "PUERTO B (REF.) · ΔP"
									}), /* @__PURE__ */ jsxs("div", {
										className: "val",
										children: [P - diffOther >= 0 ? `+${P - diffOther}` : P - diffOther, " kPa"]
									})]
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "sim-stage graticule col",
						style: {
							padding: 16,
							alignItems: "center",
							gap: 8
						},
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "mono-label",
								style: { alignSelf: "flex-start" },
								children: [
									"TUBO DE BOURDON · ",
									P,
									" kPa"
								]
							}),
							/* @__PURE__ */ jsxs("svg", {
								viewBox: "0 0 260 200",
								style: {
									width: "min(300px,100%)",
									height: "auto"
								},
								children: [
									/* @__PURE__ */ jsx("line", {
										x1: C.x - 10,
										x2: C.x + 10,
										y1: "168",
										y2: "168",
										stroke: "#22304a",
										strokeWidth: "3"
									}),
									/* @__PURE__ */ jsx("rect", {
										x: C.x - 9,
										y: "150",
										width: "18",
										height: "20",
										fill: "#0f1b30",
										stroke: "#33465f",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ jsx("path", {
										d: bPath(r, r + 13),
										fill: "#0f1b30",
										stroke: "#38bdf8",
										strokeWidth: "2",
										className: "lamp-glow",
										style: {
											transition: "all .4s cubic-bezier(.3,.8,.3,1)",
											filter: `drop-shadow(0 0 ${4 + P / 80}px rgba(56,189,248,.5))`
										}
									}),
									(() => {
										const [tx, ty] = polar(C.x, C.y, r + 13, e);
										return /* @__PURE__ */ jsx("circle", {
											cx: tx,
											cy: ty,
											r: "3",
											fill: "#38bdf8",
											className: "lamp-glow"
										});
									})(),
									/* @__PURE__ */ jsx("circle", {
										cx: C.x,
										cy: C.y,
										r: "4",
										fill: "#22304a",
										stroke: "#33465f",
										strokeWidth: "1.5"
									}),
									/* @__PURE__ */ jsx("text", {
										x: "14",
										y: "192",
										className: "mono",
										style: {
											fill: "#8fa3bc",
											fontSize: 9
										},
										children: "LA PRESIÓN ENDEREZA EL TUBO →"
									})
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mono-label",
								style: {
									color: "var(--ink-dim)",
									fontSize: 13,
									maxWidth: 36,
									textAlign: "center"
								},
								children: [
									"El tubo curvo tiende a ",
									/* @__PURE__ */ jsx("b", {
										style: { color: "var(--ink)" },
										children: "enderezarse"
									}),
									" al subir la presión; ese movimiento acciona la aguja o una galga."
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					children: [/* @__PURE__ */ jsx("input", {
						type: "range",
						min: "0",
						max: P_MAX,
						value: P,
						style: {
							"--c": "var(--ch-pres)",
							"--fill": `${P / P_MAX * 100}%`,
							flex: 1,
							minWidth: 220
						},
						onChange: (e) => setP(Number(e.target.value)),
						"aria-label": "Presión"
					}), /* @__PURE__ */ jsxs("span", {
						className: "chip",
						children: [
							"P = ",
							P,
							" kPa"
						]
					})]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					children: [
						/* @__PURE__ */ jsxs("b", { children: [MTYPES.find((t) => t.id === type).label, ":"] }),
						" ",
						MTYPES.find((t) => t.id === type).sub
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/sims/ProximityLab.tsx
var SENSORS = [
	{
		id: "mec",
		label: "FIN DE CARRERA",
		prin: "CONTACTO FÍSICO",
		maxim: 155
	},
	{
		id: "ind",
		label: "INDUCTIVO",
		prin: "CAMPO MAGNÉTICO OSCILANTE",
		maxim: 270
	},
	{
		id: "cap",
		label: "CAPACITIVO",
		prin: "CAMPO ELÉCTRICO",
		maxim: 240
	},
	{
		id: "fot",
		label: "FOTOELÉCTRICO",
		prin: "HAZ DE LUZ IR",
		maxim: 330
	},
	{
		id: "ult",
		label: "ULTRASÓNICO",
		prin: "ECO DE SONIDO",
		maxim: 380
	},
	{
		id: "mag",
		label: "MAGNÉTICO",
		prin: "CAMPO DE IMÁN",
		maxim: 310
	}
];
var MATERIALS = [
	{
		id: "metal",
		label: "METAL",
		fill: "#8b9bb4",
		stroke: "#c7d3e4"
	},
	{
		id: "plast",
		label: "PLÁSTICO",
		fill: "#e07a3f",
		stroke: "#ffb020"
	},
	{
		id: "vidrio",
		label: "VIDRIO",
		fill: "#2e4a63",
		stroke: "#7dd3fc"
	},
	{
		id: "madera",
		label: "MADERA",
		fill: "#8a6238",
		stroke: "#c9a227"
	},
	{
		id: "iman",
		label: "IMÁN",
		fill: "#a0405a",
		stroke: "#f472b6"
	},
	{
		id: "agua",
		label: "AGUA",
		fill: "#1c4f6e",
		stroke: "#38bdf8"
	}
];
var OBJ_W = 52;
var OBJ_H = 54;
var VIEW = {
	W: 720,
	H: 300
};
var AX = { "--c": "var(--ch-prox)" };
function ProximityLab() {
	const [sensor, setSensor] = useState("ind");
	const [mat, setMat] = useState("metal");
	const [x, setX] = useState(420);
	const stageRef = useRef(null);
	const S = SENSORS.find((s) => s.id === sensor);
	const M = MATERIALS.find((m) => m.id === mat);
	let range = S.maxim;
	if (sensor === "cap" && mat !== "metal" && mat !== "agua") range = 200;
	if (sensor === "ind" && mat !== "metal") range = -1;
	const det = sensor === "mec" ? x < range : range > 0 && x < range;
	const dist = Math.max(0, Math.min(500, Math.round((x - 84) / (VIEW.W - 170) * 500)));
	const drag = (clientX) => {
		const r = stageRef.current?.getBoundingClientRect();
		if (!r) return;
		setX(Math.min(VIEW.W - 90, Math.max(100, (clientX - r.left) * (VIEW.W / r.width))));
	};
	const fc = sensor === "ind" ? "#3ddc84" : sensor === "cap" ? "#9b8cff" : sensor === "fot" ? "#ffb020" : sensor === "ult" ? "#7dd3fc" : sensor === "mag" ? "#38bdf8" : "#8fa3bc";
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: "BANCO 05 · PROXIMIDAD — SELECTOR DE SENSOR × MATERIAL" }), /* @__PURE__ */ jsx("span", { children: det ? "● DETECTADO" : "○ SIN DETECCIÓN" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "row",
					style: {
						gap: 8,
						flexWrap: "wrap"
					},
					children: SENSORS.map((s) => /* @__PURE__ */ jsx("button", {
						className: `btn ${sensor === s.id ? "is-active" : ""}`,
						style: AX,
						onClick: () => setSensor(s.id),
						"aria-pressed": sensor === s.id,
						children: s.label
					}, s.id))
				}),
				/* @__PURE__ */ jsx("div", {
					ref: stageRef,
					className: "sim-stage graticule drag-zone",
					style: { touchAction: "none" },
					children: /* @__PURE__ */ jsxs("svg", {
						viewBox: `0 0 ${VIEW.W} ${VIEW.H}`,
						style: {
							width: "100%",
							height: "auto",
							display: "block",
							touchAction: "none"
						},
						onPointerDown: (e) => {
							e.target.setPointerCapture?.(e.pointerId);
							drag(e.clientX);
						},
						onPointerMove: (e) => {
							if (e.buttons > 0) drag(e.clientX);
						},
						children: [
							/* @__PURE__ */ jsx("line", {
								x1: "16",
								y1: "252",
								x2: VIEW.W - 16,
								y2: "252",
								stroke: "#22304a",
								strokeWidth: "3"
							}),
							[
								90,
								170,
								250,
								330,
								410,
								490,
								570,
								650
							].map((rx) => /* @__PURE__ */ jsx("circle", {
								cx: rx,
								cy: "248",
								r: "4",
								fill: "#0f1b30",
								stroke: "#22304a",
								strokeWidth: "1.5"
							}, rx)),
							range > 0 && /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("line", {
								x1: range,
								y1: "60",
								x2: range,
								y2: "250",
								stroke: fc,
								strokeWidth: "1",
								strokeDasharray: "5 5",
								opacity: "0.7"
							}), /* @__PURE__ */ jsxs("text", {
								x: range + 6,
								y: "72",
								className: "mono",
								style: {
									fill: fc,
									fontSize: 10
								},
								children: [
									"ALCANCE ~",
									(range / 3).toFixed(0),
									"cm"
								]
							})] }),
							sensor === "ind" && /* @__PURE__ */ jsx("g", {
								stroke: "#3ddc84",
								fill: "none",
								strokeWidth: "1.5",
								className: "field-lines",
								opacity: "0.8",
								children: [
									0,
									12,
									24
								].map((dy) => /* @__PURE__ */ jsx("ellipse", {
									cx: "110",
									cy: 185 + dy * 2,
									rx: 140 - dy * 2,
									ry: 42 + dy
								}, dy))
							}),
							sensor === "cap" && /* @__PURE__ */ jsx("g", {
								stroke: "#9b8cff",
								fill: "none",
								strokeWidth: "1.5",
								className: "field-lines",
								opacity: "0.85",
								children: [
									0,
									10,
									20
								].map((dy) => /* @__PURE__ */ jsx("ellipse", {
									cx: "118",
									cy: 175 + dy * 3,
									rx: 150 - dy * 3,
									ry: 55 + dy
								}, dy))
							}),
							sensor === "fot" && /* @__PURE__ */ jsx("polygon", {
								className: "zone-detect",
								points: `92,150 ${range + 60},46 ${range + 60},256`
							}),
							sensor === "ult" && /* @__PURE__ */ jsx("g", { children: [
								1,
								2,
								3,
								4
							].map((i) => /* @__PURE__ */ jsx("circle", {
								cx: "110",
								cy: "180",
								r: 18 + i * 34,
								fill: "none",
								stroke: "#7dd3fc",
								strokeWidth: "1",
								opacity: .6 - i * .1,
								className: i <= 2 ? "wave-rings" : "",
								style: i <= 2 ? { transformOrigin: "110px 180px" } : void 0
							}, i)) }),
							sensor === "mag" && /* @__PURE__ */ jsx("g", {
								stroke: "#38bdf8",
								fill: "none",
								strokeWidth: "1.5",
								className: "field-lines",
								opacity: "0.8",
								children: [
									0,
									11,
									22
								].map((dy) => /* @__PURE__ */ jsx("ellipse", {
									cx: "120",
									cy: 170 + dy * 3,
									rx: 150 - dy * 4,
									ry: 50 + dy
								}, dy))
							}),
							/* @__PURE__ */ jsx("rect", {
								x: "38",
								y: "120",
								width: "46",
								height: sensor === "mec" ? 70 : 90,
								rx: "5",
								fill: "#0f1b30",
								stroke: sensor === "mec" ? "#8fa3bc" : fc,
								strokeWidth: "2"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "61",
								cy: sensor === "mec" ? 158 : 165,
								r: "8",
								fill: "#22304a",
								stroke: sensor === "mec" ? "#8fa3bc" : fc,
								strokeWidth: "1.5"
							}),
							sensor === "mec" && /* @__PURE__ */ jsxs("g", {
								style: {
									transform: `rotate(${det ? -34 : 22}deg)`,
									transformOrigin: "84px 224px",
									transition: "transform .3s"
								},
								children: [/* @__PURE__ */ jsx("line", {
									x1: "84",
									y1: "224",
									x2: "118",
									y2: "196",
									stroke: "#8fa3bc",
									strokeWidth: "4",
									strokeLinecap: "round"
								}), /* @__PURE__ */ jsx("circle", {
									cx: "118",
									cy: "196",
									r: "6",
									fill: "#0f1b30",
									stroke: "#8fa3bc",
									strokeWidth: "2"
								})]
							}),
							/* @__PURE__ */ jsx("text", {
								x: "34",
								y: "110",
								className: "mono",
								style: {
									fill: sensor === "mec" ? "#8fa3bc" : fc,
									fontSize: 9.5,
									letterSpacing: ".1em"
								},
								children: S.label
							}),
							/* @__PURE__ */ jsxs("g", {
								style: { cursor: "grab" },
								children: [
									/* @__PURE__ */ jsx("ellipse", {
										cx: x + OBJ_W / 2,
										cy: "250",
										rx: "30",
										ry: "5",
										fill: "rgba(0,0,0,.5)"
									}),
									/* @__PURE__ */ jsx("rect", {
										x,
										y: 198,
										width: OBJ_W,
										height: OBJ_H,
										rx: "5",
										fill: M.fill,
										stroke: M.stroke,
										strokeWidth: "2",
										opacity: mat === "vidrio" ? .55 : 1,
										className: det ? "pulse" : ""
									}),
									mat === "iman" && /* @__PURE__ */ jsxs("g", {
										transform: `translate(${x + 10},206)`,
										children: [
											/* @__PURE__ */ jsx("rect", {
												width: "18",
												height: "18",
												rx: "2",
												fill: "#e11d48"
											}),
											/* @__PURE__ */ jsx("rect", {
												x: "18",
												width: "18",
												height: "18",
												rx: "2",
												fill: "#164e63"
											}),
											/* @__PURE__ */ jsx("text", {
												x: "8",
												y: "13",
												className: "mono",
												style: {
													fill: "#fff",
													fontSize: 8
												},
												children: "N"
											}),
											/* @__PURE__ */ jsx("text", {
												x: "26",
												y: "13",
												className: "mono",
												style: {
													fill: "#fff",
													fontSize: 8
												},
												children: "S"
											})
										]
									}),
									mat === "agua" && /* @__PURE__ */ jsxs("g", {
										transform: `translate(${x + 8},206)`,
										children: [/* @__PURE__ */ jsx("path", {
											d: "M0 14 Q 9 -6 18 14 Z",
											fill: "#38bdf8",
											opacity: "0.85"
										}), [
											4,
											10,
											16
										].map((xx) => /* @__PURE__ */ jsx("line", {
											x1: xx,
											y1: "16",
											x2: xx,
											y2: "30",
											stroke: "#7dd3fc",
											strokeWidth: "1.5",
											opacity: "0.7"
										}, xx))]
									}),
									det && /* @__PURE__ */ jsx("circle", {
										cx: x + OBJ_W / 2,
										cy: "214",
										r: "12",
										fill: "none",
										stroke: "#3ddc84",
										strokeWidth: "1.5",
										className: "wave-rings",
										style: { transformOrigin: `${x + OBJ_W / 2}px 214px` }
									}),
									/* @__PURE__ */ jsx("text", {
										x: x + OBJ_W / 2,
										y: "278",
										textAnchor: "middle",
										className: "mono obj-label",
										style: { fill: M.stroke },
										children: M.label
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: AX,
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "ESTADO"
						}), /* @__PURE__ */ jsx("div", {
							className: "val",
							style: {
								color: det ? "var(--ok)" : "var(--err)",
								textShadow: `0 0 12px ${det ? "rgba(61,220,132,.55)" : "rgba(255,90,60,.55)"}`
							},
							children: det ? "● DETECTADO" : "○ SIN DETECCIÓN"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "readout",
						style: AX,
						children: [/* @__PURE__ */ jsx("div", {
							className: "lbl",
							children: "DISTANCIA ESTIMADA"
						}), /* @__PURE__ */ jsxs("div", {
							className: "val",
							children: [dist, " mm"]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row",
					style: {
						gap: 8,
						flexWrap: "wrap",
						alignItems: "center"
					},
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "mono-label",
							style: { marginRight: 4 },
							children: "MATERIAL:"
						}),
						MATERIALS.map((m) => /* @__PURE__ */ jsx("button", {
							className: `btn ${mat === m.id ? "is-active" : ""}`,
							style: AX,
							onClick: () => setMat(m.id),
							"aria-pressed": mat === m.id,
							children: m.label
						}, m.id)),
						/* @__PURE__ */ jsx("input", {
							type: "range",
							min: "100",
							max: "640",
							value: x,
							style: {
								"--c": "var(--ch-prox)",
								"--fill": `${(x - 100) / 540 * 100}%`,
								flex: 1,
								minWidth: 180
							},
							onChange: (e) => setX(Number(e.target.value)),
							"aria-label": "Posición del objeto"
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "sim-note",
					children: [
						/* @__PURE__ */ jsxs("b", { children: [
							S.label,
							" · ",
							S.prin,
							"."
						] }),
						" ",
						sensor === "ind" && (mat === "metal" ? " El campo oscilante detecta al metal: ¡señal!" : " Solo reacciona a metales. ¡Cambia el material!"),
						sensor === "cap" && (mat === "metal" || mat === "agua" ? " El agua y el metal tienen alta constante dieléctrica." : " Los materiales no conductores funcionan con menor alcance."),
						sensor === "fot" && " El objeto refleja el haz infrarrojo: casi cualquier sólido opaco. ",
						sensor === "ult" && " Eco regresa de cualquier superficie que refleje sonido: sólidos y líquidos. ",
						sensor === "mag" && (mat === "iman" ? " El imán permanente acciona la conmutación magnética." : " Solo responde a imanes. ¿Qué objeto es magnético?"),
						sensor === "mec" && (det ? "¡Contacto! El brazo conmuta." : " Acerca el objeto hasta tocar el brazo mecánico.")
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const floor = [
		{
			icon: "◃",
			lbl: "Entrada física",
			sub: "luz · temp · presión · distancia"
		},
		{
			icon: "⛁",
			lbl: "Elemento sensor",
			sub: "responde al cambio físico"
		},
		{
			icon: "∿",
			lbl: "Acondicionamiento",
			sub: "amplifica y adapta la señal"
		},
		{
			icon: "▣",
			lbl: "Controlador",
			sub: "Arduino, PIC o PLC"
		}
	];
	const caracteristicas = [
		{
			sym: "≈",
			t: "Exactitud",
			d: "El valor medido se acerca al valor verdadero; los errores sistemáticos tienden a cero."
		},
		{
			sym: "◌",
			t: "Precisión",
			d: "Los errores aleatorios entre mediciones repetidas son pequeños: mide siempre parecido."
		},
		{
			sym: "⇄",
			t: "Rango",
			d: "Debe poder medir con exactitud y precisión un amplio abanico de valores de la magnitud."
		},
		{
			sym: "⚡",
			t: "Velocidad de respuesta",
			d: "Reacciona en el menor tiempo posible al cambio de la variable. Ideal: respuesta instantánea."
		},
		{
			sym: "∅",
			t: "Offset",
			d: "Valor de salida cuando la variable de entrada es nula (cero). Hay que calibrarlo."
		},
		{
			sym: "△",
			t: "Sensibilidad",
			d: "Cuánto cambia la salida por cada cambio de la entrada. A mayor sensibilidad, menor cambio detectable."
		}
	];
	const tiposProx = [
		{
			t: "Fin de carrera",
			d: "Interruptor mecánico de posición: conmuta al ser accionado físicamente. Simple y confiable en máquinas fijas (ascensores, robots).",
			icon: "⇋"
		},
		{
			t: "Capacitivo",
			d: "Señala cambios en un campo eléctrico: la capacitancia depende de la constante dieléctrica, masa, tamaño y distancia del objeto. Detecta metálicos y no metálicos, líquidos, polvos y granos. Usa un oscilador RC regulable.",
			icon: "⦿"
		},
		{
			t: "Inductivo",
			d: "Genera un campo magnético oscilante y detecta las pérdidas de corriente al acercarse objetos férricos y no férricos. Metales únicamente.",
			icon: "⍟"
		},
		{
			t: "Fotoeléctrico",
			d: "Emisor de infrarrojos + fototransistor o fotodiodo. La señal puede codificarse para distinguir varios sensores a la vez (muy usado en robótica).",
			icon: "◪"
		},
		{
			t: "Ultrasónico",
			d: "Emite impulsos y mide el tiempo de vuelo del eco: hasta 8 m, solo en aire, y requiere superficies que reflejen el sonido (sólidos, líquidos, polvos).",
			icon: ")))"
		},
		{
			t: "Magnético",
			d: "Conmuta con imanes permanentes. Grandes distancias con sensores pequeños; el campo atraviesa materiales no magnéticos y se transmite con hierro.",
			icon: "℧"
		}
	];
	const comparativa = [
		{
			s: "Óptico — barrera",
			p: "Interrupción del haz",
			m: "Cualquier objeto opaco",
			rango: "hasta 20–270 m",
			v: "Mayor alcance",
			d: "Alineación crítica, cableado doble"
		},
		{
			s: "Óptico — retro-reflectivo",
			p: "Haz + espejo",
			m: "Cualquier objeto opaco",
			rango: "1–3 m",
			v: "Barato, un solo cuerpo",
			d: "Falla con objetos muy brillantes"
		},
		{
			s: "Óptico — difuso",
			p: "Reflexión en el objeto",
			m: "Objetos poco brillantes",
			rango: "12–300 mm",
			v: "Un solo lado, fácil de instalar",
			d: "Distancia muy corta"
		},
		{
			s: "Temperatura — termopar",
			p: "Efecto Seebeck (voltaje)",
			m: "Temperatura",
			rango: "muy amplio",
			v: "Preciso y económico",
			d: "Señal en µV, frágil ante ruido"
		},
		{
			s: "Temperatura — RTD Pt100",
			p: "Resistencia del platino",
			m: "Temperatura",
			rango: "hasta 850 °C",
			v: "Lineal y preciso",
			d: "Más caro, necesita corriente"
		},
		{
			s: "Temperatura — termistor",
			p: "Resistencia del semiconductor",
			m: "Temperatura",
			rango: "hasta ~300 °C",
			v: "Muy sensible (~200 Ω/°C)",
			d: "Rango corto, no lineal"
		},
		{
			s: "Presión — mecánico",
			p: "Columna o deformación",
			m: "Fluidos",
			rango: "según diáfragma",
			v: "Simple, sin alimentación",
			d: "Sin señal eléctrica directa"
		},
		{
			s: "Presión — electromecánico",
			p: "Galga / cristal (puente)",
			m: "Fluidos y sólidos",
			rango: "mV hasta MPa",
			v: "Salida eléctrica, precisa",
			d: "Necesita acondicionamiento"
		},
		{
			s: "Proximidad — inductivo",
			p: "Campo magnético",
			m: "Metales",
			rango: "~mm a cm",
			v: "Robusto, sin contacto",
			d: "Solo metales"
		},
		{
			s: "Proximidad — capacitivo",
			p: "Campo eléctrico",
			m: "Metálicos y no metálicos",
			rango: "~mm",
			v: "Detecta casi todo",
			d: "Alcance corto"
		},
		{
			s: "Proximidad — ultrasónico",
			p: "Tiempo de eco",
			m: "Sólidos y líquidos",
			rango: "hasta 8 m",
			v: "Mide distancia real",
			d: "Solo en aire"
		},
		{
			s: "Proximidad — magnético",
			p: "Campo de imán",
			m: "Imanes",
			rango: "cm a m",
			v: "Gran distancia en tamaño pequeño",
			d: "Solo responde a imanes"
		}
	];
	const glosario = [
		{
			t: "Sensor",
			d: "Elemento que produce una señal relacionada con la cantidad que se está midiendo. Un sensor es un transductor orientado a medir."
		},
		{
			t: "Transductor",
			d: "Elemento que, al someterlo a un cambio físico, experimenta un cambio relacionado (ej. el tubo de Bourdon se deforma con la presión)."
		},
		{
			t: "Señal analógica",
			d: "Variable continua con infinitos valores intermedios (temperatura, luz, presión, humedad)."
		},
		{
			t: "Señal digital",
			d: "Estados discretos: encendido/apagado. Se usa para cronometrar o señalar acontecimientos."
		},
		{
			t: "NTC",
			d: "Termistor de coeficiente negativo: su resistencia disminuye al aumentar la temperatura."
		},
		{
			t: "PTC",
			d: "Termistor de coeficiente positivo: su resistencia aumenta con la temperatura."
		},
		{
			t: "Efecto Seebeck",
			d: "Dos metales distintos unidos generan un voltaje proporcional a la temperatura de la unión. Base del termopar."
		},
		{
			t: "RTD",
			d: "Detector de temperatura por resistencia (platino, Pt100). Su resistencia cambia de forma casi lineal con la temperatura."
		},
		{
			t: "Galga extensiométrica",
			d: "Resistencia cuya deformación mecánica (por presión o fuerza) cambia su valor eléctrico. Se usa en puentes de Wheatstone."
		},
		{
			t: "Constante dieléctrica",
			d: "Capacidad de un material de concentrar campo eléctrico. Los sensores capacitivos la usan para detectar masa, tamaño y distancia."
		},
		{
			t: "Tiempo de vuelo",
			d: "Tiempo que tarda el eco (sonido o luz) en regresar al sensor. Con él se calcula la distancia."
		},
		{
			t: "Offset",
			d: "Valor de salida del sensor cuando la entrada es nula. Toda instrumentación se calibra compensándolo."
		}
	];
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "theme": "tema-1" }, { "default": ($$result) => renderTemplate`  ${maybeRenderHead($$result)}<section class="hero"> <div class="container hero-grid"> <div> <p class="eyebrow rv" style="margin-bottom:18px">SISTEMAS PROGRAMABLES · TEMA I · ANTOLOGÍA UNIDAD 1</p> <h1 class="hero-title rv" style="--d:.05s"> <span class="t1">SENSORES</span><br> <span class="t2">EN VIVO</span> </h1> <p class="hero-lede rv" style="--d:.12s">
No es un apunte con dibujos: es un <strong>banco de pruebas</strong>. Cada sección es un canal de
          instrumento que puedes operar — dispara señales, arrastra piezas y mira cómo el mundo físico
          se convierte en voltaje.
</p> <div class="hero-actions rv" style="--d:.18s"> <a class="btn is-active" style="--c:var(--ch-intro);display:inline-block" href="#ch01">▼ ENTRAR AL BANCO</a> <a class="btn" style="display:inline-block" href="#ch02">PROBAR ÓPTICOS</a> </div> <div class="sim-legend rv" style="--d:.24s;margin-top:26px"> <span><i style="background:var(--ch-intro)"></i>CH01 Sensor</span> <span><i style="background:var(--ch-optico)"></i>CH02 Ópticos</span> <span><i style="background:var(--ch-temp)"></i>CH03 Temp.</span> <span><i style="background:var(--ch-pres)"></i>CH04 Presión</span> <span><i style="background:var(--ch-prox)"></i>CH05 Prox.</span> </div> </div> <div class="rv" style="--d:.1s"> ${renderComponent($$result, "SignalVisualizer", SignalVisualizer, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/SignalVisualizer.tsx",
		"client:component-export": "default"
	})} </div> </div> </section>  <section class="section" id="ch01" style="--c: var(--ch-intro)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">CH01 · DEFINICIÓN</span> <h2 class="channel-title">El sensor</h2> </div> <p class="channel-sub rv">
Según <strong>W. Bolton</strong>, un sensor es <em>un elemento que produce una señal relacionada con la
        cantidad que se está midiendo</em>. Un transductor es el elemento que experimenta un cambio relacionado
        con la magnitud física — <strong>los sensores son transductores</strong> orientados a medir. Todo sensor
        sigue después una etapa de acondicionamiento y amplificación para ajustar su señal al controlador.
</p> <div class="grid-4 rv" style="margin-bottom:clamp(24px,4vw,40px)"> ${floor.map((f, i) => renderTemplate`<div class="panel"> <div class="panel-tag"><span>${String(i + 1).padStart(2, "0")}/04</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:4px;padding:16px"> <span style="font-size:24px;color:var(--ch-intro);font-family:var(--font-display)">${f.icon}</span> <strong style="font-family:var(--font-display);letter-spacing:.03em">${f.lbl}</strong> <span class="mono" style="font-size:11px;color:var(--ink-faint)">${f.sub}</span> </div> </div>`)} </div> <div class="grid-2 rv" style="margin-bottom:clamp(24px,4vw,40px)"> ${renderComponent($$result, "CrossClassify", CrossClassify, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/CrossClassify.tsx",
		"client:component-export": "default"
	})} <div class="panel" style="--c: var(--ch-intro)"> <div class="panel-tag"><span>CLASIFICACIÓN DE LOS SENSORES</span><span>SALIDA · CONTACTO · ENERGÍA</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:14px"> <p class="text-dim" style="font-size:14.5px">
Los sensores <strong style="color:var(--ink)">analógicos</strong> miden variables como temperatura, luz, presión
              o humedad con una señal continua; los <strong style="color:var(--ink)">digitales</strong> señalan si un interruptor
              está encendido o apagado y se usan para cronometrar o indicar acontecimientos. Según su
              alimentación, un sensor <strong style="color:var(--ink)">activo</strong> (termopar, piezoeléctrico) genera su
              propia señal; un sensor <strong style="color:var(--ink)">pasivo</strong> (RTD, LDR) necesita que le inyectes
              corriente para leer su respuesta.
</p> <div class="sim-legend" style="color:var(--ink-dim)"> <span><i style="background:var(--ch-intro)"></i>Analógico = continuo</span> <span><i style="background:var(--ch-optico)"></i>Digital = estados</span> </div> </div> </div> </div> <div class="rv">${renderComponent($$result, "ClassifyGame", ClassifyGame, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/ClassifyGame.tsx",
		"client:component-export": "default"
	})}</div> <h3 class="mono rv" style="font-size:12px;letter-spacing:.22em;color:var(--ch-intro);margin:clamp(32px,5vw,48px) 0 18px">CARACTERÍSTICAS · GIRA LAS TARJETAS</h3> <div class="grid-3 rv"> ${caracteristicas.map((c) => renderTemplate`<button type="button" class="flip"${addAttribute(`Característica: ${c.t}. ${c.d}`, "aria-label")} onclick="this.classList.toggle('flipped')"> <div class="flip-in"> <div class="flip-face" style="--c:var(--ch-intro)"> <span class="sym">${c.sym}</span> <strong style="font-family:var(--font-display);letter-spacing:.05em;font-size:17px">${c.t}</strong> <span class="mono" style="font-size:10px;color:var(--ink-faint);letter-spacing:.16em">TOCA PARA VER</span> </div> <div class="flip-face flip-back" style="--c:var(--ch-intro)"> <p style="font-size:13.5px;color:var(--ink-dim)">${c.d}</p> </div> </div> </button>`)} </div> </div> </section>  <section class="section" id="ch02" style="--c: var(--ch-optico)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">CH02 · SENSORES ÓPTICOS</span> <h2 class="channel-title">La luz como detector</h2> </div> <p class="channel-sub rv">
Su funcionamiento <strong>basa en la emisión de un haz de luz que es interrumpido o reflejado</strong> por el
        objeto a detectar. Son de los sensores más sensibles que existen — y por eso mismos los que menos duran.
        Antes de operar los modos de detección, desarma mentalmente un sensor: <em>fuente, lentes, receptor y circuito de salida</em>.
</p> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "OpticalParts", OpticalParts, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/OpticalParts.tsx",
		"client:component-export": "default"
	})}</div> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "OpticalModes", OpticalModes, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/OpticalModes.tsx",
		"client:component-export": "default"
	})}</div> <div class="rv"> <div class="panel" style="--c: var(--ch-optico)"> <div class="panel-tag"><span>MODOS DE DETECCIÓN · TABLA COMPARATIVA</span><span>1.1.4 ANTOLOGÍA</span></div> <div class="panel-inner" style="overflow-x:auto"> <table class="tbl"> <thead> <tr><th>Configuración</th><th>Cómo detecta</th><th>Rango típico</th><th>Ventaja</th><th>Desventaja</th></tr> </thead> <tbody> <tr> <td><strong style="color:var(--ch-optico)">Barra / transmisión directa</strong></td> <td>Emisor frente a receptor; la pieza se interpone</td> <td class="mono">hasta 20–270 m</td> <td>Mayor distancia de todas</td> <td>Alineación crítica; no apto para objetos translúcidos o transparentes</td> </tr> <tr> <td><strong style="color:var(--ch-optico)">Retro-reflectivo (réflex)</strong></td> <td>Emisor y receptor juntos; un espejo devuelve el haz</td> <td class="mono">1–3 m</td> <td>Popular y barato, un solo cableado</td> <td>Problemas si la pieza es muy brillante</td> </tr> <tr> <td><strong style="color:var(--ch-optico)">Reflectivo difuso</strong></td> <td>El propio objeto refleja el haz</td> <td class="mono">12–300 mm</td> <td>Barato, fácil, un solo lado</td> <td>Distancia muy corta</td> </tr> </tbody> </table> </div> </div> </div> </div> </section>  <section class="section" id="ch03" style="--c: var(--ch-temp)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">CH03 · TEMPERATURA</span> <h2 class="channel-title">De grados a voltios</h2> </div> <p class="channel-sub rv">
Los sensores de temperatura <strong>transforman los cambios de temperatura en cambios en señales eléctricas</strong>.
        Típicamente se componen del <em>elemento sensor</em> (termopar, RTD o termistor), una <em>vaina</em> rellena de
        material conductor para transmitir rápido el calor, y el <em>cable</em> hacia el equipo electrónico.
        Prueba cada tecnología en el banco: verás que el termistor es el más sensible, el RTD el más lineal y el
        termopar el de mayor rango.
</p> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "TemperatureLab", TemperatureLab, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/TemperatureLab.tsx",
		"client:component-export": "default"
	})}</div> <div class="grid-3 rv"> <div class="panel" style="--c:var(--ch-temp)"> <div class="panel-tag"><span>TERMOPARES · K</span><span>efecto Seebeck</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px"> <span style="font-family:var(--font-display);font-size:30px;color:var(--ch-temp)">⧓</span> <p style="font-size:13.5px;color:var(--ink-dim)">Los más usados: <strong style="color:var(--ink)">precisos, relativamente económicos y de amplio rango</strong>. Dos metales distintos unidos generan un pequeño voltaje termoeléctrico (Seebeck) como función de la temperatura.</p> </div> </div> <div class="panel" style="--c:var(--ch-temp)"> <div class="panel-tag"><span>RTD · Pt100</span><span>platino</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px"> <span style="font-family:var(--font-display);font-size:30px;color:var(--ch-temp)">⛨</span> <p style="font-size:13.5px;color:var(--ink-dim)">Bobinas o películas de platino: <strong style="color:var(--ink)">al calentar sube su resistencia</strong>. <span class="mono" style="color:var(--ch-temp)">100 Ω @ 0 °C</span>, hasta ~850 °C, relación casi lineal. Necesita corriente para leer su voltaje.</p> </div> </div> <div class="panel" style="--c:var(--ch-temp)"> <div class="panel-tag"><span>TERMISTOR</span><span>NTC / PTC</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px"> <span style="font-family:var(--font-display);font-size:30px;color:var(--ch-temp)">◍</span> <p style="font-size:13.5px;color:var(--ink-dim)">Semiconductor de óxidos metálicos prensado y cubierto con epoxi o vidrio: <strong style="color:var(--ink)">alta resistencia (2 a 10 kΩ) y sensibilidad ~200 Ω/°C</strong>, en un rango limitado (hasta ~300 °C).</p> </div> </div> </div> </div> </section>  <section class="section" id="ch04" style="--c: var(--ch-pres)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">CH04 · PRESIÓN</span> <h2 class="channel-title">Fuerza repartida</h2> </div> <p class="channel-sub rv">
En técnicas de proceso, <strong>entre el 30 y 40 % de todas las mediciones miden presión</strong>. El sensor lleva un
        elemento sensible que emite una señal eléctrica al variar la presión, o conmuta si se supera un valor límite.
        Las unidades de mantenimiento neumáticas llevan manómetro y regulador: aquí operas el manómetro, el tubo de
        Bourdon y los tres tipos de medida.
</p> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "PressureLab", PressureLab, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/PressureLab.tsx",
		"client:component-export": "default"
	})}</div> <div class="grid-3 rv"> <div class="panel" style="--c:var(--ch-pres)"> <div class="panel-tag"><span>MECÁNICOS · DIRECTOS</span><span>columna / pozo</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px"> <span style="font-family:var(--font-display);font-size:30px;color:var(--ch-pres)">ⵄ</span> <p style="font-size:13.5px;color:var(--ink-dim)">Manómetro de tubo en U, manómetro de pozo y barómetro: miden comparando <strong style="color:var(--ink)">una columna de líquido contra una presión de referencia</strong>.</p> </div> </div> <div class="panel" style="--c:var(--ch-pres)"> <div class="panel-tag"><span>MECÁNICOS · ELÁSTICOS</span><span>deformación</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px"> <span style="font-family:var(--font-display);font-size:30px;color:var(--ch-pres)">⌒</span> <p style="font-size:13.5px;color:var(--ink-dim)"><strong style="color:var(--ink)">Tubo de Bourdon, diafragma y fuelle</strong>: se deforman con la presión y ese movimiento acciona la aguja de un manómetro. Lo que acabas de operar.</p> </div> </div> <div class="panel" style="--c:var(--ch-pres)"> <div class="panel-tag"><span>ELECTROMECÁNICOS</span><span>señal eléctrica</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px"> <span style="font-family:var(--font-display);font-size:30px;color:var(--ch-pres)">≋</span> <p style="font-size:13.5px;color:var(--ink-dim)">La deformación actúa sobre potenciómetros, condensadores, bobinas o <strong style="color:var(--ink)">galgas extensiométricas</strong> (resistencia que varía con la forma) y producen tensión o corriente medible.</p> </div> </div> </div> </div> </section>  <section class="section" id="ch05" style="--c: var(--ch-prox)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">CH05 · PROXIMIDAD</span> <h2 class="channel-title">Detectar sin tocar</h2> </div> <p class="channel-sub rv">
Un sensor de proximidad es un <strong>transductor que detecta objetos o señales cerca del elemento sensor</strong>,
        sin contacto físico. Existen tantos porque cada campo físico tiene su material: el reto del banco es
<em>encontrar la pareja correcta de sensor y material</em>.
</p> <div class="rv" style="margin-bottom:clamp(24px,4vw,40px)">${renderComponent($$result, "ProximityLab", ProximityLab, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/ProximityLab.tsx",
		"client:component-export": "default"
	})}</div> <div class="rv"> <h3 class="mono" style="font-size:12px;letter-spacing:.22em;color:var(--ch-prox);margin-bottom:18px">LOS SEIS FAMILIARES · 1.4.1 TIPOS</h3> <div class="grid-3"> ${tiposProx.map((t) => renderTemplate`<div class="panel" style="--c:var(--ch-prox)"> <div class="panel-tag"><span>${t.icon}</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:8px;padding:16px"> <strong style="font-family:var(--font-display);letter-spacing:.04em;font-size:16px">${t.t}</strong> <p style="font-size:13px;color:var(--ink-dim)">${t.d}</p> </div> </div>`)} </div> </div> </div> </section>  <section class="section" id="quiz" style="--c: var(--ch-quiz)"> <div class="container"> <div class="channel-head rv"> <span class="channel-tag">FINAL · RESUMEN</span> <h2 class="channel-title">Tabla maestra</h2> </div> <p class="channel-sub rv">Un solo vistazo a qué detecta cada familia, con qué principio y a qué distancia. Dedica un minuto a la fila que más te cueste en el test.</p> <div class="rv" style="margin-bottom:clamp(32px,5vw,48px)"> <div class="panel" style="--c:var(--trace)"> <div class="panel-tag"><span>MATRIZ DE SELECCIÓN DE SENSOR</span><span>PRINCIPIO → MATERIAL → RANGO</span></div> <div class="panel-inner" style="overflow-x:auto"> <table class="tbl"> <thead> <tr><th>Sensor</th><th>Principio físico</th><th>Detecta</th><th>Rango</th><th>Ventaja</th><th>Ojo con…</th></tr> </thead> <tbody> ${comparativa.map((c) => renderTemplate`<tr> <td><strong>${c.s}</strong></td> <td>${c.p}</td> <td>${c.m}</td> <td class="mono">${c.rango}</td> <td>${c.v}</td> <td>${c.d}</td> </tr>`)} </tbody> </table> </div> </div> </div> <div class="grid-2" style="align-items:start"> <div class="rv">${renderComponent($$result, "Quiz", Quiz, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/components/sims/Quiz.tsx",
		"client:component-export": "default"
	})}</div> <div class="rv"> <div class="panel" style="--c:var(--ch-quiz)"> <div class="panel-tag"><span>GLOSARIO DEL BANCO</span><span>12 TÉRMINOS</span></div> <div class="panel-inner" style="display:flex;flex-direction:column;gap:10px;padding:18px"> ${glosario.map((g) => renderTemplate`<details class="acc"> <summary>${g.t}</summary> <div class="acc-body"><p>${g.d}</p></div> </details>`)} </div> </div> </div> </div> <div class="rv" style="margin-top:clamp(40px,6vw,64px);text-align:center"> <div class="panel" style="background:var(--bg-deep)"> <div class="panel-inner" style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px 24px"> <div style="font-family:var(--font-display);font-size:30px;color:var(--trace)">SENSOR = PUENTE ENTRE EL MUNDO FÍSICO Y EL PROGRAMA</div> <p style="color:var(--ink-dim);max-width:56ch">
Cada canal de este banco hizo lo mismo: <strong style="color:var(--ink)">una magnitud que cambia</strong>
→ un <strong style="color:var(--ink)">elemento que responde</strong> → una <strong style="color:var(--ink)">señal que tu controlador entiende</strong>.
              Eso es Sistemas Programables: el programa empieza donde el sensor termina.
</p> <a class="btn is-active" style="--c:var(--trace);display:inline-block;margin-top:6px" href="#top">↑ SUBIR AL INICIO</a> </div> </div> </div> </div> </section> ` })}`;
}, "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/pages/index.astro", void 0);
var $$file = "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
