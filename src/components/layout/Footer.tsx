import { APP_BRANDING } from '../../utils/constants';

export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-400 text-sm py-6 mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>{APP_BRANDING}</p>
        <p className="mt-1 text-slate-500">Results are for preliminary design purposes. Always verify with project-specific standards.</p>
      </div>
    </footer>
  );
}
