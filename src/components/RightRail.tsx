import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Plus } from 'lucide-react';
import { Post } from '../types/post.types';
import { useFeedStore } from '../store/feed.store';
import { useUIStore } from '../store/ui.store';

interface RightRailProps {
  post: Post;
  onOpenComments: () => void;
}

export const RightRail: React.FC<RightRailProps> = ({ post, onOpenComments }) => {
  const { toggleLike, toggleSave, toggleFollow, followedUserIds } = useFeedStore();
  const { openSellerProfile, addToast } = useUIStore();

  const isFollowed = followedUserIds.has(post.sellerId);

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.seller.displayName} on Abihani`,
          text: post.caption,
          url: window.location.href,
        });
        addToast('Link shared');
      } catch {
        // user aborted or not supported
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('Link copied to clipboard');
    }
  };

  return (
    <div className="absolute right-3 bottom-[145px] z-20 flex flex-col items-center gap-4 select-none">
      {/* 1. Avatar with follow plus indicator */}
      <div className="relative mb-1">
        <button
          onClick={() => openSellerProfile(post.seller)}
          className="w-12 h-12 rounded-full border-2 border-[#F5F0E6] overflow-hidden bg-neutral-800 shadow-md cursor-pointer active:scale-95 transition-transform"
          aria-label={`View ${post.seller.displayName}'s profile`}
        >
          <img
            src={post.seller.avatarUrl}
            alt={post.seller.displayName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>

        {!isFollowed && (
          <button
            onClick={() => toggleFollow(post.sellerId)}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#C41E3A] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
            aria-label="Follow seller"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        )}
      </div>

      {/* 2. Like Button */}
      <button
        onClick={() => toggleLike(post.id)}
        className="flex flex-col items-center group cursor-pointer"
        aria-label="Like post"
      >
        <div className="p-2 active:scale-125 transition-transform duration-150">
          <Heart
            className={`w-7 h-7 drop-shadow-md transition-colors ${
              post.isLiked
                ? 'fill-[#C41E3A] text-[#C41E3A]'
                : 'text-[#F5F0E6] hover:text-white'
            }`}
          />
        </div>
        <span className="text-xs font-semibold text-[#F5F0E6] drop-shadow-sm -mt-1 tabular-nums">
          {post.likesCount}
        </span>
      </button>

      {/* 3. Comment Button */}
      <button
        onClick={onOpenComments}
        className="flex flex-col items-center group cursor-pointer"
        aria-label="Comments"
      >
        <div className="p-2 active:scale-125 transition-transform duration-150">
          <MessageCircle className="w-7 h-7 text-[#F5F0E6] hover:text-white drop-shadow-md" />
        </div>
        <span className="text-xs font-semibold text-[#F5F0E6] drop-shadow-sm -mt-1 tabular-nums">
          {post.commentsCount}
        </span>
      </button>

      {/* 4. Save Button */}
      <button
        onClick={() => toggleSave(post.id)}
        className="flex flex-col items-center group cursor-pointer"
        aria-label="Save post"
      >
        <div className="p-2 active:scale-125 transition-transform duration-150">
          <Bookmark
            className={`w-7 h-7 drop-shadow-md transition-colors ${
              post.isSaved
                ? 'fill-[#E7C27A] text-[#E7C27A]'
                : 'text-[#F5F0E6] hover:text-white'
            }`}
          />
        </div>
        <span className="text-xs font-semibold text-[#F5F0E6] drop-shadow-sm -mt-1 tabular-nums">
          {post.savesCount}
        </span>
      </button>

      {/* 5. Share Button */}
      <button
        onClick={handleShare}
        className="flex flex-col items-center group cursor-pointer"
        aria-label="Share post"
      >
        <div className="p-2 active:scale-125 transition-transform duration-150">
          <Share2 className="w-7 h-7 text-[#F5F0E6] hover:text-white drop-shadow-md" />
        </div>
        <span className="text-xs font-semibold text-[#F5F0E6] drop-shadow-sm -mt-1 tabular-nums">
          {post.sharesCount}
        </span>
      </button>

      {/* 6. More Options */}
      <button
        onClick={() => addToast('Post options recorded')}
        className="p-2 text-[#F5F0E6] hover:text-white active:scale-95 transition-transform cursor-pointer"
        aria-label="More options"
      >
        <MoreHorizontal className="w-6 h-6 drop-shadow-md" />
      </button>
    </div>
  );
};
