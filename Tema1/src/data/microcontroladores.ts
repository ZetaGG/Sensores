import type { QuizQuestion } from '../components/sims/Quiz.tsx';

export interface MicrocontrollerFamily {
  id: string;
  name: string;
  core: string;
  width: '8 bits' | '16 bits' | '32 bits' | 'Varía';
  overview: string;
  examples: string;
  fit: string;
}

export const MCU_FAMILIES: MicrocontrollerFamily[] = [
  {
    id: 'classic-8', name: 'Clásicas de 8 bits', core: '8051 · PIC · AVR', width: '8 bits',
    overview: 'Familias consolidadas para control dedicado, periféricos sencillos y sistemas con recursos ajustados.',
    examples: '8051; PIC16/PIC18; AVR ATmega/ATtiny',
    fit: 'Secuencias de control, medición sencilla, temporización y productos de bajo costo.',
  },
  {
    id: 'control-16', name: 'Control de 16 bits', core: 'PIC24 · dsPIC · MSP430', width: '16 bits',
    overview: 'Núcleos y familias de 16 bits ofrecen un punto intermedio; algunas integran funciones de bajo consumo o control digital de señales.',
    examples: 'PIC24F; dsPIC33; MSP430',
    fit: 'Instrumentación, control de potencia, medición y equipos de batería; comprobar periféricos y consumo en cada modelo.',
  },
  {
    id: 'cortex-m', name: 'Ecosistema Cortex‑M', core: 'Arm Cortex‑M0+ · M3 · M4 · M7 · M33', width: '32 bits',
    overview: 'Una amplia gama de núcleos para MCU, ofrecidos por distintos fabricantes con memorias y periféricos diferentes.',
    examples: 'STM32; Microchip SAM/PIC32CM; RP2040 (dual Cortex‑M0+)',
    fit: 'Desde control general y bajo consumo hasta procesamiento, conectividad y aplicaciones con pantalla.',
  },
  {
    id: 'risc-v', name: 'RISC‑V integrado', core: 'ISA abierta · implementaciones diversas', width: 'Varía',
    overview: 'RISC‑V es una arquitectura de conjunto de instrucciones; distintos fabricantes implementan núcleos y MCU con combinaciones propias.',
    examples: 'RP2350 ofrece variantes con núcleos Cortex‑M33 o Hazard3 RISC‑V',
    fit: 'La selección depende de la implementación, herramientas, memoria, periféricos, consumo y soporte del dispositivo.',
  },
];

export interface MemoryKind {
  id: 'flash' | 'sram' | 'eeprom' | 'rom' | 'registers';
  name: string;
  volatility: string;
  role: string;
  example: string;
}

export const MCU_MEMORIES: MemoryKind[] = [
  { id: 'flash', name: 'Flash', volatility: 'No volátil', role: 'Guarda el firmware y, según el MCU, puede reservarse una zona para datos persistentes.', example: 'El programa de control se conserva al apagar.' },
  { id: 'sram', name: 'SRAM', volatility: 'Volátil', role: 'Memoria de trabajo rápida para variables, buffers, pila y datos temporales.', example: 'La lectura actual del ADC vive aquí durante el cálculo.' },
  { id: 'eeprom', name: 'EEPROM / emulación', volatility: 'No volátil', role: 'Guarda parámetros que deben sobrevivir al apagado. No todos los MCU ofrecen EEPROM dedicada; algunos usan Flash.', example: 'Consigna, calibración o preferencias.' },
  { id: 'rom', name: 'ROM / Boot ROM', volatility: 'No volátil', role: 'Puede contener código de arranque o rutinas del fabricante; disponibilidad y función dependen del chip.', example: 'Código de arranque de fábrica.' },
  { id: 'registers', name: 'Registros', volatility: 'Estado inmediato', role: 'Almacenes pequeños dentro del núcleo y los periféricos para operandos y control de hardware.', example: 'Registro GPIO, contador del timer o resultado ADC.' },
];

export interface IoKind {
  id: string;
  title: string;
  signal: string;
  role: string;
  caution: string;
}

export const MCU_IO: IoKind[] = [
  { id: 'gpio', title: 'GPIO digital', signal: '0 / 1 · entrada o salida', role: 'Lee botones y sensores digitales, o controla una señal lógica.', caution: 'Revisar tensión lógica, corriente máxima, estado de arranque y resistencias pull-up/down.' },
  { id: 'adc', title: 'Entrada analógica · ADC', signal: 'Voltaje → número', role: 'Muestrea una señal dentro del rango de referencia y la convierte a un valor digital.', caution: 'La resolución en bits no elimina ruido ni sustituye acondicionamiento, referencia y protección.' },
  { id: 'pwm', title: 'Salida temporizada · PWM', signal: 'Pulsos · ciclo de trabajo', role: 'Un temporizador genera pulsos para regular potencia promedio o producir señales de control.', caution: 'PWM no es una salida analógica verdadera; la carga puede requerir filtro o driver.' },
  { id: 'serial', title: 'Interfaces de comunicación', signal: 'UART · I²C · SPI · USB…', role: 'Intercambia datos con sensores, memorias, displays y otros controladores.', caution: 'Confirmar niveles eléctricos, protocolo, velocidad, dirección y conexión física.' },
  { id: 'timer', title: 'Temporizadores e interrupciones', signal: 'Tiempo · eventos', role: 'Miden intervalos, cuentan pulsos, capturan eventos y despiertan al núcleo cuando hace falta.', caution: 'Una función periférica debe estar disponible en ese MCU y asignada al pin correcto.' },
];

export interface DisplayKind {
  id: 'seven' | 'lcd' | 'oled' | 'epaper';
  name: string;
  principle: string;
  strengths: string;
  tradeoff: string;
  interface: string;
}

export const MCU_DISPLAYS: DisplayKind[] = [
  { id: 'seven', name: 'LED de 7 segmentos', principle: 'Varios LED forman segmentos; al encender una combinación se representan números y algunos caracteres.', strengths: 'Brillante, simple y fácil de leer para valores cortos.', tradeoff: 'Consume corriente; varios dígitos suelen multiplexarse o usar un driver. Cada LED necesita limitación de corriente.', interface: 'GPIO + resistencias/driver; a menudo registro de desplazamiento o controlador dedicado.' },
  { id: 'lcd', name: 'LCD de caracteres', principle: 'Cristal líquido modula luz ambiental o una retroiluminación; el módulo puede incluir su propio controlador.', strengths: 'Muestra texto y símbolos con bajo consumo de píxeles.', tradeoff: 'Requiere controlador, contraste y refresco; el ángulo y la temperatura afectan algunos módulos.', interface: 'GPIO paralelo o interfaz serial del controlador; I²C/SPI en módulos adaptadores.' },
  { id: 'oled', name: 'OLED / matriz gráfica', principle: 'Píxeles emisivos producen luz; el controlador administra filas, columnas y memoria de imagen.', strengths: 'Alto contraste y capacidad para iconos, gráficos y texto.', tradeoff: 'Presupuesto de corriente y vida útil dependen del brillo, contenido y panel.', interface: 'Controlador de display por I²C/SPI u otras interfaces según el panel.' },
  { id: 'epaper', name: 'Papel electrónico', principle: 'La imagen queda retenida con muy poca energía entre actualizaciones en muchos paneles.', strengths: 'Legible con luz ambiental y apropiado para información estática.', tradeoff: 'Actualiza más lentamente; el ciclo de refresco y consumo dependen del panel.', interface: 'Controlador de panel, normalmente serial, más señales de control.' },
];

export const MCU_QUIZ: QuizQuestion[] = [
  { q: '¿Qué integra normalmente un microcontrolador?', opts: ['Solo una CPU externa', 'Núcleo de procesamiento, memoria y periféricos en un chip', 'Únicamente memoria Flash', 'Solo entradas analógicas'], ans: 1, why: 'Un MCU integra el núcleo de CPU, memoria y periféricos de entrada/salida para controlar una aplicación embebida.' },
  { q: '¿Qué memoria conserva el firmware al quitar la alimentación?', opts: ['SRAM', 'Registro temporal', 'Flash', 'Pila'], ans: 2, why: 'Flash es no volátil y suele almacenar el programa; SRAM es volátil y se usa para datos de trabajo.' },
  { q: '¿Para qué se usa la SRAM durante la ejecución?', opts: ['Para variables y buffers temporales', 'Para emitir luz', 'Para medir el eje', 'Para sustituir todos los periféricos'], ans: 0, why: 'La SRAM es memoria de trabajo volátil usada por variables, buffers y pila.' },
  { q: '¿Qué hace un ADC?', opts: ['Convierte un valor digital en luz', 'Convierte una señal analógica muestreada en un número', 'Guarda permanentemente el programa', 'Cuenta solo pulsos de red'], ans: 1, why: 'Un convertidor analógico-digital cuantiza la señal dentro de su rango de entrada y referencia.' },
  { q: '¿Qué afirmación sobre 8/16/32 bits es más precisa?', opts: ['Siempre indica el ancho de todos los buses externos', 'Describe una propiedad del núcleo/modelo de datos; los buses pueden tener anchos distintos', 'Indica cuántos pines tiene el chip', 'Es el tamaño de la Flash'], ans: 1, why: 'La etiqueta de bits no permite deducir por sí sola el ancho de cada bus interno/externo ni el número de pines.' },
  { q: '¿Qué muestra un display de siete segmentos de forma más directa?', opts: ['Video a color', 'Dígitos y algunos caracteres simples', 'Posición absoluta multivuelta', 'Una señal analógica continua'], ans: 1, why: 'Los segmentos LED forman patrones que representan principalmente cifras; cada LED requiere control de corriente.' },
  { q: '¿Qué ventaja principal tiene un encoder incremental en cuadratura?', opts: ['Entrega siempre un código absoluto tras apagar', 'Dos canales desfasados permiten contar movimiento y determinar dirección', 'No necesita alimentación', 'Convierte temperatura en resistencia'], ans: 1, why: 'Al observar cuál canal A/B cambia primero, el controlador infiere el sentido y cuenta pulsos desde una referencia.' },
  { q: '¿Qué bloque es la salida en el ejemplo temperatura → MCU → LCD y ventilador?', opts: ['El sensor de temperatura', 'El ADC solamente', 'El LCD y la etapa que acciona el ventilador', 'La consigna almacenada'], ans: 2, why: 'El LCD visualiza el resultado y una salida lógica/driver controla el actuador; el microcontrolador procesa entre ambos.' },
  { q: '¿Qué limita el uso de un pin GPIO para alimentar directamente una carga?', opts: ['El tipo de letra del código', 'Los límites eléctricos de tensión y corriente del pin', 'El ancho del bus de direcciones únicamente', 'El tipo de encoder'], ans: 1, why: 'La carga debe respetar especificaciones eléctricas; motores, relés y LEDs de potencia suelen requerir una etapa driver.' },
];

export const MCU_QUIZ_RESULTS: [string, string, string] = [
  'Buen dominio: ya conectas arquitectura, periféricos y aplicación.',
  'Vas bien. Repasa los tipos de memoria y la diferencia entre núcleo y buses.',
  'Vuelve a recorrer la cadena Entrada → Procesamiento → Salida y prueba los laboratorios.',
];

export const MCU_SOURCES = [
  { organization: 'STMicroelectronics', title: 'STM32 MCU basics: arquitectura, periféricos y selección', url: 'https://wiki.st.com/stm32mcu/wiki/STM32StepByStep:STM32MCU_basics' },
  { organization: 'Microchip Technology', title: 'Memory features: Flash, EEPROM y SRAM', url: 'https://www.microchip.com/en-us/products/microcontrollers/8-bit-mcus/peripherals/system-flexibility/memory' },
  { organization: 'Microchip Technology', title: 'Portfolio of PIC, AVR, SAM and dsPIC microcontrollers', url: 'https://www.microchip.com/en-us/products/microcontrollers' },
  { organization: 'NXP Semiconductors', title: '80C51 8-bit microcontroller family', url: 'https://www.nxp.com/products/P87C52SFAA' },
  { organization: 'Texas Instruments', title: 'MSP430 ultra-low-power MCU family overview', url: 'https://www.ti.com/lit/pdf/slyt345' },
  { organization: 'Raspberry Pi', title: 'Microcontroller chips: RP2040 and RP2350 feature comparison', url: 'https://www.raspberrypi.com/documentation/microcontrollers/microcontroller-chips.html' },
  { organization: 'Analog Devices', title: 'Incremental and absolute encoders: operation and trade-offs', url: 'https://ez.analog.com/ez-blogs/b/engineerzone-spotlight/posts/the-what-why-and-where-of-incremental-and-absolute-encoders' },
  { organization: 'Texas Instruments', title: 'TLC59283 LED display driver datasheet (seven-segment/matrix driving)', url: 'https://www.ti.com/lit/ds/symlink/tlc59283.pdf' },
  { organization: 'Microchip Technology', title: 'Microcontrollers for segmented LCD displays', url: 'https://www.microchip.com/en-us/solutions/technologies/displays/segmented-lcd-solutions/microcontrollers-for-segmented-displays' },
];
