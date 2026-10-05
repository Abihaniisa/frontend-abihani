import React from 'react';
import { X, Lock } from 'lucide-react';

interface PrivacySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacySheet: React.FC<PrivacySheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs select-none">
      <div className="flex-1 w-full" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-auto bg-[#0B0B0F] border-t border-neutral-800 rounded-t-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden pb-safe">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#E7C27A] tracking-wider block">
              Data Protection (NDPA 2023)
            </span>
            <h3 className="text-base font-bold text-[#F5F0E6]">Privacy Policy</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#B8B2A6] hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 text-xs text-[#B8B2A6] leading-relaxed space-y-4 no-scrollbar">
          <p className="text-sm font-semibold text-[#F5F0E6]">
            Your privacy is protected under the Nigeria Data Protection Act (NDPA) 2023.
          </p>

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">1. Information We Collect</h4>
          <p>
            We collect your email address for account authentication and transactional updates. Phone numbers are treated as contact preferences for deliveries and dispute evidence, never as platform identity, and are shared only inside active order threads.
          </p>

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">2. No Third-Party Tracking</h4>
          <p>
            Abihani does not deploy third-party advertising pixels, biometric identifiers, or cross-site tracking cookies. Telemetry is strictly aggregated and privacy-preserving.
          </p>

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">3. Communications & Opt-out</h4>
          <p>
            In accordance with legal consumer safeguards, all transactional emails are limited to security and order events. You can manage push and notification settings inside the application.
          </p>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-2.5 my-4">
            <Lock className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#B8B2A6]">
              Your financial payout bank account details are verified via official NUBAN lookups and never published to public seller profile pages.
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-800 text-center">
            <span className="text-[11px] text-neutral-500 font-medium block">
              Abihani is a product of Abihani Express, registered in Nigeria.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
