import { FileSpreadsheet, FileText, ClipboardCopy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';

interface ExportToolbarProps {
  onExportExcel: () => void;
  onExportPdf: () => void;
  onCopyTable: () => Promise<void>;
}

export function ExportToolbar({ onExportExcel, onExportPdf, onCopyTable }: ExportToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopyTable();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-200 no-print">
      <Button
        variant="success"
        onClick={onExportExcel}
        icon={<FileSpreadsheet className="w-4 h-4" />}
      >
        Export Excel
      </Button>
      <Button
        variant="primary"
        onClick={onExportPdf}
        icon={<FileText className="w-4 h-4" />}
      >
        Export PDF
      </Button>
      <Button
        variant="outline"
        onClick={handleCopy}
        icon={copied ? <Check className="w-4 h-4 text-success" /> : <ClipboardCopy className="w-4 h-4" />}
      >
        {copied ? 'Copied!' : 'Copy Table'}
      </Button>
    </div>
  );
}
