import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Video, X, AlertCircle } from 'lucide-react';
import { PostMedia } from '../types/post.types';
import { useAuthStore } from '../store/auth.store';
import { useFeedStore } from '../store/feed.store';
import { useUIStore } from '../store/ui.store';
import { PostService } from '../services';

export const CreateScreen: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { refreshPosts } = useFeedStore();
  const { navigate, addToast, showMilestone } = useUIStore();

  const [selectedMedia, setSelectedMedia] = useState<PostMedia[]>([]);
  const [caption, setCaption] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [stockInput, setStockInput] = useState('1');
  const [shipFrom, setShipFrom] = useState(currentUser.location || 'Abuja (FCT)');
  const [hashtags, setHashtags] = useState('');
  const [hashtagError, setHashtagError] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasPayoutMethod = currentUser.payoutMethod?.isVerified;
  const numericPrice = priceInput ? parseInt(priceInput.replace(/\D/g, ''), 10) : undefined;
  const isPriced = numericPrice !== undefined && numericPrice > 0;

  const handleMediaPick = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMediaError('');
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const hasVideo = files.some((f) => f.type.startsWith('video/'));

    // Check mixed media rule: Never mix photos and video
    if (hasVideo && files.length > 1) {
      setMediaError('Never mix photos and video in the same post.');
      return;
    }

    if (hasVideo) {
      if (selectedMedia.length > 0) {
        setMediaError('One video per post.');
        return;
      }
      const videoUrl = URL.createObjectURL(files[0]);
      setSelectedMedia([{ id: `med_${Date.now()}`, type: 'video', url: videoUrl, aspectRatio: 'vertical' }]);
      return;
    }

    // Photos selected
    if (selectedMedia.some((m) => m.type === 'video')) {
      setMediaError('Never mix photos and video in the same post.');
      return;
    }

    const totalCount = selectedMedia.length + files.length;
    if (totalCount > 5) {
      setMediaError(`Up to 5 photos. You selected ${totalCount}.`);
      return;
    }

    const newMediaItems: PostMedia[] = files.map((f, i) => ({
      id: `med_${Date.now()}_${i}`,
      type: 'image',
      url: URL.createObjectURL(f),
      aspectRatio: 'vertical',
    }));

    setSelectedMedia((prev) => [...prev, ...newMediaItems]);
  };

  const removeMedia = (index: number): void => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
    setMediaError('');
  };

  const handlePublish = (): void => {
    // 1. Media validation
    if (selectedMedia.length === 0) {
      setMediaError('Please select at least 1 photo or 1 video.');
      return;
    }

    // 2. Hashtags required validation (inline error, not toast)
    const parsedTags = hashtags
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    if (parsedTags.length === 0) {
      setHashtagError('At least one hashtag is required to classify your post.');
      return;
    }
    setHashtagError('');

    // 3. Payout method rule if price is set
    if (isPriced && !hasPayoutMethod) {
      return;
    }

    setIsPublishing(true);

    setTimeout(() => {
      PostService.createPost({
        sellerId: currentUser.id,
        seller: currentUser,
        media: selectedMedia,
        caption: caption.trim(),
        hashtags: parsedTags,
        price: numericPrice,
        stock: stockInput ? parseInt(stockInput, 10) : undefined,
        shipFrom: shipFrom.trim(),
      });

      refreshPosts(currentUser.id);
      addToast('Post published', 'success');

      // Milestone check: First post
      if (currentUser.salesCount === 0) {
        showMilestone({
          title: 'First Post on Abihani',
          badge: 'Creator Milestone',
          description: 'Your craft is now live in the Nigeria-wide feed.',
        });
      }

      setIsPublishing(false);
      navigate('you');
    }, 400);
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] pb-32 pt-safe select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <h2 className="text-base font-bold text-[#F5F0E6]">New Post</h2>
        <button
          onClick={() => navigate('home')}
          className="text-xs text-[#B8B2A6] hover:text-white"
        >
          Cancel
        </button>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto">
        {/* 1. MEDIA PICKER: FIRST ELEMENT ON THE SCREEN */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#F5F0E6]">
              {selectedMedia.length === 0
                ? 'Add photos or a video.'
                : `Add more photos (${selectedMedia.length}/5)`}
            </label>
            <span className="text-[10px] text-[#B8B2A6]">Max 5 photos or 1 video</span>
          </div>

          {/* Media previews or picker button */}
          <div className="grid grid-cols-3 gap-2.5">
            {selectedMedia.map((m, index) => (
              <div key={m.id} className="relative aspect-square rounded-xl bg-neutral-900 overflow-hidden border border-neutral-800">
                {m.type === 'video' ? (
                  <video src={m.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={m.url} alt="Upload" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {selectedMedia.length < 5 && !selectedMedia.some((m) => m.type === 'video') && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 flex flex-col items-center justify-center p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <Camera className="w-6 h-6 mb-1 text-[#E7C27A]" />
                <span className="text-[10px] font-semibold text-center leading-tight">
                  {selectedMedia.length === 0 ? 'Upload media' : 'Add photo'}
                </span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleMediaPick}
          />

          {mediaError && (
            <p className="text-xs text-[#FF3B3B] mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {mediaError}
            </p>
          )}
        </div>

        {/* 2. Caption (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-[#F5F0E6] mb-1">
            Caption <span className="text-neutral-500 font-normal">(optional)</span>
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            placeholder="Describe what you are selling or sharing..."
            autoComplete="off"
            data-lpignore="true"
            data-form-type="other"
            className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] focus:border-[#C41E3A] focus:outline-none resize-none"
          />
        </div>

        {/* 3. Hashtags (REQUIRED - Inline error if missing) */}
        <div>
          <label className="block text-xs font-semibold text-[#F5F0E6] mb-1">
            Hashtags <span className="text-[#C41E3A] font-bold">*</span>
          </label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => {
              setHashtags(e.target.value);
              if (hashtagError) setHashtagError('');
            }}
            placeholder="#fashion #abuja #handmade"
            autoComplete="off"
            data-lpignore="true"
            data-form-type="other"
            className={`w-full h-11 px-4 rounded-xl bg-neutral-900 border text-xs text-[#F5F0E6] focus:outline-none transition-colors ${
              hashtagError ? 'border-[#FF3B3B]' : 'border-neutral-800 focus:border-[#C41E3A]'
            }`}
          />
          {hashtagError && (
            <p className="text-xs text-[#FF3B3B] mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {hashtagError}
            </p>
          )}
        </div>

        {/* 4. Commerce Pricing & Stock (Optional) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#F5F0E6] mb-1">
              Price <span className="text-neutral-500 font-normal">(optional)</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-[#E7C27A]">₦</span>
              <input
                type="number"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="0"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full h-11 pl-7 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] focus:border-[#C41E3A] focus:outline-none tabular-nums font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F5F0E6] mb-1">
              Stock <span className="text-neutral-500 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              placeholder="1"
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
              className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] focus:border-[#C41E3A] focus:outline-none tabular-nums font-semibold"
            />
          </div>
        </div>

        {/* 5. Ships From Location */}
        <div>
          <label className="block text-xs font-semibold text-[#F5F0E6] mb-1">
            Ships from
          </label>
          <input
            type="text"
            value={shipFrom}
            onChange={(e) => setShipFrom(e.target.value)}
            placeholder="e.g. Kano (Kano Municipal)"
            autoComplete="off"
            data-lpignore="true"
            data-form-type="other"
            className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] focus:border-[#C41E3A] focus:outline-none"
          />
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Shows a quiet gold badge if different from your profile location.
          </span>
        </div>

        {/* Payout method warning if price set without verified payout */}
        {isPriced && !hasPayoutMethod && (
          <div className="p-3.5 rounded-xl bg-[#E7C27A]/10 border border-[#E7C27A]/30 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#E7C27A] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#E7C27A]">
                Add a payout method to sell. Takes 2 minutes.
              </p>
              <button
                type="button"
                onClick={() => navigate('settings')}
                className="text-[11px] text-[#F5F0E6] underline font-bold mt-1"
              >
                Set up Nigerian bank payout now
              </button>
            </div>
          </div>
        )}

        {/* 6. Publish Button */}
        <button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing || (isPriced && !hasPayoutMethod)}
          className="w-full h-12 rounded-xl bg-[#C41E3A] text-white font-bold text-sm shadow-lg hover:bg-[#b01a33] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-transform"
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
};
