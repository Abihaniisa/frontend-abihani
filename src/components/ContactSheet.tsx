import React from 'react';
import { X, Phone, MessageCircle, Copy, Shield } from './icons';
import { normalizePhone } from '../utils/normalizePhone';
import { useUIStore } from '../store/ui.store';
import { useOrderStore } from '../store/order.store';
import { useAuthStore } from '../store/auth.store';

interface ContactSheetProps {
  orderId: string | null;
  onClose: () => void;
}

export const ContactSheet: React.FC<ContactSheetProps> = ({ orderId, onClose }) => {
  const { orders } = useOrderStore();
  const { currentUser } = useAuthStore();
  const { addToast } = useUIStore();

  if (!orderId) return null;
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  const isBuyer = currentUser.id === order.buyerId;
  const otherParty = isBuyer ? order.seller : order.buyer;
  const rawPhone = isBuyer
    ? order.seller.contactPhone || '+2348000000000'
    : order.contactPhone || order.buyer.contactPhone || '+2348000000000';

  const normalized = normalizePhone(rawPhone);
  const digitsOnly = normalized.replace(/\D/g, '');

  const handleCopy = (): void => {
    navigator.clipboard?.writeText(normalized);
    addToast('Phone number copied');
  };

  const handleCall = (): void => {
    window.location.href = `tel:${normalized}`;
  };

  const handleWhatsApp = (): void => {
    window.open(`https://wa.me/${digitsOnly}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs select-none">
      <div className="flex-1 w-full" onClick={onClose} />

      <div className="relative w-full max-w-sm mx-auto bg-[#0B0B0F] border-t border-neutral-800 rounded-t-3xl p-5 shadow-2xl pb-safe">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#E7C27A] tracking-wider block">
              Active Order Contact
            </span>
            <h3 className="text-sm font-bold text-[#F5F0E6]">
              Contact {otherParty.displayName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#B8B2A6] hover:text-white hover:bg-neutral-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#E7C27A] shrink-0 mt-0.5" />
          <p className="text-xs text-[#B8B2A6] leading-relaxed">
            Contact is only available during an active order.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800 text-center mb-4">
          <span className="text-xs text-neutral-400 block mb-0.5">Verified Number</span>
          <span className="text-base font-mono font-bold text-[#F5F0E6] tracking-wider tabular-nums">
            {normalized}
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-2.5 w-full h-11 rounded-xl bg-[#C41E3A] text-white text-xs font-bold shadow hover:bg-[#b01a33] active:scale-[0.98] transition-transform"
          >
            <Phone className="w-4 h-4" />
            <span>Call directly</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2.5 w-full h-11 rounded-xl bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30 text-xs font-bold hover:bg-[#4ADE80]/20 active:scale-[0.98] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2.5 w-full h-11 rounded-xl bg-neutral-900 text-[#F5F0E6] border border-neutral-800 text-xs font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-colors"
          >
            <Copy className="w-4 h-4 text-[#B8B2A6]" />
            <span>Copy number</span>
          </button>
        </div>
      </div>
    </div>
  );
};