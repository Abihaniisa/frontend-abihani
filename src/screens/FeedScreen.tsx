import React, { useRef, useEffect } from 'react';
import { TopChrome } from '../components/TopChrome';
import { FeedItem } from '../components/FeedItem';
import { OfficialNoticeCard } from '../components/OfficialNoticeCard';
import { CommentSheet } from '../components/CommentSheet';
import { BuySheet } from '../components/BuySheet';
import { FeedSkeleton } from '../components/SkeletonLoader';
import { useFeedStore } from '../store/feed.store';
import { useUIStore } from '../store/ui.store';

export const FeedScreen: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { posts, currentPostIndex, setCurrentPostIndex, officialNotice, dismissNotice } = useFeedStore();
  const { activeCommentPost, closeComments, activeBuyPost, openBuySheet, closeBuySheet, openComments } = useUIStore();

  const scrollToTop = (): void => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPostIndex(0);
  };

  const handleScroll = (): void => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = window.innerHeight;
    const index = Math.round(scrollTop / height);
    if (index !== currentPostIndex && index >= 0 && index < posts.length) {
      setCurrentPostIndex(index);
    }
  };

  useEffect(() => {
    // Preserve scroll position
    if (containerRef.current && currentPostIndex > 0) {
      containerRef.current.scrollTop = currentPostIndex * window.innerHeight;
    }
  }, [currentPostIndex]);

  if (!posts || posts.length === 0) {
    return <FeedSkeleton />;
  }

  return (
    <div className="relative w-full h-[100dvh] bg-[#0B0B0F] overflow-hidden">
      {/* Floating Top Chrome */}
      <TopChrome onScrollToTop={scrollToTop} />

      {/* Vertical Full-Screen Scroll-Snap Container */}
      <main
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* Official Notice Card displayed if present */}
        {officialNotice && !officialNotice.isDismissed && (
          <OfficialNoticeCard
            notice={officialNotice}
            onDismiss={dismissNotice}
          />
        )}

        {/* Feed Posts */}
        {posts.map((post, idx) => (
          <FeedItem
            key={post.id}
            post={post}
            isActive={idx === currentPostIndex}
            onOpenComments={() => openComments(post)}
            onOpenBuy={() => openBuySheet(post)}
          />
        ))}
      </main>

      {/* Sheets & Modals */}
      <CommentSheet
        post={activeCommentPost}
        onClose={closeComments}
      />

      <BuySheet
        post={activeBuyPost}
        onClose={closeBuySheet}
      />
    </div>
  );
};
