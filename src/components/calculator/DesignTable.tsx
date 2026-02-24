import type { PipeSizingResult, PipeSizeRow, VelocityFlag } from '../../types/calculator';
import type { UnitSystem } from '../../types/units';
import { formatNumber } from '../../utils/formatting';
import { mpsToFps, paPerMToPsiPer100ft, paToPsi, mmToInches } from '../../engine/unit-conversions';

interface DesignTableProps {
  result: PipeSizingResult;
  unitSystem: UnitSystem;
}

const flagColors: Record<VelocityFlag, string> = {
  'low': 'bg-warning-light text-amber-800',
  'acceptable-low': 'bg-emerald-50 text-emerald-700',
  'optimal': 'bg-success-light text-emerald-800 font-medium',
  'acceptable-high': 'bg-emerald-50 text-emerald-700',
  'high': 'bg-danger-light text-red-800',
};

const flagLabels: Record<VelocityFlag, string> = {
  'low': 'Low',
  'acceptable-low': 'OK',
  'optimal': 'Optimal',
  'acceptable-high': 'OK',
  'high': 'High',
};

export function DesignTable({ result, unitSystem }: DesignTableProps) {
  const isImperial = unitSystem === 'imperial';

  const formatRow = (row: PipeSizeRow) => {
    const velocity = isImperial ? mpsToFps(row.velocity) : row.velocity;
    const dpPerUnit = isImperial ? paPerMToPsiPer100ft(row.pressureDropPerMeter) : row.pressureDropPerMeter;
    const dpTotal = isImperial ? paToPsi(row.pressureDropTotal) : row.pressureDropTotal;
    const id = isImperial ? mmToInches(row.innerDiameter) : row.innerDiameter;

    return { velocity, dpPerUnit, dpTotal, id };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse" id="design-table">
        <thead>
          <tr className="bg-primary text-white text-left">
            <th className="px-3 py-2.5 font-medium">NPS</th>
            <th className="px-3 py-2.5 font-medium">DN</th>
            <th className="px-3 py-2.5 font-medium text-right">
              ID ({isImperial ? 'in' : 'mm'})
            </th>
            <th className="px-3 py-2.5 font-medium text-right">
              Velocity ({isImperial ? 'ft/s' : 'm/s'})
            </th>
            <th className="px-3 py-2.5 font-medium text-right">Re</th>
            <th className="px-3 py-2.5 font-medium text-right">f</th>
            <th className="px-3 py-2.5 font-medium text-right">
              {isImperial ? 'ΔP (psi/100ft)' : 'ΔP (Pa/m)'}
            </th>
            <th className="px-3 py-2.5 font-medium text-right">
              {isImperial ? 'ΔP Total (psi)' : 'ΔP Total (Pa)'}
            </th>
            <th className="px-3 py-2.5 font-medium text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {result.allSizes.map((row) => {
            const formatted = formatRow(row);
            const isRecommended = row.nps === result.recommendedSize.nps;

            return (
              <tr
                key={row.nps}
                className={`
                  border-b border-slate-200
                  ${isRecommended ? 'bg-blue-50 font-semibold' : 'hover:bg-slate-50'}
                `}
              >
                <td className="px-3 py-2">
                  {row.nps}
                  {isRecommended && (
                    <span className="ml-1.5 text-xs bg-accent text-white px-1.5 py-0.5 rounded">REC</span>
                  )}
                </td>
                <td className="px-3 py-2">{row.dn}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(formatted.id, 4)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(formatted.velocity, 3)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(row.reynoldsNumber, 4)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(row.frictionFactor, 4)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(formatted.dpPerUnit, 4)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(formatted.dpTotal, 4)}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${flagColors[row.velocityFlag]}`}>
                    {flagLabels[row.velocityFlag]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
