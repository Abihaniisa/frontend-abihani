import React from 'react';
import { ArrowLeft, Shield, Mail, HelpCircle, FileText } from '../components/icons';
import { useUIStore } from '../store/ui.store';
import { AppConfig } from '../config/app.config';

export const Support: React.FC = () => {
  const { navigateBack, setTermsSheet, setPrivacySheet, setAboutSheet } = useUIStore();

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] pb-28 pt-safe select-none">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800">
        <button
          onClick={navigateBack}
          className="p-1.5 rounded-full text-[#B8B2A6] hover:text-white"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-[#F5F0E6]">Help & Safety</h1>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto text-xs">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-2 text-[#E7C27A] font-bold">
            <Mail className="w-4 h-4" />
            <span>Contact Us</span>
          </div>
          <p className="text-[#B8B2A6] leading-relaxed">
            For dispute reviews, payout questions, or account issues:
          </p>
          <a
            href={`mailto:${AppConfig.publicContactEmail}`}
            className="text-[#F5F0E6] font-mono font-bold underline block"
          >
            {AppConfig.publicContactEmail}
          </a>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-2 text-[#C41E3A] font-bold">
            <Shield className="w-4 h-4" />
            <span>Payments & Reports</span>
          </div>
          <p className="text-[#B8B2A6] leading-relaxed">
            Payments are direct between buyer and seller. Always verify bank details before you send. If something goes wrong, open a report from the order thread. Every report is reviewed. Verified cases lead to a permanent ban.
          </p>
        </div>

        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 divide-y divide-neutral-800">
          <button
            onClick={() => setTermsSheet(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-800/50"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#B8B2A6]" />
              <span className="font-semibold text-[#F5F0E6]">Terms of Service</span>
            </div>
          </button>

          <button
            onClick={() => setPrivacySheet(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-800/50"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#B8B2A6]" />
              <span className="font-semibold text-[#F5F0E6]">Privacy Policy (NDPA)</span>
            </div>
          </button>

          <button
            onClick={() => setAboutSheet(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-800/50"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#B8B2A6]" />
              <span className="font-semibold text-[#F5F0E6]">About Abihani</span>
            </div>
          </button>
        </div>

        <div className="text-center pt-4">
          <span className="text-[10px] text-neutral-500">
            {AppConfig.legalEntity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Support;