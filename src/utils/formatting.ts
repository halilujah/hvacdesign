/**
 * Round a number to a specified number of significant figures.
 */
export function roundSigFigs(value: number, sigFigs: number): number {
  if (value === 0) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(value))) + 1;
  const factor = Math.pow(10, sigFigs - magnitude);
  return Math.round(value * factor) / factor;
}

/**
 * Format a number for display with appropriate precision.
 * Uses engineering-friendly formatting.
 */
export function formatNumber(value: number, sigFigs: number = 4): string {
  if (value === 0) return '0';
  const rounded = roundSigFigs(value, sigFigs);
  if (Math.abs(rounded) >= 1e6 || Math.abs(rounded) < 0.001) {
    return rounded.toExponential(sigFigs - 1);
  }
  return rounded.toLocaleString('en-US', { maximumSignificantDigits: sigFigs });
}

/**
 * Format a number with fixed decimal places.
 */
export function formatFixed(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}
