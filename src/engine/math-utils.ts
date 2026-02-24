/**
 * Linear interpolation between two points.
 */
export function lerp(x: number, x0: number, y0: number, x1: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

/**
 * Round to N significant figures.
 */
export function roundSigFigs(value: number, sigFigs: number): number {
  if (value === 0) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(value))) + 1;
  const factor = Math.pow(10, sigFigs - magnitude);
  return Math.round(value * factor) / factor;
}
