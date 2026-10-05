import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  Paperclip,
  Send,
  UploadCloud,
  CheckCircle2,
  Truck,
  AlertTriangle,
  Clock,
  ShieldAlert,
} from '../components/icons';
import { useOrderStore } from '../store/order.store';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from '../store/ui.store';
import { formatPrice } from '../utils/formatPrice';
import { useOrderTimer } from '../hooks/useOrderTimer';
import { ContactSheet } from '../components/ContactSheet';
import { ReceiptUploadModal } from '../components/ReceiptUploadModal';

export const OrderThreadScreen: React.FC = () => {
  const { selectedOrderId, orders, sendMessage, confirmPayment, shipOrder, confirmDone, cancelOrder, openDispute } = useOrderStore();
  const { currentUser } = useAuthStore();
  const {
    navigateBack,
    addToast,
    openContactSheet,
    closeContactSheet,
    activeContactOrder,
    activeReceiptUploadOrderId,
    openReceiptUpload,
    closeReceiptUpload,
    showMilestone,
  } = useUIStore();

  const [messageText, setMessageText] = useState('');
  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [showSellerOptions, setShowSellerOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const order = orders.find((o) => o.id === selectedOrderId);

  const timerInfo = useOrderTimer(order?.shippedAt, 72);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order?.messages]);

  if (!order) {
    return (
      <div className="w-full h-[100dvh] bg-[#0B0B0F] flex flex-col items-center justify-center p-6 text-center select-none">
        <span className="text-sm font-bold text-[#F5F0E6]">Order not found</span>
        <button
          onClick={navigateBack}
          className="mt-4 px-4 py-2 rounded-xl bg-neutral-800 text-xs text-[#F5F0E6]"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isBuyer = currentUser.id === order.buyerId;
  const isSeller = currentUser.id === order.sellerId;
  const counterparty = isBuyer ? order.seller : order.buyer;

  const handleSendMessage = (): void => {
    if (!messageText.trim()) return;
    sendMessage(order.id, currentUser, messageText.trim());
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDoneConfirmed = (): void => {
    confirmDone(order.id);
    addToast('Delivery confirmed. Order complete.', 'success');
    showMilestone({
      title: 'Order Complete',
      badge: 'Order Done',
      description: `Delivery confirmed for ${order.post.caption}.`,
    });
  };

  const handleDisputeSubmit = (): void => {
    if (!disputeReason.trim()) return;
    openDispute(order.id, currentUser, disputeReason.trim());
    addToast('Report submitted', 'error');
    setShowDisputeInput(false);
    setDisputeReason('');
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-[#0B0B0F] text-[#F5F0E6] select-none">
      <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-[#0B0B0F] pt-safe shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={navigateBack}
            className="p-1.5 rounded-full text-[#B8B2A6] hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-[#F5F0E6] truncate">
                {order.post.caption}
              </h2>
              <span className="text-[10px] font-mono text-neutral-400">
                {order.orderNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#B8B2A6] mt-0.5">
              <span>{order.status}</span>
              {order.status === 'Shipped' && (
                <span className={`font-semibold ${timerInfo.colorClass} flex items-center gap-1`}>
                  <Clock className="w-2.5 h-2.5" />
                  {timerInfo.formattedRemaining}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => openContactSheet(order.id)}
          className="p-2 text-[#E7C27A] hover:text-white active:scale-95"
          title="Contact Info"
          aria-label="Contact information"
        >
          <HelpCircle className="w-5 h-5 stroke-[2.2]" />
        </button>
      </header>

      <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800/80 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-neutral-400">
            Settlement:
          </span>
          <span className="px-2 py-0.5 rounded bg-[#E7C27A]/15 text-[#E7C27A] text-[10px] font-bold">
            Direct Payment
          </span>
        </div>
        <span className="font-extrabold text-[#E7C27A] tabular-nums text-sm">
          {formatPrice(order.amount)}
        </span>
      </div>

      {order.buyerNote && (
        <div className="px-4 py-1.5 bg-neutral-900/40 border-b border-neutral-800/50 text-[11px] text-[#B8B2A6] italic truncate">
          Note: "{order.buyerNote}"
        </div>
      )}

      <div className="p-3 bg-neutral-900/80 border-b border-neutral-800 flex flex-wrap items-center gap-2 shrink-0">
        {isBuyer && !order.receiptUrl && (
          <button
            onClick={() => openReceiptUpload(order.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C41E3A] text-white text-xs font-bold shadow hover:bg-[#b01a33] active:scale-95"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload receipt</span>
          </button>
        )}

        {isBuyer && order.status === 'Shipped' && (
          <button
            onClick={handleDoneConfirmed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4ADE80] text-[#0B0B0F] text-xs font-extrabold shadow hover:bg-[#3ec470] active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm delivery received</span>
          </button>
        )}

        {isSeller && (order.status === 'Paid (Unconfirmed)' || order.status === 'Paid (Receipt Uploaded)') && (
          <>
            <button
              onClick={() => shipOrder(order.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C41E3A] text-white text-xs font-bold active:scale-95"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Ship anyway</span>
            </button>

            <button
              onClick={() => setShowSellerOptions(true)}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 text-[#F5F0E6] text-xs font-semibold"
            >
              More options
            </button>
          </>
        )}

        {isSeller && order.status === 'Paid (Confirmed)' && (
          <button
            onClick={() => shipOrder(order.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C41E3A] text-white text-xs font-bold active:scale-95"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Ship now</span>
          </button>
        )}

        {order.status !== 'Done' && order.status !== 'Disputed' && (
          <button
            onClick={() => setShowDisputeInput(true)}
            className="ml-auto text-[11px] font-semibold text-[#B8B2A6] hover:text-[#FF3B3B] flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF3B3B]" />
            <span>Report</span>
          </button>
        )}
      </div>

      {showSellerOptions && (
        <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex flex-col gap-2">
          <button
            onClick={() => { confirmPayment(order.id); setShowSellerOptions(false); }}
            className="w-full py-2 rounded-lg bg-neutral-800 text-xs text-[#F5F0E6] font-medium"
          >
            Mark money as received
          </button>
          <button
            onClick={() => { setShowSellerOptions(false); setShowCancelPrompt(true); }}
            className="w-full py-2 rounded-lg bg-neutral-800 text-xs text-[#FF3B3B] font-medium"
          >
            Cancel this order
          </button>
          <button
            onClick={() => setShowSellerOptions(false)}
            className="w-full py-2 text-xs text-[#B8B2A6]"
          >
            Close
          </button>
        </div>
      )}

      {showCancelPrompt && (
        <div className="p-4 bg-neutral-900 border-b border-neutral-800 space-y-2">
          <span className="text-xs font-bold text-[#FF3B3B] block">Select cancellation reason:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                cancelOrder