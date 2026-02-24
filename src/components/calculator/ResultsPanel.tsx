import type { PipeSizingResult } from '../../types/calculator';
import type { UnitSystem } from '../../types/units';
import { Card } from '../ui/Card';
import { ResultsSummary } from './ResultsSummary';
import { DesignTable } from './DesignTable';
import { NotesSection } from './NotesSection';
import { ExportToolbar } from './ExportToolbar';

interface ResultsPanelProps {
  result: PipeSizingResult | null;
  unitSystem: UnitSystem;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onCopyTable: () => Promise<void>;
}

export function ResultsPanel({
  result,
  unitSystem,
  onExportExcel,
  onExportPdf,
  onCopyTable,
}: ResultsPanelProps) {
  if (!result) {
    return (
      <Card>
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">Enter values to see results</p>
          <p className="text-sm mt-2">Adjust the input parameters on the left to calculate pipe sizing.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Calculation Results</h2>

      <ResultsSummary result={result} unitSystem={unitSystem} />

      <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
        Design Table — All Standard Pipe Sizes
      </h3>
      <DesignTable result={result} unitSystem={unitSystem} />

      <NotesSection assumptions={result.assumptions} />

      <ExportToolbar
        onExportExcel={onExportExcel}
        onExportPdf={onExportPdf}
        onCopyTable={onCopyTable}
      />
    </Card>
  );
}
