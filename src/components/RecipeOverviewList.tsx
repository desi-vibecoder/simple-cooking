import React from 'react';
import { Play, Clock, ShieldAlert, Flame, Check } from 'lucide-react';
import {
  CookingStep,
  RecipeConfig,
  MainIngredientType,
  calculateTotalTimeSeconds,
  formatHumanDuration,
  formatTimerDisplay,
} from '../utils/recipeLogic';
import { StepAnimatedLogo } from './StepAnimatedLogo';

interface RecipeOverviewListProps {
  steps: CookingStep[];
  config: RecipeConfig;
  onMainTypeChange: (type: MainIngredientType) => void;
  onToggleTomato: () => void;
  onStartCooking: (stepIndex?: number) => void;
}

export const RecipeOverviewList: React.FC<RecipeOverviewListProps> = ({
  steps,
  config,
  onMainTypeChange,
  onToggleTomato,
  onStartCooking,
}) => {
  const totalSeconds = calculateTotalTimeSeconds(steps);
  const timedCount = steps.filter((s) => s.timerSeconds > 0).length;

  return (
    <div data-testid="recipe-overview" className="space-y-4">
      {/* Direct Portrait Summary & Mode Selector */}
      <section className="rounded-3xl border border-[#1C1613]/12 bg-white p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#C84B11]">
              Universal Indian Cooking · {steps.length} Direct Steps
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1C1613] mt-0.5">
              All Steps &amp; Time Taken
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#1C1613]/10 rounded-2xl px-4 py-2.5 shrink-0">
            <Clock className="w-5 h-5 text-[#C84B11] shrink-0" />
            <div>
              <p className="text-[11px] text-[#655A52]">Total Wait Timers</p>
              <p className="text-base font-bold font-mono-tabular text-[#1C1613]">
                {formatHumanDuration(totalSeconds)} ({timedCount} timers)
              </p>
            </div>
          </div>
        </div>

        {/* Main Ingredient + Tomato Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Main Ingredient Type"
            className="flex items-center gap-1 p-1 bg-[#F3EDE2] rounded-xl flex-1 sm:flex-initial"
          >
            {(['meat', 'veg', 'paneer'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onMainTypeChange(type)}
                className={`flex-1 sm:flex-initial min-h-[42px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  config.mainType === type
                    ? 'bg-white text-[#1C1613] shadow-xs'
                    : 'text-[#655A52] hover:text-[#1C1613]'
                }`}
              >
                {type === 'meat' ? 'Chicken / Meat' : type === 'veg' ? 'Vegetables' : 'Paneer'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleTomato}
            aria-pressed={config.includeTomato}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              config.includeTomato
                ? 'border-[#2A6F48] bg-[#2A6F48]/10 text-[#2A6F48]'
                : 'border-[#1C1613]/15 bg-white text-[#655A52]'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{config.includeTomato ? 'Tomato: Included' : 'Tomato: Skipped'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onStartCooking(0)}
          className="w-full min-h-[52px] px-6 py-3 rounded-2xl bg-[#C84B11] hover:bg-[#B03E0B] text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-colors shadow-sm"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Guided Cooking — Step 1</span>
        </button>
      </section>

      {/* Complete Sequential List: Animated Logo + Step + Time Taken */}
      <section aria-label="Complete Step List with Timers" className="space-y-2">
        {steps.map((step, idx) => {
          const hasLidAlert = step.lidState !== 'open';
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStartCooking(idx)}
              className={`w-full text-left rounded-2xl border p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-colors ${
                hasLidAlert
                  ? 'bg-[#FFF5EE] border-[#C84B11]/35 hover:border-[#C84B11]'
                  : 'bg-white border-[#1C1613]/10 hover:bg-[#F3EDE2]/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <StepAnimatedLogo stepId={step.id} size="sm" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#655A52]">
                    <span className="font-mono-tabular font-bold text-[#1C1613]">
                      {String(step.stepNumber).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Flame className="w-3 h-3 text-[#C84B11]" />
                      {step.heat === 'high' ? 'High' : step.heat === 'lowest' ? 'Lowest' : 'Off'}
                    </span>
                    {hasLidAlert && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 font-bold text-[#C84B11]">
                          <ShieldAlert className="w-3 h-3" />
                          {step.lidState === 'closed-water-on-lid'
                            ? 'Water on Lid'
                            : step.lidState === 'remove-lid-water'
                              ? 'Remove Lid Water'
                              : 'Close Lid'}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-bold text-[#1C1613] leading-snug truncate mt-0.5">
                    {step.title}
                  </p>
                  <p className="text-xs text-[#655A52] truncate">
                    {step.originalDirective}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right pl-2">
                <span
                  className={`inline-block font-mono-tabular text-xs font-bold px-2.5 py-1 rounded-lg ${
                    step.timerSeconds > 0
                      ? 'bg-[#1C1613] text-[#FAF7F2]'
                      : 'bg-[#F3EDE2] text-[#655A52]'
                  }`}
                >
                  {step.timerSeconds > 0 ? formatTimerDisplay(step.timerSeconds) : 'Action'}
                </span>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
};
