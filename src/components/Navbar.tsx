import React from 'react';
import { Layers, Plus, Moon, Sun, Download, Upload } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onCreateGuide: () => void;
  onExport: () => void;
  onImport: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onToggleTheme,
  onCreateGuide,
  onExport,
  onImport,
  onHomeClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Brand Zone */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:bg-indigo-500 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              MethodFlow
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Step-by-Step Blueprint Engine
            </div>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onExport}
            title="Export Guides to JSON backup"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onImport}
            title="Import Guides from JSON"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            onClick={onCreateGuide}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Guide</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

      </div>
    </header>
  );
};
