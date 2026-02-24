import type { CalculatorMeta } from '../types/calculator';

export const CALCULATORS: CalculatorMeta[] = [
  {
    id: 'pipe-sizing',
    slug: 'pipe-sizing',
    title: 'Water Flow / Pipe Sizing',
    description: 'Calculate velocity, pressure drop, and recommended pipe size for water systems using Darcy-Weisbach and Colebrook-White equations.',
    category: 'hydraulic',
    version: '1.0.0',
    status: 'active',
    icon: 'Droplets',
  },
  {
    id: 'duct-sizing',
    slug: 'duct-sizing',
    title: 'Duct Sizing',
    description: 'Calculate air velocity and pressure drop for rectangular and circular ducts.',
    category: 'ventilation',
    version: '0.0.0',
    status: 'coming-soon',
    icon: 'Wind',
  },
  {
    id: 'heat-loss',
    slug: 'heat-loss',
    title: 'Heat Loss Calculator',
    description: 'Calculate building heat loss based on U-values, areas, and temperature difference.',
    category: 'heating',
    version: '0.0.0',
    status: 'coming-soon',
    icon: 'Flame',
  },
];

export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find(c => c.slug === slug);
}
