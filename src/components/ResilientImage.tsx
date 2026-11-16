import React, { useState } from 'react';
import { Flame, Utensils } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  objectPosition = 'center center',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  // Resolve relative path cleanly for both Vite dev server and GitHub/GitLab Pages subpaths
  const resolvedSrc = src.startsWith('http') || src.startsWith('/') || src.startsWith('.')
    ? src
    : `./${src}`;

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#2B1E1A] via-[#3D261E] to-[#1C1613] text-[#FAF7F2] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#C84B11]/20 border border-[#C84B11]/40 flex items-center justify-center mb-3 text-[#E88D14]">
          <Flame className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold tracking-tight text-[#FAF7F2] max-w-xs">
          {fallbackLabel || alt}
        </p>
        <span className="mt-1 text-xs text-[#FAF7F2]/60 flex items-center gap-1">
          <Utensils className="w-3.5 h-3.5" /> Universal Indian Kitchen Guide
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      style={{ objectPosition }}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
