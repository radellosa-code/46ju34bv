import React, { useState, useEffect } from 'react';
import { SEED_DATA } from './data/seedGuides';
import { Guide } from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { GuideRunner } from './components/GuideRunner';
import { GuideEditorModal } from './components/GuideEditorModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ImportModal } from './components/ImportModal';

const STORAGE_KEY = 'methodflow_guides';
const THEME_KEY = 'methodflow_theme';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Guides state
  const [guides, setGuides] = useState<Guide[]>(() => {
    if (typeof window === 'undefined') return SEED_DATA;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return SEED_DATA;
  });

  // View state: 'dashboard' | 'runner'
  const [activeView, setActiveView] = useState<'dashboard' | 'runner'>('dashboard');
  const [runningGuide, setRunningGuide] = useState<Guide | null>(null);

  // Editor modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);

  // Import modal state
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Confirm delete modal state
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Reset confirmation modal state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Sync theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  // Persist guides whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
    } catch {
      // ignore quota errors
    }
  }, [guides]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Launch guide runner
  const handleFollowGuide = (guide: Guide) => {
    setRunningGuide(guide);
    setActiveView('runner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open editor for new guide
  const handleCreateGuide = () => {
    setEditingGuide(null);
    setIsEditorOpen(true);
  };

  // Open editor for existing guide
  const handleEditGuide = (guide: Guide) => {
    setEditingGuide(guide);
    setIsEditorOpen(true);
  };

  // Duplicate guide
  const handleDuplicateGuide = (guide: Guide) => {
    const duplicated: Guide = {
      ...guide,
      id: 'guide-' + Date.now(),
      title: `${guide.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timesCompleted: 0,
    };
    setGuides(prev => [duplicated, ...prev]);
  };

  // Save guide (new or updated)
  const handleSaveGuide = (savedGuide: Guide) => {
    setGuides(prev => {
      const idx = prev.findIndex(g => g.id === savedGuide.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedGuide;
        return copy;
      }
      return [savedGuide, ...prev];
    });

    // If currently running this guide, update runningGuide
    if (runningGuide && runningGuide.id === savedGuide.id) {
      setRunningGuide(savedGuide);
    }
  };

  // Delete guide flow
  const promptDeleteGuide = (id: string) => {
    setDeleteCandidateId(id);
  };

  const confirmDeleteGuide = () => {
    if (deleteCandidateId) {
      setGuides(prev => prev.filter(g => g.id !== deleteCandidateId));
      if (runningGuide?.id === deleteCandidateId) {
        setActiveView('dashboard');
        setRunningGuide(null);
      }
      setDeleteCandidateId(null);
    }
  };

  // Record completion
  const handleRecordCompletion = (guideId: string) => {
    setGuides(prev =>
      prev.map(g => {
        if (g.id === guideId) {
          return {
            ...g,
            timesCompleted: (g.timesCompleted || 0) + 1,
            updatedAt: new Date().toISOString(),
          };
        }
        return g;
      })
    );
  };

  // Reset to starter data
  const handleResetToSeed = () => {
    setGuides(SEED_DATA);
    setIsResetConfirmOpen(false);
  };

  // Export guides as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(guides, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStamp = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `methodflow-blueprints-${dateStamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import guides from JSON
  const handleImportGuides = (importedList: Guide[]) => {
    setGuides(prev => {
      // Merge by ID or append
      const existingIds = new Set(prev.map(g => g.id));
      const newItems: Guide[] = [];

      importedList.forEach(item => {
        if (existingIds.has(item.id)) {
          // Re-id to avoid collisions
          newItems.push({
            ...item,
            id: 'guide-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          });
        } else {
          newItems.push(item);
        }
      });

      return [...newItems, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onCreateGuide={handleCreateGuide}
        onExport={handleExportJSON}
        onImport={() => setIsImportOpen(true)}
        onHomeClick={() => setActiveView('dashboard')}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'runner' && runningGuide ? (
          <GuideRunner
            guide={runningGuide}
            onBack={() => setActiveView('dashboard')}
            onRecordCompletion={handleRecordCompletion}
          />
        ) : (
          <DashboardView
            guides={guides}
            onFollowGuide={handleFollowGuide}
            onEditGuide={handleEditGuide}
            onDuplicateGuide={handleDuplicateGuide}
            onDeleteGuide={promptDeleteGuide}
            onCreateGuide={handleCreateGuide}
            onResetSeedData={() => setIsResetConfirmOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-500 dark:text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>MethodFlow — Step-by-Step Blueprint & Method Engine</div>
          <div>All methods stored locally in browser storage</div>
        </div>
      </footer>

      {/* Modals */}
      <GuideEditorModal
        isOpen={isEditorOpen}
        initialGuide={editingGuide}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveGuide}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportGuides}
      />

      <ConfirmModal
        isOpen={!!deleteCandidateId}
        title="Delete Method Blueprint?"
        message="This action will permanently delete this guide and its steps from your local storage. This action cannot be undone."
        confirmLabel="Delete Blueprint"
        isDestructive={true}
        onConfirm={confirmDeleteGuide}
        onCancel={() => setDeleteCandidateId(null)}
      />

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reload Starter Guides?"
        message="This will reset your catalog with the curated starter guides (Pizza, Drywall Mounting, Docker Compose, Cold Brew)."
        confirmLabel="Reload Guides"
        isDestructive={false}
        onConfirm={handleResetToSeed}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

    </div>
  );
}
