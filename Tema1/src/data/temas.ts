/**
 * Registro central de temas de la asignatura.
 * El layout y las páginas consumen este módulo para no duplicar
 * navegación, canales ni metadatos. Añadir un tema nuevo = añadir
 * una entrada aquí + crear su página.
 */

export type ThemeId = 'tema-1' | 'tema-2';

export interface ThemeChannel {
  /** Ancla real de la sección en la página, p. ej. `ch01` o `act03`. */
  id: string;
  /** Etiqueta de instrumento, p. ej. `CH01`. */
  label: string;
  /** Nombre corto que se muestra en la lámpara de canal. */
  name: string;
  /** Color del canal, siempre referenciado a un token CSS. */
  color: string;
}

export interface Theme {
  id: ThemeId;
  /** Número romano del tema. */
  roman: string;
  /** Código de instrumento (SP-01, SP-02…). */
  code: string;
  /** Nombre largo del banco. */
  name: string;
  /** Nombre corto para el selector. */
  short: string;
  /** Ruta real de la página del tema. */
  path: string;
  title: string;
  description: string;
  footer: string;
  /** Color de acento del selector (primer canal). */
  accent: string;
  channels: ThemeChannel[];
}

export interface PlannedTheme {
  roman: string;
  short: string;
}

export const TEMAS: Theme[] = [
  {
    id: 'tema-1',
    roman: 'I',
    code: 'SP-01',
    name: 'BANCO DE SENSORES',
    short: 'SENSORES',
    path: '/',
    title: 'SP-01 · Banco de Sensores — Sistemas Programables, Tema I',
    description:
      'Tema I — Sensores de Sistemas Programables: laboratorio interactivo con simulaciones de sensores ópticos, de temperatura, presión y proximidad.',
    footer: 'SP-01 · BANCO DE SENSORES — SISTEMAS PROGRAMABLES · TEMA I',
    accent: 'var(--ch-intro)',
    channels: [
      { id: 'ch01', label: 'CH01', name: 'EL SENSOR', color: 'var(--ch-intro)' },
      { id: 'ch02', label: 'CH02', name: 'ÓPTICOS', color: 'var(--ch-optico)' },
      { id: 'ch03', label: 'CH03', name: 'TEMP.', color: 'var(--ch-temp)' },
      { id: 'ch04', label: 'CH04', name: 'PRESIÓN', color: 'var(--ch-pres)' },
      { id: 'ch05', label: 'CH05', name: 'PROX.', color: 'var(--ch-prox)' },
      { id: 'quiz', label: 'TEST', name: 'REPASO', color: 'var(--ch-quiz)' },
    ],
  },
  {
    id: 'tema-2',
    roman: 'II',
    code: 'SP-02',
    name: 'BANCO DE ACTUADORES',
    short: 'ACTUADORES',
    path: '/tema-2',
    title: 'SP-02 · Banco de Actuadores — Sistemas Programables, Tema II',
    description:
      'Tema II — Actuadores de Sistemas Programables: motores, cilindros, válvulas, bombas y señalización en un laboratorio interactivo.',
    footer: 'SP-02 · BANCO DE ACTUADORES — SISTEMAS PROGRAMABLES · TEMA II',
    accent: 'var(--act-intro)',
    channels: [
      { id: 'act01', label: 'ACT-01', name: 'ACTUADOR', color: 'var(--act-intro)' },
      { id: 'act02', label: 'ACT-02', name: 'ELÉCTR.', color: 'var(--act-elec)' },
      { id: 'act03', label: 'ACT-03', name: 'NEUM.', color: 'var(--act-neum)' },
      { id: 'act04', label: 'ACT-04', name: 'HIDR.', color: 'var(--act-hidr)' },
      { id: 'act05', label: 'ACT-05', name: 'SEÑAL', color: 'var(--act-senal)' },
      { id: 'act06', label: 'ACT-06', name: 'SELEC.', color: 'var(--act-sel)' },
    ],
  },
];

export const FUTURE_TEMAS: PlannedTheme[] = [
  { roman: 'III', short: 'PRÓX.' },
  { roman: 'IV', short: 'PRÓX.' },
];

export function getTheme(id: ThemeId): Theme {
  return TEMAS.find((t) => t.id === id) ?? TEMAS[0];
}
