import React from 'react';
import { Play, Edit3, Trash2, Copy, Clock, CheckCircle2, ListOrdered } from 'lucide-react';
import { Guide } from '../types';

interface GuideCardProps {
  guide: Guide;
  onFollow: (guide: Guide) => void;
  onEdit: (guide: Guide) => void;
  onDuplicate: (guide: Guide) => void;
  onDelete: (id: string) => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  onFollow,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col justify-between">
      <div>
        {/* Unboxed Metadata with Typographic Separator */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{guide.category}</span>
            <span aria-hidden="true">·</span>
            <span>{guide.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{guide.time || 'Variable'}</span>
            </span>
          </div>

          {guide.timesCompleted ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tabular-nums" title={`Completed ${guide.timesCompleted} times`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guide.timesCompleted}</span>
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 leading-snug">
          {guide.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {guide.description}
        </p>

        {/* Prerequisites or Key Tags if available */}
        {guide.prerequisites && guide.prerequisites.length > 0 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Requires: </span>
            {guide.prerequisites.join(', ')}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
          <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
          <span>{guide.steps.length} {guide.steps.length === 1 ? 'Step' : 'Steps'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDuplicate(guide)}
            title="Duplicate Method"
            aria-label="Duplicate"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEdit(guide)}
            title="Edit Blueprint"
            aria-label="Edit"
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(guide.id)}
            title="Delete Method"
            aria-label="Delete"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onFollow(guide)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Follow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
