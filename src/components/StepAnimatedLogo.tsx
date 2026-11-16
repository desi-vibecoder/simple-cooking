import React from 'react';

interface StepAnimatedLogoProps {
  stepId: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StepAnimatedLogo: React.FC<StepAnimatedLogoProps> = ({
  stepId,
  size = 'md',
}) => {
  const dims =
    size === 'sm'
      ? 'w-10 h-10 rounded-xl'
      : size === 'lg'
        ? 'w-16 h-16 rounded-2xl'
        : 'w-12 h-12 rounded-xl';

  const svgDims = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';

  const getColors = () => {
    switch (stepId) {
      case 'step-high-heat':
      case 'step-oil-heated':
        return 'bg-[#C84B11] text-[#FFF3D6]';
      case 'step-lowest-heat':
        return 'bg-[#E88D14] text-[#1C1613]';
      case 'step-jilakara-aavalu':
      case 'step-ginger-garlic':
        return 'bg-[#78350F] text-[#FDE68A]';
      case 'step-green-chilli':
      case 'step-curry-leaves':
      case 'step-coriander-curry-mix':
        return 'bg-[#2A6F48] text-[#ECFDF5]';
      case 'step-haldi':
        return 'bg-[#D97706] text-[#FEF9C3]';
      case 'step-close-lid-1':
      case 'step-close-lid-final-1min':
      case 'step-meat-water-lid':
        return 'bg-[#9A3412] text-white';
      case 'step-water-on-lid':
      case 'step-remove-lid-water':
        return 'bg-[#1D4ED8] text-[#EFF6FF]';
      case 'step-turn-off-stove-5min':
      case 'step-eat':
        return 'bg-[#1C1613] text-[#FDE68A]';
      default:
        return 'bg-[#451A03] text-[#FDE68A]';
    }
  };

  const renderGraphic = () => {
    switch (stepId) {
      case 'step-high-heat':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path
              d="M16 4C16 4 23 11.5 23 18.2C23 22.5 19.9 26 16 26C12.1 26 9 22.5 9 18.2C9 14.5 11.2 11 13 9C13 9 13.5 12.2 15.2 13C14.8 9.8 16 4 16 4Z"
              fill="currentColor"
              className="anim-tf-flame"
            />
            <rect x="6" y="27" width="20" height="2.5" rx="1.25" fill="currentColor" opacity="0.8" />
          </svg>
        );

      case 'step-oil-heated':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path
              d="M16 5C16 5 22.5 13 22.5 18C22.5 21.6 19.6 24.5 16 24.5C12.4 24.5 9.5 21.6 9.5 18C9.5 13 16 5 16 5Z"
              fill="currentColor"
              className="anim-tf-pop"
            />
            <ellipse cx="16" cy="26.5" rx="9" ry="2" stroke="currentColor" strokeWidth="1.7" className="anim-tf-ripple" />
          </svg>
        );

      case 'step-lowest-heat':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path
              d="M16 12C16 12 20.5 16.5 20.5 20.5C20.5 23 18.5 25 16 25C13.5 25 11.5 23 11.5 20.5C11.5 16.5 16 12 16 12Z"
              fill="currentColor"
              className="anim-tf-flame"
            />
            <circle cx="16" cy="20.5" r="9.5" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" opacity="0.55" />
          </svg>
        );

      case 'step-jilakara-aavalu':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <circle cx="11" cy="18" r="2.2" fill="currentColor" className="anim-tf-pop" />
            <circle cx="17" cy="13" r="2" fill="currentColor" className="anim-tf-pop" style={{ animationDelay: '0.2s' }} />
            <circle cx="21.5" cy="19" r="2.2" fill="currentColor" className="anim-tf-pop" style={{ animationDelay: '0.4s' }} />
            <path d="M7 24C9.5 26 22.5 26 25 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        );

      case 'step-green-chilli':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path
              d="M22 8C20 14 15 21 8 23C10 18 14 12 20 8.5L22 8Z"
              fill="currentColor"
              className="anim-tf-stir"
            />
            <path d="M21 8.5C22.5 6.5 24.5 6 26 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'step-curry-leaves':
      case 'step-coriander-curry-mix':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path d="M7 25C13 20 19 13 24 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="14" cy="14" rx="4" ry="2.2" transform="rotate(-35 14 14)" fill="currentColor" className="anim-tf-pop" />
            <ellipse cx="19" cy="18" rx="4" ry="2.2" transform="rotate(20 19 18)" fill="currentColor" className="anim-tf-pop" style={{ animationDelay: '0.25s' }} />
            <ellipse cx="20" cy="10" rx="3.5" ry="2" transform="rotate(-20 20 10)" fill="currentColor" />
          </svg>
        );

      case 'step-onion':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <circle cx="16" cy="18" r="7.5" stroke="currentColor" strokeWidth="2" className="anim-tf-stir" />
            <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16 7V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'step-salt-chitikedu':
      case 'step-final-salt-taste':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path d="M11 9H21L19.5 14H12.5L11 9Z" fill="currentColor" />
            <circle cx="13" cy="19" r="1.5" fill="currentColor" className="anim-tf-sprinkle" />
            <circle cx="16.5" cy="22" r="1.5" fill="currentColor" className="anim-tf-sprinkle" style={{ animationDelay: '0.3s' }} />
            <circle cx="20" cy="19" r="1.5" fill="currentColor" className="anim-tf-sprinkle" style={{ animationDelay: '0.6s' }} />
          </svg>
        );

      case 'step-ginger-garlic':
      case 'step-main-mix':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path d="M7 18H25C25 22.5 21 26 16 26C11 26 7 22.5 7 18Z" fill="currentColor" opacity="0.85" />
            <path d="M18 7L14 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="anim-tf-stir" />
          </svg>
        );

      case 'step-haldi':
      case 'step-chilli-salt':
      case 'step-dhaniya-powder':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path d="M8 23L16 11L24 23H8Z" fill="currentColor" className="anim-tf-pop" />
            <circle cx="16" cy="7.5" r="1.6" fill="currentColor" className="anim-tf-sprinkle" />
            <circle cx="11" cy="10" r="1.3" fill="currentColor" className="anim-tf-sprinkle" style={{ animationDelay: '0.3s' }} />
          </svg>
        );

      case 'step-close-lid-1':
      case 'step-close-lid-final-1min':
      case 'step-meat-water-lid':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <g className="anim-tf-lid">
              <path d="M6 15H26" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M13 12H19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </g>
            <path d="M8 18.5H24V22C24 24.5 21.5 26 16 26C10.5 26 8 24.5 8 22V18.5Z" fill="currentColor" />
          </svg>
        );

      case 'step-water-on-lid':
      case 'step-remove-lid-water':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path
              d="M16 5C16 5 20 9.5 20 12C20 14.2 18.2 16 16 16C13.8 16 12 14.2 12 12C12 9.5 16 5 16 5Z"
              fill="currentColor"
              className="anim-tf-pop"
            />
            <path d="M6 19H26" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M8 22H24V24.5C24 26 21 27 16 27C11 27 8 26 8 24.5V22Z" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'step-optional-tomato':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <circle cx="16" cy="18" r="8" fill="currentColor" className="anim-tf-pop" />
            <path d="M16 7V11M12.5 9L16 11L19.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'step-turn-off-stove-5min':
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path d="M12 11C12 9 13.5 7.5 13.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="anim-tf-steam" />
            <path d="M16 11C16 8.5 17.5 7 17.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="anim-tf-steam" style={{ animationDelay: '0.4s' }} />
            <path d="M20 11C20 9 21.5 7.5 21.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="anim-tf-steam" style={{ animationDelay: '0.8s' }} />
            <path d="M7 15H25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M8.5 17.5H23.5V22C23.5 24.5 20.5 26 16 26C11.5 26 8.5 24.5 8.5 22V17.5Z" fill="currentColor" />
          </svg>
        );

      case 'step-eat':
      default:
        return (
          <svg viewBox="0 0 32 32" fill="none" className={svgDims} aria-hidden="true">
            <path d="M12 10C12 8 13.5 7 13.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="anim-tf-steam" />
            <path d="M16 10C16 7.5 17.5 6.5 17.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="anim-tf-steam" style={{ animationDelay: '0.35s' }} />
            <path d="M20 10C20 8 21.5 7 21.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="anim-tf-steam" style={{ animationDelay: '0.7s' }} />
            <path d="M6 15H26C26 21.5 21.5 26 16 26C10.5 26 6 21.5 6 15Z" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`${dims} ${getColors()} flex items-center justify-center shrink-0 shadow-xs`}
      aria-hidden="true"
    >
      {renderGraphic()}
    </div>
  );
};
