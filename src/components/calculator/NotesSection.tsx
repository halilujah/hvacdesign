import { Info } from 'lucide-react';

interface NotesSectionProps {
  assumptions: string[];
}

export function NotesSection({ assumptions }: NotesSectionProps) {
  return (
    <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">Assumptions & Notes</h3>
      </div>
      <ul className="space-y-1">
        {assumptions.map((note, i) => (
          <li key={i} className="text-xs text-slate-600 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
