# Tema III · Microcontroladores

**Estado:** implementado en la aplicación Astro existente.

**Ruta nueva:** `/tema-3`

**Revisión de fuentes:** 4 de octubre de 2026.

## Propósito y continuidad

El sitio sigue siendo el proyecto iniciado para Tema I y Tema II. Esta ampliación incorpora Tema III como tercera página sin reemplazar `src/pages/index.astro` (Sensores) ni `src/pages/tema-2.astro` (Actuadores). La navegación compartida registra el nuevo tema y deja Tema IV como próximo.

La idea integradora es:

```text
SENSOR → MICROCONTROLADOR → ACTUADOR / DISPOSITIVO DE VISUALIZACIÓN
```

El ejemplo operable usa temperatura simulada como entrada. Una conversión ADC ilustrativa y una comparación con la consigna representan el procesamiento del firmware; la decisión actualiza un display y activa el estado del ventilador. La escala no pretende modelar un sensor físico particular. Si una carga excede los límites eléctricos del pin, se intercala la etapa driver apropiada.

## Cobertura del encargo

| Requisito | Dónde se explica o experimenta |
| --- | --- |
| Concepto, características y función del MCU en un sistema programable | `mcu01` de `Tema1/src/pages/tema-3.astro` |
| Familias y ancho de buses | `mcu02` y `ArchitectureWorkbench.tsx` |
| Memorias, volatilidad y uso | `mcu03` y `MemoryWorkbench.tsx` |
| Circuitería y dispositivos de entrada/salida | `mcu04`, diagrama de señal y `MCU_IO` |
| Displays LED y LCD, OLED y papel electrónico | `mcu05` y `DisplayLab.tsx` |
| Codificadores incremental y absoluto | `mcu06` y `EncoderLab.tsx` |
| Sistema completo Entrada → Procesamiento → Salida | `SystemEvolution.tsx` |
| Repaso con retroalimentación | `mcu07`, componente compartido `Quiz.tsx` y banco `MCU_QUIZ` |

## Estructura añadida

```text
Tema1/src/
├── data/
│   ├── microcontroladores.ts       # familias, memorias, I/O, displays, quiz y fuentes
│   └── temas.ts                    # añade Tema III al registro compartido
├── components/tema3/
│   ├── TopicSection.astro          # encabezado y envoltura común de los canales
│   ├── SystemEvolution.tsx         # simulación de entrada → procesamiento → salidas
│   ├── ArchitectureWorkbench.tsx   # selector de familias y modelo conceptual de buses
│   ├── MemoryWorkbench.tsx         # memoria seleccionable + ejercicio de elección
│   ├── DisplayLab.tsx              # visualizador LED de siete segmentos/LCD/OLED/e-paper
│   └── EncoderLab.tsx              # posición incremental, cuadratura y absoluta
├── pages/
│   └── tema-3.astro                # composición de los siete canales
└── tests/
    └── microcontroladores.test.ts  # cobertura y consistencia del banco de datos
```

Los laboratorios están aislados como componentes React hidratados con `client:visible`, siguiendo el patrón que ya utilizan Tema I y Tema II. El contenido editorial, el orden de los canales y sus anclas se componen en Astro; los datos educativos y el banco del quiz se mantienen fuera de la página.

## Precisión técnica y límites de los modelos

- **Familias:** PIC, AVR, 8051, familias de 16 bits, Cortex‑M y RISC‑V son ejemplos de ecosistemas o arquitecturas diferentes, no una escala única de “mejor a peor”. La ficha concreta decide núcleo, memoria y periféricos. dsPIC se identifica como controlador digital de señales.
- **Bits y buses:** “8/16/32 bits” caracteriza principalmente la anchura de datos/modelo del núcleo. No determina por sí sola el ancho de cada bus interno o externo. El control interactivo separa ancho de datos y direcciones; la capacidad `2ⁿ` se presenta como límite teórico de un modelo byte-addressable, no como promesa de RAM física.
- **Memoria:** Flash conserva el programa; SRAM es memoria de trabajo volátil; EEPROM, cuando está integrada, puede conservar datos de configuración. Algunos modelos implementan almacenamiento persistente sobre Flash en vez de tener EEPROM dedicada. ROM/Boot ROM y registros se explican por separado.
- **E/S:** GPIO, ADC, PWM, timers e interfaces seriales se presentan como periféricos con límites eléctricos. ADC mide dentro de su referencia y rango; un pin GPIO no es un driver universal para motores, relés o cargas de corriente elevada.
- **Displays:** LED de siete segmentos representa patrones numéricos y debe respetar su corriente; LCD usa control y temporización del panel; OLED es emisivo; e-paper puede retener una imagen con refresco más lento. Interfaces y capacidades dependen del controlador y módulo seleccionados.
- **Encoders:** el incremental informa movimiento relativo por pulsos y A/B en cuadratura ayuda a determinar sentido; su referencia puede perderse tras un reinicio. El absoluto entrega un código de posición dentro de su resolución. El laboratorio representa los conceptos, no un modelo comercial específico.

## Fuentes técnicas consultadas

Fuentes primarias y documentación de fabricantes usadas para contrastar las explicaciones (consulta: 2026-10-04):

1. STMicroelectronics, [STM32 MCU basics](https://wiki.st.com/stm32mcu/wiki/STM32StepByStep:STM32MCU_basics) — MCU como núcleo, memoria y periféricos; arquitecturas Cortex‑M, selección y familias STM32.
2. Microchip Technology, [Memory features](https://www.microchip.com/en-us/products/microcontrollers/8-bit-mcus/peripherals/system-flexibility/memory) — usos de Flash, EEPROM y SRAM, además de particularidades del almacenamiento en Flash.
3. Microchip Technology, [Microcontrollers portfolio](https://www.microchip.com/en-us/products/microcontrollers) — familias PIC, AVR, SAM y dsPIC, con dispositivos de 8, 16 y 32 bits.
4. NXP Semiconductors, [80C51 8-bit microcontroller family](https://www.nxp.com/products/P87C52SFAA) — referencia de la familia histórica 8051 de 8 bits.
5. Texas Instruments, [MSP430 ultra-low-power 16-bit MCUs (application report)](https://www.ti.com/lit/pdf/slyt345) — ejemplo de familia enfocada a bajo consumo.
6. Raspberry Pi, [Microcontroller chips](https://www.raspberrypi.com/documentation/microcontrollers/microcontroller-chips.html) — ejemplos RP2040/RP2350, memorias y variantes de procesador Arm/RISC‑V.
7. Analog Devices, [Incremental and absolute encoders](https://ez.analog.com/ez-blogs/b/engineerzone-spotlight/posts/the-what-why-and-where-of-incremental-and-absolute-encoders) — conteo, cuadratura, referencia HOME y códigos absolutos.
8. Texas Instruments, [TLC59283 datasheet](https://www.ti.com/lit/ds/symlink/tlc59283.pdf) — controlador dedicado para displays LED de siete segmentos y matrices.
9. Microchip Technology, [MCUs for segmented LCD displays](https://www.microchip.com/en-us/solutions/technologies/displays/segmented-lcd-solutions/microcontrollers-for-segmented-displays) — controladores LCD integrados, polarización, segmentos y operación de bajo consumo.

Las fuentes respaldan principios generales y ejemplos. No se atribuyen números de pines, velocidades o tamaños de memoria a una familia completa; esos valores se deben confirmar en la hoja de datos del part number seleccionado.

## Verificación

Desde `Tema1/`:

```bash
npm test
npm run check
npm run build
```

La salida estática incluye `/`, `/tema-2/` y `/tema-3/`. Tema I y II permanecen en sus archivos originales; las únicas extensiones compartidas requeridas son el registro de temas, el selector de navegación y el sistema de diseño para el nuevo canal.

Verificación al incorporar el tema: **14 pruebas aprobadas**, `astro check` con **0 errores, 0 warnings y 0 hints**, y `astro build` con las **3 rutas**. Además, se recorrieron las rutas en navegador headless, se probaron la selección de memoria/display/encoder y la cadena térmica, y se comprobó un viewport móvil sin overflow horizontal ni errores JavaScript.
