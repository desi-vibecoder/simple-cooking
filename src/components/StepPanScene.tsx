import React from 'react';
import { CookingStep } from '../utils/recipeLogic';

interface StepPanSceneProps {
  step: CookingStep;
}

export const StepPanScene: React.FC<StepPanSceneProps> = ({ step }) => {
  const { id, heat, lidState } = step;

  const isLidClosed = lidState === 'closed-mandatory' || lidState === 'closed-water-on-lid';
  const isWaterOnLid = lidState === 'closed-water-on-lid';
  const isRemoveLidWater = lidState === 'remove-lid-water';

  // Determine what type of action is happening above the pan
  const renderActionOverlay = () => {
    switch (id) {
      case 'step-high-heat':
      case 'step-lowest-heat': {
        const isHigh = id === 'step-high-heat';
        return (
          <g>
            {/* Heat waves rising from pan */}
            <path d="M120 115 C115 100, 125 90, 120 75" stroke={isHigh ? '#F97316' : '#FBBF24'} strokeWidth="2.5" strokeLinecap="round" className="anim-steam-1" />
            <path d="M160 110 C155 95, 165 85, 160 70" stroke={isHigh ? '#EF4444' : '#FBBF24'} strokeWidth="2.5" strokeLinecap="round" className="anim-steam-2" />
            <path d="M200 115 C195 100, 205 90, 200 75" stroke={isHigh ? '#F97316' : '#FBBF24'} strokeWidth="2.5" strokeLinecap="round" className="anim-steam-3" />
            {/* Hand adjusting stove dial badge */}
            <g className="anim-hand-sprinkle">
              <circle cx="248" cy="64" r="22" fill="#1E1916" stroke={isHigh ? '#F97316' : '#38BDF8'} strokeWidth="2.5" />
              <line
                x1="248"
                y1="64"
                x2={isHigh ? '260' : '236'}
                y2={isHigh ? '52' : '74'}
                stroke={isHigh ? '#F97316' : '#38BDF8'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <text x="248" y="98" textAnchor="middle" fill="#F5EFE6" fontSize="10" fontWeight="700">
                {isHigh ? 'DIAL: HIGH' : 'DIAL: LOW'}
              </text>
            </g>
          </g>
        );
      }

      case 'step-oil-heated':
        return (
          <g>
            {/* Hand holding tilted oil bottle pouring golden oil into pan */}
            <g className="anim-hand-sprinkle">
              {/* Hand */}
              <path d="M225 28 C212 28, 205 36, 205 44 C205 50, 212 56, 224 56 L248 56 L248 28 Z" fill="#E6A972" />
              {/* Bottle body */}
              <rect x="172" y="26" width="44" height="24" rx="6" transform="rotate(-25 172 26)" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1.5" />
              <rect x="155" y="42" width="18" height="8" rx="3" transform="rotate(-25 155 42)" fill="#D97706" />
            </g>
            {/* Golden oil stream */}
            <path d="M156 50 Q152 88 156 126" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" className="anim-stream" />
            <ellipse cx="156" cy="128" rx="28" ry="5" fill="#F59E0B" className="anim-shimmer" />
          </g>
        );

      case 'step-jilakara-aavalu':
      case 'step-salt-chitikedu':
      case 'step-haldi':
      case 'step-chilli-salt':
      case 'step-dhaniya-powder':
      case 'step-coriander-curry-mix': {
        const particleColor =
          id === 'step-jilakara-aavalu'
            ? '#A16207'
            : id === 'step-salt-chitikedu'
              ? '#F8FAFC'
              : id === 'step-haldi'
                ? '#FACC15'
                : id === 'step-chilli-salt'
                  ? '#EF4444'
                  : id === 'step-dhaniya-powder'
                    ? '#D97706'
                    : '#22C55E';

        const secondaryColor =
          id === 'step-jilakara-aavalu'
            ? '#1C1917'
            : id === 'step-chilli-salt'
              ? '#F8FAFC'
              : id === 'step-coriander-curry-mix'
                ? '#15803D'
                : particleColor;

        return (
          <g>
            {/* Animated Hand Sprinkling into the Frying Pan */}
            <g className="anim-hand-sprinkle">
              {/* Forearm & Wrist entering from top-right */}
              <path
                d="M255 18 L205 34 C192 38, 180 46, 174 56 C170 62, 175 68, 183 65 L198 58 C193 66, 184 72, 177 74 C172 75, 174 82, 182 81 C192 79, 204 72, 212 64 L258 46 Z"
                fill="#E6A972"
                stroke="#B87B48"
                strokeWidth="1.5"
              />
              {/* Pinched thumb & index finger tip */}
              <circle cx="174" cy="68" r="5" fill={particleColor} />
            </g>

            {/* Falling Sprinkled Particles into the Pan */}
            <g className="anim-particle-1">
              <circle cx="156" cy="82" r="3.2" fill={particleColor} />
              <circle cx="168" cy="88" r="2.8" fill={secondaryColor} />
              <circle cx="145" cy="90" r="2.6" fill={particleColor} />
            </g>
            <g className="anim-particle-2">
              <circle cx="162" cy="92" r="3" fill={secondaryColor} />
              <circle cx="150" cy="98" r="3.2" fill={particleColor} />
              <circle cx="174" cy="96" r="2.5" fill={particleColor} />
            </g>
            <g className="anim-particle-3">
              <circle cx="154" cy="102" r="2.8" fill={particleColor} />
              <circle cx="166" cy="105" r="3.2" fill={secondaryColor} />
              <circle cx="142" cy="104" r="2.5" fill={secondaryColor} />
            </g>
          </g>
        );
      }

      case 'step-green-chilli':
      case 'step-curry-leaves': {
        const isChilli = id === 'step-green-chilli';
        return (
          <g>
            {/* Hand dropping green chillies / curry leaves */}
            <g className="anim-hand-sprinkle">
              <path
                d="M250 20 L200 36 C188 40, 178 48, 174 58 C171 64, 177 69, 185 65 L202 56 L252 44 Z"
                fill="#E6A972"
                stroke="#B87B48"
                strokeWidth="1.5"
              />
            </g>
            <g className="anim-particle-1">
              {isChilli ? (
                <>
                  <path d="M145 82 Q158 92 170 84" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" />
                  <path d="M162 96 Q175 106 186 98" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <ellipse cx="152" cy="86" rx="7" ry="4" transform="rotate(-25 152 86)" fill="#22C55E" />
                  <ellipse cx="170" cy="94" rx="7" ry="4" transform="rotate(20 170 94)" fill="#15803D" />
                </>
              )}
            </g>
            <g className="anim-particle-2">
              <ellipse cx="158" cy="104" rx="6.5" ry="3.5" transform="rotate(-15 158 104)" fill="#4ADE80" />
            </g>
          </g>
        );
      }

      case 'step-onion':
      case 'step-ginger-garlic':
      case 'step-main-mix':
      case 'step-optional-tomato': {
        const chunkColor =
          id === 'step-onion'
            ? '#E879F9'
            : id === 'step-ginger-garlic'
              ? '#FDE047'
              : id === 'step-optional-tomato'
                ? '#EF4444'
                : '#FB923C';
        return (
          <g>
            {/* Hand holding wooden spatula stirring & tossing ingredients in pan */}
            <g className="anim-spatula">
              {/* Hand on handle */}
              <circle cx="192" cy="36" r="12" fill="#E6A972" stroke="#B87B48" strokeWidth="1.5" />
              {/* Spatula shaft */}
              <line x1="192" y1="36" x2="156" y2="122" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
              {/* Spatula blade */}
              <polygon points="144,118 168,118 172,130 140,130" fill="#B45309" />
            </g>
            {/* Tossed ingredient pieces */}
            <g className="anim-particle-1">
              <rect x="128" y="88" width="9" height="9" rx="2.5" fill={chunkColor} />
              <rect x="174" y="92" width="10" height="9" rx="2.5" fill={chunkColor} />
              <rect x="148" y="82" width="8" height="8" rx="2" fill={chunkColor} />
            </g>
          </g>
        );
      }

      case 'step-close-lid-1':
      case 'step-close-lid-final-1min':
      case 'step-meat-water-lid':
        return (
          <g className="anim-lid-lower">
            {/* Forearm & Hand gripping top lid knob and lowering rimmed steel lid onto pan */}
            <path
              d="M230 34 L172 74 C162 78, 148 78, 144 86 C142 90, 148 93, 156 91 L176 91 L238 54 Z"
              fill="#E6A972"
              stroke="#B87B48"
              strokeWidth="1.5"
            />
            {/* Lid handle */}
            <rect x="144" y="88" width="32" height="8" rx="4" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Rimmed stainless steel lid dome */}
            <path
              d="M66 122 L82 96 L238 96 L254 122 Z"
              fill="#CBD5E1"
              stroke="#F8FAFC"
              strokeWidth="2"
            />
            <line x1="62" y1="122" x2="258" y2="122" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
          </g>
        );

      case 'step-water-on-lid':
        return (
          <g>
            {/* Closed rimmed lid sitting on pan with pooled water on top */}
            <path
              d="M66 124 L82 102 L238 102 L254 124 Z"
              fill="#94A3B8"
              stroke="#E2E8F0"
              strokeWidth="2"
            />
            {/* Pooled blue water on top of the concave lid */}
            <ellipse cx="160" cy="105" rx="68" ry="7" fill="#38BDF8" className="anim-shimmer" />
            {/* Hand tilting water cup pouring onto the lid */}
            <g className="anim-hand-sprinkle">
              <path d="M236 24 L204 36 L212 58 L244 46 Z" fill="#60A5FA" stroke="#EFF6FF" strokeWidth="1.5" />
              <circle cx="234" cy="34" r="10" fill="#E6A972" />
            </g>
            {/* Water stream landing on top of the lid */}
            <path d="M204 46 Q182 74 176 103" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" className="anim-stream" />
          </g>
        );

      case 'step-remove-lid-water':
        return (
          <g className="anim-lid-lift">
            {/* Hands with cloth lifting the water-filled lid carefully off the pan */}
            <circle cx="82" cy="96" r="10" fill="#F97316" />
            <circle cx="238" cy="96" r="10" fill="#F97316" />
            <path
              d="M66 114 L82 94 L238 94 L254 114 Z"
              fill="#CBD5E1"
              stroke="#F8FAFC"
              strokeWidth="2"
            />
            <ellipse cx="160" cy="96" rx="62" ry="6" fill="#38BDF8" />
          </g>
        );

      case 'step-final-salt-taste':
        return (
          <g>
            {/* Hand lifting a tasting spoon + sprinkling final pinch of salt */}
            <g className="anim-hand-sprinkle">
              <path d="M242 40 L184 72" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />
              <ellipse cx="176" cy="76" rx="12" ry="6" fill="#EA580C" stroke="#F8FAFC" strokeWidth="1.5" />
              <circle cx="236" cy="42" r="11" fill="#E6A972" />
            </g>
            <path d="M172 64 C170 54, 178 48, 174 38" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" className="anim-steam-1" />
          </g>
        );

      case 'step-turn-off-stove-5min':
        return (
          <g>
            {/* Tightly closed lid resting while aromatic steam wisps rise */}
            <path
              d="M66 124 L82 100 L238 100 L254 124 Z"
              fill="#94A3B8"
              stroke="#E2E8F0"
              strokeWidth="2"
            />
            <rect x="146" y="92" width="28" height="8" rx="4" fill="#64748B" />
            <path d="M115 90 C110 74, 122 64, 115 48" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" className="anim-steam-1" />
            <path d="M160 86 C155 70, 167 60, 160 44" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" className="anim-steam-2" />
            <path d="M205 90 C200 74, 212 64, 205 48" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" className="anim-steam-3" />
          </g>
        );

      case 'step-eat':
      default:
        return (
          <g>
            {/* Aromatic steam rising from finished garnished dish */}
            <path d="M115 105 C110 86, 122 74, 115 54" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" className="anim-steam-1" />
            <path d="M160 100 C155 80, 167 68, 160 48" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" className="anim-steam-2" />
            <path d="M205 105 C200 86, 212 74, 205 54" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" className="anim-steam-3" />
          </g>
        );
    }
  };

  // Determine contents visible inside the frying pan bowl
  const renderPanContents = () => {
    if (isLidClosed && id !== 'step-close-lid-1' && id !== 'step-close-lid-final-1min' && id !== 'step-meat-water-lid') {
      return null;
    }
    return (
      <g>
        {/* Base oil/gravy surface inside pan */}
        <ellipse
          cx="160"
          cy="128"
          rx="82"
          ry="10"
          fill={
            id === 'step-high-heat'
              ? '#27272A'
              : id === 'step-haldi' || id === 'step-main-mix'
                ? '#EAB308'
                : id.includes('chilli') || id.includes('tomato') || id.includes('dhaniya') || id.includes('eat') || id.includes('coriander') || id.includes('final')
                  ? '#C2410C'
                  : '#D97706'
          }
          className="anim-shimmer"
        />
        {/* Sizzling bits inside the pan */}
        {id !== 'step-high-heat' && (
          <g className="anim-sizzle">
            <circle cx="125" cy="127" r="3" fill="#FEF08A" />
            <circle cx="152" cy="130" r="3.5" fill="#22C55E" />
            <circle cx="182" cy="126" r="3" fill="#FEF08A" />
            <circle cx="168" cy="129" r="2.5" fill="#FDE047" />
          </g>
        )}
      </g>
    );
  };

  return (
    <div
      data-testid="step-pan-scene"
      className="relative w-full h-full min-h-[175px] max-h-[250px] rounded-3xl bg-gradient-to-b from-[#1A1512] to-[#120E0C] dark:from-[#181310] dark:to-[#0E0B0A] border border-stone-200/80 dark:border-stone-800 flex items-center justify-center overflow-hidden shadow-inner"
    >
      {/* Top Corner Step Status Pill & Heat Status */}
      <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono-tabular z-10">
        <span className="text-amber-400 font-semibold">
          STEP {String(step.stepNumber).padStart(2, '0')} · {step.phase.toUpperCase()}
        </span>
        <span
          className={`font-bold ${
            heat === 'high'
              ? 'text-orange-400'
              : heat === 'lowest'
                ? 'text-sky-400'
                : 'text-stone-400'
          }`}
        >
          {heat === 'high' ? '● HIGH HEAT' : heat === 'lowest' ? '● LOWEST HEAT' : '○ STOVE OFF'}
        </span>
      </div>

      {/* Animated SVG Kitchen Stove + Frying Pan + Hand Action */}
      <svg
        viewBox="0 0 320 190"
        className="w-full h-full max-w-[360px] max-h-[220px]"
        role="img"
        aria-label={step.imageCaption}
      >
        {/* Action Overlay (Hand Sprinkling, Pouring, Stirring, or Lid Lowering) */}
        {renderActionOverlay()}

        {/*Pan Contents */}
        {renderPanContents()}

        {/* Cast Iron Frying Pan / Kadai Body */}
        <path
          d="M68 124 C74 156, 110 164, 160 164 C210 164, 246 156, 252 124 Z"
          fill="#27272A"
          stroke="#52525B"
          strokeWidth="2.5"
        />
        {/* Pan Rim */}
        <line x1="62" y1="124" x2="258" y2="124" stroke="#71717A" strokeWidth="4" strokeLinecap="round" />
        {/* Left Helper Handle */}
        <path d="M68 130 C52 130, 52 144, 68 144" stroke="#71717A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Right Long Skillet Handle */}
        <path d="M250 126 L304 110 L307 118 L250 136 Z" fill="#3F3F46" stroke="#71717A" strokeWidth="1.5" />

        {/* Stove Grate */}
        <rect x="92" y="166" width="136" height="5" rx="2.5" fill="#52525B" />
        <rect x="76" y="171" width="168" height="6" rx="3" fill="#3F3F46" />

        {/* Animated Burner Flames */}
        {heat === 'high' && (
          <g className="anim-flame-high">
            <path d="M115 166 Q122 146 130 166" fill="#F97316" />
            <path d="M135 166 Q144 142 152 166" fill="#FB923C" />
            <path d="M152 166 Q160 140 168 166" fill="#FACC15" />
            <path d="M168 166 Q176 142 185 166" fill="#FB923C" />
            <path d="M190 166 Q198 146 205 166" fill="#F97316" />
          </g>
        )}

        {heat === 'lowest' && (
          <g className="anim-flame-low">
            <path d="M132 166 Q137 156 142 166" fill="#38BDF8" />
            <path d="M148 166 Q153 155 158 166" fill="#60A5FA" />
            <path d="M162 166 Q167 155 172 166" fill="#60A5FA" />
            <path d="M178 166 Q183 156 188 166" fill="#38BDF8" />
          </g>
        )}
      </svg>

      {/* Bottom Scrim Badge inside Scene when Lid is Closed or Water on Lid */}
      {(isLidClosed || isRemoveLidWater) && (
        <div
          className={`absolute bottom-2.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm ${
            isWaterOnLid
              ? 'bg-sky-500 text-slate-950'
              : isRemoveLidWater
                ? 'bg-amber-400 text-slate-950'
                : 'bg-orange-500 text-white'
          }`}
        >
          {isWaterOnLid
            ? 'LID CLOSED · WATER ON TOP OF LID'
            : isRemoveLidWater
              ? 'CAREFULLY REMOVE WATER ON LID'
              : 'REMINDER: KEEP THE LID CLOSED'}
        </div>
      )}
    </div>
  );
};
