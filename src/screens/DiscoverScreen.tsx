import React, { useState, useMemo } from 'react';
import { Search, X, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import { useFeedStore } from '../store/feed.store';
import { useUIStore } from '../store/ui.store';
import { formatPrice } from '../utils/formatPrice';

const TRENDING_HASHTAGS = ['#kaftan', '#handmade', '#leather', '#jewelry', '#abujafashion', '#kano', '#lekki'];
const RECENT_SEARCHES = ['Amina Bello', '#tourmaline', 'Kano Kaftan', 'Duffle bag'];

export const DiscoverScreen: React.FC = () => {
  const { posts, setCurrentPostIndex } = useFeedStore();
  const { searchQuery, setSearchQuery, navigate } = useUIStore();
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setSearchQuery(localInput.trim());
  };

  const handleTagClick = (tag: string): void => {
    setLocalInput(tag);
    setSearchQuery(tag);
  };

  const clearSearch = (): void => {
    setLocalInput('');
    setSearchQuery('');
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().replace('#', '');
    return posts.filter((p) => {
      const matchCaption = p.caption.toLowerCase().includes(q);
      const matchSeller =
        p.seller.displayName.toLowerCase().includes(q) ||
        p.seller.handle.toLowerCase().includes(q);
      const matchHashtags = p.hashtags.some((t) => t.toLowerCase().includes(q));
      return matchCaption || matchSeller || matchHashtags;
    });
  }, [posts, searchQuery]);

  const handlePostClick = (postId: string): void => {
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      setCurrentPostIndex(idx);
      navigate('home');
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] pb-28 pt-safe select-none">
      {/* Search Header */}
      <div className="sticky top-0 z-30 px-4 pt-3 pb-3 bg-[#0B0B0F]/90 backdrop-blur-md border-b border-neutral-800/80">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Search hashtags, sellers, captions..."
            autoComplete="off"
            data-lpignore="true"
            data-form-type="other"
            className="w-full h-11 pl-10 pr-10 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] placeholder-neutral-500 focus:outline-none focus:border-[#C41E3A] transition-colors"
          />
          {localInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      <div className="p-4 space-y-6">
        {/* Active Search Results */}
        {searchQuery ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#B8B2A6]">
                Results for "{searchQuery}" ({searchResults.length})
              </span>
              <button onClick={clearSearch} className="text-xs text-[#C41E3A] font-bold">
                Clear
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-sm font-semibold text-[#F5F0E6]">Nothing found</span>
                <p className="text-xs text-[#B8B2A6] mt-1">Try another keyword or hashtag</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden cursor-pointer group active:scale-98 transition-transform"
                  >
                    <div className="relative aspect-4/5 bg-neutral-800 overflow-hidden">
                      <img
                        src={post.media[0].url}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {post.price && (
                        <span className="absolute bottom-2 left-2 text-xs font-extrabold text-[#E7C27A] bg-[#0B0B0F]/80 px-2 py-0.5 rounded-md tabular-nums backdrop-blur-xs">
                          {formatPrice(post.price)}
                        </span>
                      )}
                    </div>
                    <div className="p-2.5">
                      <span className="text-[11px] font-bold text-[#F5F0E6] block truncate">
                        @{post.seller.handle}
                      </span>
                      <p className="text-[11px] text-[#B8B2A6] line-clamp-1 mt-0.5">
                        {post.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Trending Hashtags */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-[#E7C27A]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_HASHTAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-[#F5F0E6] hover:border-[#E7C27A]/50 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <span className="text-xs font-semibold text-[#B8B2A6] block mb-2">
                Recent Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map((query) => (
                  <button
                    key={query}
                    onClick={() => handleTagClick(query)}
                    className="text-xs text-[#B8B2A6] px-3 py-1 rounded-lg bg-neutral-900/60 hover:text-white"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>

            {/* Fresh Drops Grid */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-[#F5F0E6]">
                <Sparkles className="w-3.5 h-3.5 text-[#E7C27A]" />
                <span>Fresh Drops</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden cursor-pointer group active:scale-98 transition-transform"
                  >
                    <div className="relative aspect-4/5 bg-neutral-800 overflow-hidden">
                      <img
                        src={post.media[0].url}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {post.price && (
                        <span className="absolute bottom-2 left-2 text-xs font-extrabold text-[#E7C27A] bg-[#0B0B0F]/80 px-2 py-0.5 rounded-md tabular-nums backdrop-blur-xs">
                          {formatPrice(post.price)}
                        </span>
                      )}
                    </div>

                    <div className="p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#F5F0E6] truncate">
                          @{post.seller.handle}
                        </span>
                        {post.shipFrom && (
                          <span className="text-[9px] text-[#B8B2A6] flex items-center gap-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5 text-[#E7C27A]" />
                            {post.shipFrom.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#B8B2A6] line-clamp-1 mt-0.5">
                        {post.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
