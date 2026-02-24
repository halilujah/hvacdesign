import type { UnitSystem } from '../../types/units';

interface UnitToggleProps {
  value: UnitSystem;
  onChange: (system: UnitSystem) => void;
}

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-2">Unit System</label>
      <div className="inline-flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => onChange('metric')}
          className={`
            px-4 py-2 text-sm font-medium rounded-l-md border
            ${value === 'metric'
              ? 'bg-accent text-white border-accent'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}
          `}
        >
          Metric (SI)
        </button>
        <button
          type="button"
          onClick={() => onChange('imperial')}
          className={`
            px-4 py-2 text-sm font-medium rounded-r-md border border-l-0
            ${value === 'imperial'
              ? 'bg-accent text-white border-accent'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}
          `}
        >
          Imperial (US)
        </button>
      </div>
    </div>
  );
}
