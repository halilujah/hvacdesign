import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PipeSizingResult } from '../types/calculator';
import type { UnitSystem } from '../types/units';
import { roundSigFigs } from '../utils/formatting';
import { mpsToFps, paPerMToPsiPer100ft, paToPsi, mmToInches } from '../engine/unit-conversions';
import { APP_BRANDING } from '../utils/constants';

export function exportToPdf(result: PipeSizingResult, unitSystem: UnitSystem): void {
  const isImperial = unitSystem === 'imperial';
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title block
  doc.setFontSize(20);
  doc.setTextColor(51, 65, 85); // Slate-700
  doc.text('Pipe Sizing Calculation Report', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  doc.text(`Calculator Version: ${result.calculatorVersion}`, 14, 34);
  doc.text(APP_BRANDING, pageWidth - 14, 28, { align: 'right' });

  // Inputs summary table
  doc.setFontSize(13);
  doc.setTextColor(51, 65, 85);
  doc.text('Input Parameters', 14, 46);

  autoTable(doc, {
    startY: 50,
    head: [['Parameter', 'Value', 'Unit']],
    body: [
      ['Flow Rate', String(result.inputSummary.flowRate), result.inputSummary.flowRateUnit],
      ['Water Temperature', String(result.inputSummary.fluidTemperature), '°C'],
      ['Pipe Material', result.inputSummary.pipeMaterial, ''],
      ['Pipe Roughness', String(result.inputSummary.pipeRoughness), 'mm'],
      ['Pipe Length', String(result.inputSummary.pipeLength), result.inputSummary.pipeLengthUnit],
      ['Fluid Density', String(roundSigFigs(result.fluidProperties.density, 5)), 'kg/m³'],
      ['Fluid Viscosity', String(roundSigFigs(result.fluidProperties.viscosity * 1e6, 4)), '× 10⁻⁶ Pa·s'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85], fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14 },
    tableWidth: pageWidth / 2.5,
  });

  // Results design table
  const lastY = (doc as unknown as Record<string, Record<string, number>>).lastAutoTable.finalY + 12;
  doc.setFontSize(13);
  doc.setTextColor(51, 65, 85);
  doc.text('Design Table — Standard Pipe Sizes (Schedule 40)', 14, lastY);

  const velUnit = isImperial ? 'ft/s' : 'm/s';
  const dpUnit = isImperial ? 'psi/100ft' : 'Pa/m';
  const dpTotalUnit = isImperial ? 'psi' : 'Pa';
  const idUnit = isImperial ? 'in' : 'mm';

  const recIndex = result.allSizes.findIndex(r => r.nps === result.recommendedSize.nps);

  autoTable(doc, {
    startY: lastY + 4,
    head: [['NPS', 'DN', `ID (${idUnit})`, `Vel (${velUnit})`, 'Re', 'f', `ΔP (${dpUnit})`, `ΔP Total (${dpTotalUnit})`, 'Status']],
    body: result.allSizes.map(row => {
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
    }),
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    didParseCell: (data) => {
      if (data.row.index === recIndex && data.section === 'body') {
        data.cell.styles.fillColor = [219, 234, 254]; // Blue-100
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // Assumptions
  const lastY2 = (doc as unknown as Record<string, Record<string, number>>).lastAutoTable.finalY + 8;

  // Check if we need a new page for assumptions
  if (lastY2 > doc.internal.pageSize.getHeight() - 30) {
    doc.addPage();
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text('Assumptions & Notes', 14, 20);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    result.assumptions.forEach((note, i) => {
      doc.text(`• ${note}`, 16, 28 + i * 5);
    });
  } else {
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text('Assumptions & Notes', 14, lastY2);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    result.assumptions.forEach((note, i) => {
      const y = lastY2 + 6 + i * 5;
      if (y < doc.internal.pageSize.getHeight() - 15) {
        doc.text(`• ${note}`, 16, y);
      }
    });
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const pageH = doc.internal.pageSize.getHeight();
    doc.text(APP_BRANDING, 14, pageH - 8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageH - 8, { align: 'right' });
  }

  doc.save(`pipe-sizing-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
