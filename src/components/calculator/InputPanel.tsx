import type { UnitSystem } from '../../types/units';
import type { PipeSizingInput } from '../../types/calculator';
import { PIPE_SIZING_FIELDS } from '../../config/pipe-sizing.config';
import { Card } from '../ui/Card';
import { NumberInput } from '../ui/NumberInput';
import { SelectInput } from '../ui/SelectInput';
import { UnitToggle } from '../ui/UnitToggle';
import { Button } from '../ui/Button';
import { RotateCcw } from 'lucide-react';

interface InputPanelProps {
  values: PipeSizingInput;
  onChange: (values: PipeSizingInput) => void;
  onReset: () => void;
}

export function InputPanel({ values, onChange, onReset }: InputPanelProps) {
  const updateField = (field: keyof PipeSizingInput, value: number | string) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Input Parameters</h2>

      <UnitToggle
        value={values.unitSystem}
        onChange={(system: UnitSystem) => updateField('unitSystem', system)}
      />

      {PIPE_SIZING_FIELDS.map(field => {
        if (field.type === 'select') {
          return (
            <SelectInput
              key={field.id}
              id={field.id}
              label={field.label}
              value={values[field.id as keyof PipeSizingInput] as string}
              onChange={v => updateField(field.id as keyof PipeSizingInput, v)}
              options={field.options || []}
              helpText={field.helpText}
            />
          );
        }

        const unit = values.unitSystem === 'metric' ? field.metricUnit : field.imperialUnit;

        return (
          <NumberInput
            key={field.id}
            id={field.id}
            label={field.label}
            value={values[field.id as keyof PipeSizingInput] as number}
            onChange={v => updateField(field.id as keyof PipeSizingInput, v)}
            unit={unit}
            min={field.min}
            max={field.max}
            step={field.step}
            helpText={field.helpText}
          />
        );
      })}

      <div className="mt-6 pt-4 border-t border-slate-200">
        <Button variant="outline" size="sm" onClick={onReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
          Reset Defaults
        </Button>
      </div>
    </Card>
  );
}
