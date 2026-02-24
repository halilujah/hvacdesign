import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { PipeSizingResult } from '../types/calculator';
import type { UnitSystem } from '../types/units';
import { roundSigFigs } from '../utils/formatting';
import { mpsToFps, paPerMToPsiPer100ft, paToPsi, mmToInches } from '../engine/unit-conversions';
import { APP_BRANDING } from '../utils/constants';

export function exportToExcel(result: PipeSizingResult, unitSystem: UnitSystem): void {
  const isImperial = unitSystem === 'imperial';
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Inputs Summary
  const inputsData = [
    ['Parameter', 'Value', 'Unit'],
    ['Flow Rate', result.inputSummary.flowRate, result.inputSummary.flowRateUnit],
    ['Water Temperature', result.inputSummary.fluidTemperature, '°C'],
    ['Pipe Material', result.inputSummary.pipeMaterial, ''],
    ['Pipe Roughness', result.inputSummary.pipeRoughness, 'mm'],
    ['Pipe Length', result.inputSummary.pipeLength, result.inputSummary.pipeLengthUnit],
    ['Fluid Density', roundSigFigs(result.fluidProperties.density, 5), 'kg/m³'],
    ['Fluid Viscosity', roundSigFigs(result.fluidProperties.viscosity * 1e6, 4), '× 10⁻⁶ Pa·s'],
    ['Unit System', result.inputSummary.unitSystem, ''],
  ];
  const inputsSheet = XLSX.utils.aoa_to_sheet(inputsData);
  inputsSheet['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(workbook, inputsSheet, 'Inputs');

  // Sheet 2: Results Table
  const velUnit = isImperial ? 'ft/s' : 'm/s';
  const dpUnit = isImperial ? 'psi/100ft' : 'Pa/m';
  const dpTotalUnit = isImperial ? 'psi' : 'Pa';
  const idUnit = isImperial ? 'in' : 'mm';

  const headers = [
    'NPS', 'DN', `ID (${idUnit})`, `Velocity (${velUnit})`,
    'Reynolds No.', 'Friction Factor',
    `ΔP (${dpUnit})`, `ΔP Total (${dpTotalUnit})`, 'Status', 'Recommended',
  ];

  const resultsRows = result.allSizes.map(row => {
    const velocity = isImperial ? mpsToFps(row.velocity) : row.velocity;
    const dp = isImperial ? paPerMToPsiPer100ft(row.pressureDropPerMeter) : row.pressureDropPerMeter;
    const dpTotal = isImperial ? paToPsi(row.pressureDropTotal) : row.pressureDropTotal;
    const id = isImperial ? mmToInches(row.innerDiameter) : row.innerDiameter;

    return [
      row.nps,
      row.dn,
      roundSigFigs(id, 4),
      roundSigFigs(velocity, 4),
      Math.round(row.reynoldsNumber),
      roundSigFigs(row.frictionFactor, 5),
      roundSigFigs(dp, 4),
      roundSigFigs(dpTotal, 4),
      row.velocityFlag,
      row.nps === result.recommendedSize.nps ? 'YES' : '',
    ];
  });

  const resultsSheet = XLSX.utils.aoa_to_sheet([headers, ...resultsRows]);
  resultsSheet['!cols'] = [
    { wch: 8 }, { wch: 6 }, { wch: 12 }, { wch: 14 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    { wch: 14 }, { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Results');

  // Sheet 3: Metadata
  const metaData = [
    ['Calculator', 'Water Flow / Pipe Sizing'],
    ['Version', result.calculatorVersion],
    ['Generated', result.timestamp],
    ['Tool', APP_BRANDING],
    [''],
    ['Assumptions'],
    ...result.assumptions.map(a => [a]),
  ];
  const metaSheet = XLSX.utils.aoa_to_sheet(metaData);
  metaSheet['!cols'] = [{ wch: 15 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(workbook, metaSheet, 'Metadata');

  // Write and download
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `pipe-sizing-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
