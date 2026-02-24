/**
 * Standard pipe sizes per ASME B36.10M (Carbon Steel) — Schedule 40.
 * Covers NPS 1/2" through 24" (DN 15 through DN 600).
 */

export interface StandardPipeSize {
  nps: string;                   // Nominal Pipe Size (e.g., "1/2", "3/4", "1")
  dn: number;                    // Diamètre Nominal in mm
  outerDiameter_mm: number;      // OD
  wallThickness_sch40_mm: number; // Schedule 40 wall thickness
  innerDiameter_mm: number;      // ID = OD - 2 * wall
}

export const STANDARD_PIPE_SIZES: StandardPipeSize[] = [
  { nps: '1/2',   dn: 15,  outerDiameter_mm: 21.3,   wallThickness_sch40_mm: 2.77,  innerDiameter_mm: 15.76 },
  { nps: '3/4',   dn: 20,  outerDiameter_mm: 26.7,   wallThickness_sch40_mm: 2.87,  innerDiameter_mm: 20.96 },
  { nps: '1',     dn: 25,  outerDiameter_mm: 33.4,   wallThickness_sch40_mm: 3.38,  innerDiameter_mm: 26.64 },
  { nps: '1-1/4', dn: 32,  outerDiameter_mm: 42.2,   wallThickness_sch40_mm: 3.56,  innerDiameter_mm: 35.08 },
  { nps: '1-1/2', dn: 40,  outerDiameter_mm: 48.3,   wallThickness_sch40_mm: 3.68,  innerDiameter_mm: 40.94 },
  { nps: '2',     dn: 50,  outerDiameter_mm: 60.3,   wallThickness_sch40_mm: 3.91,  innerDiameter_mm: 52.48 },
  { nps: '2-1/2', dn: 65,  outerDiameter_mm: 73.0,   wallThickness_sch40_mm: 5.16,  innerDiameter_mm: 62.68 },
  { nps: '3',     dn: 80,  outerDiameter_mm: 88.9,   wallThickness_sch40_mm: 5.49,  innerDiameter_mm: 77.92 },
  { nps: '3-1/2', dn: 90,  outerDiameter_mm: 101.6,  wallThickness_sch40_mm: 5.74,  innerDiameter_mm: 90.12 },
  { nps: '4',     dn: 100, outerDiameter_mm: 114.3,  wallThickness_sch40_mm: 6.02,  innerDiameter_mm: 102.26 },
  { nps: '5',     dn: 125, outerDiameter_mm: 141.3,  wallThickness_sch40_mm: 6.55,  innerDiameter_mm: 128.20 },
  { nps: '6',     dn: 150, outerDiameter_mm: 168.3,  wallThickness_sch40_mm: 7.11,  innerDiameter_mm: 154.08 },
  { nps: '8',     dn: 200, outerDiameter_mm: 219.1,  wallThickness_sch40_mm: 8.18,  innerDiameter_mm: 202.74 },
  { nps: '10',    dn: 250, outerDiameter_mm: 273.1,  wallThickness_sch40_mm: 9.27,  innerDiameter_mm: 254.56 },
  { nps: '12',    dn: 300, outerDiameter_mm: 323.9,  wallThickness_sch40_mm: 10.31, innerDiameter_mm: 303.28 },
  { nps: '14',    dn: 350, outerDiameter_mm: 355.6,  wallThickness_sch40_mm: 11.13, innerDiameter_mm: 333.34 },
  { nps: '16',    dn: 400, outerDiameter_mm: 406.4,  wallThickness_sch40_mm: 12.70, innerDiameter_mm: 381.00 },
  { nps: '18',    dn: 450, outerDiameter_mm: 457.2,  wallThickness_sch40_mm: 14.27, innerDiameter_mm: 428.66 },
  { nps: '20',    dn: 500, outerDiameter_mm: 508.0,  wallThickness_sch40_mm: 15.09, innerDiameter_mm: 477.82 },
  { nps: '24',    dn: 600, outerDiameter_mm: 609.6,  wallThickness_sch40_mm: 17.48, innerDiameter_mm: 574.64 },
];
