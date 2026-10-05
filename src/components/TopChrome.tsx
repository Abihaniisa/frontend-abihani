import React from 'react';
import { Search } from './icons';
import { useFeedStore } from '../store/feed.store';
import { useUIStore } from '../store/ui.store';

interface TopChromeProps {
  onScrollToTop?: () => void;
}

export const TopChrome: React.FC<TopChromeProps> = ({ onScrollToTop }) => {
  const { activeTab, setActiveTab } = useFeedStore();
  const { navigate, currentScreen } = useUIStore();

  const handleWordmarkClick = (): void => {
    if (currentScreen === 'home' && onScrollToTop) {
      onScrollToTop();
    } else {
      navigate('home');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-safe h-14 bg-gradient-to-b from-[#0B0B0F]/90 via-[#0B0B0F]/40 to-transparent pointer-events-none">
      {/* Left: Wordmark only with blinking crimson dot */}
      <div
        onClick={handleWordmarkClick}
        className="pointer-events-auto flex items-center gap-1.5 cursor-pointer active:opacity-80 transition-opacity"
        role="button"
        tabIndex={0}
        aria-label="Abihani home"
      >
        <span className="text-[19px] font-[800] tracking-[-0.6px] text-[#F5F0E6] select-none">
          Abihani
        </span>
        <span className="w-[6px] h-[6px] rounded-full bg-[#C41E3A] animate-blink-dot" />
      </div>

      {/* Center: Tabs */}
      <nav className="pointer-events-auto flex items-center gap-5 text-sm font-semibold tracking-tight">
        <button
          onClick={() => setActiveTab('following')}
          className={`transition-colors relative py-1 ${
            activeTab === 'following'
              ? 'text-[#F5F0E6] font-bold'
              : 'text-[#B8B2A6] hover:text-[#F5F0E6]'
          }`}
        >
          Following
          {activeTab === 'following' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#F5F0E6] rounded-full" />
          )}
        </button>

        <span className="text-neutral-600 text-xs select-none">|</span>

        <button
          onClick={() => setActiveTab('forYou')}
          className={`transition-colors relative py-1 ${
            activeTab === 'forYou'
              ? 'text-[#F5F0E6] font-bold'
              : 'text-[#B8B2A6] hover:text-[#F5F0E6]'
          }`}
        >
          For You
          {activeTab === 'forYou' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#F5F0E6] rounded-full" />
          )}
        </button>
      </nav>

      {/* Right: Search Icon trigger */}
      <div className="pointer-events-auto flex items-center justify-end">
        <button
          onClick={() => navigate('discover')}
          className="p-2 text-[#F5F0E6] hover:text-white active:scale-95 transition-transform"
          aria-label="Search"
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
};
