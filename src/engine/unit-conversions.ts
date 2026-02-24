/**
 * Unit conversion functions.
 * The calculation engine works exclusively in SI units.
 * These functions convert user input/display values to/from SI.
 */

// Flow rate: L/s ↔ m³/s
export function litersPerSecToM3PerSec(lps: number): number {
  return lps / 1000;
}

export function m3PerSecToLitersPerSec(m3ps: number): number {
  return m3ps * 1000;
}

// Flow rate: GPM ↔ m³/s
export function gpmToM3PerSec(gpm: number): number {
  return gpm * 6.30902e-5;
}

export function m3PerSecToGpm(m3ps: number): number {
  return m3ps / 6.30902e-5;
}

// Length: ft ↔ m
export function feetToMeters(ft: number): number {
  return ft * 0.3048;
}

export function metersToFeet(m: number): number {
  return m / 0.3048;
}

// Diameter: in ↔ mm
export function inchesToMm(inches: number): number {
  return inches * 25.4;
}

export function mmToInches(mm: number): number {
  return mm / 25.4;
}

// Velocity: ft/s ↔ m/s
export function fpsToMps(fps: number): number {
  return fps * 0.3048;
}

export function mpsToFps(mps: number): number {
  return mps / 0.3048;
}

// Pressure: Pa ↔ psi
export function paToPsi(pa: number): number {
  return pa / 6894.757;
}

export function psiToPa(psi: number): number {
  return psi * 6894.757;
}

// Pressure drop: Pa/m ↔ psi/100ft
export function paPerMToPsiPer100ft(paPerm: number): number {
  return (paPerm * 0.3048 * 100) / 6894.757;
}

export function psiPer100ftToPaPerM(psiPer100ft: number): number {
  return (psiPer100ft * 6894.757) / (0.3048 * 100);
}
