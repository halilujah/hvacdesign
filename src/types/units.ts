export type UnitSystem = 'metric' | 'imperial';

export interface UnitOption {
  label: string;
  symbol: string;
}

export interface UnitPair {
  metric: UnitOption;
  imperial: UnitOption;
}

export const FLOW_RATE_UNITS: UnitPair = {
  metric: { label: 'Liters per second', symbol: 'L/s' },
  imperial: { label: 'Gallons per minute', symbol: 'GPM' },
};

export const LENGTH_UNITS: UnitPair = {
  metric: { label: 'Meters', symbol: 'm' },
  imperial: { label: 'Feet', symbol: 'ft' },
};

export const VELOCITY_UNITS: UnitPair = {
  metric: { label: 'Meters per second', symbol: 'm/s' },
  imperial: { label: 'Feet per second', symbol: 'ft/s' },
};

export const PRESSURE_DROP_UNITS: UnitPair = {
  metric: { label: 'Pascals per meter', symbol: 'Pa/m' },
  imperial: { label: 'psi per 100 ft', symbol: 'psi/100ft' },
};

export const DIAMETER_UNITS: UnitPair = {
  metric: { label: 'Millimeters', symbol: 'mm' },
  imperial: { label: 'Inches', symbol: 'in' },
};

export const TOTAL_PRESSURE_UNITS: UnitPair = {
  metric: { label: 'Pascals', symbol: 'Pa' },
  imperial: { label: 'psi', symbol: 'psi' },
};
