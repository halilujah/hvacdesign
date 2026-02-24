/**
 * Pipe sizing calculation orchestrator.
 * Given a flow rate and conditions, calculates results for all standard pipe sizes
 * and determines the recommended size.
 */

import type { PipeSizingInput, PipeSizingResult, PipeSizeRow, VelocityFlag } from '../types/calculator';
import { STANDARD_PIPE_SIZES } from '../data/pipe-sizes';
import { getMaterialRoughness } from '../data/pipe-roughness';
import { getWaterProperties } from '../data/water-properties';
import { reynoldsNumber, velocityFromFlow, frictionFactor, darcyWeisbachPressureDrop } from './fluid-mechanics';
import { litersPerSecToM3PerSec, gpmToM3PerSec, feetToMeters } from './unit-conversions';
import { VELOCITY_THRESHOLDS } from '../config/pipe-sizing.config';

function classifyVelocity(velocity: number): VelocityFlag {
  if (velocity < VELOCITY_THRESHOLDS.low) return 'low';
  if (velocity < VELOCITY_THRESHOLDS.optimalLow) return 'acceptable-low';
  if (velocity <= VELOCITY_THRESHOLDS.optimalHigh) return 'optimal';
  if (velocity <= VELOCITY_THRESHOLDS.high) return 'acceptable-high';
  return 'high';
}

export function calculatePipeSizing(input: PipeSizingInput): PipeSizingResult {
  // Convert inputs to SI
  const flowRate_m3s = input.unitSystem === 'metric'
    ? litersPerSecToM3PerSec(input.flowRate)
    : gpmToM3PerSec(input.flowRate);

  const pipeLength_m = input.unitSystem === 'metric'
    ? input.pipeLength
    : feetToMeters(input.pipeLength);

  const roughness_mm = getMaterialRoughness(input.pipeMaterial);
  const roughness_m = roughness_mm / 1000;

  // Get fluid properties
  const fluidProps = getWaterProperties(input.fluidTemperature);

  // Calculate for each standard pipe size
  const allSizes: PipeSizeRow[] = STANDARD_PIPE_SIZES.map(pipe => {
    const diameter_m = pipe.innerDiameter_mm / 1000;
    const velocity = velocityFromFlow(flowRate_m3s, diameter_m);
    const re = reynoldsNumber(fluidProps.density, velocity, diameter_m, fluidProps.viscosity);
    const f = re > 0 ? frictionFactor(re, roughness_m, diameter_m) : 0;
    const dpPerMeter = diameter_m > 0 && velocity > 0
      ? darcyWeisbachPressureDrop(f, 1, diameter_m, fluidProps.density, velocity)
      : 0;
    const dpTotal = dpPerMeter * pipeLength_m;

    return {
      nps: pipe.nps,
      dn: pipe.dn,
      outerDiameter: pipe.outerDiameter_mm,
      wallThickness: pipe.wallThickness_sch40_mm,
      innerDiameter: pipe.innerDiameter_mm,
      velocity,
      reynoldsNumber: re,
      frictionFactor: f,
      pressureDropPerMeter: dpPerMeter,
      pressureDropTotal: dpTotal,
      velocityFlag: classifyVelocity(velocity),
    };
  });

  // Find recommended size: smallest pipe in optimal velocity range
  let recommended = allSizes.find(s => s.velocityFlag === 'optimal');
  if (!recommended) {
    // Fallback: find pipe closest to 1.5 m/s (middle of optimal range)
    recommended = allSizes.reduce((best, current) =>
      Math.abs(current.velocity - 1.5) < Math.abs(best.velocity - 1.5) ? current : best
    );
  }

  // Build assumptions
  const assumptions: string[] = [
    'Pipe schedule: Schedule 40 (ASME B36.10M)',
    `Pipe material: ${input.pipeMaterial} (ε = ${roughness_mm} mm)`,
    `Water temperature: ${input.fluidTemperature} °C`,
    `Water density: ${fluidProps.density.toFixed(2)} kg/m³`,
    `Water viscosity: ${(fluidProps.viscosity * 1e6).toFixed(1)} × 10⁻⁶ Pa·s`,
    'Calculation method: Darcy-Weisbach with Colebrook-White friction factor',
    'Optimal velocity range: 1.0–2.5 m/s',
    'Pressure drop is for straight pipe only (no fittings or valves)',
  ];

  // Check for transitional flow warnings
  const transitional = allSizes.filter(s => s.reynoldsNumber > 2300 && s.reynoldsNumber < 4000);
  if (transitional.length > 0) {
    assumptions.push(
      `Note: Some sizes (${transitional.map(s => s.nps).join(', ')}) have Reynolds numbers in the transitional zone (2300–4000). Results in this zone may be less accurate.`
    );
  }

  return {
    recommendedSize: recommended,
    allSizes,
    fluidProperties: fluidProps,
    assumptions,
    calculatorVersion: '1.0.0',
    timestamp: new Date().toISOString(),
    inputSummary: {
      flowRate: input.flowRate,
      flowRateUnit: input.unitSystem === 'metric' ? 'L/s' : 'GPM',
      fluidTemperature: input.fluidTemperature,
      pipeMaterial: input.pipeMaterial,
      pipeRoughness: roughness_mm,
      pipeLength: input.pipeLength,
      pipeLengthUnit: input.unitSystem === 'metric' ? 'm' : 'ft',
      unitSystem: input.unitSystem,
    },
  };
}
