import { describe, it, expect } from 'vitest';
import {
  reynoldsNumber,
  velocityFromFlow,
  darcyWeisbachPressureDrop,
  frictionFactor,
} from '../fluid-mechanics';

describe('reynoldsNumber', () => {
  it('calculates correctly for known values', () => {
    // Water at 20°C: ρ=998.21, μ=0.001002, v=1.5 m/s, D=0.05 m
    const re = reynoldsNumber(998.21, 1.5, 0.05, 0.001002);
    // Expected: 998.21 * 1.5 * 0.05 / 0.001002 ≈ 74,716
    expect(re).toBeCloseTo(74716, -1);
  });

  it('returns 0 for zero velocity', () => {
    expect(reynoldsNumber(998, 0, 0.05, 0.001)).toBe(0);
  });
});

describe('velocityFromFlow', () => {
  it('calculates velocity from flow rate and diameter', () => {
    // Q = 0.002 m³/s, D = 0.05 m → A = π/4 * 0.05² = 0.001963 → v = 1.019 m/s
    const v = velocityFromFlow(0.002, 0.05);
    expect(v).toBeCloseTo(1.019, 2);
  });
});

describe('frictionFactor', () => {
  it('returns 64/Re for laminar flow', () => {
    const f = frictionFactor(1000, 0.000045, 0.05);
    expect(f).toBeCloseTo(0.064, 4);
  });

  it('returns 64/Re at Re=2300 boundary', () => {
    const f = frictionFactor(2300, 0.000045, 0.05);
    expect(f).toBeCloseTo(64 / 2300, 5);
  });

  it('solves Colebrook-White for turbulent flow', () => {
    // Known case: Re=100000, ε/D=0.001, expected f ≈ 0.0222 (from Moody chart)
    const f = frictionFactor(100000, 0.00005, 0.05);
    expect(f).toBeGreaterThan(0.018);
    expect(f).toBeLessThan(0.025);
  });

  it('gives reasonable values for smooth pipe', () => {
    // Smooth pipe (ε ≈ 0), Re=100000
    // Blasius: f = 0.316/Re^0.25 = 0.316/17.78 ≈ 0.0178
    const f = frictionFactor(100000, 0.0000001, 0.05);
    expect(f).toBeCloseTo(0.0180, 2);
  });

  it('converges for high Reynolds number', () => {
    const f = frictionFactor(1e7, 0.000045, 0.1);
    expect(f).toBeGreaterThan(0.008);
    expect(f).toBeLessThan(0.02);
  });
});

describe('darcyWeisbachPressureDrop', () => {
  it('calculates pressure drop correctly', () => {
    // f=0.02, L=100m, D=0.05m, ρ=998, v=1.5 m/s
    // ΔP = 0.02 * (100/0.05) * (998 * 1.5² / 2) = 0.02 * 2000 * 1122.75 = 44,910 Pa
    const dp = darcyWeisbachPressureDrop(0.02, 100, 0.05, 998, 1.5);
    expect(dp).toBeCloseTo(44910, -2);
  });

  it('returns 0 for zero velocity', () => {
    expect(darcyWeisbachPressureDrop(0.02, 100, 0.05, 998, 0)).toBe(0);
  });
});
