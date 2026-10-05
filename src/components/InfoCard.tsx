import React, { useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Post } from '../types/post.types';
import { formatPrice } from '../utils/formatPrice';
import { useUIStore } from '../store/ui.store';
import { useFeedStore } from '../store/feed.store';
import { useAdminStore } from '../store/admin.store';

interface InfoCardProps {
  post: Post;
  onOpenBuy: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({ post, onOpenBuy }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openSellerProfile, navigate, setSearchQuery } = useUIStore();
  const { activeNegotiations } = useFeedStore();
  const { buySellActive } = useAdminStore();

  const isShoppable = post.price !== undefined && post.price > 0;
  const showShipFromChip = post.shipFrom && post.shipFrom !== post.seller.location;

  const activeOffer = activeNegotiations[post.id];
  const displayPrice = activeOffer ? activeOffer.offerPrice : post.price;

  const handleHashtagClick = (tag: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setSearchQuery(tag);
    navigate('discover');
  };

  return (
    <div className="absolute bottom-20 left-0 right-16 z-20 px-4 pb-2 text-[#F5F0E6] select-none pointer-events-auto">
      {/* Pre-order Special Offer Banner (if applicable) */}
      {activeOffer && (
        <div className="mb-2 p-2 rounded-xl bg-[#E7C27A]/15 border border-[#E7C27A]/40 backdrop-blur-md flex items-center justify-between">
          <span className="text-xs font-semibold text-[#E7C27A]">
            Private Offer: {formatPrice(activeOffer.offerPrice)}
          </span>
          <button
            onClick={onOpenBuy}
            className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#E7C27A] text-[#0B0B0F]"
          >
            Claim
          </button>
        </div>
      )}

      {/* Seller Header & Location */}
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <button
          onClick={() => openSellerProfile(post.seller)}
          className="text-sm font-bold text-[#F5F0E6] hover:underline flex items-center gap-1.5"
        >
          <span>@{post.seller.handle}</span>
          {post.seller.isVerified && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E7C27A]" title="Verified" />
          )}
        </button>

        {showShipFromChip && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#E7C27A] bg-[#E7C27A]/10 px-2 py-0.5 rounded-md">
            <MapPin className="w-3 h-3 text-[#E7C27A]" />
            Ships from {post.shipFrom}
          </span>
        )}
      </div>

      {/* Caption & Hashtags with expansion toggle */}
      <div className="text-xs leading-relaxed text-[#F5F0E6]/90 mb-2">
        <p className={isExpanded ? '' : 'line-clamp-2'}>
          {post.caption}
        </p>

        {/* Clickable Hashtags */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {post.hashtags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => handleHashtagClick(tag, e)}
              className="text-[#E7C27A] font-semibold hover:underline"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </button>
          ))}
        </div>

        {post.caption.length > 80 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#B8B2A6] mt-1"
          >
            {isExpanded ? (
              <>
                Less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                More <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Shoppable Module: Price & Buy TOGETHER in one cohesive block */}
      {isShoppable && (
        <div className="flex items-center gap-3 pt-1">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-[#B8B2A6] tracking-wider">
              Direct Price
            </span>
            <span className="text-lg font-extrabold text-[#E7C27A] tabular-nums tracking-tight">
              {formatPrice(displayPrice)}
            </span>
          </div>

          <button
            onClick={onOpenBuy}
            disabled={!buySellActive}
            className={`flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl font-bold text-xs tracking-tight shadow-lg transition-transform ${
              buySellActive
                ? 'bg-[#C41E3A] text-white hover:bg-[#b01a33] active:scale-95'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>{buySellActive ? 'Buy now' : 'Paused'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
