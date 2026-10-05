import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <>
      {isInstallable && (
        <div className="fixed top-16 left-4 right-4 z-40 p-3 rounded-2xl bg-[#0B0B0F]/95 border border-[#E7C27A]/30 backdrop-blur-md shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E7C27A]/20 text-[#E7C27A] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F5F0E6] block leading-tight">Install Abihani</span>
              <span className="text-[10px] text-[#B8B2A6]">Fast home screen experience</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-lg bg-[#C41E3A] text-white text-[11px] font-bold shadow active:scale-95"
            >
              Install
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-neutral-400 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isIOS && !isInstallable && (
        <div className="fixed top-16 left-4 right-4 z-40 p-3 rounded-2xl bg-[#0B0B0F]/95 border border-[#E7C27A]/30 backdrop-blur-md shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E7C27A]/20 text-[#E7C27A] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F5F0E6] block leading-tight">Add to Home Screen</span>
              <span className="text-[10px] text-[#B8B2A6]">iOS Safari web app</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIOSModal(true)}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 text-[#F5F0E6] text-[11px] font-semibold"
            >
              Guide
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
          <div className="w-full max-w-xs bg-[#0B0B0F] border border-neutral-800 rounded-3xl p-6 text-center shadow-2xl">
            <h3 className="text-base font-bold text-[#F5F0E6] mb-2">Install on iPhone</h3>
            <p className="text-xs text-[#B8B2A6] leading-relaxed mb-4">
              1. Tap the <strong className="text-white">Share</strong> icon in the bottom Safari bar.<br />
              2. Scroll down and choose <strong className="text-[#E7C27A]">Add to Home Screen</strong>.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full h-10 rounded-xl bg-[#C41E3A] text-white text-xs font-bold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
