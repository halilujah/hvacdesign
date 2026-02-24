import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { CalculatorShell } from '../components/calculator/CalculatorShell';
import { InputPanel } from '../components/calculator/InputPanel';
import { ResultsPanel } from '../components/calculator/ResultsPanel';
import { getCalculatorBySlug } from '../config/calculators.registry';
import { calculatePipeSizing } from '../engine/pipe-sizing';
import { exportToExcel } from '../export/excel-export';
import { exportToPdf } from '../export/pdf-export';
import { copyTableToClipboard } from '../export/clipboard-export';
import type { PipeSizingInput } from '../types/calculator';

const DEFAULT_INPUT: PipeSizingInput = {
  flowRate: 2.0,
  fluidTemperature: 20,
  pipeMaterial: 'commercial-steel',
  pipeLength: 100,
  unitSystem: 'metric',
};

export function CalculatorPage() {
  const { slug } = useParams<{ slug: string }>();
  const calculator = getCalculatorBySlug(slug || '');

  const [input, setInput] = useState<PipeSizingInput>(DEFAULT_INPUT);

  const result = useMemo(() => {
    if (input.flowRate <= 0 || input.pipeLength <= 0) return null;
    return calculatePipeSizing(input);
  }, [input]);

  if (!calculator || calculator.status !== 'active') {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-slate-900">Calculator not found</h1>
          <Link to="/" className="mt-4 inline-block text-accent hover:underline">Back to calculators</Link>
        </div>
      </PageLayout>
    );
  }

  const handleReset = () => setInput(DEFAULT_INPUT);

  const handleExportExcel = () => {
    if (result) exportToExcel(result, input.unitSystem);
  };

  const handleExportPdf = () => {
    if (result) exportToPdf(result, input.unitSystem);
  };

  const handleCopyTable = async () => {
    if (result) await copyTableToClipboard(result, input.unitSystem);
  };

  return (
    <PageLayout wide>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-accent mb-3">
          <ArrowLeft className="w-4 h-4" /> All Calculators
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{calculator.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{calculator.description}</p>
      </div>

      <CalculatorShell
        inputPanel={
          <InputPanel
            values={input}
            onChange={setInput}
            onReset={handleReset}
          />
        }
        resultsPanel={
          <ResultsPanel
            result={result}
            unitSystem={input.unitSystem}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            onCopyTable={handleCopyTable}
          />
        }
      />
    </PageLayout>
  );
}
