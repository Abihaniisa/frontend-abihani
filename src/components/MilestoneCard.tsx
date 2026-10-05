import React from 'react';
import { Award, Share2, X } from './icons';
import { MilestoneData } from '../store/ui.store';

interface MilestoneCardProps {
  milestone: MilestoneData | null;
  onClose: () => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, onClose }) => {
  if (!milestone) return null;

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Milestone Achieved: ${milestone.title}`,
          text: `${milestone.title} — ${milestone.description} on Abihani, the social marketplace.`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xs bg-[#0B0B0F] border border-[#E7C27A]/40 rounded-3xl p-6 text-center shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded text-neutral-400 hover:text-white"
          aria-label="Close milestone"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Milestone Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#E7C27A]/15 border border-[#E7C27A]/30 flex items-center justify-center mx-auto mb-4 text-[#E7C27A]">
          <Award className="w-8 h-8" />
        </div>

        <span className="text-[11px] uppercase font-bold tracking-widest text-[#E7C27A] block mb-1">
          {milestone.badge}
        </span>

        <h3 className="text-lg font-extrabold text-[#F5F0E6] mb-2 leading-snug">
          {milestone.title}
        </h3>

        <p className="text-xs text-[#B8B2A6] leading-relaxed mb-6">
          {milestone.description}
        </p>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-[#C41E3A] text-white text-xs font-bold shadow hover:bg-[#b01a33] active:scale-[0.98] transition-transform"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Milestone</span>
        </button>
      </div>
    </div>
  );
};
