import { Link } from 'react-router';
import { PageLayout } from '../components/layout/PageLayout';

export function NotFoundPage() {
  return (
    <PageLayout>
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-slate-300">404</h1>
        <p className="mt-4 text-lg text-slate-600">Page not found</p>
        <Link to="/" className="mt-6 inline-block text-accent hover:underline">
          Back to calculators
        </Link>
      </div>
    </PageLayout>
  );
}
