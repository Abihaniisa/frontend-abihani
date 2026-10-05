import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Post } from '../types/post.types';
import { formatPrice } from '../utils/formatPrice';
import { useAuthStore } from '../store/auth.store';
import { useOrderStore } from '../store/order.store';
import { useUIStore } from '../store/ui.store';
import { useFeedStore } from '../store/feed.store';

interface BuySheetProps {
  post: Post | null;
  onClose: () => void;
}

export const BuySheet: React.FC<BuySheetProps> = ({ post, onClose }) => {
  const { currentUser } = useAuthStore();
  const { createOrder } = useOrderStore();
  const { navigate, addToast, openNegotiation } = useUIStore();
  const { activeNegotiations } = useFeedStore();

  const [buyerNote, setBuyerNote] = useState('');
  const [contactPhone, setContactPhone] = useState(currentUser.contactPhone || '');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!post || !post.price) return null;

  const activeOffer = activeNegotiations[post.id];
  const finalPrice = activeOffer ? activeOffer.offerPrice : post.price;
  const sellerBank = post.seller.payoutMethod;

  const copyToClipboard = (text: string, field: string): void => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    addToast(`Copied ${field}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePaidSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const order = createOrder({
        post,
        buyer: currentUser,
        amount: finalPrice,
        buyerNote: buyerNote.trim(),
        contactPhone: contactPhone.trim() || '+2348000000000',
      });

      addToast('Order created. Status: Paid (Unconfirmed)', 'success');
      onClose();
      navigate('thread');
      useOrderStore.getState().selectOrder(order.id);
    } catch {
      addToast('Failed to create order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAskFirst = (): void => {
    onClose();
    openNegotiation(post);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs select-none">
      <div className="flex-1 w-full" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-auto bg-[#0B0B0F] border-t border-neutral-800 rounded-t-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div>
            <span className="text-xs uppercase font-bold text-[#E7C27A] tracking-wider block">
              Direct Checkout
            </span>
            <h3 className="text-base font-extrabold text-[#F5F0E6]">
              Pay {post.seller.displayName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#B8B2A6] hover:text-white hover:bg-neutral-800"
            aria-label="Cancel checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
          {/* Honest Disclaimer Box as locked by prompt */}
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#E7C27A] shrink-0 mt-0.5" />
            <p className="text-xs text-[#B8B2A6] leading-relaxed">
              Pay the seller directly. Abihani does not hold your money yet. Pay only after you trust this seller.
            </p>
          </div>

          {/* Amount Due Card */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#B8B2A6]">Amount to transfer</span>
            <span className="text-xl font-extrabold text-[#E7C27A] tabular-nums">
              {formatPrice(finalPrice)}
            </span>
          </div>

          {/* Seller Bank Details */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-medium text-[#B8B2A6]">Bank Name</span>
              <span className="text-xs font-bold text-[#F5F0E6]">
                {sellerBank?.bankName || 'Guaranty Trust Bank (GTBank)'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-medium text-[#B8B2A6]">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-[#E7C27A] tracking-wider tabular-nums">
                  {sellerBank?.accountNumber || '0123456789'}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(sellerBank?.accountNumber || '0123456789', 'Account Number')
                  }
                  className="p-1 rounded text-[#B8B2A6] hover:text-white"
                  title="Copy"
                >
                  {copiedField === 'Account Number' ? (
                    <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#B8B2A6]">Account Name</span>
              <span className="text-xs font-bold text-[#F5F0E6]">
                {sellerBank?.accountName || post.seller.displayName.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Contact Phone & Note Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#F5F0E6] mb-1">
                Your Contact Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="08012345678"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] focus:border-[#C41E3A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F5F0E6] mb-1">
                Order Note (captured upon payment)
              </label>
              <textarea
                value={buyerNote}
                onChange={(e) => setBuyerNote(e.target.value)}
                rows={2}
                placeholder="Delivery address, size, or special instructions..."
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] focus:border-[#C41E3A] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons: "I have paid" & "Ask about this first" */}
        <div className="p-4 border-t border-neutral-800 bg-[#0B0B0F] space-y-2">
          <button
            onClick={handlePaidSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#C41E3A] text-white font-bold text-sm shadow-lg hover:bg-[#b01a33] active:scale-[0.98] transition-transform"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>I have paid</span>
          </button>

          <button
            onClick={handleAskFirst}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-neutral-900 text-[#F5F0E6] font-semibold text-xs border border-neutral-800 hover:bg-neutral-800 active:scale-[0.98] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#E7C27A]" />
            <span>Ask about this first</span>
          </button>
        </div>
      </div>
    </div>
  );
};
