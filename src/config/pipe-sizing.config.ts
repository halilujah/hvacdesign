import { PIPE_MATERIALS } from '../data/pipe-roughness';

export interface InputFieldConfig {
  id: string;
  label: string;
  type: 'number' | 'select';
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  metricUnit?: string;
  imperialUnit?: string;
  options?: { value: string; label: string }[];
  helpText?: string;
  required?: boolean;
}

export const PIPE_SIZING_FIELDS: InputFieldConfig[] = [
  {
    id: 'flowRate',
    label: 'Flow Rate',
    type: 'number',
    defaultValue: 2.0,
    min: 0.01,
    max: 10000,
    step: 0.1,
    metricUnit: 'L/s',
    imperialUnit: 'GPM',
    helpText: 'Volume flow rate of water through the pipe',
    required: true,
  },
  {
    id: 'pipeMaterial',
    label: 'Pipe Material',
    type: 'select',
    defaultValue: 'commercial-steel',
    options: PIPE_MATERIALS.map(m => ({ value: m.id, label: m.name })),
    helpText: 'Material determines the internal roughness coefficient',
    required: true,
  },
  {
    id: 'pipeLength',
    label: 'Pipe Length',
    type: 'number',
    defaultValue: 100,
    min: 0.1,
    max: 100000,
    step: 1,
    metricUnit: 'm',
    imperialUnit: 'ft',
    helpText: 'Total length of the pipe run for pressure drop calculation',
    required: true,
  },
  {
    id: 'fluidTemperature',
    label: 'Water Temperature',
    type: 'number',
    defaultValue: 20,
    min: 0,
    max: 100,
    step: 1,
    metricUnit: '°C',
    imperialUnit: '°C',
    helpText: 'Temperature affects water density and viscosity (0–100 °C)',
    required: true,
  },
];

export const VELOCITY_THRESHOLDS = {
  low: 0.5,
  optimalLow: 1.0,
  optimalHigh: 2.5,
  high: 3.5,
} as const;
