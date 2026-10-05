import React from 'react';
import { Home, Compass, Plus, Package, User } from 'lucide-react';
import { useUIStore, ScreenType } from '../store/ui.store';
import { useOrderStore } from '../store/order.store';

interface BottomNavProps {
  onHomeClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onHomeClick }) => {
  const { currentScreen, navigate } = useUIStore();
  const { orders } = useOrderStore();

  const hasUnreadOrders = orders.some((o) => o.hasUnreadBuyer || o.hasUnreadSeller);

  const handleTabClick = (screen: ScreenType): void => {
    if (screen === 'home') {
      if (currentScreen === 'home' && onHomeClick) {
        onHomeClick();
      } else {
        navigate('home');
      }
    } else {
      navigate(screen);
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center pointer-events-none px-3">
      {/* Solid Crimson Capsule. Fully opaque. No glass. No blur. No white line. */}
      <nav
        className="pointer-events-auto flex items-center justify-between w-full max-w-[390px] h-[64px] px-3 rounded-[32px] bg-[#C41E3A] shadow-2xl"
        role="navigation"
        aria-label="Primary"
      >
        {/* 1. Home */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex flex-col items-center justify-center flex-1 h-full select-none cursor-pointer focus:outline-none"
        >
          <Home
            className={`transition-all duration-150 text-[#F5F0E6] ${
              currentScreen === 'home' ? 'w-[23px] h-[23px] opacity-100' : 'w-[20px] h-[20px] opacity-90'
            }`}
          />
          <span
            className={`text-[10px] font-semibold tracking-tight text-[#F5F0E6] mt-0.5 leading-none ${
              currentScreen === 'home' ? 'opacity-100 font-bold' : 'opacity-90'
            }`}
          >
            Home
          </span>
          {currentScreen === 'home' && (
            <span className="w-[5px] h-[5px] rounded-full bg-[#F5F0E6] mt-1" />
          )}
        </button>

        {/* 2. Discover */}
        <button
          onClick={() => handleTabClick('discover')}
          className="flex flex-col items-center justify-center flex-1 h-full select-none cursor-pointer focus:outline-none"
        >
          <Compass
            className={`transition-all duration-150 text-[#F5F0E6] ${
              currentScreen === 'discover' ? 'w-[23px] h-[23px] opacity-100' : 'w-[20px] h-[20px] opacity-90'
            }`}
          />
          <span
            className={`text-[10px] font-semibold tracking-tight text-[#F5F0E6] mt-0.5 leading-none ${
              currentScreen === 'discover' ? 'opacity-100 font-bold' : 'opacity-90'
            }`}
          >
            Discover
          </span>
          {currentScreen === 'discover' && (
            <span className="w-[5px] h-[5px] rounded-full bg-[#F5F0E6] mt-1" />
          )}
        </button>

        {/* 3. Center Plus Button: Gold background, crimson plus sign. Slightly raised. */}
        <div className="flex items-center justify-center flex-1">
          <button
            onClick={() => handleTabClick('create')}
            className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#E7C27A] text-[#C41E3A] shadow-md -translate-y-1 active:scale-95 transition-transform cursor-pointer focus:outline-none"
            aria-label="Create Post"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* 4. Orders */}
        <button
          onClick={() => handleTabClick('orders')}
          className="relative flex flex-col items-center justify-center flex-1 h-full select-none cursor-pointer focus:outline-none"
        >
          <div className="relative">
            <Package
              className={`transition-all duration-150 text-[#F5F0E6] ${
                currentScreen === 'orders' || currentScreen === 'thread'
                  ? 'w-[23px] h-[23px] opacity-100'
                  : 'w-[20px] h-[20px] opacity-90'
              }`}
            />
            {hasUnreadOrders && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F5F0E6] rounded-full animate-pulse-slow" />
            )}
          </div>
          <span
            className={`text-[10px] font-semibold tracking-tight text-[#F5F0E6] mt-0.5 leading-none ${
              currentScreen === 'orders' || currentScreen === 'thread'
                ? 'opacity-100 font-bold'
                : 'opacity-90'
            }`}
          >
            Orders
          </span>
          {(currentScreen === 'orders' || currentScreen === 'thread') && (
            <span className="w-[5px] h-[5px] rounded-full bg-[#F5F0E6] mt-1" />
          )}
        </button>

        {/* 5. You */}
        <button
          onClick={() => handleTabClick('you')}
          className="flex flex-col items-center justify-center flex-1 h-full select-none cursor-pointer focus:outline-none"
        >
          <User
            className={`transition-all duration-150 text-[#F5F0E6] ${
              currentScreen === 'you' || currentScreen === 'settings'
                ? 'w-[23px] h-[23px] opacity-100'
                : 'w-[20px] h-[20px] opacity-90'
            }`}
          />
          <span
            className={`text-[10px] font-semibold tracking-tight text-[#F5F0E6] mt-0.5 leading-none ${
              currentScreen === 'you' || currentScreen === 'settings'
                ? 'opacity-100 font-bold'
                : 'opacity-90'
            }`}
          >
            You
          </span>
          {(currentScreen === 'you' || currentScreen === 'settings') && (
            <span className="w-[5px] h-[5px] rounded-full bg-[#F5F0E6] mt-1" />
          )}
        </button>
      </nav>
    </div>
  );
};
