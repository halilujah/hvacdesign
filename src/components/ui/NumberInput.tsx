interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  error?: string;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step,
  helpText,
  error,
}: NumberInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="flex">
        <input
          id={id}
          type="number"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`
            block w-full rounded-l-md border px-3 py-2 text-sm tabular-nums
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
            ${error ? 'border-danger' : 'border-slate-300'}
            ${!unit ? 'rounded-r-md' : ''}
          `}
        />
        {unit && (
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-600">
            {unit}
          </span>
        )}
      </div>
      {helpText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
