import type { UnitSystem } from './units';

export interface CalculatorMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'hydraulic' | 'ventilation' | 'heating';
  version: string;
  status: 'active' | 'coming-soon';
  icon: string;
}

export type VelocityFlag = 'low' | 'acceptable-low' | 'optimal' | 'acceptable-high' | 'high';

export interface PipeSizingInput {
  flowRate: number;         // L/s (metric) or GPM (imperial) — converted to m³/s for engine
  fluidTemperature: number; // °C
  pipeMaterial: string;
  pipeLength: number;       // m (metric) or ft (imperial)
  unitSystem: UnitSystem;
}

export interface PipeSizeRow {
  nps: string;
  dn: number;
  outerDiameter: number;    // mm
  wallThickness: number;    // mm
  innerDiameter: number;    // mm
  velocity: number;         // m/s
  reynoldsNumber: number;
  frictionFactor: number;
  pressureDropPerMeter: number; // Pa/m
  pressureDropTotal: number;    // Pa
  velocityFlag: VelocityFlag;
}

export interface FluidProperties {
  density: number;    // kg/m³
  viscosity: number;  // Pa·s
}

export interface PipeSizingResult {
  recommendedSize: PipeSizeRow;
  allSizes: PipeSizeRow[];
  fluidProperties: FluidProperties;
  assumptions: string[];
  calculatorVersion: string;
  timestamp: string;
  inputSummary: {
    flowRate: number;
    flowRateUnit: string;
    fluidTemperature: number;
    pipeMaterial: string;
    pipeRoughness: number;
    pipeLength: number;
    pipeLengthUnit: string;
    unitSystem: UnitSystem;
  };
}
