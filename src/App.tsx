import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Splash } from './components/Splash';
import { BottomNav } from './components/BottomNav';
import { AppRoutes } from './router';
import { TermsSheet } from './components/TermsSheet';
import { PrivacySheet } from './components/PrivacySheet';
import { AboutSheet } from './components/AboutSheet';
import { MilestoneCard } from './components/MilestoneCard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { useUIStore } from './store/ui.store';

export default function App(): React.ReactElement {
  const [splashFinished, setSplashFinished] = useState(false);
  const location = useLocation();
  const {
    showTermsSheet,
    setTermsSheet,
    showPrivacySheet,
    setPrivacySheet,
    showAboutSheet,
    setAboutSheet,
    activeMilestone,
    closeMilestone,
    toasts,
    navigateBack,
  } = useUIStore();

  // Edge-swipe or hardware back listener
  useEffect(() => {
    const handlePopState = (e: PopStateEvent): void => {
      e.preventDefault();
      navigateBack();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigateBack]);

  // Show bottom nav on main tabs
  const path = location.pathname;
  const showBottomNav =
    path === '/' ||
    path === '/discover' ||
    path === '/orders' ||
    path === '/profile';

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] flex flex-col justify-between overflow-x-hidden font-sans">
      {/* 1. Splash Screen under 1s */}
      {!splashFinished && (
        <Splash onComplete={() => setSplashFinished(true)} />
      )}

      {/* 2. PWA In-App Install Prompt Banner */}
      <PWAInstallPrompt />

      {/* 3. Screen Router */}
      <div className="flex-1 w-full">
        <AppRoutes />
      </div>

      {/* 4. Bottom Nav Capsule */}
      {showBottomNav && <BottomNav />}

      {/* 5. Toasts (Bottom floating, auto-dismiss, max 2 stacked) */}
      <div className="fixed bottom-24 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-2 rounded-xl text-xs font-semibold shadow-xl border animate-bounce ${
              toast.type === 'error'
                ? 'bg-[#FF3B3B] text-white border-[#FF3B3B]'
                : toast.type === 'success'
                ? 'bg-neutral-900 text-[#4ADE80] border-[#4ADE80]/40'
                : 'bg-neutral-900 text-[#F5F0E6] border-neutral-700'
            }`}
          >
            {toast.text}
          </div>
        ))}
      </div>

      {/* 6. Universal Sheets & Modals */}
      <TermsSheet
        isOpen={showTermsSheet}
        onClose={() => setTermsSheet(false)}
      />

      <PrivacySheet
        isOpen={showPrivacySheet}
        onClose={() => setPrivacySheet(false)}
      />

      <AboutSheet
        isOpen={showAboutSheet}
        onClose={() => setAboutSheet(false)}
      />

      <MilestoneCard
        milestone={activeMilestone}
        onClose={closeMilestone}
      />
    </div>
  );
}
