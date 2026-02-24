/**
 * Water properties (density and dynamic viscosity) as a function of temperature.
 * Source: NIST Standard Reference Data.
 * Temperature range: 0–100 °C at atmospheric pressure.
 */

interface WaterPropertyEntry {
  temperature: number;  // °C
  density: number;      // kg/m³
  viscosity: number;    // Pa·s (dynamic viscosity)
}

const WATER_PROPERTIES_TABLE: WaterPropertyEntry[] = [
  { temperature: 0,   density: 999.84, viscosity: 0.001792 },
  { temperature: 5,   density: 999.97, viscosity: 0.001519 },
  { temperature: 10,  density: 999.70, viscosity: 0.001307 },
  { temperature: 15,  density: 999.10, viscosity: 0.001138 },
  { temperature: 20,  density: 998.21, viscosity: 0.001002 },
  { temperature: 25,  density: 997.05, viscosity: 0.000890 },
  { temperature: 30,  density: 995.65, viscosity: 0.000798 },
  { temperature: 35,  density: 994.03, viscosity: 0.000720 },
  { temperature: 40,  density: 992.22, viscosity: 0.000653 },
  { temperature: 45,  density: 990.21, viscosity: 0.000596 },
  { temperature: 50,  density: 988.07, viscosity: 0.000547 },
  { temperature: 55,  density: 985.69, viscosity: 0.000504 },
  { temperature: 60,  density: 983.20, viscosity: 0.000467 },
  { temperature: 65,  density: 980.55, viscosity: 0.000434 },
  { temperature: 70,  density: 977.76, viscosity: 0.000404 },
  { temperature: 75,  density: 974.84, viscosity: 0.000378 },
  { temperature: 80,  density: 971.79, viscosity: 0.000355 },
  { temperature: 85,  density: 968.61, viscosity: 0.000334 },
  { temperature: 90,  density: 965.31, viscosity: 0.000315 },
  { temperature: 95,  density: 961.89, viscosity: 0.000298 },
  { temperature: 100, density: 958.37, viscosity: 0.000282 },
];

/**
 * Get water density and viscosity at a given temperature via linear interpolation.
 * Clamps to [0, 100] °C range.
 */
export function getWaterProperties(tempCelsius: number): { density: number; viscosity: number } {
  const t = Math.max(0, Math.min(100, tempCelsius));

  // Find bounding entries
  let lower = WATER_PROPERTIES_TABLE[0];
  let upper = WATER_PROPERTIES_TABLE[WATER_PROPERTIES_TABLE.length - 1];

  for (let i = 0; i < WATER_PROPERTIES_TABLE.length - 1; i++) {
    if (t >= WATER_PROPERTIES_TABLE[i].temperature && t <= WATER_PROPERTIES_TABLE[i + 1].temperature) {
      lower = WATER_PROPERTIES_TABLE[i];
      upper = WATER_PROPERTIES_TABLE[i + 1];
      break;
    }
  }

  if (lower.temperature === upper.temperature) {
    return { density: lower.density, viscosity: lower.viscosity };
  }

  const fraction = (t - lower.temperature) / (upper.temperature - lower.temperature);
  return {
    density: lower.density + fraction * (upper.density - lower.density),
    viscosity: lower.viscosity + fraction * (upper.viscosity - lower.viscosity),
  };
}
