import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Clock,
  CheckSquare,
  Square,
  ListOrdered,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Guide, GuideStep } from '../types';
import { playStepCompleteSound, playCelebrationSound, playTimerAlertSound } from '../utils/audio';

interface GuideRunnerProps {
  guide: Guide;
  onBack: () => void;
  onRecordCompletion: (guideId: string) => void;
}

export const GuideRunner: React.FC<GuideRunnerProps> = ({
  guide,
  onBack,
  onRecordCompletion,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showStepOverview, setShowStepOverview] = useState(false);

  // Per-step checklist state: map of stepId -> item index -> boolean
  const [stepChecklistStates, setStepChecklistStates] = useState<Record<string, boolean[]>>(() => {
    const initial: Record<string, boolean[]> = {};
    guide.steps.forEach(s => {
      initial[s.id] = s.checklist ? s.checklist.map(c => !!c.done) : [];
    });
    return initial;
  });

  // Stopwatch (Total session time)
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(true);

  // Step countdown timer (optional per step)
  const [timerMode, setTimerMode] = useState<'stopwatch' | 'countdown'>('stopwatch');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);
  const [countdownInitial, setCountdownInitial] = useState<number>(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentStep: GuideStep = guide.steps[currentStepIndex] || guide.steps[0];
  const totalSteps = guide.steps.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Initialize countdown when step changes if step has suggestedMinutes
  useEffect(() => {
    if (currentStep?.suggestedMinutes) {
      const secs = currentStep.suggestedMinutes * 60;
      setCountdownSeconds(secs);
      setCountdownInitial(secs);
      setIsCountdownRunning(false);
    } else {
      setCountdownSeconds(300); // 5 min fallback
      setCountdownInitial(300);
      setIsCountdownRunning(false);
    }
  }, [currentStepIndex, currentStep]);

  // Stopwatch interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isStopwatchRunning && !isCompleted) {
      interval = setInterval(() => {
        setStopwatchSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStopwatchRunning, isCompleted]);

  // Countdown interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCountdownRunning && countdownSeconds > 0) {
      interval = setInterval(() => {
        setCountdownSeconds(prev => {
          if (prev <= 1) {
            setIsCountdownRunning(false);
            if (!isMuted) playTimerAlertSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCountdownRunning, countdownSeconds, isMuted]);

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      if (!isMuted) playStepCompleteSound();
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleCompleteGuide();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleCompleteGuide = () => {
    setIsCompleted(true);
    setIsStopwatchRunning(false);
    setIsCountdownRunning(false);
    if (!isMuted) playCelebrationSound();
    onRecordCompletion(guide.id);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback safe
    }
  };

  const toggleChecklistItem = (stepId: string, itemIdx: number) => {
    setStepChecklistStates(prev => {
      const stepItems = [...(prev[stepId] || [])];
      stepItems[itemIdx] = !stepItems[itemIdx];
      return { ...prev, [stepId]: stepItems };
    });
  };

  const currentChecklist = currentStep?.checklist || [];
  const currentChecklistState = stepChecklistStates[currentStep?.id] || [];
  const completedChecklistCount = currentChecklistState.filter(Boolean).length;

  return (
    <div
      ref={containerRef}
      className={`min-h-[calc(100vh-4rem)] flex flex-col ${
        isFullscreen ? 'bg-slate-900 text-white p-6 sm:p-10' : 'py-6 px-4 sm:px-6 lg:px-8'
      }`}
    >
      {/* Runner Top Bar */}
      <div className="max-w-4xl w-full mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Guides</span>
        </button>

        {/* Global Controls & Timer */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Audio Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Workshop Mode'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Step Index Quick Drawer Trigger */}
          <button
            onClick={() => setShowStepOverview(!showStepOverview)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
          >
            <ListOrdered className="w-3.5 h-3.5 text-indigo-500" />
            <span>Steps ({currentStepIndex + 1}/{totalSteps})</span>
          </button>

          {/* Integrated Stopwatch & Timer Widget */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm text-xs font-mono tabular-nums">
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <button
              onClick={() => setTimerMode(timerMode === 'stopwatch' ? 'countdown' : 'stopwatch')}
              className="text-[11px] uppercase font-bold text-slate-400 hover:text-indigo-500 mr-1"
              title="Click to switch between Total Stopwatch and Step Countdown"
            >
              {timerMode === 'stopwatch' ? 'Total' : 'Step'}
            </button>
            
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {timerMode === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(countdownSeconds)}
            </span>

            {timerMode === 'stopwatch' ? (
              <button
                onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                className="p-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                title={isStopwatchRunning ? 'Pause Stopwatch' : 'Resume Stopwatch'}
              >
                {isStopwatchRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsCountdownRunning(!isCountdownRunning)}
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  title={isCountdownRunning ? 'Pause Countdown' : 'Start Countdown'}
                >
                  {isCountdownRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button
                  onClick={() => {
                    setIsCountdownRunning(false);
                    setCountdownSeconds(countdownInitial);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Reset Countdown"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Runner Content */}
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-between">
        
        {/* Step Drawer if open */}
        {showStepOverview && (
          <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in duration-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">All Steps in Method</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {guide.steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setShowStepOverview(false);
                  }}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left text-xs transition-colors ${
                    idx === currentStepIndex
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-semibold'
                      : idx < currentStepIndex
                      ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="shrink-0 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="line-clamp-1">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completion Card or Active Step Card */}
        {isCompleted ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-lg my-auto max-w-xl mx-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
              Method Successfully Executed!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              You completed all {totalSteps} steps of <span className="font-semibold text-slate-800 dark:text-slate-200">{guide.title}</span> in {formatTime(stopwatchSeconds)}.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 mb-8 flex justify-around text-center">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Steps Done</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{totalSteps} / {totalSteps}</div>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Duration</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">{formatTime(stopwatchSeconds)}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentStepIndex(0);
                  setStopwatchSeconds(0);
                  setIsStopwatchRunning(true);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Restart Guide
              </button>

              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm transition-colors"
              >
                Return to Blueprint Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header Info */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{guide.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.title}</span>
                </div>

                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                  Step {currentStepIndex + 1} of {totalSteps}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* Active Step Content */}
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                    Step {currentStepIndex + 1}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                    {currentStep.title}
                  </h2>
                </div>

                {/* Instruction Detail */}
                <div className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {currentStep.detail}
                </div>

                {/* Interactive Checklist (if present) */}
                {currentChecklist.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
                      <span>Step Checklist</span>
                      <span className="tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
                        {completedChecklistCount}/{currentChecklist.length} checked
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {currentChecklist.map((item, idx) => {
                        const isChecked = !!currentChecklistState[idx];
                        return (
                          <button
                            key={item.id || idx}
                            type="button"
                            onClick={() => toggleChecklistItem(currentStep.id, idx)}
                            className="w-full flex items-start gap-3 p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                          >
                            <span className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </span>
                            <span
                              className={`text-sm leading-snug ${
                                isChecked
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {item.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pro-Tip / Pitfall Warning Callout */}
                {currentStep.tip && currentStep.tip.trim() !== '' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-sm">
                    <div className="flex items-center gap-2 font-bold mb-1.5 text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Key Discovery / Pro-Tip</span>
                    </div>
                    <p className="leading-relaxed text-xs sm:text-sm pl-6 opacity-95">
                      {currentStep.tip}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between gap-4 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <div className="flex items-center gap-1.5">
                {guide.steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    aria-label={`Go to step ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentStepIndex
                        ? 'w-6 bg-indigo-600'
                        : idx < currentStepIndex
                        ? 'w-2 bg-indigo-300 dark:bg-indigo-800'
                        : 'w-2 bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <span>{currentStepIndex === totalSteps - 1 ? 'Finish Guide' : 'Complete & Next'}</span>
                {currentStepIndex === totalSteps - 1 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
