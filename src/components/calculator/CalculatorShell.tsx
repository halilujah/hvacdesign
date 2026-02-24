import type { ReactNode } from 'react';

interface CalculatorShellProps {
  inputPanel: ReactNode;
  resultsPanel: ReactNode;
}

export function CalculatorShell({ inputPanel, resultsPanel }: CalculatorShellProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
      <div className="lg:sticky lg:top-6">{inputPanel}</div>
      <div>{resultsPanel}</div>
    </div>
  );
}
