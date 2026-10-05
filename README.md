# Sistemas Programables — Temas I–III

Laboratorio didáctico Astro + React: sensores, actuadores y microcontroladores. Puedes ejecutar los comandos desde la raíz (`Sensores/`) o directamente desde `Tema1/`.

## Setup

```bash
npm run install:app
```

Esto instala las dependencias en `Tema1/`, donde vive el proyecto Astro. Alternativamente: `cd Tema1` y ejecuta `npm install`.

## Run

```bash
npm run dev       # dev server (Astro)
npm run build     # static build → Tema1/dist
npm run preview   # serve the built site
npm run check     # astro check (TS + content)
npm test          # regression tests for Temas II and III
```

Los scripts de la raíz delegan al proyecto dentro de `Tema1/`. Astro sirve en la URL que imprime `npm run dev` (normalmente `http://localhost:4321`).
Routes: `/` (Tema I · Sensores), `/tema-2` (Tema II · Actuadores), `/tema-3` (Tema III · Microcontroladores).
Project notes and technical references: [`docs/`](docs/README.md).
