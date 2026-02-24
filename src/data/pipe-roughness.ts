/**
 * Absolute roughness values (ε) for common pipe materials.
 * Source: Various engineering references (Cameron Hydraulic Data, Crane TP-410).
 */

export interface PipeMaterial {
  id: string;
  name: string;
  roughness_mm: number;  // Absolute roughness in mm
}

export const PIPE_MATERIALS: PipeMaterial[] = [
  { id: 'commercial-steel',  name: 'Commercial Steel / Welded Steel', roughness_mm: 0.045 },
  { id: 'galvanized-steel',  name: 'Galvanized Steel',                roughness_mm: 0.15 },
  { id: 'cast-iron',         name: 'Cast Iron',                       roughness_mm: 0.26 },
  { id: 'ductile-iron',      name: 'Ductile Iron (lined)',            roughness_mm: 0.025 },
  { id: 'copper',            name: 'Copper / Brass',                  roughness_mm: 0.0015 },
  { id: 'stainless-steel',   name: 'Stainless Steel',                 roughness_mm: 0.015 },
  { id: 'pvc',               name: 'PVC / Plastic',                   roughness_mm: 0.0015 },
  { id: 'concrete',          name: 'Concrete',                        roughness_mm: 0.3 },
];

export function getMaterialRoughness(materialId: string): number {
  const material = PIPE_MATERIALS.find(m => m.id === materialId);
  if (!material) {
    throw new Error(`Unknown pipe material: ${materialId}`);
  }
  return material.roughness_mm;
}
