import test from 'node:test';
import assert from 'node:assert/strict';
import { MCU_DISPLAYS, MCU_FAMILIES, MCU_IO, MCU_MEMORIES, MCU_QUIZ, MCU_SOURCES } from '../src/data/microcontroladores.ts';

test('covers representative microcontroller families without conflating ISA and vendor', () => {
  const ids = MCU_FAMILIES.map((family) => family.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes('classic-8'));
  assert.ok(ids.includes('control-16'));
  assert.ok(ids.includes('cortex-m'));
  assert.ok(ids.includes('risc-v'));
  assert.ok(MCU_FAMILIES.every((family) => family.overview.length > 0 && family.examples.length > 0 && family.fit.length > 0));
});

test('documents distinct memory roles and volatility', () => {
  assert.deepEqual(MCU_MEMORIES.map((memory) => memory.id), ['flash', 'sram', 'eeprom', 'rom', 'registers']);
  assert.equal(MCU_MEMORIES.find((memory) => memory.id === 'sram')?.volatility, 'Volátil');
  assert.equal(MCU_MEMORIES.find((memory) => memory.id === 'flash')?.volatility, 'No volátil');
  assert.ok(MCU_MEMORIES.find((memory) => memory.id === 'eeprom')?.role.includes('algunos'));
});

test('covers digital, analog, timing, PWM and serial I/O fundamentals', () => {
  assert.deepEqual(MCU_IO.map((item) => item.id), ['gpio', 'adc', 'pwm', 'serial', 'timer']);
  assert.ok(MCU_IO.every((item) => item.role.length > 0 && item.caution.length > 0));
});

test('includes LED, LCD, OLED and another display technology', () => {
  assert.deepEqual(MCU_DISPLAYS.map((display) => display.id), ['seven', 'lcd', 'oled', 'epaper']);
  assert.ok(MCU_DISPLAYS.every((display) => display.principle && display.strengths && display.tradeoff && display.interface));
});

test('quiz bank is usable and backed by linked technical sources', () => {
  assert.ok(MCU_QUIZ.length >= 8);
  assert.ok(MCU_QUIZ.every((question) => question.opts.length === 4 && question.ans >= 0 && question.ans < question.opts.length && question.why.length > 0));
  assert.ok(MCU_SOURCES.length >= 6);
  assert.ok(MCU_SOURCES.every((source) => source.url.startsWith('https://')));
});
