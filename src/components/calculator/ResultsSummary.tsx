import type { PipeSizingResult } from '../../types/calculator';
import type { UnitSystem } from '../../types/units';
import { formatNumber } from '../../utils/formatting';
import { mpsToFps, paPerMToPsiPer100ft, paToPsi } from '../../engine/unit-conversions';

interface ResultsSummaryProps {
  result: PipeSizingResult;
  unitSystem: UnitSystem;
}

export function ResultsSummary({ result, unitSystem }: ResultsSummaryProps) {
  const rec = result.recommendedSize;
  const isImperial = unitSystem === 'imperial';

  const velocity = isImperial ? mpsToFps(rec.velocity) : rec.velocity;
  const velocityUnit = isImperial ? 'ft/s' : 'm/s';

  const dpPerUnit = isImperial ? paPerMToPsiPer100ft(rec.pressureDropPerMeter) : rec.pressureDropPerMeter;
  const dpPerUnitLabel = isImperial ? 'psi/100ft' : 'Pa/m';

  const dpTotal = isImperial ? paToPsi(rec.pressureDropTotal) : rec.pressureDropTotal;
  const dpTotalUnit = isImperial ? 'psi' : 'Pa';

  const cards = [
    {
      label: 'Recommended Size',
      value: `NPS ${rec.nps}`,
      sub: `DN ${rec.dn} — ID ${rec.innerDiameter.toFixed(1)} mm`,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Velocity',
      value: `${formatNumber(velocity, 3)} ${velocityUnit}`,
      sub: `Re = ${formatNumber(rec.reynoldsNumber, 4)}`,
      color: 'bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Pressure Drop / Length',
      value: `${formatNumber(dpPerUnit, 4)} ${dpPerUnitLabel}`,
      sub: `f = ${formatNumber(rec.frictionFactor, 4)}`,
      color: 'bg-amber-50 border-amber-200',
    },
    {
      label: 'Total Pressure Drop',
      value: `${formatNumber(dpTotal, 4)} ${dpTotalUnit}`,
      sub: `Over ${result.inputSummary.pipeLength} ${result.inputSummary.pipeLengthUnit}`,
      color: 'bg-slate-50 border-slate-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {cards.map(card => (
        <div key={card.label} className={`rounded-lg border p-4 ${card.color}`}>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.label}</p>
          <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">{card.value}</p>
          <p className="text-xs text-slate-600 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
