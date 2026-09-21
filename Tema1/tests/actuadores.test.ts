import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLASIFICACION_ACTUADORES,
  CONTROL_SCENARIOS,
  SECTOR_APLICACIONES,
} from '../src/data/actuadores.ts';

test('exposes the four canonical actuator families with the required fields', () => {
  assert.equal(CLASIFICACION_ACTUADORES.length, 4);
  assert.deepEqual(
    CLASIFICACION_ACTUADORES.map((entry) => entry.id),
    ['electrico', 'mecanico', 'neumatico', 'hidraulico'],
  );
  for (const family of CLASIFICACION_ACTUADORES) {
    assert.ok(family.nombre.length > 0, 'familia sin nombre');
    assert.ok(family.icono.length > 0, 'familia sin icono');
    assert.ok(family.fuenteEnergia.length > 0, 'familia sin fuenteEnergia');
    assert.ok(family.movimientoTipico.length > 0, 'familia sin movimientoTipico');
    assert.ok(family.ventajas.length > 0, `${family.id} sin ventajas`);
    assert.ok(family.desventajas.length > 0, `${family.id} sin desventajas`);
    assert.ok(family.aplicaciones.length > 0, `${family.id} sin aplicaciones`);
  }
});

test('covers all four industrial sectors with at least three frequent actuators each', () => {
  assert.equal(SECTOR_APLICACIONES.length, 4);
  assert.deepEqual(
    SECTOR_APLICACIONES.map((entry) => entry.id),
    ['automotriz', 'manufactura', 'robotica', 'domotica'],
  );
  for (const sector of SECTOR_APLICACIONES) {
    assert.ok(sector.nombre.length > 0, 'sector sin nombre');
    assert.ok(sector.descripcion.length > 0, `${sector.id} sin descripción`);
    assert.ok(sector.actuadores.length >= 3, `${sector.id} debería listar ≥3 actuadores`);
  }
});

test('includes the smoke-alarm control-loop scenario without disturbing the first three', () => {
  assert.ok(
    CONTROL_SCENARIOS.some((scenario) => scenario.id === 'humo-zumbador'),
    'humo-zumbador debería estar presente en CONTROL_SCENARIOS',
  );
  assert.deepEqual(
    CONTROL_SCENARIOS.slice(0, 3).map((scenario) => scenario.id),
    ['temperature-fan', 'inductive-belt', 'pressure-valve'],
  );
  const smoke = CONTROL_SCENARIOS.find((scenario) => scenario.id === 'humo-zumbador');
  assert.ok(smoke);
  assert.equal(smoke.controller, 'arduino');
  assert.equal(smoke.actuator, 'zumbador');
  assert.ok(smoke.condition.toLowerCase().includes('humo'));
});
