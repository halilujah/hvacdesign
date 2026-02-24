import { Link } from 'react-router';
import { Droplets, Wind, Flame, ArrowRight } from 'lucide-react';
import type { CalculatorMeta } from '../../types/calculator';
import { Card } from '../ui/Card';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Wind,
  Flame,
};

const categoryColors: Record<string, string> = {
  hydraulic: 'bg-blue-100 text-blue-700',
  ventilation: 'bg-cyan-100 text-cyan-700',
  heating: 'bg-orange-100 text-orange-700',
};

interface CalculatorCardProps {
  calculator: CalculatorMeta;
}

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  const IconComponent = iconMap[calculator.icon] || Droplets;
  const isActive = calculator.status === 'active';

  const content = (
    <Card className={`h-full transition-shadow ${isActive ? 'hover:shadow-md' : 'opacity-60'}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-100 rounded-lg">
          <IconComponent className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-slate-900">{calculator.title}</h3>
          </div>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[calculator.category] || ''}`}>
            {calculator.category}
          </span>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{calculator.description}</p>
          {isActive ? (
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent">
              Open Calculator <ArrowRight className="w-4 h-4" />
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-400 font-medium">Coming Soon</div>
          )}
        </div>
      </div>
    </Card>
  );

  if (isActive) {
    return <Link to={`/calc/${calculator.slug}`} className="block no-underline">{content}</Link>;
  }
  return content;
}
