/**
 * Core fluid mechanics calculations.
 * All inputs and outputs are in SI units.
 */

/**
 * Reynolds number: Re = ρvD/μ
 * @param density    kg/m³
 * @param velocity   m/s
 * @param diameter   m
 * @param viscosity  Pa·s (dynamic viscosity)
 */
export function reynoldsNumber(
  density: number,
  velocity: number,
  diameter: number,
  viscosity: number,
): number {
  return (density * velocity * diameter) / viscosity;
}

/**
 * Velocity from flow rate using continuity equation: v = Q / A = Q / (π/4 · D²)
 * @param flowRate  m³/s
 * @param diameter  m
 */
export function velocityFromFlow(flowRate: number, diameter: number): number {
  const area = (Math.PI / 4) * diameter * diameter;
  return flowRate / area;
}

/**
 * Darcy-Weisbach pressure drop: ΔP = f · (L/D) · (ρv²/2)
 * @param frictionFact  Darcy friction factor (dimensionless)
 * @param length        m
 * @param diameter      m
 * @param density       kg/m³
 * @param velocity      m/s
 * @returns Pressure drop in Pa
 */
export function darcyWeisbachPressureDrop(
  frictionFact: number,
  length: number,
  diameter: number,
  density: number,
  velocity: number,
): number {
  return frictionFact * (length / diameter) * (density * velocity * velocity / 2);
}

/**
 * Swamee-Jain explicit approximation for friction factor.
 * Used as initial guess for Colebrook-White iteration.
 * Valid for 5000 ≤ Re ≤ 1e8 and 1e-6 ≤ ε/D ≤ 0.05
 * @param re         Reynolds number
 * @param roughness  Absolute roughness (m)
 * @param diameter   m
 */
export function swameeJain(re: number, roughness: number, diameter: number): number {
  const relRoughness = roughness / diameter;
  const term = Math.log10(relRoughness / 3.7 + 5.74 / Math.pow(re, 0.9));
  return 0.25 / (term * term);
}

/**
 * Colebrook-White equation solver for Darcy friction factor.
 * Uses Newton-Raphson iteration with Swamee-Jain initial guess.
 *
 * Equation: 1/√f = -2·log₁₀(ε/(3.7D) + 2.51/(Re·√f))
 *
 * For laminar flow (Re < 2300): f = 64/Re
 *
 * @param re         Reynolds number
 * @param roughness  Absolute roughness (m)
 * @param diameter   m
 * @returns Darcy friction factor
 */
export function frictionFactor(
  re: number,
  roughness: number,
  diameter: number,
): number {
  // Laminar flow
  if (re <= 2300) {
    return 64 / re;
  }

  const relRoughness = roughness / diameter;
  const a = relRoughness / 3.7;

  // Initial guess from Swamee-Jain
  let f = swameeJain(re, roughness, diameter);

  // Newton-Raphson iteration on:
  // g(f) = 1/sqrt(f) + 2*log10(a + 2.51/(Re*sqrt(f)))
  const maxIter = 50;
  const tolerance = 1e-10;

  for (let i = 0; i < maxIter; i++) {
    const sqrtF = Math.sqrt(f);
    const invSqrtF = 1 / sqrtF;
    const b = 2.51 / (re * sqrtF);
    const logArg = a + b;
    const g = invSqrtF + 2 * Math.log10(logArg);

    // Derivative: dg/df
    const dInvSqrtF = -0.5 / (f * sqrtF);           // d(1/sqrt(f))/df
    const db = -0.5 * 2.51 / (re * f * sqrtF);       // d(b)/df
    const dg = dInvSqrtF + 2 * db / (logArg * Math.LN10);

    const fNew = f - g / dg;

    if (fNew <= 0) {
      // Safety: if Newton step goes negative, halve current f
      f = f / 2;
      continue;
    }

    if (Math.abs(fNew - f) / f < tolerance) {
      return fNew;
    }

    f = fNew;
  }

  return f; // Return best estimate after max iterations
}
