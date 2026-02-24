import { describe, it, expect } from 'vitest';
import { calculatePipeSizing } from '../pipe-sizing';
import type { PipeSizingInput } from '../../types/calculator';

const baseInput: PipeSizingInput = {
  flowRate: 2.0,        // 2 L/s
  fluidTemperature: 20,
  pipeMaterial: 'commercial-steel',
  pipeLength: 100,
  unitSystem: 'metric',
};

describe('calculatePipeSizing', () => {
  it('returns results for all standard pipe sizes', () => {
    const result = calculatePipeSizing(baseInput);
    expect(result.allSizes.length).toBe(20); // NPS 1/2 through 24
  });

  it('identifies a recommended size', () => {
    const result = calculatePipeSizing(baseInput);
    expect(result.recommendedSize).toBeDefined();
    expect(result.recommendedSize.velocityFlag).toBe('optimal');
  });

  it('recommended size has velocity in optimal range (1.0-2.5 m/s)', () => {
    const result = calculatePipeSizing(baseInput);
    expect(result.recommendedSize.velocity).toBeGreaterThanOrEqual(1.0);
    expect(result.recommendedSize.velocity).toBeLessThanOrEqual(2.5);
  });

  it('velocities decrease as pipe size increases', () => {
    const result = calculatePipeSizing(baseInput);
    for (let i = 1; i < result.allSizes.length; i++) {
      expect(result.allSizes[i].velocity).toBeLessThan(result.allSizes[i - 1].velocity);
    }
  });

  it('pressure drops decrease as pipe size increases', () => {
    const result = calculatePipeSizing(baseInput);
    for (let i = 1; i < result.allSizes.length; i++) {
      expect(result.allSizes[i].pressureDropPerMeter).toBeLessThan(
        result.allSizes[i - 1].pressureDropPerMeter
      );
    }
  });

  it('includes correct fluid properties for 20°C water', () => {
    const result = calculatePipeSizing(baseInput);
    expect(result.fluidProperties.density).toBeCloseTo(998.21, 0);
    expect(result.fluidProperties.viscosity).toBeCloseTo(0.001002, 4);
  });

  it('includes assumptions list', () => {
    const result = calculatePipeSizing(baseInput);
    expect(result.assumptions.length).toBeGreaterThan(0);
    expect(result.assumptions.some(a => a.includes('Darcy-Weisbach'))).toBe(true);
  });

  it('handles imperial units input', () => {
    const imperialInput: PipeSizingInput = {
      flowRate: 30,         // ~30 GPM ≈ ~1.9 L/s
      fluidTemperature: 20,
      pipeMaterial: 'commercial-steel',
      pipeLength: 328,      // ~100m
      unitSystem: 'imperial',
    };
    const result = calculatePipeSizing(imperialInput);
    expect(result.allSizes.length).toBe(20);
    expect(result.recommendedSize).toBeDefined();
    expect(result.inputSummary.flowRateUnit).toBe('GPM');
  });

  it('handles hot water (80°C) with different properties', () => {
    const hotInput: PipeSizingInput = {
      ...baseInput,
      fluidTemperature: 80,
    };
    const result = calculatePipeSizing(hotInput);
    // Hot water has lower viscosity → higher Re for same velocity
    expect(result.fluidProperties.viscosity).toBeLessThan(0.001);
    expect(result.fluidProperties.density).toBeLessThan(980);
  });

  it('handles very small flow rate', () => {
    const smallInput: PipeSizingInput = {
      ...baseInput,
      flowRate: 0.05, // 0.05 L/s — very small
    };
    const result = calculatePipeSizing(smallInput);
    expect(result.allSizes.length).toBe(20);
    // Most pipes should show low velocity
    const lowVelocity = result.allSizes.filter(s => s.velocityFlag === 'low');
    expect(lowVelocity.length).toBeGreaterThan(10);
  });

  it('handles large flow rate', () => {
    const largeInput: PipeSizingInput = {
      ...baseInput,
      flowRate: 500, // 500 L/s — industrial
    };
    const result = calculatePipeSizing(largeInput);
    expect(result.allSizes.length).toBe(20);
    // Smaller pipes should show high velocity
    const highVelocity = result.allSizes.filter(s => s.velocityFlag === 'high');
    expect(highVelocity.length).toBeGreaterThan(5);
  });
});
