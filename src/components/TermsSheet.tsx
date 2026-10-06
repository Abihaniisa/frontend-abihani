import React from 'react';
import { X, ShieldAlert } from './icons';

interface TermsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsSheet: React.FC<TermsSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs select-none">
      <div className="flex-1 w-full" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-auto bg-[#0B0B0F] border-t border-neutral-800 rounded-t-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden pb-safe">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#E7C27A] tracking-wider block">
              Legal Agreement
            </span>
            <h3 className="text-base font-bold text-[#F5F0E6]">Terms of Service</h3>
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
            Welcome to Abihani. By using the app, you agree to these Terms.
          </p>

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">1. One Account for Everyone</h4>
          <p>
            Abihani is a social marketplace for Nigeria. One profile for every user. No buyer mode. No seller mode. Anyone can post. Anyone can buy. Anyone can sell.
          </p>

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">2. Direct Payment Between Users</h4>
          <p>
            At launch, buyers pay sellers directly to the seller's bank account. Abihani does not hold the money. Verify the seller's bank details before you send. Abihani cannot reverse a bank transfer once it leaves your account.
          </p>

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">3. Reports and Account Actions</h4>
          <p>
            Abihani cannot reverse bank transfers made between two private bank accounts. But every report is reviewed by our team. Verified cases of fraud or non-delivery lead to suspension and a permanent ban from the platform.
          </p>

          <h4 className="font-bold text-[#F5F0E6] text-xs pt-2">4. Age Requirement</h4>
          <p>
            You must be at least 18 years of age to open an account, list products, or enter commercial transactions on Abihani under the laws of the Federal Republic of Nigeria.
          </p>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-2.5 my-4">
            <ShieldAlert className="w-4 h-4 text-[#E7C27A] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#B8B2A6]">
              All sellers must provide accurate item photos, a real Nigerian ship-from location, and honor delivery commitments.
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