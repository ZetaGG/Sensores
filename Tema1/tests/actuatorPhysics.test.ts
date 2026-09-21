import test from 'node:test';
import assert from 'node:assert/strict';
import {
  actuatorForceN,
  hydraulicPowerKw,
  hydraulicVelocityMps,
  pistonAreaCm2,
  rodAreaCm2,
  rotorRpm,
  stepperAngle,
  stepperPhaseIndex,
  stepperPulseIntervalMs,
  synchronousRpm,
} from '../src/components/sims/actuatorPhysics.ts';
import { ACTUATOR_CHALLENGES, CONTROL_SCENARIOS, SELECTION_CRITERIA } from '../src/data/actuadores.ts';
import { isChallengeCorrect } from '../src/components/sims/challengeLogic.ts';

function assertClose(actual: number, expected: number, tolerance = 0.001) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not close to ${expected}`);
}

test('computes pneumatic advance and retract forces for a 32 mm piston', () => {
  const pistonArea = pistonAreaCm2(32);
  const rodArea = rodAreaCm2(32);

  assertClose(actuatorForceN(6, pistonArea), 482.55, 0.01);
  assertClose(actuatorForceN(6, pistonArea - rodArea), 405.34, 0.01);
});

test('computes hydraulic force, velocity and power in the expected units', () => {
  const pistonArea = pistonAreaCm2(80);
  const annularArea = pistonArea - rodAreaCm2(80);

  assertClose(actuatorForceN(120, pistonArea), 60318.58, 0.01);
  assertClose(hydraulicVelocityMps(20, pistonArea), 0.06631, 0.00001);
  assertClose(hydraulicVelocityMps(20, annularArea), 0.07895, 0.00001);
  assert.equal(hydraulicPowerKw(120, 20), 4);
});

test('computes synchronous and slipped AC motor speeds', () => {
  assert.equal(synchronousRpm(50, 4), 1500);
  assert.equal(Math.round(rotorRpm(1500)), 1440);
});

test('computes stepper angle, direction, phase and pulse interval', () => {
  assert.equal(stepperAngle(1, 1.8, 1), 1.8);
  assert.equal(stepperAngle(1, 1.8, -1), 358.2);
  assert.equal(stepperAngle(200, 1.8, 1), 0);
  assert.equal(stepperPhaseIndex(0, 1), 0);
  assert.equal(stepperPhaseIndex(1, 1), 1);
  assert.equal(stepperPhaseIndex(1, -1), 3);
  assert.equal(stepperPulseIntervalMs(5), 200);
  assert.equal(stepperPulseIntervalMs(0), 10000);
});

test('defines the required Tema II learning data', () => {
  assert.deepEqual(SELECTION_CRITERIA.map((criterion) => criterion.id), [
    'power',
    'controllability',
    'size',
    'precision',
    'speed',
    'maintenance',
    'cost',
  ]);
  assert.deepEqual(CONTROL_SCENARIOS.slice(0, 3).map((scenario) => scenario.id), [
    'temperature-fan',
    'inductive-belt',
    'pressure-valve',
  ]);
  assert.ok(ACTUATOR_CHALLENGES.some((challenge) => challenge.id === 'positioned-conveyor'));
});

test('evaluates actuator challenge answers without mutating challenge data', () => {
  const challenge = ACTUATOR_CHALLENGES[0];
  assert.equal(isChallengeCorrect(challenge, 'stepper'), true);
  assert.equal(isChallengeCorrect(challenge, 'buzzer'), false);
  assert.equal(challenge.correct, 'stepper');
});
