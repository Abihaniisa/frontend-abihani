import React, { useState, useRef } from 'react';
import {
  Settings,
  Share2,
  Grid,
  Heart,
  Bookmark,
  MoreVertical,
  CheckCircle,
  Camera,
  MapPin,
  ShieldAlert,
} from '../components/icons';
import { UserProfile } from '../types/user.types';
import { useAuthStore } from '../store/auth.store';
import { useFeedStore } from '../store/feed.store';
import { useUIStore } from '../store/ui.store';
import { formatPrice } from '../utils/formatPrice';

interface ProfileScreenProps {
  sellerOverride?: UserProfile | null;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ sellerOverride }) => {
  const { currentUser, updateProfile } = useAuthStore();
  const { posts, setCurrentPostIndex, toggleFollow, followedUserIds } = useFeedStore();
  const { navigate, addToast } = useUIStore();

  const isOwnProfile = !sellerOverride || sellerOverride.id === currentUser.id;
  const profile = isOwnProfile ? currentUser : sellerOverride;

  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'saved'>('posts');
  const [showTrustModal, setShowTrustModal] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const isFollowed = followedUserIds.has(profile.id);

  const userPosts = posts.filter((p) => p.sellerId === profile.id);
  const likedPosts = posts.filter((p) => p.isLiked);
  const savedPosts = posts.filter((p) => p.isSaved);

  const displayedPosts =
    activeTab === 'posts' ? userPosts : activeTab === 'liked' ? likedPosts : savedPosts;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      updateProfile({ coverUrl: url });
      addToast('Cover image updated');
    }
  };

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} (@${profile.handle}) on Abihani`,
          text: profile.bio,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('Profile link copied');
    }
  };

  const handlePostClick = (postId: string): void => {
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      setCurrentPostIndex(idx);
      navigate('home');
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] pb-28 select-none">
      {/* 1. Cover Band (~140px) */}
      <div className="relative w-full h-[140px] bg-neutral-900 overflow-hidden">
        {profile.coverUrl ? (
          <img
            src={profile.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900" />
        )}

        {/* Change Cover for Own Profile */}
        {isOwnProfile && (
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-[#F5F0E6] hover:bg-black/80 backdrop-blur-md active:scale-95"
            aria-label="Change cover image"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />

        {/* Other profile back / options */}
        {!isOwnProfile && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => navigate('home')}
              className="px-3 py-1 rounded-full bg-black/60 text-xs font-semibold text-white backdrop-blur-md"
            >
              Back
            </button>
            <button
              onClick={() => addToast('Seller options')}
              className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-md"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Avatar Overlaps Bottom Edge */}
      <div className="px-5 relative">
        <div className="flex items-end justify-between -mt-11 mb-3">
          <div className="relative w-20 h-20 rounded-full border-4 border-[#0B0B0F] overflow-hidden bg-neutral-800 shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <>
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 text-xs font-semibold border border-neutral-800 hover:bg-neutral-800"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('settings')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-xs font-bold border border-neutral-800 hover:bg-neutral-800"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => toggleFollow(profile.id)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 ${
                    isFollowed
                      ? 'bg-neutral-800 text-[#F5F0E6]'
                      : 'bg-[#C41E3A] text-white hover:bg-[#b01a33]'
                  }`}
                >
                  {isFollowed ? 'Following' : 'Follow'}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-neutral-900 text-xs font-semibold border border-neutral-800"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Display Name & Handle */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-extrabold text-[#F5F0E6]">
              {profile.displayName}
            </h1>
            {profile.isVerified && (
              <CheckCircle className="w-4 h-4 fill-[#E7C27A] text-[#0B0B0F]" />
            )}
          </div>

          <span className="text-xs text-[#B8B2A6] block">@{profile.handle}</span>

          <p className="text-xs text-[#F5F0E6]/90 leading-relaxed pt-1 max-w-md">
            {profile.bio}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-[#B8B2A6] pt-1">
            <MapPin className="w-3 h-3 text-[#E7C27A]" />
            <span>{profile.location}</span>
          </div>
        </div>

        {/* Trust Row: Sales · Rating · Disputes. All tappable to a list */}
        <div className="flex items-center gap-3 my-4 py-2.5 px-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs">
          <button
            onClick={() => setShowTrustModal('Sales history: verified completed transactions on Abihani.')}
            className="flex items-center gap-1 hover:underline"
          >
            <span className="font-extrabold text-[#F5F0E6] tabular-nums">{profile.salesCount}</span>
            <span className="text-[#B8B2A6]">sales</span>
          </button>
          <span className="text-neutral-600 font-bold">·</span>

          {profile.salesCount >= 3 ? (
            <>
              <button
                onClick={() => setShowTrustModal('Ratings from verified buyers on past orders.')}
                className="flex items-center gap-1 hover:underline"
              >
                <span className="font-extrabold text-[#E7C27A] tabular-nums">★ {profile.rating || 5.0}</span>
                <span className="text-[#B8B2A6]">rating</span>
              </button>
              <span className="text-neutral-600 font-bold">·</span>
            </>
          ) : (
            <span className="text-[10px] text-[#E7C27A] font-semibold">New seller · 0 completed orders</span>
          )}

          {profile.disputesCount > 0 && (
            <button
              onClick={() => setShowTrustModal('Reported open disputes on this account.')}
              className="flex items-center gap-1 hover:underline text-[#FF3B3B]"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{profile.disputesCount} disputes</span>
            </button>
          )}

          <div className="ml-auto text-neutral-400 text-[11px]">
            <span className="font-bold text-[#F5F0E6]">{profile.followersCount}</span> followers
          </div>
        </div>
      </div>

      {/* Tabs: Own Profile has Posts, Liked, Saved. Other profile has Posts only */}
      <div className="flex border-b border-neutral-800 mt-2 px-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'posts'
              ? 'text-[#F5F0E6] border-b-2 border-[#C41E3A]'
              : 'text-[#B8B2A6]'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts</span>
        </button>

        {isOwnProfile && (
          <>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'liked'
                  ? 'text-[#F5F0E6] border-b-2 border-[#C41E3A]'
                  : 'text-[#B8B2A6]'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Liked</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'saved'
                  ? 'text-[#F5F0E6] border-b-2 border-[#C41E3A]'
                  : 'text-[#B8B2A6]'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </button>
          </>
        )}
      </div>

      {/* Posts Grid */}
      <div className="p-1">
        {displayedPosts.length === 0 ? (
          <div className="py-16 text-center text-[#B8B2A6] text-xs">
            {isOwnProfile ? 'No posts yet. Post something.' : 'No posts yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {displayedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="relative aspect-square bg-neutral-900 cursor-pointer overflow-hidden group"
              >
                <img
                  src={post.media[0].url}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                {post.price && (
                  <span className="absolute bottom-1 right-1 text-[10px] font-extrabold text-[#E7C27A] bg-[#0B0B0F]/80 px-1.5 py-0.5 rounded tabular-nums">
                    {formatPrice(post.price)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Row Modal */}
      {showTrustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
          <div className="w-full max-w-xs bg-[#0B0B0F] border border-neutral-800 rounded-2xl p-5 shadow-2xl text-center">
            <h4 className="text-sm font-bold text-[#F5F0E6] mb-2">Verified Trust Info</h4>
            <p className="text-xs text-[#B8B2A6] leading-relaxed mb-4">{showTrustModal}</p>
            <button
              onClick={() => setShowTrustModal(null)}
              className="w-full h-10 rounded-xl bg-neutral-800 text-xs font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
