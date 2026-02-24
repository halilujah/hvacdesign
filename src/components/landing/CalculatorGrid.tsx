import { CALCULATORS } from '../../config/calculators.registry';
import { CalculatorCard } from './CalculatorCard';

export function CalculatorGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {CALCULATORS.map(calc => (
        <CalculatorCard key={calc.id} calculator={calc} />
      ))}
    </div>
  );
}
