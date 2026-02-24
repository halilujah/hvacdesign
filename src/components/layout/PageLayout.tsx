import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  wide?: boolean;
}

export function PageLayout({ children, wide }: PageLayoutProps) {
  return (
    <main className={`${wide ? 'max-w-[1400px]' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-8 print-full-width`}>
      {children}
    </main>
  );
}
