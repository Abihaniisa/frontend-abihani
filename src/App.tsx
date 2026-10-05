import React, { useState, useEffect } from 'react';
import { Splash } from './components/Splash';
import { BottomNav } from './components/BottomNav';
import { FeedScreen } from './screens/FeedScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { CreateScreen } from './screens/CreateScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { OrderThreadScreen } from './screens/OrderThreadScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AdminScreen } from './screens/AdminScreen';
import { AuthScreen } from './screens/AuthScreen';
import { TermsSheet } from './components/TermsSheet';
import { PrivacySheet } from './components/PrivacySheet';
import { AboutSheet } from './components/AboutSheet';
import { MilestoneCard } from './components/MilestoneCard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { useUIStore } from './store/ui.store';
import { useAuthStore } from './store/auth.store';

export default function App(): React.ReactElement {
  const [splashFinished, setSplashFinished] = useState(false);
  const {
    currentScreen,
    viewingSeller,
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

  const { isAuthenticated } = useAuthStore();

  // Edge-swipe or hardware back button listener
  useEffect(() => {
    const handlePopState = (e: PopStateEvent): void => {
      e.preventDefault();
      navigateBack();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigateBack]);

  // Show primary bottom nav only on main destinations
  const showBottomNav =
    currentScreen === 'home' ||
    currentScreen === 'discover' ||
    currentScreen === 'orders' ||
    currentScreen === 'you';

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
        {!isAuthenticated ? (
          <AuthScreen />
        ) : currentScreen === 'home' ? (
          <FeedScreen />
        ) : currentScreen === 'discover' ? (
          <DiscoverScreen />
        ) : currentScreen === 'create' ? (
          <CreateScreen />
        ) : currentScreen === 'orders' ? (
          <OrdersScreen />
        ) : currentScreen === 'thread' ? (
          <OrderThreadScreen />
        ) : currentScreen === 'you' ? (
          <ProfileScreen />
        ) : currentScreen === 'seller_profile' ? (
          <ProfileScreen sellerOverride={viewingSeller} />
        ) : currentScreen === 'settings' ? (
          <SettingsScreen />
        ) : currentScreen === 'admin' ? (
          <AdminScreen />
        ) : (
          <FeedScreen />
        )}
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
