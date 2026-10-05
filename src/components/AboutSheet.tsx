import React from 'react';
import { X, Mail, Globe, Shield } from './icons';
import { AppConfig } from '../config/app.config';
import { INITIAL_CURRENT_USER } from '../constants/seedData';
import { useUIStore } from '../store/ui.store';

interface AboutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSheet: React.FC<AboutSheetProps> = ({ isOpen, onClose }) => {
  const { navigate } = useUIStore();

  if (!isOpen) return null;

  const founder = INITIAL_CURRENT_USER;

  const handleFounderTap = (): void => {
    onClose();
    navigate('seller_profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs select-none">
      <div className="flex-1 w-full" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-auto bg-[#0B0B0F] border-t border-neutral-800 rounded-t-3xl flex flex-col max-h-[92vh] shadow-2xl overflow-hidden pb-safe">
        {/* Close button */}
        <div className="flex justify-end px-4 pt-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#B8B2A6] hover:text-white hover:bg-neutral-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
          {/* AH mark */}
          <div className="flex justify-center mb-4">
            <img
              src="/icon.svg"
              alt="Abihani"
              className="w-16 h-16"
              draggable={false}
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-extrabold text-[#F5F0E6] text-center tracking-tight">
            Abihani
          </h2>

          {/* Tagline */}
          <p className="text-sm text-[#B8B2A6] text-center mt-1 mb-6">
            The social marketplace
          </p>

          {/* Divider */}
          <div className="border-t border-neutral-800 mb-5" />

          {/* Founder slab */}
          <button
            type="button"
            onClick={handleFounderTap}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:bg-neutral-900 active:scale-[0.99] transition-all text-left"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
              <img
                src={founder.avatarUrl}
                alt={founder.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#F5F0E6] truncate">
                {AppConfig.founderName}
              </div>
              <div className="text-[11px] text-[#B8B2A6] mt-0.5">
                {AppConfig.founderRole}
              </div>
            </div>
          </button>

          {/* Divider */}
          <div className="border-t border-neutral-800 my-6" />

          {/* Three paragraphs */}
          <div className="space-y-4 text-sm text-[#B8B2A6] leading-relaxed">
            <p>
              Abihani is a place where buying lives inside a feed. Open with no intention. Scroll. Discover. Sometimes buy. Sometimes just watch.
            </p>
            <p>
              One account. No buyer mode. No seller mode. Anyone can post. Anyone can buy. Payments are direct between buyer and seller.
            </p>
            <p>
              Built in Nigeria, for Nigeria first.
            </p>
          </div>

          {/* Legal footer */}
          <div className="mt-8 pt-4 border-t border-neutral-800 text-center">
            <span className="text-[11px] text-neutral-500 font-medium block">
              {AppConfig.legalEntity}
            </span>
          </div>
        </div>

        {/* Back to feed button */}
        <div className="px-6 pb-6 pt-3 border-t border-neutral-800 bg-[#0B0B0F]">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-[#C41E3A] text-white font-bold text-sm tracking-tight shadow-lg hover:bg-[#b01a33] active:scale-[0.98] transition-transform"
          >
            Back to feed
          </button>
        </div>
      </div>
    </div>
  );
};