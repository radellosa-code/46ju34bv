import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { Guide } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (guides: Guide[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        setJsonText(content);
        setError(null);
      } catch {
        setError('Failed to read selected file.');
      }
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    setError(null);
    if (!jsonText.trim()) {
      setError('Please paste JSON data or select a JSON file.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const list: Guide[] = Array.isArray(parsed) ? parsed : [parsed];

      // Basic validation
      const validGuides = list.filter(g => g && typeof g.title === 'string' && Array.isArray(g.steps));
      if (validGuides.length === 0) {
        setError('No valid MethodFlow guides found in the imported data.');
        return;
      }

      onImport(validGuides);
      onClose();
    } catch {
      setError('Invalid JSON format. Please ensure valid syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Import Guides & Blueprints
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Select JSON Backup File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-950/50 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Or Paste JSON Content Directly
            </label>
            <textarea
              rows={6}
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              placeholder="Paste MethodFlow JSON export here..."
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProcessImport}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
          >
            Import Guides
          </button>
        </div>

      </div>
    </div>
  );
};
