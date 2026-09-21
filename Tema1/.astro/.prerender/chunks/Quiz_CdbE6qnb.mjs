import { J as AstroError, c as renderSlot, d as renderTemplate, j as InvalidComponentArgs, m as addAttribute, p as renderHead, x as createAstro } from "./server_B7faeoIi.mjs";
import { useEffect, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/astro/dist/runtime/server/astro-component.js
function validateArgs(args) {
	if (args.length !== 3) return false;
	if (!args[0] || typeof args[0] !== "object") return false;
	return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
	const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
	const fn = (...args) => {
		if (!validateArgs(args)) throw new AstroError({
			...InvalidComponentArgs,
			message: InvalidComponentArgs.message(name)
		});
		return cb(...args);
	};
	Object.defineProperty(fn, "name", {
		value: name,
		writable: false
	});
	fn.isAstroComponentFactory = true;
	fn.moduleId = moduleId;
	fn.propagation = propagation;
	return fn;
}
function createComponentWithOptions(opts) {
	return baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
}
function createComponent(arg1, moduleId, propagation) {
	if (typeof arg1 === "function") return baseCreateComponent(arg1, moduleId, propagation);
	else return createComponentWithOptions(arg1);
}
//#endregion
//#region src/data/temas.ts
var TEMAS = [{
	id: "tema-1",
	roman: "I",
	code: "SP-01",
	name: "BANCO DE SENSORES",
	short: "SENSORES",
	path: "/",
	title: "SP-01 · Banco de Sensores — Sistemas Programables, Tema I",
	description: "Tema I — Sensores de Sistemas Programables: laboratorio interactivo con simulaciones de sensores ópticos, de temperatura, presión y proximidad.",
	footer: "SP-01 · BANCO DE SENSORES — SISTEMAS PROGRAMABLES · TEMA I",
	accent: "var(--ch-intro)",
	channels: [
		{
			id: "ch01",
			label: "CH01",
			name: "EL SENSOR",
			color: "var(--ch-intro)"
		},
		{
			id: "ch02",
			label: "CH02",
			name: "ÓPTICOS",
			color: "var(--ch-optico)"
		},
		{
			id: "ch03",
			label: "CH03",
			name: "TEMP.",
			color: "var(--ch-temp)"
		},
		{
			id: "ch04",
			label: "CH04",
			name: "PRESIÓN",
			color: "var(--ch-pres)"
		},
		{
			id: "ch05",
			label: "CH05",
			name: "PROX.",
			color: "var(--ch-prox)"
		},
		{
			id: "quiz",
			label: "TEST",
			name: "REPASO",
			color: "var(--ch-quiz)"
		}
	]
}, {
	id: "tema-2",
	roman: "II",
	code: "SP-02",
	name: "BANCO DE ACTUADORES",
	short: "ACTUADORES",
	path: "/tema-2",
	title: "SP-02 · Banco de Actuadores — Sistemas Programables, Tema II",
	description: "Tema II — Actuadores de Sistemas Programables: motores, cilindros, válvulas, bombas y señalización en un laboratorio interactivo.",
	footer: "SP-02 · BANCO DE ACTUADORES — SISTEMAS PROGRAMABLES · TEMA II",
	accent: "var(--act-intro)",
	channels: [
		{
			id: "act01",
			label: "ACT-01",
			name: "ACTUADOR",
			color: "var(--act-intro)"
		},
		{
			id: "act02",
			label: "ACT-02",
			name: "ELÉCTR.",
			color: "var(--act-elec)"
		},
		{
			id: "act03",
			label: "ACT-03",
			name: "NEUM.",
			color: "var(--act-neum)"
		},
		{
			id: "act04",
			label: "ACT-04",
			name: "HIDR.",
			color: "var(--act-hidr)"
		},
		{
			id: "act05",
			label: "ACT-05",
			name: "SEÑAL",
			color: "var(--act-senal)"
		},
		{
			id: "act06",
			label: "ACT-06",
			name: "SELEC.",
			color: "var(--act-sel)"
		}
	]
}];
var FUTURE_TEMAS = [{
	roman: "III",
	short: "PRÓX."
}, {
	roman: "IV",
	short: "PRÓX."
}];
function getTheme(id) {
	return TEMAS.find((t) => t.id === id) ?? TEMAS[0];
}
//#endregion
//#region src/layouts/BaseLayout.astro
createAstro("https://astro.build");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { theme = "tema-1" } = Astro.props;
	const active = getTheme(theme);
	const progressGradient = `linear-gradient(90deg, ${active.channels.map((c) => c.color).join(", ")})`;
	return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(active.description, "content")}><meta name="theme-color" content="#070d17"><title>${active.title}</title><link rel="icon" href="data:image/svg+xml,&lt;svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'&gt;&lt;rect width='32' height='32' rx='6' fill='%23070d17'/&gt;&lt;circle cx='16' cy='16' r='5' fill='%237dd3fc'/&gt;&lt;/svg&gt;"><script>document.documentElement.classList.add('js');<\/script>${renderHead($$result)}</head> <body> <header class="site-head"> <div class="container head-inner"> <a class="brand" href="#top"${addAttribute(`${active.code} ${active.name}: volver al inicio`, "aria-label")}> <span class="id">${active.code}</span> <span>${active.name}</span> </a> <nav class="theme-switch" aria-label="Selector de tema"> ${TEMAS.map((t) => renderTemplate`<a${addAttribute(["theme-tab", t.id === active.id && "is-active"], "class:list")}${addAttribute(t.path, "href")}${addAttribute(`--c:${t.accent}`, "style")}${addAttribute(t.id === active.id ? "page" : void 0, "aria-current")}${addAttribute(`Tema ${t.roman}: ${t.name}`, "aria-label")}> <span class="tnum">TEMA ${t.roman}</span> <span class="tn">${t.short}</span> </a>`)} ${FUTURE_TEMAS.map((t) => renderTemplate`<span class="theme-tab is-soon" aria-disabled="true"${addAttribute(`Tema ${t.roman}: Próximamente`, "aria-label")} title="Próximamente"> <span class="tnum">TEMA ${t.roman}</span> <span class="tn">${t.short}</span> </span>`)} </nav> <nav class="channel-lamps" aria-label="Secciones del tema"> ${active.channels.map((ch) => renderTemplate`<a class="ch-lamp"${addAttribute(ch.id, "data-ch")}${addAttribute(`#${ch.id}`, "href")}${addAttribute(`--c:${ch.color}`, "style")}${addAttribute(`${ch.label} ${ch.name}`, "aria-label")}> <span class="dot"></span> <span>${ch.name}</span> </a>`)} </nav> </div> <div class="head-progress" id="head-progress" aria-hidden="true"${addAttribute(`background:${progressGradient}`, "style")}></div> </header> <main id="top"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="site-foot"> <div class="container"> <div class="row"> <span>${active.footer}</span> <span>MAT. REV. 2026 · SIMULACIONES EDUCATIVAS</span> </div> <div class="row" style="margin-top:10px"> <span>Elaborado con Astro + React — sin hardware conectado, todo es simulación.</span> </div> </div> </footer> <script>
    // Lámparas de canal: encender la sección visible + barra de progreso
    (function () {
      var lamps = document.querySelectorAll('.ch-lamp');
      var progress = document.getElementById('head-progress');
      var sections = lamps.length
        ? Array.from(lamps).map(function (l) {
            var el = document.getElementById(l.getAttribute('data-ch'));
            return el;
          }).filter(Boolean)
        : [];

      function onScroll() {
        var y = window.scrollY;
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        if (max > 0 && progress) progress.style.width = (y / max) * 100 + '%';

        var current = 0;
        sections.forEach(function (s, i) {
          if (s && s.offsetTop - 120 <= y) current = i;
        });
        lamps.forEach(function (l, i) { l.classList.toggle('is-on', i === current); });
      }

      // Reveal on scroll
      var io = 'IntersectionObserver' in window
        ? new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
            });
          }, { threshold: 0.12 })
        : null;

      document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.rv').forEach(function (el, i) {
          if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(i * 0.06, 0.5) + 's');
          if (io) io.observe(el);
          else el.classList.add('in');
        });
        onScroll();
      });
      window.addEventListener('scroll', onScroll, { passive: true });
    })();
  <\/script></body> </html>`;
}, "/home/zeta/Documentos/Proyectos/Zacek/Tema1Proyecto/Tema1/src/layouts/BaseLayout.astro", void 0);
//#endregion
//#region src/components/sims/useReducedMotion.ts
/**
* Devuelve `true` cuando el sistema pide reducir movimiento.
* Se resuelve en el cliente para no romper el render en servidor.
*/
function useReducedMotion() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduced(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);
	return reduced;
}
//#endregion
//#region src/components/sims/Quiz.tsx
var DEFAULT_BANK = [
	{
		q: "Un sensor es un dispositivo que…",
		opts: [
			"Genera movimiento a partir de una señal",
			"Produce una señal relacionada con la magnitud que mide",
			"Almacena datos de proceso",
			"Amplifica potencia eléctrica"
		],
		ans: 1,
		why: "El sensor transforma una magnitud física (temperatura, luz, presión…) en una señal utilizable por el sistema de control."
	},
	{
		q: "Según la antología, la relación entre sensor y transductor es:",
		opts: [
			"Son conceptos opuestos",
			"El transductor mide y el sensor actúa",
			"Los sensores son transductores: todo sensor convierte una magnitud en señal",
			"Solo los digitales son transductores"
		],
		ans: 2,
		why: "El transductor es el elemento que experimenta un cambio relacionado con una magnitud física; el sensor es ese transductor orientado a medir."
	},
	{
		q: "¿Qué configuración óptica alcanza la mayor distancia de detección?",
		opts: [
			"Reflectivo difuso (12–300 mm)",
			"Retro-reflectivo (1–3 m)",
			"Barrera de luz (hasta 20–270 m)",
			"Todas igual"
		],
		ans: 2,
		why: "En barrera, emisor y receptor separados: el haz corre sin necesidad de reflexión y alcanza cientos de metros."
	},
	{
		q: "En el modo retro-reflectivo, ¿qué devuelve el haz al receptor?",
		opts: [
			"El propio objeto",
			"Un espejo reflector",
			"El emisor",
			"La luz ambiental"
		],
		ans: 1,
		why: "Emisor y receptor van en el mismo cuerpo; el haz viaja a un espejo y regresa. Al interrumpirlo se detecta."
	},
	{
		q: "Un termistor NTC, al aumentar la temperatura…",
		opts: [
			"Aumenta su resistencia",
			"Disminuye su resistencia",
			"Genera voltaje",
			"Conmuta a ON"
		],
		ans: 1,
		why: "NTC = Negative Temperature Coefficient: la resistencia baja al calentar. Muy sensible (~200 Ω/°C) en rangos cortos."
	},
	{
		q: "Un RTD Pt100 a 0 °C presenta una resistencia de:",
		opts: [
			"0 Ω",
			"100 Ω",
			"1000 Ω",
			"10 kΩ"
		],
		ans: 1,
		why: "Pt100: platino, 100 Ω a 0 °C, casi lineal, hasta ~850 °C. Pasa corriente y mides el voltaje para conocer R."
	},
	{
		q: "El termopar genera su señal gracias al efecto:",
		opts: [
			"Peltier",
			"Seebeck",
			"Fotovoltaico",
			"Hall"
		],
		ans: 1,
		why: "Dos metales distintos unidos: la unión caliente genera un pequeño voltaje termoeléctrico (Seebeck) proporcional a la temperatura."
	},
	{
		q: "El tubo de Bourdon pertenece a los sensores de presión…",
		opts: [
			"de medida directa",
			"elásticos",
			"electromecánicos",
			"neumáticos"
		],
		ans: 1,
		why: "Es un elemento elástico: se deforma con la presión y ese movimiento acciona la aguja o una galga."
	},
	{
		q: "¿Qué sensor de proximidad detecta SOLO metales?",
		opts: [
			"Capacitivo",
			"Ultrasónico",
			"Inductivo",
			"Fotoeléctrico"
		],
		ans: 2,
		why: "El inductivo genera un campo magnético oscilante que solo perturban los metales (férricos y no férricos)."
	},
	{
		q: "Para detectar arena o grano sin contacto usarías un sensor…",
		opts: [
			"Inductivo",
			"Capacitivo",
			"Magnético",
			"Solo mecánico"
		],
		ans: 1,
		why: "El capacitivo detecta cualquier material por su constante dieléctrica (incluidos sólidos en polvo o grano)."
	},
	{
		q: "La presión absoluta se mide respecto a…",
		opts: [
			"La atmósfera",
			"Otro punto del proceso",
			"El vacío total",
			"El nivel del mar"
		],
		ans: 2,
		why: "Absoluta = contra el vacío. La sobrepresión resta la atmósfera (~101 kPa); la diferencial compara dos puntos."
	},
	{
		q: "Las galgas extensiométricas pertenecen a los sensores de presión…",
		opts: [
			"Mecánicos directos",
			"Elásticos",
			"Electromecánicos",
			"Primarios"
		],
		ans: 2,
		why: "Deforman un elemento cuya resistencia varía; son el puente entre lo mecánico y la señal eléctrica."
	}
];
var DEFAULT_RESULTS = [
	"Dominas el banco. Revisa los rangos y alcances de cada canal para afinar.",
	"Vas bien. Repasa los modos de detección ópticos y los tipos de presión.",
	"Vuelve a operar los bancos 02–05: la teoría se aprende moviendo las piezas."
];
function Quiz({ bank = DEFAULT_BANK, accent = "var(--ch-quiz)", tag = "TEST DE REPASO · 8 PREGUNTAS ALEATORIAS", results = DEFAULT_RESULTS }) {
	const [qs, setQs] = useState(() => bank.slice(0, 8));
	const [i, setI] = useState(0);
	const [picked, setPicked] = useState(null);
	const [score, setScore] = useState(0);
	const [done, setDone] = useState(false);
	const questionRef = useRef(null);
	const resultRef = useRef(null);
	const focusQuestionAfterRestart = useRef(false);
	const AX = { "--c": accent };
	const q = qs[i];
	useEffect(() => {
		setQs([...bank].sort(() => Math.random() - .5).slice(0, 8));
	}, []);
	useEffect(() => {
		if (done) resultRef.current?.focus();
		else if ((i > 0 || focusQuestionAfterRestart.current) && picked === null) {
			questionRef.current?.focus();
			focusQuestionAfterRestart.current = false;
		}
	}, [
		done,
		i,
		picked
	]);
	const answer = (oi) => {
		if (picked !== null) return;
		setPicked(oi);
		if (oi === q.ans) setScore((s) => s + 1);
	};
	const next = () => {
		if (i + 1 >= qs.length) setDone(true);
		else {
			setI(i + 1);
			setPicked(null);
		}
	};
	const restart = () => {
		setQs([...bank].sort(() => Math.random() - .5).slice(0, 8));
		setI(0);
		setPicked(null);
		setScore(0);
		setDone(false);
		focusQuestionAfterRestart.current = true;
	};
	const pct = done ? Math.round(score / qs.length * 100) : Math.round(i / qs.length * 100);
	const ratio = score / qs.length;
	return /* @__PURE__ */ jsxs("div", {
		className: "panel",
		style: AX,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "panel-tag",
			children: [/* @__PURE__ */ jsx("span", { children: tag }), /* @__PURE__ */ jsx("span", { children: done ? `RESULTADO: ${score}/${qs.length}` : `PREGUNTA ${i + 1}/${qs.length}` })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "panel-inner col",
			style: { gap: 16 },
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					height: 4,
					background: "#1c2a3f",
					borderRadius: 2,
					overflow: "hidden"
				},
				children: /* @__PURE__ */ jsx("div", { style: {
					height: "100%",
					width: `${pct}%`,
					background: accent,
					transition: "width .3s",
					boxShadow: `0 0 8px ${accent}`
				} })
			}), !done ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
				/* @__PURE__ */ jsx("h3", {
					ref: questionRef,
					tabIndex: -1,
					style: {
						fontSize: 20,
						fontWeight: 600
					},
					children: q.q
				}),
				/* @__PURE__ */ jsx("div", {
					className: "col",
					style: { gap: 10 },
					children: q.opts.map((o, oi) => {
						let cls = "quiz-opt";
						if (picked !== null) {
							if (oi === q.ans) cls += " right";
							else if (oi === picked) cls += " wrong";
						}
						return /* @__PURE__ */ jsxs("button", {
							className: cls,
							onClick: () => answer(oi),
							disabled: picked !== null,
							children: [/* @__PURE__ */ jsx("span", {
								className: "mono",
								style: {
									opacity: .6,
									marginRight: 8
								},
								children: String.fromCharCode(65 + oi)
							}), o]
						}, oi);
					})
				}),
				picked !== null && /* @__PURE__ */ jsxs("div", {
					className: "col",
					style: {
						gap: 12,
						alignItems: "flex-start"
					},
					children: [/* @__PURE__ */ jsxs("p", {
						className: "sim-note",
						role: "status",
						"aria-live": "polite",
						style: {
							marginTop: 0,
							color: picked === q.ans ? "var(--ok)" : "var(--warn)"
						},
						children: [picked === q.ans ? "✓ Correcto. " : "✗ Incorrecto. ", /* @__PURE__ */ jsx("b", { children: q.why })]
					}), /* @__PURE__ */ jsx("button", {
						className: "btn is-active",
						style: AX,
						onClick: next,
						children: i + 1 >= qs.length ? "VER RESULTADO →" : "SIGUIENTE →"
					})]
				})
			] }) : /* @__PURE__ */ jsxs("div", {
				ref: resultRef,
				tabIndex: -1,
				className: "col txt-center",
				role: "status",
				"aria-live": "polite",
				style: {
					alignItems: "center",
					gap: 14,
					padding: "18px 0"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mono",
						style: {
							fontSize: "clamp(44px, 7vw, 64px)",
							fontWeight: 700,
							color: ratio >= .75 ? "var(--ok)" : ratio >= .5 ? "var(--warn)" : "var(--err)"
						},
						children: [
							score,
							"/",
							qs.length
						]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							fontSize: 15,
							color: "var(--ink-dim)",
							maxWidth: "44ch"
						},
						children: ratio >= .75 ? results[0] : ratio >= .5 ? results[1] : results[2]
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn is-active",
						style: AX,
						onClick: restart,
						children: "REPETIR TEST"
					})
				]
			})]
		})]
	});
}
//#endregion
export { __exportAll as a, createComponent as i, useReducedMotion as n, $$BaseLayout as r, Quiz as t };
