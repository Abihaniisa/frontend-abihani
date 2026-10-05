import React, { useState, useRef } from 'react';
import { Heart } from './icons';
import { Post } from '../types/post.types';
import { RightRail } from './RightRail';
import { InfoCard } from './InfoCard';
import { useFeedStore } from '../store/feed.store';
import { useUIStore } from '../store/ui.store';

interface FeedItemProps {
  post: Post;
  isActive: boolean;
  onOpenComments: () => void;
  onOpenBuy: () => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({
  post,
  isActive: _isActive,
  onOpenComments,
  onOpenBuy,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [burstCoords, setBurstCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartX = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);

  const { toggleLike } = useFeedStore();
  const { openSellerProfile } = useUIStore();

  const currentMedia = post.media[activeMediaIndex] || post.media[0];

  const handleTouchStart = (e: React.TouchEvent): void => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent): void => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    // Swipe left gesture threshold (at least 60px)
    if (deltaX > 60) {
      // If at last image or single image, swipe left opens seller profile
      if (activeMediaIndex >= post.media.length - 1) {
        openSellerProfile(post.seller);
      } else {
        setActiveMediaIndex((prev) => prev + 1);
      }
    } else if (deltaX < -60 && activeMediaIndex > 0) {
      // Swipe right to previous photo
      setActiveMediaIndex((prev) => prev - 1);
    }

    touchStartX.current = null;
  };

  const handleMediaClick = (e: React.MouseEvent): void => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTapTime.current;

    // Double tap detection (< 300ms)
    if (tapLength < 300 && tapLength > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setBurstCoords({ x, y });
      setShowHeartBurst(true);
      if (!post.isLiked) {
        toggleLike(post.id);
      }
      setTimeout(() => setShowHeartBurst(false), 800);
      lastTapTime.current = 0;
    } else {
      lastTapTime.current = currentTime;
    }
  };

  return (
    <div
      className="relative w-full h-[100dvh] flex items-center justify-center bg-[#0B0B0F] overflow-hidden select-none snap-start snap-always"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Blur Backdrop for Square/Horizontal Aspect Ratios */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-30 transform scale-110 pointer-events-none"
        style={{ backgroundImage: `url(${currentMedia.url})` }}
      />

      {/* Primary Media Container: Never crop seller's work */}
      <div
        onClick={handleMediaClick}
        className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer"
      >
        {currentMedia.type === 'video' ? (
          <video
            src={currentMedia.url}
            className="w-full h-full object-contain max-h-[100dvh]"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={currentMedia.url}
            alt={post.caption || `Post by ${post.seller.displayName}`}
            className="w-full h-full object-cover sm:object-contain max-h-[100dvh]"
            loading="eager"
          />
        )}

        {/* Double-tap Heart Burst Animation */}
        {showHeartBurst && (
          <div
            className="absolute z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-heart-burst"
            style={{ left: `${burstCoords.x}px`, top: `${burstCoords.y}px` }}
          >
            <Heart className="w-24 h-24 fill-[#C41E3A] text-[#C41E3A] drop-shadow-2xl" />
          </div>
        )}

        {/* Carousel Pagination Dots (up to 5 photos) */}
        {post.media.length > 1 && (
          <div className="absolute bottom-28 left-0 right-0 z-20 flex justify-center gap-1.5 pointer-events-none">
            {post.media.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === activeMediaIndex ? 'w-4 bg-[#F5F0E6]' : 'w-1.5 bg-[#F5F0E6]/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Rail Action Column */}
      <RightRail post={post} onOpenComments={onOpenComments} />

      {/* Bottom Info Card */}
      <InfoCard post={post} onOpenBuy={onOpenBuy} />

      {/* Subtle Bottom Scrim for readibility */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/60 to-transparent pointer-events-none z-10" />
    </div>
  );
};
