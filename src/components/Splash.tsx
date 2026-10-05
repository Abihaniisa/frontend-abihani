import React, { useEffect, useState } from 'react';
import { TimingConfig } from '../config/timing.config';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, TimingConfig.splashDurationMs);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-white text-[#0B0B0F] select-none pointer-events-auto transition-opacity duration-300"
      aria-label="Abihani Splash"
    >
      <div className="flex-1 flex items-center justify-center">
        {/* Parent AH Angular Crimson Mark */}
        <div className="w-24 h-24 flex items-center justify-center">
          <svg viewBox="0 0 512 512" className="w-full h-full" fill="none">
            <g fill="#C41E3A">
              <path d="M120 400 L210 112 L260 112 L170 400 Z" />
              <path d="M245 112 L295 112 L385 400 L335 400 L300 286 L205 286 L187 342 L137 342 L245 112 Z" fillRule="evenodd" />
              <path d="M342 112 L392 112 L392 400 L342 400 Z" />
              <path d="M216 250 L342 250 L342 286 L205 286 Z" />
            </g>
            <circle cx="392" cy="120" r="14" fill="#E7C27A" />
          </svg>
        </div>
      </div>

      {/* Footer Branding strictly as specified: "from" in grey, "Abihani Isa" in crimson below */}
      <div className="pb-12 text-center">
        <span className="block text-xs font-normal text-neutral-400 tracking-wider">from</span>
        <span className="block text-sm font-bold text-[#C41E3A] tracking-tight mt-0.5">
          Abihani Isa
        </span>
      </div>
    </div>
  );
};
