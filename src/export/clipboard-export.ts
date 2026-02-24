import type { PipeSizingResult } from '../types/calculator';
import type { UnitSystem } from '../types/units';
import { roundSigFigs } from '../utils/formatting';
import { mpsToFps, paPerMToPsiPer100ft, paToPsi, mmToInches } from '../engine/unit-conversions';

export async function copyTableToClipboard(result: PipeSizingResult, unitSystem: UnitSystem): Promise<void> {
  const isImperial = unitSystem === 'imperial';

  const velUnit = isImperial ? 'ft/s' : 'm/s';
  const dpUnit = isImperial ? 'psi/100ft' : 'Pa/m';
  const dpTotalUnit = isImperial ? 'psi' : 'Pa';
  const idUnit = isImperial ? 'in' : 'mm';

  const headers = ['NPS', 'DN', `ID (${idUnit})`, `Velocity (${velUnit})`, 'Re', 'f', `ΔP (${dpUnit})`, `ΔP Total (${dpTotalUnit})`, 'Status'];

  const rows = result.allSizes.map(row => {
    const velocity = isImperial ? mpsToFps(row.velocity) : row.velocity;
    const dp = isImperial ? paPerMToPsiPer100ft(row.pressureDropPerMeter) : row.pressureDropPerMeter;
    const dpTotal = isImperial ? paToPsi(row.pressureDropTotal) : row.pressureDropTotal;
    const id = isImperial ? mmToInches(row.innerDiameter) : row.innerDiameter;

    return [
      row.nps,
      String(row.dn),
      String(roundSigFigs(id, 4)),
      String(roundSigFigs(velocity, 3)),
      String(Math.round(row.reynoldsNumber)),
      String(roundSigFigs(row.frictionFactor, 4)),
      String(roundSigFigs(dp, 4)),
      String(roundSigFigs(dpTotal, 4)),
      row.velocityFlag,
    ];
  });

  // Build HTML table for rich paste (Word, Google Docs)
  const htmlRows = rows.map((cells, i) => {
    const isRec = result.allSizes[i].nps === result.recommendedSize.nps;
    const rowStyle = isRec ? ' style="background-color:#DBEAFE;font-weight:bold"' : '';
    const tds = cells.map(c => `<td style="padding:4px 8px;border:1px solid #CBD5E1">${c}</td>`).join('');
    return `<tr${rowStyle}>${tds}</tr>`;
  }).join('\n');

  const headerCells = headers.map(h =>
    `<th style="padding:6px 8px;background-color:#334155;color:white;border:1px solid #334155;font-weight:600">${h}</th>`
  ).join('');

  const html = `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px">
<thead><tr>${headerCells}</tr></thead>
<tbody>
${htmlRows}
</tbody>
</table>`;

  // Build TSV for spreadsheet paste
  const tsv = [
    headers.join('\t'),
    ...rows.map(cells => cells.join('\t')),
  ].join('\n');

  // Try rich clipboard API first
  try {
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([tsv], { type: 'text/plain' }),
    });
    await navigator.clipboard.write([clipboardItem]);
  } catch {
    // Fallback: plain text only
    await navigator.clipboard.writeText(tsv);
  }
}
