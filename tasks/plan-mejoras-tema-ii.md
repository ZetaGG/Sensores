# Implementation Plan: Tema I + Tema II Improvements

## Overview

Extend the existing Astro/React learning laboratory without regressing Tema I. The work adds explicit control-loop examples, corrects the stepper motor model, adds a solenoid visual lab, completes mechanical/hydraulic/application content, adds the actuator-selection challenge, and hardens navigation and accessibility.

## Contract

- Preserve `src/pages/index.astro` and every Tema I simulator.
- Keep the existing Astro/React/static-output architecture and visual language.
- Use the seven requested selection criteria: power, controllability, weight and volume, precision, speed, maintenance, and cost.
- Implement the three named integration examples: temperature → fan, inductive → belt motor, and pressure → valve.
- Do not add audio, video, hardware, backend services, or third-party dependencies unless required later.

## Dependency-Ordered Tasks

1. Shared Tema II data, pure calculations, and regression tests.
2. Explicit sensor → controller → actuator scenarios.
3. Stepper direction, speed, phase, and angle correction.
4. Solenoid visual laboratory.
5. Mechanical, hydraulic, criteria, and industrial-application content.
6. `SELECCIONA EL ACTUADOR CORRECTO` challenge.
7. Future-theme navigation, accessibility, responsive behavior, and Tema I regression.
8. Browser verification, report refresh, ZIP refresh, and final review.

## Verification Commands

```bash
npm test
npm run check
npm run build
```

Runtime verification uses the local Astro server and an isolated Chrome profile at desktop and mobile widths, including reduced-motion checks.

## Risks

| Risk | Mitigation |
|---|---|
| Tema I regression through shared CSS/layout | Leave Tema I composition unchanged where possible; run route and interaction smoke tests after each UI slice. |
| Stepper angle and phase drift | Extract pure stepper calculations and test positive, negative, boundary, and full-turn cases. |
| Solenoid animation communicates only color | Render labeled bobbin, field, plunger, flow, and textual state. |
| Scenario data duplicated across components | Centralize new criteria, scenarios, and challenge data. |
| Future theme links become broken URLs | Render Tema III/IV as disabled roadmap entries until routes exist. |

## Existing Plan Note

The prior evidence-delivery plan remains untouched in `tasks/plan.md`; this file tracks the approved improvement scope separately.
