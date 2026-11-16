import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  ShieldAlert,
  FastForward,
  BellRing,
  Sun,
  Moon,
  LayoutList,
  Eye,
  Settings,
  X,
  Terminal,
  Check,
} from 'lucide-react';
import {
  RecipeConfig,
  MainIngredientType,
  INGREDIENTS,
  ACCENT_PRESETS,
  normalizeHexColor,
  getFilteredSteps,
  formatTimerDisplay,
  calculateRemainingTimeSeconds,
  calculateTotalTimeSeconds,
  formatHumanDuration,
  computeWallClockRemaining,
  getLidReminderState,
} from './utils/recipeLogic';
import { kitchenAudio } from './utils/kitchenAudio';
import { StepPanScene } from './components/StepPanScene';
import { StepAnimatedLogo } from './components/StepAnimatedLogo';
import { ResilientImage } from './components/ResilientImage';

type AppViewMode = 'home' | 'preview' | 'cooking';

export default function App() {
  const initialAutoStart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  // Dark theme by default; configurable in Gear Settings
  const [isDark, setIsDark] = useState<boolean>(true);
  // Dynamic accent color; configurable via presets or Nerd Section #code
  const [accentHex, setAccentHex] = useState<string>('#EA580C');
  const [customHexInput, setCustomHexInput] = useState<string>('#EA580C');
  const [hexError, setHexError] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0F0D0C';
      document.body.style.color = '#F5EFE6';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#FAF7F2';
      document.body.style.color = '#1C1613';
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentHex);
  }, [accentHex]);

  const handleSelectAccentPreset = (hex: string) => {
    setAccentHex(hex);
    setCustomHexInput(hex);
    setHexError('');
  };

  const handleCustomHexChange = (val: string) => {
    setCustomHexInput(val);
    const normalized = normalizeHexColor(val);
    if (normalized) {
      setAccentHex(normalized);
      setHexError('');
    } else if (val.trim().length > 0) {
      setHexError('Enter a 3 or 6 digit hex code (e.g. #FF5500)');
    } else {
      setHexError('');
    }
  };

  const handleApplyCustomHex = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeHexColor(customHexInput);
    if (normalized) {
      setAccentHex(normalized);
      setCustomHexInput(normalized);
      setHexError('');
    } else {
      setHexError('Enter a valid hex code like #EA580C or #0FA');
    }
  };

  // 'home' = scrollable 1-step-per-row overview
  // 'preview' = clicked a step without starting cook (shows animation & info only, NO timer)
  // 'cooking' = active guided cook with real-time wall-clock timer & alarm
  const [viewMode, setViewMode] = useState<AppViewMode>(
    initialAutoStart ? 'cooking' : 'home'
  );

  // Recipe configuration
  const [config, setConfig] = useState<RecipeConfig>({
    mainType: 'meat',
    includeTomato: true,
    customMainName: '',
  });

  const steps = useMemo(() => getFilteredSteps(config), [config]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = steps[Math.min(currentStepIdx, steps.length - 1)] || steps[0];

  // Real-time wall-clock timer state (only active in 'cooking' mode)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(currentStep.timerSeconds);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [alarmRinging, setAlarmRinging] = useState<boolean>(false);
  const [completedStepIds, setCompletedStepIds] = useState<Record<string, boolean>>({});
  const [lidConfirmedSteps, setLidConfirmedSteps] = useState<Record<string, boolean>>({});

  // Audio mute setting
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  // Wall-clock deadline ref & Web Worker ref for background-resilient timing
  const endTimeMsRef = useRef<number | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const dismissAlarm = useCallback(() => {
    setAlarmRinging(false);
    kitchenAudio.stopAlarmLoop();
  }, []);

  const triggerStepCompletionAlarm = useCallback(
    (stepTitle: string, stepNumber: number, stepId: string) => {
      endTimeMsRef.current = null;
      setTimerRunning(false);
      setRemainingSeconds(0);
      setAlarmRinging(true);
      setCompletedStepIds((old) => ({ ...old, [stepId]: true }));

      kitchenAudio.startAlarmLoop();
      kitchenAudio.sendTimerNotification(
        `Step ${stepNumber} Timer Complete — simple-cooking`,
        `${stepTitle} is finished. Return to your kitchen guide.`
      );
    },
    []
  );

  // Start or resume real-time wall-clock timer
  const startRealTimeTimer = useCallback(
    (secondsToRun: number) => {
      dismissAlarm();
      if (secondsToRun <= 0) return;
      const now = Date.now();
      endTimeMsRef.current = now + secondsToRun * 1000;
      setRemainingSeconds(secondsToRun);
      setTimerRunning(true);

      kitchenAudio.scheduleBackgroundAlarm(secondsToRun);
      kitchenAudio.requestNotificationPermission().catch(() => {});
    },
    [dismissAlarm]
  );

  const pauseRealTimeTimer = useCallback(() => {
    if (endTimeMsRef.current !== null) {
      const rem = computeWallClockRemaining(endTimeMsRef.current, Date.now());
      setRemainingSeconds(rem);
    }
    endTimeMsRef.current = null;
    setTimerRunning(false);
    kitchenAudio.cancelScheduledAlarm();
  }, []);

  // Sync wall-clock timer via Web Worker + visibilitychange for background accuracy
  useEffect(() => {
    if (viewMode !== 'cooking' || !timerRunning || endTimeMsRef.current === null) {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      return;
    }

    const syncClock = () => {
      if (endTimeMsRef.current === null) return;
      const rem = computeWallClockRemaining(endTimeMsRef.current, Date.now());
      if (rem <= 0) {
        triggerStepCompletionAlarm(
          currentStep.title,
          currentStep.stepNumber,
          currentStep.id
        );
      } else {
        setRemainingSeconds(rem);
      }
    };

    let fallbackInterval: number | null = null;
    try {
      const workerCode = `
        let id = setInterval(() => postMessage('tick'), 250);
        self.onmessage = () => { clearInterval(id); };
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);
      worker.onmessage = syncClock;
      workerRef.current = worker;
      URL.revokeObjectURL(workerUrl);
    } catch {
      fallbackInterval = window.setInterval(syncClock, 250);
    }

    document.addEventListener('visibilitychange', syncClock);
    window.addEventListener('focus', syncClock);

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      if (fallbackInterval !== null) {
        window.clearInterval(fallbackInterval);
      }
      document.removeEventListener('visibilitychange', syncClock);
      window.removeEventListener('focus', syncClock);
    };
  }, [viewMode, timerRunning, currentStep, triggerStepCompletionAlarm]);

  // Keep document title updated with live countdown or alarm during active cooking
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (alarmRinging && viewMode === 'cooking') {
      document.title = `ALARM! Step ${currentStep.stepNumber} Done — simple-cooking`;
    } else if (timerRunning && viewMode === 'cooking') {
      document.title = `${formatTimerDisplay(remainingSeconds)} · Step ${currentStep.stepNumber} — simple-cooking`;
    } else {
      document.title = 'simple-cooking';
    }
  }, [alarmRinging, timerRunning, remainingSeconds, currentStep.stepNumber, viewMode]);

  // Open a step in Preview Mode (animation + info only, NO timer)
  const openStepPreview = useCallback(
    (index: number) => {
      dismissAlarm();
      kitchenAudio.cancelScheduledAlarm();
      endTimeMsRef.current = null;
      setTimerRunning(false);

      const clampedIdx = Math.max(0, Math.min(index, steps.length - 1));
      setCurrentStepIdx(clampedIdx);
      setRemainingSeconds(steps[clampedIdx].timerSeconds);
      setViewMode('preview');
      kitchenAudio.playStepConfirmTone();
    },
    [steps, dismissAlarm]
  );

  // Start or advance in Active Cook Mode (with real-time timer)
  const selectCookingStep = useCallback(
    (newIndex: number, autoStartTimer = true) => {
      dismissAlarm();
      kitchenAudio.cancelScheduledAlarm();
      endTimeMsRef.current = null;

      const clampedIdx = Math.max(0, Math.min(newIndex, steps.length - 1));
      const targetStep = steps[clampedIdx];
      setCurrentStepIdx(clampedIdx);
      setViewMode('cooking');

      if (autoStartTimer && targetStep.timerSeconds > 0) {
        const now = Date.now();
        endTimeMsRef.current = now + targetStep.timerSeconds * 1000;
        setRemainingSeconds(targetStep.timerSeconds);
        setTimerRunning(true);
        kitchenAudio.scheduleBackgroundAlarm(targetStep.timerSeconds);
      } else {
        setRemainingSeconds(targetStep.timerSeconds);
        setTimerRunning(false);
      }

      const lidState = getLidReminderState(targetStep);
      if (lidState.requiresAlert) {
        kitchenAudio.playLidAlertChime();
      } else {
        kitchenAudio.playStepConfirmTone();
      }
    },
    [steps, dismissAlarm]
  );

  const handleNextStep = useCallback(() => {
    dismissAlarm();
    if (viewMode === 'preview') {
      if (currentStepIdx < steps.length - 1) {
        openStepPreview(currentStepIdx + 1);
      }
      return;
    }

    setCompletedStepIds((old) => ({ ...old, [currentStep.id]: true }));
    if (currentStepIdx < steps.length - 1) {
      const nextStep = steps[currentStepIdx + 1];
      selectCookingStep(currentStepIdx + 1, nextStep.timerSeconds > 0);
    }
  }, [viewMode, currentStep.id, currentStepIdx, steps, openStepPreview, selectCookingStep, dismissAlarm]);

  const handlePrevStep = useCallback(() => {
    dismissAlarm();
    if (currentStepIdx > 0) {
      if (viewMode === 'preview') {
        openStepPreview(currentStepIdx - 1);
      } else {
        selectCookingStep(currentStepIdx - 1, false);
      }
    } else {
      pauseRealTimeTimer();
      setViewMode('home');
    }
  }, [currentStepIdx, viewMode, openStepPreview, selectCookingStep, pauseRealTimeTimer, dismissAlarm]);

  const handleReturnHome = () => {
    dismissAlarm();
    pauseRealTimeTimer();
    setViewMode('home');
  };

  const handleToggleMute = () => {
    const nextMuted = !audioMuted;
    setAudioMuted(nextMuted);
    kitchenAudio.setMuted(nextMuted);
  };

  const handleMainTypeChange = (mainType: MainIngredientType) => {
    dismissAlarm();
    setConfig((prev) => ({ ...prev, mainType }));
    setCurrentStepIdx(0);
    setTimerRunning(false);
    endTimeMsRef.current = null;
    setRemainingSeconds(0);
  };

  const handleToggleTomato = () => {
    dismissAlarm();
    setConfig((prev) => ({ ...prev, includeTomato: !prev.includeTomato }));
    setCurrentStepIdx(0);
    setTimerRunning(false);
    endTimeMsRef.current = null;
    setRemainingSeconds(0);
  };

  const stepIngredients = useMemo(
    () => INGREDIENTS.filter((ing) => currentStep.ingredientIds.includes(ing.id)),
    [currentStep]
  );

  const totalRecipeSeconds = calculateTotalTimeSeconds(steps);
  const totalRemainingSecs = calculateRemainingTimeSeconds(steps, currentStepIdx, remainingSeconds);
  const lidConfirmed = !!lidConfirmedSteps[currentStep.id];
  const lidReminder = getLidReminderState(currentStep);

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden flex flex-col bg-[#FAF7F2] dark:bg-[#0F0D0C] text-[#1C1613] dark:text-[#F5EFE6] transition-colors">
      {/* Minimal Top Bar: Project Name on Left, GitHub + Speaker + Gear Settings on Right */}
      <header className="h-12 shrink-0 px-4 sm:px-6 border-b border-stone-200 dark:border-stone-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={handleReturnHome}
            data-testid="brand-title-btn"
            className="text-base font-bold tracking-tight font-display text-[#1C1613] dark:text-[#F5EFE6] flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>simple-cooking</span>
          </button>
          {viewMode !== 'home' && (
            <button
              type="button"
              onClick={handleReturnHome}
              title="Back to all steps"
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-stone-200/70 dark:bg-stone-800 text-[11px] font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors whitespace-nowrap shrink-0"
            >
              <LayoutList className="w-3 h-3 text-accent" />
              <span>Steps</span>
            </button>
          )}
        </div>

        {/* Right Controls: GitHub Link (left of speaker) + Speaker Button + Gear Settings Icon */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="https://github.com/vivekmasaram/simple-cooking"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            title="View simple-cooking on GitHub"
            data-testid="github-link"
            className="min-h-[36px] min-w-[36px] rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-4 h-4 fill-current"
            >
              <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.21.7.82.58C20.56 22.3 24 17.8 24 12.5 24 5.87 18.63 0.5 12 0.5z" />
            </svg>
          </a>

          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={audioMuted ? 'Unmute kitchen audio' : 'Mute kitchen audio'}
            data-testid="speaker-mute-btn"
            className="min-h-[36px] min-w-[36px] rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 transition-colors"
          >
            {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-accent" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
            data-testid="settings-gear-btn"
            className="min-h-[36px] min-w-[36px] px-2.5 py-1 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-[#1C1613] dark:text-[#F5EFE6] flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <Settings className="w-4 h-4 text-accent" />
          </button>
        </div>
      </header>

      {/* Settings Modal (Theme Light/Dark, Accent Colour Swatches, and Nerd Section Custom #Code) */}
      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Settings"
          data-testid="settings-modal"
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSettingsOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-[#171412] p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-accent" />
                <h2 className="text-base font-bold text-[#1C1613] dark:text-[#F5EFE6]">
                  Settings
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
                data-testid="close-settings-btn"
                className="min-h-[32px] min-w-[32px] rounded-lg bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Theme: Light / Dark */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Theme
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsDark(true)}
                  data-testid="theme-dark-btn"
                  className={`min-h-[40px] px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    isDark
                      ? 'bg-accent text-white border-transparent'
                      : 'bg-stone-100 dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDark(false)}
                  data-testid="theme-light-btn"
                  className={`min-h-[40px] px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    !isDark
                      ? 'bg-accent text-white border-transparent'
                      : 'bg-stone-100 dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
              </div>
            </div>

            {/* 2. Accent Colour Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Accent Colour
                </p>
                <span className="text-[11px] font-mono-tabular text-stone-500 dark:text-stone-400">
                  {accentHex}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ACCENT_PRESETS.map((preset) => {
                  const selected = accentHex.toUpperCase() === preset.hex.toUpperCase();
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectAccentPreset(preset.hex)}
                      data-testid={`accent-preset-${preset.id}`}
                      className={`min-h-[38px] px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                        selected
                          ? 'border-[#1C1613] dark:border-white bg-stone-200/70 dark:bg-stone-800'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: preset.hex }}
                      >
                        {selected && <Check className="w-2.5 h-2.5 text-white" />}
                      </span>
                      <span className="truncate text-[11px]">{preset.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Nerd Section: Custom #Code for Colour */}
            <div
              data-testid="nerd-section"
              className="rounded-xl border border-stone-300/80 dark:border-stone-800 bg-stone-100/90 dark:bg-[#110F0E] p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-bold text-[#1C1613] dark:text-[#F5EFE6]">
                    Nerd Section
                  </span>
                </div>
                <span className="text-[10px] font-mono-tabular text-stone-500 dark:text-stone-400">
                  Custom #HEX
                </span>
              </div>

              <form onSubmit={handleApplyCustomHex} className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <span
                    className="w-5 h-5 rounded-md border border-stone-300 dark:border-stone-700 shrink-0 mr-2"
                    style={{ backgroundColor: accentHex }}
                  />
                  <input
                    type="text"
                    value={customHexInput}
                    onChange={(e) => handleCustomHexChange(e.target.value)}
                    placeholder="#EA580C"
                    maxLength={7}
                    aria-label="Custom hex colour code"
                    data-testid="custom-hex-input"
                    className="w-full min-h-[36px] px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono-tabular text-[#1C1613] dark:text-[#F5EFE6] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  data-testid="apply-custom-hex-btn"
                  className="min-h-[36px] px-3 py-1 rounded-lg bg-accent text-white text-xs font-bold shrink-0"
                >
                  Apply
                </button>
              </form>

              {hexError && (
                <p className="text-[11px] text-rose-500 font-medium">{hexError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'home' ? (
        /* ================= HOME PAGE: SCROLLABLE 1-STEP-AT-A-TIME LIST + FIXED START BUTTON ================= */
        <main
          data-testid="start-overview-screen"
          className="flex-1 min-h-0 w-full max-w-md sm:max-w-xl mx-auto flex flex-col overflow-hidden"
        >
          {/* Scrollable Container Showing Header + 1 Step Per Row (strictly vertical pan only) */}
          <div
            data-testid="home-scroll-container"
            className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden overscroll-x-none touch-pan-y px-3.5 pt-3 pb-4 space-y-2.5"
          >
            {/* Recipe Header & Total Time Summary */}
            <div className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#171412] p-3.5 space-y-3 overflow-hidden">
              <div className="flex items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-[#1C1613] dark:text-[#F5EFE6] leading-tight truncate">
                    Indian Universal
                  </h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                    Tap any step to preview its animation &amp; info
                  </p>
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-accent-soft border border-accent-soft text-right shrink-0">
                  <p className="text-[10px] text-accent font-semibold">TOTAL TIME</p>
                  <p className="text-sm font-bold font-mono-tabular text-[#1C1613] dark:text-[#F5EFE6]">
                    {formatHumanDuration(totalRecipeSeconds)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 w-full">
                {(['meat', 'veg', 'paneer'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleMainTypeChange(type)}
                    className={`flex-1 min-h-[36px] min-w-0 px-2 py-1 rounded-xl text-xs font-semibold transition-colors truncate ${
                      config.mainType === type
                        ? 'bg-accent text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {type === 'meat' ? 'Meat' : type === 'veg' ? 'Vegetables' : 'Paneer'}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleToggleTomato}
                  aria-label={config.includeTomato ? 'Tomato included (tap to remove)' : 'No tomato (tap to include)'}
                  aria-pressed={config.includeTomato}
                  title={config.includeTomato ? 'Tomato included' : 'No tomato'}
                  data-testid="tomato-toggle-btn"
                  className={`min-h-[36px] min-w-[42px] px-2.5 py-1 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                    config.includeTomato
                      ? 'border-red-500/45 bg-red-500/15 shadow-xs'
                      : 'border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60'
                  }`}
                >
                  <span
                    data-testid="tomato-emoji"
                    className={`text-base leading-none transition-all select-none ${
                      config.includeTomato ? 'grayscale-0 opacity-100 scale-105' : 'grayscale opacity-35 scale-95'
                    }`}
                  >
                    🍅
                  </span>
                </button>
              </div>
            </div>

            {/* Single-Column Step List (1 Step at a Time per Row — Uniform Style, No Lid Highlight) */}
            <div aria-label="All Recipe Steps and Times" className="space-y-2 w-full">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  data-testid={`overview-step-${step.stepNumber}`}
                  onClick={() => openStepPreview(idx)}
                  className="w-full p-3 rounded-2xl border bg-white dark:bg-[#171412] border-stone-200 dark:border-stone-800/90 hover:border-stone-400 dark:hover:border-stone-700 text-left flex items-center justify-between gap-2.5 transition-colors overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <StepAnimatedLogo stepId={step.id} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        <span className="font-mono-tabular font-bold text-accent">
                          STEP {String(step.stepNumber).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{step.phase}</span>
                      </div>
                      <p className="text-sm font-bold text-[#1C1613] dark:text-[#F5EFE6] truncate mt-0.5">
                        {step.title}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono-tabular font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                      step.timerSeconds > 0
                        ? 'bg-stone-900 dark:bg-stone-800 text-amber-300'
                        : 'bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {step.timerSeconds > 0 ? formatHumanDuration(step.timerSeconds) : 'Action'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Bottom Start Cooking Bar */}
          <div className="shrink-0 p-3.5 border-t border-stone-200 dark:border-stone-800/80 bg-[#FAF7F2]/95 dark:bg-[#0F0D0C]/95 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => selectCookingStep(0, steps[0]?.timerSeconds > 0)}
              data-testid="start-cooking-btn"
              className="h-12 w-full rounded-2xl bg-accent hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-opacity"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Guided Cooking — Step 1</span>
            </button>
          </div>
        </main>
      ) : (
        /* ================= STEP VIEW (ZERO-SCROLL): PREVIEW (NO TIMER) OR ACTIVE COOKING (WITH TIMER) ================= */
        <main
          data-testid={viewMode === 'preview' ? 'step-preview-screen' : 'active-cooking-screen'}
          className="flex-1 min-h-0 w-full max-w-md sm:max-w-xl mx-auto px-3.5 py-2.5 flex flex-col justify-between gap-2 overflow-hidden"
        >
          {/* 1. Interactive 23-Step Progress Bar (No Lid Highlight) */}
          <div className="shrink-0 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono-tabular text-stone-500 dark:text-stone-400">
              <span>
                STEP <strong className="text-[#1C1613] dark:text-[#F5EFE6]">{currentStep.stepNumber}</strong> OF {steps.length}
                {viewMode === 'preview' ? ' · PREVIEW MODE' : ''}
              </span>
              <span>
                {viewMode === 'preview'
                  ? currentStep.timerSeconds > 0
                    ? `Step time: ${formatHumanDuration(currentStep.timerSeconds)}`
                    : 'Immediate / Action Step'
                  : `${formatHumanDuration(totalRemainingSecs)} remaining`}
              </span>
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
              {steps.map((s, idx) => {
                const isCurrent = idx === currentStepIdx;
                const isDone = viewMode === 'cooking' && (idx < currentStepIdx || !!completedStepIds[s.id]);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      viewMode === 'preview'
                        ? openStepPreview(idx)
                        : selectCookingStep(idx, s.timerSeconds > 0)
                    }
                    aria-label={`Jump to step ${s.stepNumber}: ${s.shortTitle}`}
                    className={`h-2 rounded-full transition-colors ${
                      isCurrent
                        ? 'bg-accent'
                        : isDone
                          ? 'bg-emerald-500'
                          : 'bg-stone-300 dark:bg-stone-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 2. Alarm Banner when Real-Time Timer Finishes (Active Cooking Only) */}
          {viewMode === 'cooking' && alarmRinging && (
            <div
              role="alertdialog"
              aria-label="Step Timer Alarm"
              data-testid="alarm-banner"
              className="shrink-0 rounded-2xl bg-accent text-white px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-lg"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <BellRing className="w-5 h-5 shrink-0 animate-bounce" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-snug">
                    ALARM: Step {currentStep.stepNumber} Complete!
                  </p>
                  <p className="text-[11px] text-white/90 leading-snug">
                    {lidReminder.requiresAlert ? lidReminder.badgeText : 'Tap Next Step to continue'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={dismissAlarm}
                  className="min-h-[36px] px-2.5 py-1 rounded-xl bg-black/25 text-xs font-semibold"
                >
                  Mute
                </button>
                {currentStepIdx < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="min-h-[36px] px-3 py-1 rounded-xl bg-white text-[#1C1613] text-xs font-bold"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. Animated Frying Pan & Hand Action Visual Scene */}
          <div className="flex-1 min-h-[155px] max-h-[250px] flex flex-col">
            <StepPanScene step={currentStep} />
          </div>

          {/* 4. Lid Status Bar (Full Text Visible — Never Truncated) */}
          <div
            data-testid="lid-status-banner"
            className="shrink-0 rounded-2xl border bg-stone-200/60 dark:bg-[#171412] border-stone-300/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 px-3.5 py-2.5 flex items-center justify-between gap-2.5 transition-colors"
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <ShieldAlert className="w-4 h-4 shrink-0 text-accent mt-0.5" />
              <div className="min-w-0 flex-1">
                <p
                  data-testid="lid-reminder-title"
                  className="text-xs font-bold leading-snug text-[#1C1613] dark:text-[#F5EFE6] break-words"
                >
                  {lidReminder.badgeText}
                </p>
                <p
                  data-testid="lid-reminder-instruction"
                  className="text-[11px] opacity-90 leading-snug mt-0.5 break-words"
                >
                  {lidReminder.instruction}
                </p>
              </div>
            </div>

            {viewMode === 'cooking' && lidReminder.requiresAlert && (
              <button
                type="button"
                onClick={() =>
                  setLidConfirmedSteps((prev) => ({
                    ...prev,
                    [currentStep.id]: !prev[currentStep.id],
                  }))
                }
                className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                  lidConfirmed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-accent text-white'
                }`}
              >
                {lidConfirmed ? 'Lid Closed ✓' : 'Confirm Lid'}
              </button>
            )}
          </div>

          {/* 5. Minimal English Step Title, Info & Active Ingredient Photo Pill */}
          <div className="shrink-0 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#171412] p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-[#1C1613] dark:text-[#F5EFE6] leading-snug">
                  {currentStep.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-0.5 leading-snug">
                  {currentStep.instruction}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                  {currentStep.chefDetail}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  kitchenAudio.speakText(`${currentStep.title}. ${currentStep.instruction}`)
                }
                aria-label="Read instruction aloud"
                className="min-h-[38px] min-w-[38px] rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-accent shrink-0"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {stepIngredients.length > 0 && (
              <div className="flex items-center gap-2.5 pt-1.5 border-t border-stone-200/70 dark:border-stone-800/80 overflow-x-auto">
                {stepIngredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="flex items-center gap-2 pr-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shrink-0"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-stone-800">
                      <ResilientImage
                        src={ing.imagePath}
                        alt={ing.name}
                        objectPosition={ing.cropPosition}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#1C1613] dark:text-[#F5EFE6] leading-none">
                        {ing.name}
                      </p>
                      <p className="text-[11px] font-mono-tabular text-accent mt-0.5 leading-none">
                        {ing.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. In Preview Mode: NO TIMER (only option to start cook); In Cooking Mode: Real-Time Timer */}
          {viewMode === 'preview' ? (
            <div
              data-testid="preview-mode-bar"
              className="shrink-0 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#171412] px-3.5 py-2.5 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <Eye className="w-4 h-4 text-accent shrink-0" />
                <span>Step Preview · Start cooking to activate timers</span>
              </div>
              <button
                type="button"
                data-testid="start-cook-from-preview-btn"
                onClick={() => selectCookingStep(currentStepIdx, currentStep.timerSeconds > 0)}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-accent hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Cook Here</span>
              </button>
            </div>
          ) : currentStep.timerSeconds > 0 ? (
            <div
              data-testid="step-timer-box"
              className={`shrink-0 rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2 ${
                alarmRinging
                  ? 'bg-accent-soft border-accent'
                  : 'bg-white dark:bg-[#171412] border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    {alarmRinging ? 'Alarm Ringing' : timerRunning ? 'Real-Time Timer' : 'Step Timer'}
                  </p>
                  <p
                    data-testid="timer-readout"
                    className="text-2xl font-bold font-mono-tabular text-[#1C1613] dark:text-[#F5EFE6] leading-none mt-0.5"
                  >
                    {formatTimerDisplay(remainingSeconds)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (timerRunning) {
                      pauseRealTimeTimer();
                    } else {
                      startRealTimeTimer(
                        remainingSeconds > 0 ? remainingSeconds : currentStep.timerSeconds
                      );
                    }
                  }}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    timerRunning
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-accent text-white'
                  }`}
                >
                  {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{timerRunning ? 'Pause' : remainingSeconds === 0 ? 'Restart' : 'Start'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextVal = remainingSeconds + 15;
                    setRemainingSeconds(nextVal);
                    if (timerRunning) startRealTimeTimer(nextVal);
                  }}
                  className="min-h-[42px] px-2.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-mono-tabular font-semibold"
                >
                  +15s
                </button>

                <button
                  type="button"
                  onClick={() =>
                    triggerStepCompletionAlarm(
                      currentStep.title,
                      currentStep.stepNumber,
                      currentStep.id
                    )
                  }
                  title="Complete timer now"
                  className="min-h-[42px] px-2.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold flex items-center gap-1"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Done</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    pauseRealTimeTimer();
                    dismissAlarm();
                    setRemainingSeconds(currentStep.timerSeconds);
                  }}
                  aria-label="Reset timer"
                  className="min-h-[42px] min-w-[38px] rounded-xl border border-stone-300 dark:border-stone-700 flex items-center justify-center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="shrink-0 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#171412] px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-accent">
                {currentStep.immediate
                  ? 'IMMEDIATE ACTION — Perform right away, then tap Next'
                  : 'ACTION STEP — Complete in pan, then tap Next Step'}
              </span>
              <span className="font-mono-tabular text-stone-500">No wait timer</span>
            </div>
          )}

          {/* 7. Bottom Thumb-Zone Navigation Buttons */}
          <div className="shrink-0 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handlePrevStep}
              className="min-h-[48px] rounded-2xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-[#171412] hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{currentStepIdx === 0 ? 'Back to Steps' : 'Previous'}</span>
            </button>

            {currentStepIdx < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="min-h-[48px] rounded-2xl bg-accent hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md transition-opacity"
              >
                <span>
                  {viewMode === 'preview'
                    ? 'Next Preview'
                    : lidReminder.requiresAlert && !lidConfirmed
                      ? 'Lid Closed -> Next'
                      : 'Next Step'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReturnHome}
                className="min-h-[48px] rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Back to Steps</span>
              </button>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
