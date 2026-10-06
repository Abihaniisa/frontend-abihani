import React, { use } from 'react';
import { X, Lock } from './icons';

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

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">1. What We Collect</h4>
          <p>
            We collect your phone number for account access. We collect your email for the recovery path. Phone numbers are contact info used only inside active order threads. We do not use phone numbers to identify you anywhere else in the app.
          </p>

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">2. No Third-Party Tracking</h4>
          <p>
            Abihani does not use third-party advertising pixels, biometric identifiers, or cross-site tracking cookies. We do not sell your data.
          </p>

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">3. Messages and Options</h4>
          <p>
            Transactional messages are limited to security and order events. You can manage push and notification settings inside the app.
          </p>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-2.5 my-4">
            <Lock className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#B8B2A6]">
              Your payout bank account details are verified through official NUBAN lookups. They are never published on your public profile.
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-800 text-center">
            <span className="text-[11px] text-neutral-500 font-medium block">
              Abihani. Damaturu, Yobe State, Nigeria.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};