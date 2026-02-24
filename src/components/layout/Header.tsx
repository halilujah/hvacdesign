import { Link } from 'react-router';
import { Calculator } from 'lucide-react';
import { APP_NAME, APP_VERSION } from '../../utils/constants';

export function Header() {
  return (
    <header className="bg-primary text-white shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 text-white no-underline">
            <Calculator className="w-7 h-7" />
            <span className="text-xl font-semibold tracking-tight">{APP_NAME}</span>
          </Link>
          <span className="text-sm text-slate-300">v{APP_VERSION}</span>
        </div>
      </div>
    </header>
  );
}
