import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Guide, Difficulty } from '../types';
import { GuideCard } from './GuideCard';

interface DashboardViewProps {
  guides: Guide[];
  onFollowGuide: (guide: Guide) => void;
  onEditGuide: (guide: Guide) => void;
  onDuplicateGuide: (guide: Guide) => void;
  onDeleteGuide: (id: string) => void;
  onCreateGuide: () => void;
  onResetSeedData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  guides,
  onFollowGuide,
  onEditGuide,
  onDuplicateGuide,
  onDeleteGuide,
  onCreateGuide,
  onResetSeedData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'updated' | 'steps' | 'completed'>('updated');

  // Extract all categories from existing guides
  const categories = useMemo(() => {
    const set = new Set<string>();
    guides.forEach(g => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [guides]);

  // Total steps & executions calculation
  const totalSteps = useMemo(() => {
    return guides.reduce((acc, g) => acc + (g.steps?.length || 0), 0);
  }, [guides]);

  const totalRuns = useMemo(() => {
    return guides.reduce((acc, g) => acc + (g.timesCompleted || 0), 0);
  }, [guides]);

  // Filter and sort guides
  const filteredGuides = useMemo(() => {
    return guides
      .filter(g => {
        const matchesCategory = selectedCategory === 'ALL' || g.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesDifficulty = selectedDifficulty === 'ALL' || g.difficulty === selectedDifficulty;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          (g.tags && g.tags.some(t => t.toLowerCase().includes(q))) ||
          g.steps.some(s => s.title.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q));

        return matchesCategory && matchesDifficulty && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'steps') {
          return b.steps.length - a.steps.length;
        }
        if (sortBy === 'completed') {
          return (b.timesCompleted || 0) - (a.timesCompleted || 0);
        }
        // Default updated
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      });
  }, [guides, selectedCategory, selectedDifficulty, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      
      {/* Hero / Overview Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Methods & Blueprints
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Personal knowledge base for cooking recipes, software setups, workshop builds, and discoveries. Execute them step-by-step with zero guesswork.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {guides.length}
            </div>
            <div>Saved Methods</div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalSteps}
            </div>
            <div>Verified Steps</div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {totalRuns}
            </div>
            <div>Total Runs</div>
          </div>
        </div>
      </div>

      {/* Search, Filter Bar, and Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search guides, techniques, tools, or ingredients..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="ALL">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'updated' | 'steps' | 'completed')}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="updated">Recently Updated</option>
              <option value="steps">Most Steps</option>
              <option value="completed">Most Executed</option>
            </select>
          </div>

        </div>

        {/* Category Segmented Tabs (Interactive Filter Controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Cards Grid */}
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map(guide => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onFollow={onFollowGuide}
              onEdit={onEditGuide}
              onDuplicate={onDuplicateGuide}
              onDelete={onDeleteGuide}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            No methods match your criteria
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Try adjusting your search terms or category filter, or document a new recipe or workflow right now.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onCreateGuide}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Guide</span>
            </button>
            <button
              onClick={onResetSeedData}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Starter Guides</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
