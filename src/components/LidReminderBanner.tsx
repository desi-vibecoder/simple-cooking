import React from 'react';
import { ShieldAlert, Droplets, CheckCircle2, Volume2, Disc } from 'lucide-react';
import { CookingStep, getLidReminderState } from '../utils/recipeLogic';
import { kitchenAudio } from '../utils/kitchenAudio';

interface LidReminderBannerProps {
  step: CookingStep;
  lidConfirmed: boolean;
  onToggleLidConfirm: () => void;
}

export const LidReminderBanner: React.FC<LidReminderBannerProps> = ({
  step,
  lidConfirmed,
  onToggleLidConfirm,
}) => {
  const reminder = getLidReminderState(step);

  const handlePlayLidReminder = () => {
    kitchenAudio.playLidAlertChime();
    kitchenAudio.speakText(`${reminder.badgeText}. ${reminder.instruction}`);
  };

  if (!reminder.requiresAlert) {
    return (
      <div
        data-testid="lid-status-banner"
        className="rounded-2xl border border-[#1C1613]/10 bg-[#F3EDE2] px-4 py-3 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#1C1613]/10 flex items-center justify-center text-[#655A52] shrink-0">
            <Disc className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#655A52]">
              Pan Lid Status · Keep Lid Open
            </p>
            <p className="text-xs text-[#655A52]/80">
              {reminder.instruction}
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-[#2A6F48]">
          Next lid close at Step 12
        </span>
      </div>
    );
  }

  const isWaterLid = reminder.urgency === 'water-on-lid';
  const isRemoveWater = reminder.urgency === 'remove-water';

  return (
    <div
      data-testid="lid-status-banner"
      role="region"
      aria-label="Important Lid Reminder"
      className={`rounded-2xl border p-4 transition-colors ${
        lidConfirmed
          ? 'bg-[#2A6F48]/10 border-[#2A6F48]/40 text-[#1C1613]'
          : isWaterLid
            ? 'bg-[#1D4ED8]/10 border-[#1D4ED8]/40 text-[#1C1613]'
            : 'bg-[#C84B11]/12 border-[#C84B11] text-[#1C1613]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              lidConfirmed
                ? 'bg-[#2A6F48] text-white'
                : isWaterLid
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-[#C84B11] text-white'
            }`}
          >
            {isWaterLid || isRemoveWater ? (
              <Droplets className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-tight">
              <span
                className={
                  lidConfirmed
                    ? 'text-[#2A6F48]'
                    : isWaterLid
                      ? 'text-[#1D4ED8]'
                      : 'text-[#C84B11]'
                }
              >
                {reminder.badgeText}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#655A52] font-medium">
                {lidConfirmed ? 'Verified by Cook' : 'Action Required Before Timer Finishes'}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#1C1613] leading-snug">
              {reminder.instruction}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePlayLidReminder}
            aria-label="Hear lid reminder aloud"
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl border border-[#1C1613]/15 bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#1C1613] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Volume2 className="w-4 h-4 text-[#C84B11]" />
            <span>Hear Alert</span>
          </button>

          <button
            type="button"
            onClick={onToggleLidConfirm}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
              lidConfirmed
                ? 'bg-[#2A6F48] text-white'
                : 'bg-[#1C1613] text-[#FAF7F2] hover:bg-[#2E2520]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {lidConfirmed
                ? isRemoveWater
                  ? 'Lid Water Removed ✓'
                  : 'Lid Closed Confirmed ✓'
                : isRemoveWater
                  ? 'Confirm Lid Water Removed'
                  : 'Confirm Lid is Closed'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
