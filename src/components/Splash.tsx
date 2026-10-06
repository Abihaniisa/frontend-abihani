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
        <img
          src="/icon.svg"
          alt="Abihani"
          className="w-24 h-24"
          draggable={false}
        />
      </div>

      <div className="pb-12 text-center">
        <span className="block text-xs font-normal text-neutral-400 tracking-wider">from</span>
        <span className="block text-sm font-bold text-[#C41E3A] tracking-tight mt-0.5">
          Abihani Isa
        </span>
      </div>
    </div>
  );
};