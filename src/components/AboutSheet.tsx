import React from 'react';
import { X, Mail, Globe, Shield } from './icons';
import { AppConfig } from '../config/app.config';

interface AboutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSheet: React.FC<AboutSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs select-none">
      <div className="flex-1 w-full" onClick={onClose} />

      <div className="relative w-full max-w-sm mx-auto bg-[#0B0B0F] border-t border-neutral-800 rounded-t-3xl p-6 shadow-2xl pb-safe text-center">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1 rounded text-[#B8B2A6] hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parent Angular AH Mark */}
        <div className="w-16 h-16 mx-auto mb-3">
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

        <h2 className="text-xl font-extrabold text-[#F5F0E6] tracking-tight">
          {AppConfig.name}
        </h2>
        <span className="text-xs text-[#E7C27A] font-semibold tracking-wide block mb-3">
          {AppConfig.tagline}
        </span>

        <p className="text-xs text-[#B8B2A6] leading-relaxed mb-5 px-2">
          A social feed where every post can be bought. Nigeria first. Built with passion for Nigerian artisans, creators, and independent businesses.
        </p>

        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-left text-xs mb-6">
          <div className="flex items-center gap-2 text-[#B8B2A6]">
            <Globe className="w-4 h-4 text-[#E7C27A]" />
            <span>Market: Nigeria (NGN ₦)</span>
          </div>
          <div className="flex items-center gap-2 text-[#B8B2A6]">
            <Mail className="w-4 h-4 text-[#E7C27A]" />
            <span>Contact: {AppConfig.publicContactEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-[#B8B2A6]">
            <Shield className="w-4 h-4 text-[#E7C27A]" />
            <span>Platform Settlement: Manual peer-to-peer</span>
          </div>
        </div>

        <div className="border-t border-neutral-800/80 pt-4">
          <span className="text-[11px] text-neutral-500 font-medium block">
            {AppConfig.legalEntity}
          </span>
        </div>
      </div>
    </div>
  );
};
