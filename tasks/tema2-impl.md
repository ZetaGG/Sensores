# Plan de Implementación: Tema 2 - Actuadores

## Contexto del Proyecto

Este proyecto es una aplicación web didáctica construida con **Astro, React y TypeScript**. El objetivo de este plan es implementar la página del "Tema 2: Actuadores" (`src/pages/tema-2.astro`) integrando una guía técnica completa estructurada en 5 pilares, manteniendo el flujo y diseño modular establecido en el "Tema 1: Sensores".

Ya contamos con la estructura base y varios componentes interactivos en `src/components/sims/` (ej. `MotorLab.tsx`, `PneumaticLab.tsx`, `ControlLoop.tsx`, `ActuatorCompare.tsx`). La meta es inyectar la nueva información técnica en el modelo de datos y conectar estos componentes en la vista principal.

---

## Fases de Implementación

### Fase 1: Actualización del Modelo de Datos (`src/data/actuadores.ts`)

Debes crear o actualizar las interfaces TypeScript y los objetos de datos en este archivo para reflejar estrictamente la siguiente información:

1. **Clasificación General (Tabla Comparativa):**
   - Tipos: Eléctrico, Mecánico, Neumático, Hidráulico.
   - Atributos por tipo: Fuente de energía, Movimiento típico, Ventajas, Desventajas, Aplicaciones.
2. **Fichas Técnicas de Dispositivos:**
   - Crear un array de objetos para: Motor DC, Motor AC, Motor Paso a Paso, Válvula Solenoide, Motobomba, Luz Piloto, Zumbador (Buzzer).
   - Propiedades requeridas: `nombre`, `tipo`, `principioFuncionamiento`, `alimentacion`, `control`, `caracteristicas`, `ventajas`, `limitaciones`, `aplicaciones`.
3. **Casos de Bucle de Control (Sensor -> Controlador -> Actuador):**
   - Crear un array con los 5 ejemplos industriales: Control de temperatura (Horno), Nivel de tanque, Banda transportadora, Alarma de humo, Presión en tubería.
4. **Criterios de Selección y Aplicaciones por Sector:**
   - Listas de parámetros (Mecánicos, Control, Entorno, Costo).
   - Diccionario/Array de sectores (Automotriz, Manufactura, Robótica, Domótica) con sus actuadores frecuentes.

### Fase 2: Lógica Física y Fórmulas (`src/components/sims/actuatorPhysics.ts`)

Integra las fórmulas matemáticas proporcionadas en funciones exportables de TypeScript para que sean consumidas por los laboratorios interactivos:

- **Neumática/Hidráulica:** $F = P \cdot A$. Añadir cálculo de área anular ($A_a = \pi(D^2-d^2)/4$) para cilindros de doble efecto, y estimación de velocidad ($v = Q/A$).
- **Motores Eléctricos:** Relaciones simplificadas para Motor DC ($T \approx k_t I$, $\omega \approx (V-IR)/k_e$), Motor AC ($n_s = 120f/p$) y Motor Paso a Paso ($\theta = N\cdot\theta_s$).
- **Fluidos:** Potencia hidráulica ($P_h = \rho g Q H$).

### Fase 3: Construcción de la Vista (`src/pages/tema-2.astro`)

Utiliza el layout `BaseLayout.astro`. La página debe estructurarse semánticamente intercalando teoría con los componentes interactivos de React.

**Estructura del Documento:**

1. **Introducción:** Concepto de actuador (etapa de salida del sistema de control).
2. **Sección 1: Clasificación de Actuadores:**
   - Renderizar una tabla o grid de tarjetas utilizando los datos de clasificación.
   - _Componente sugerido:_ Integrar `ActuatorCompare.tsx` o `ClassifyGame.tsx`.
3. **Sección 2: Fichas Técnicas:**
   - _Componente sugerido:_ Instanciar `ActuatorGallery.tsx` pasándole como props el array de dispositivos de `actuadores.ts`.
   - Incorporar demostraciones específicas usando `MotorLab.tsx`, `StepperView.tsx` y `SolenoidLab.tsx`.
4. **Sección 3: Neumática e Hidráulica:**
   - Explicar diferencias entre simple y doble efecto.
   - _Componente sugerido:_ Renderizar `PneumaticLab.tsx` y `HydraulicLab.tsx`, asegurándose de que consuman las fórmulas de `actuatorPhysics.ts`.
5. **Sección 4: El Bucle de Control en Acción:**
   - _Componente sugerido:_ Utilizar `ControlLoop.tsx` pasándole los 5 casos de estudio (Temperatura, Tanque, Banda, Humo, Presión). El componente debe permitir al usuario ver cómo interactúa el Sensor, Controlador y Actuador.
6. **Sección 5: Selección y Sectores:**
   - Listar los criterios mecánicos, de control y de entorno.
   - Mostrar la tabla de sectores industriales (Automotriz, Manufactura, etc.).
7. **Cierre/Evaluación:**
   - _Componente sugerido:_ Incluir el componente `Quiz.tsx` (si está adaptado para recibir preguntas) o `ActuatorChallenge.tsx` (apoyado en `challengeLogic.ts`) para evaluar los conceptos aprendidos.

### Instrucciones Técnicas y Reglas para la IA

- **Estilos:** Mantén la coherencia visual usando Tailwind CSS (asumiendo que está configurado) o las clases globales definidas en `src/styles/global.css`.
- **Accesibilidad:** Mantén el soporte para `useReducedMotion.ts` en todas las animaciones de los motores y cilindros.
- **Tipado:** Define interfaces claras e independientes en los archivos `.ts`. No uses `any`.
- **Flujo de Trabajo:** Procede archivo por archivo. Comienza actualizando `src/data/actuadores.ts`, luego `actuatorPhysics.ts`, y finalmente ensambla todo en `tema-2.astro` conectando los componentes `.tsx`.
