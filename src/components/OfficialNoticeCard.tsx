import React, { useRef } from 'react';
import { Megaphone, ArrowRight, X } from 'lucide-react';
import { OfficialNotice } from '../types/post.types';
import { useUIStore } from '../store/ui.store';

interface OfficialNoticeCardProps {
  notice: OfficialNotice;
  onDismiss: () => void;
}

export const OfficialNoticeCard: React.FC<OfficialNoticeCardProps> = ({ notice, onDismiss }) => {
  const { setTermsSheet } = useUIStore();
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent): void => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent): void => {
    if (touchStartX.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    // Swipe left dismisses
    if (deltaX > 60) {
      onDismiss();
    }
    touchStartX.current = null;
  };

  const handleCtaClick = (): void => {
    if (notice.ctaLink === 'terms') {
      setTermsSheet(true);
    }
  };

  return (
    <div
      className="relative w-full h-[100dvh] flex items-center justify-center bg-[#0B0B0F] px-6 select-none snap-start snap-always"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full max-w-sm p-6 rounded-2xl bg-neutral-900/90 border-l-4 border-l-[#E7C27A] border-y border-r border-neutral-800 shadow-2xl backdrop-blur-md">
        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Megaphone in gold circle */}
        <div className="w-10 h-10 rounded-full bg-[#E7C27A]/15 border border-[#E7C27A]/30 flex items-center justify-center text-[#E7C27A] mb-4">
          <Megaphone className="w-5 h-5 stroke-[2.2]" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-widest text-[#E7C27A] block mb-1">
          Official Notice
        </span>

        <h3 className="text-xl font-bold text-[#F5F0E6] mb-2 leading-tight">
          {notice.title}
        </h3>

        <p className="text-sm text-[#B8B2A6] leading-relaxed mb-6">
          {notice.message}
        </p>

        {notice.ctaLabel && (
          <button
            onClick={handleCtaClick}
            className="flex items-center justify-between w-full h-11 px-4 rounded-xl bg-[#C41E3A] text-white text-xs font-bold shadow hover:bg-[#b01a33] active:scale-[0.98] transition-transform"
          >
            <span>{notice.ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <span className="block text-center text-[10px] text-neutral-500 mt-4">
          Swipe left to dismiss
        </span>
      </div>
    </div>
  );
};
