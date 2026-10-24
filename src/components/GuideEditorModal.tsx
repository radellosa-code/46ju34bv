import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Clock,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { Guide, GuideStep, Difficulty } from '../types';

interface GuideEditorModalProps {
  initialGuide: Guide | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (guide: Guide) => void;
}

export const GuideEditorModal: React.FC<GuideEditorModalProps> = ({
  initialGuide,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(initialGuide?.title || '');
  const [category, setCategory] = useState(initialGuide?.category || 'Cooking');
  const [customCategory, setCustomCategory] = useState('');
  const [time, setTime] = useState(initialGuide?.time || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialGuide?.difficulty || 'Beginner');
  const [description, setDescription] = useState(initialGuide?.description || '');
  const [prereqInput, setPrereqInput] = useState((initialGuide?.prerequisites || []).join(', '));
  const [tagsInput, setTagsInput] = useState((initialGuide?.tags || []).join(', '));

  const [steps, setSteps] = useState<GuideStep[]>(() => {
    if (initialGuide && initialGuide.steps && initialGuide.steps.length > 0) {
      return initialGuide.steps;
    }
    return [
      {
        id: 'step-' + Date.now(),
        title: '',
        detail: '',
        tip: '',
        suggestedMinutes: 5,
        checklist: [],
      },
    ];
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddStep = () => {
    setSteps(prev => [
      ...prev,
      {
        id: 'step-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        title: '',
        detail: '',
        tip: '',
        suggestedMinutes: 5,
        checklist: [],
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      setErrorMsg('A method requires at least one step.');
      return;
    }
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    setSteps(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const updateStepField = (index: number, field: keyof GuideStep, value: unknown) => {
    setSteps(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddChecklistItem = (stepIndex: number) => {
    setSteps(prev => {
      const copy = [...prev];
      const step = copy[stepIndex];
      const currentList = step.checklist || [];
      step.checklist = [
        ...currentList,
        { id: 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5), text: '', done: false },
      ];
      return copy;
    });
  };

  const updateChecklistItem = (stepIndex: number, itemIndex: number, text: string) => {
    setSteps(prev => {
      const copy = [...prev];
      const step = copy[stepIndex];
      if (step.checklist && step.checklist[itemIndex]) {
        step.checklist[itemIndex].text = text;
      }
      return copy;
    });
  };

  const removeChecklistItem = (stepIndex: number, itemIndex: number) => {
    setSteps(prev => {
      const copy = [...prev];
      const step = copy[stepIndex];
      if (step.checklist) {
        step.checklist = step.checklist.filter((_, i) => i !== itemIndex);
      }
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Please enter a guide title.');
      return;
    }

    // Validate that at least 1 step has title and detail
    const invalidStep = steps.find(s => !s.title.trim() || !s.detail.trim());
    if (invalidStep) {
      setErrorMsg('All steps must have a title and instruction details.');
      return;
    }

    const finalCategory = category === 'Custom' ? (customCategory.trim() || 'General') : category;

    const prereqs = prereqInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const cleanSteps = steps.map(s => ({
      ...s,
      checklist: (s.checklist || []).filter(c => c.text.trim().length > 0),
    }));

    const guidePayload: Guide = {
      id: initialGuide?.id || 'guide-' + Date.now(),
      title: title.trim(),
      category: finalCategory,
      time: time.trim() || 'Flexible',
      difficulty,
      description: description.trim(),
      tags,
      prerequisites: prereqs,
      steps: cleanSteps,
      createdAt: initialGuide?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timesCompleted: initialGuide?.timesCompleted || 0,
    };

    onSave(guidePayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl p-6 sm:p-8 my-auto relative max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {initialGuide ? 'Edit Method Blueprint' : 'Create New Method Blueprint'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Document your discoveries or workflows so anyone can follow with 100% precision.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 space-y-6 pr-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Guide Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Guide Title <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Sourdough Loaf, Clean Docker Setup, Fixing Drywall..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={['Cooking', 'Tech', 'Construction', 'Lifehack', 'Science'].includes(category) ? category : 'Custom'}
                onChange={e => {
                  if (e.target.value === 'Custom') {
                    setCategory('Custom');
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Cooking">Cooking & Recipes</option>
                <option value="Tech">Tech & Software</option>
                <option value="Construction">Construction & DIY</option>
                <option value="Lifehack">Lifehacks & General</option>
                <option value="Science">Science & Lab</option>
                <option value="Custom">Custom Category...</option>
              </select>

              {category === 'Custom' && (
                <input
                  type="text"
                  placeholder="Enter custom category name"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Estimated Time
              </label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 35 mins, 2 hours, 1 day"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="e.g. Pizza, Cast Iron, Baking"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Prerequisites & Tools Required (comma separated)
              </label>
              <input
                type="text"
                value={prereqInput}
                onChange={e => setPrereqInput(e.target.value)}
                placeholder="e.g. 12-inch cast iron, Cordless drill, Screws"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Goal / Summary Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What does this blueprint accomplish? Brief overview."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Dynamic Steps List */}
          <div>
            <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Execution Steps ({steps.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3 relative group"
                >
                  {/* Step Header with Reordering & Delete */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Step {idx + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveStep(idx, 'up')}
                        title="Move Up"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === steps.length - 1}
                        onClick={() => handleMoveStep(idx, 'down')}
                        title="Move Down"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        title="Delete Step"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 ml-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title and Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-3">
                      <input
                        required
                        type="text"
                        placeholder="Step Title (e.g. Preheat Pan & Prep Dough)"
                        value={step.title}
                        onChange={e => updateStepField(idx, 'title', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="300"
                          placeholder="Mins (e.g. 5)"
                          value={step.suggestedMinutes || ''}
                          onChange={e => updateStepField(idx, 'suggestedMinutes', e.target.value ? parseInt(e.target.value) : undefined)}
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>
                  </div>

                  {/* Details Instructions */}
                  <textarea
                    required
                    rows={2}
                    placeholder="Detailed method, technique, heat settings, exact measurements..."
                    value={step.detail}
                    onChange={e => updateStepField(idx, 'detail', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  />

                  {/* Pro-Tip Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Pro-tip, pitfall warning, or key discovery (optional)"
                      value={step.tip || ''}
                      onChange={e => updateStepField(idx, 'tip', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-dashed border-amber-300 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-2.5" />
                  </div>

                  {/* Step Subtask Checklist Builder */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                      <span>Action Checkpoints / Subtasks:</span>
                      <button
                        type="button"
                        onClick={() => handleAddChecklistItem(idx)}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add checkpoint</span>
                      </button>
                    </div>

                    {step.checklist && step.checklist.length > 0 && (
                      <div className="space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                        {step.checklist.map((item, itemIdx) => (
                          <div key={item.id || itemIdx} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                            <input
                              type="text"
                              value={item.text}
                              onChange={e => updateChecklistItem(idx, itemIdx, e.target.value)}
                              placeholder={`Checkpoint ${itemIdx + 1} (e.g. Coat rim with olive oil)`}
                              className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeChecklistItem(idx, itemIdx)}
                              className="p-1 text-slate-400 hover:text-rose-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddStep}
              className="mt-4 w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Step</span>
            </button>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            >
              Save Method
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
