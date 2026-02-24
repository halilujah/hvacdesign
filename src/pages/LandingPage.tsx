import { PageLayout } from '../components/layout/PageLayout';
import { CalculatorGrid } from '../components/landing/CalculatorGrid';
import { APP_NAME } from '../utils/constants';

export function LandingPage() {
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{APP_NAME}</h1>
        <p className="mt-2 text-lg text-slate-600">
          Professional engineering calculators with design tables, Excel export, and PDF reports.
        </p>
      </div>
      <CalculatorGrid />
    </PageLayout>
  );
}
