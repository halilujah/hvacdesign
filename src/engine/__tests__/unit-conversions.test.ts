import { describe, it, expect } from 'vitest';
import {
  litersPerSecToM3PerSec,
  m3PerSecToLitersPerSec,
  gpmToM3PerSec,
  m3PerSecToGpm,
  feetToMeters,
  metersToFeet,
  mmToInches,
  inchesToMm,
  paToPsi,
  psiToPa,
  mpsToFps,
  fpsToMps,
} from '../unit-conversions';

describe('flow rate conversions', () => {
  it('L/s to m³/s and back', () => {
    expect(litersPerSecToM3PerSec(1)).toBeCloseTo(0.001, 6);
    expect(m3PerSecToLitersPerSec(0.001)).toBeCloseTo(1, 6);
  });

  it('GPM to m³/s and back', () => {
    // 1 GPM ≈ 6.309e-5 m³/s
    const m3s = gpmToM3PerSec(1);
    expect(m3s).toBeCloseTo(6.309e-5, 7);
    expect(m3PerSecToGpm(m3s)).toBeCloseTo(1, 4);
  });

  it('round-trip GPM → m³/s → GPM', () => {
    const original = 100;
    const roundTrip = m3PerSecToGpm(gpmToM3PerSec(original));
    expect(roundTrip).toBeCloseTo(original, 4);
  });
});

describe('length conversions', () => {
  it('feet to meters', () => {
    expect(feetToMeters(1)).toBeCloseTo(0.3048, 4);
    expect(feetToMeters(100)).toBeCloseTo(30.48, 2);
  });

  it('meters to feet', () => {
    expect(metersToFeet(1)).toBeCloseTo(3.2808, 3);
  });

  it('round-trip ft → m → ft', () => {
    expect(metersToFeet(feetToMeters(50))).toBeCloseTo(50, 6);
  });
});

describe('diameter conversions', () => {
  it('inches to mm', () => {
    expect(inchesToMm(1)).toBeCloseTo(25.4, 4);
  });

  it('mm to inches', () => {
    expect(mmToInches(25.4)).toBeCloseTo(1, 4);
  });
});

describe('pressure conversions', () => {
  it('Pa to psi', () => {
    expect(paToPsi(6894.757)).toBeCloseTo(1, 3);
  });

  it('psi to Pa', () => {
    expect(psiToPa(1)).toBeCloseTo(6894.757, 0);
  });
});

describe('velocity conversions', () => {
  it('m/s to ft/s', () => {
    expect(mpsToFps(1)).toBeCloseTo(3.2808, 3);
  });

  it('ft/s to m/s', () => {
    expect(fpsToMps(1)).toBeCloseTo(0.3048, 4);
  });
});
