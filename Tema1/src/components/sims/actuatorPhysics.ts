/** Pure calculations shared by the actuator simulators and their tests. */

export function pistonAreaCm2(diameterMm: number): number {
  return Math.PI * (diameterMm / 20) ** 2;
}

export function rodAreaCm2(pistonDiameterMm: number, diameterRatio = 0.4): number {
  return pistonAreaCm2(pistonDiameterMm * diameterRatio);
}

export function actuatorForceN(pressureBar: number, areaCm2: number): number {
  return pressureBar * areaCm2 * 10;
}

export function hydraulicVelocityMps(flowLitersPerMinute: number, areaCm2: number): number {
  return (flowLitersPerMinute * 1000) / areaCm2 / 100 / 60;
}

export function hydraulicPowerKw(pressureBar: number, flowLitersPerMinute: number): number {
  return (pressureBar * flowLitersPerMinute) / 600;
}

export function synchronousRpm(frequencyHz: number, poles: number): number {
  return (120 * frequencyHz) / poles;
}

export function rotorRpm(synchronousSpeed: number, slipRatio = 0.04): number {
  return synchronousSpeed * (1 - slipRatio);
}

export type StepDirection = 1 | -1;

export function normalizeAngle(angle: number): number {
  return Number((((angle % 360) + 360) % 360).toFixed(1));
}

export function stepperAngle(steps: number, angleStep: number, direction: StepDirection = 1): number {
  return normalizeAngle(steps * angleStep * direction);
}

export function stepperPhaseIndex(steps: number, direction: StepDirection = 1): number {
  return ((steps * direction) % 4 + 4) % 4;
}

export function stepperPulseIntervalMs(pulsesPerSecond: number): number {
  return 1000 / Math.max(0.1, pulsesPerSecond);
}
