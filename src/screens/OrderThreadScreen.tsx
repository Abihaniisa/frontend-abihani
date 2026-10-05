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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const order = orders.find((o) => o.id === selectedOrderId);

  const timerInfo = useOrderTimer(order?.shippedAt, 72);

  // Opens scrolled to newest message
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
    addToast('Delivery confirmed. Order Done!', 'success');
    showMilestone({
      title: 'Order Completed',
      badge: 'Order Done',
      description: `Delivery confirmed for ${order.post.caption}.`,
    });
  };

  const handleDisputeSubmit = (): void => {
    if (!disputeReason.trim()) return;
    openDispute(order.id, currentUser, disputeReason.trim());
    addToast('Dispute opened with moderation team', 'error');
    setShowDisputeInput(false);
    setDisputeReason('');
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-[#0B0B0F] text-[#F5F0E6] select-none">
      {/* Top Header */}
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

        {/* Contact sheet trigger */}
        <button
          onClick={() => openContactSheet(order.id)}
          className="p-2 text-[#E7C27A] hover:text-white active:scale-95"
          title="Contact Info"
          aria-label="Contact information"
        >
          <HelpCircle className="w-5 h-5 stroke-[2.2]" />
        </button>
      </header>

      {/* Money Block & Note Bar */}
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

      {/* Action Strip: Changes dynamically with Order Status */}
      <div className="p-3 bg-neutral-900/80 border-b border-neutral-800 flex flex-wrap items-center gap-2 shrink-0">
        {/* Buyer actions */}
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

        {/* Seller actions */}
        {isSeller && (order.status === 'Paid (Unconfirmed)' || order.status === 'Paid (Receipt Uploaded)') && (
          <>
            <button
              onClick={() => confirmPayment(order.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4ADE80] text-[#0B0B0F] text-xs font-bold active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm money received</span>
            </button>

            <button
              onClick={() => shipOrder(order.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-[#F5F0E6] text-xs font-bold border border-neutral-700 hover:bg-neutral-700 active:scale-95"
            >
              <Truck className="w-3.5 h-3.5 text-[#E7C27A]" />
              <span>Ship anyway</span>
            </button>

            <button
              onClick={() => setShowCancelPrompt(true)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 text-[#FF3B3B] text-xs font-semibold hover:bg-neutral-800"
            >
              Cancel order
            </button>
          </>
        )}

        {isSeller && order.status === 'Paid (Confirmed)' && (
          <button
            onClick={() => shipOrder(order.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C41E3A] text-white text-xs font-bold active:scale-95"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Mark as Shipped</span>
          </button>
        )}

        {/* Dispute Button */}
        {order.status !== 'Done' && order.status !== 'Disputed' && (
          <button
            onClick={() => setShowDisputeInput(true)}
            className="ml-auto text-[11px] font-semibold text-[#B8B2A6] hover:text-[#FF3B3B] flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF3B3B]" />
            <span>Dispute</span>
          </button>
        )}
      </div>

      {/* Cancel Order Selection Sheet */}
      {showCancelPrompt && (
        <div className="p-4 bg-neutral-900 border-b border-neutral-800 space-y-2">
          <span className="text-xs font-bold text-[#FF3B3B] block">Select cancellation reason:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                cancelOrder(order.id, currentUser, 'payment_not_received');
                setShowCancelPrompt(false);
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 text-xs text-[#F5F0E6] font-medium hover:bg-neutral-700"
            >
              Payment not received
            </button>
            <button
              onClick={() => {
                cancelOrder(order.id, currentUser, 'other');
                setShowCancelPrompt(false);
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 text-xs text-[#F5F0E6] font-medium hover:bg-neutral-700"
            >
              Other reason
            </button>
            <button
              onClick={() => setShowCancelPrompt(false)}
              className="py-2 px-3 rounded-lg bg-neutral-900 text-xs text-[#B8B2A6]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Dispute Reason Prompt */}
      {showDisputeInput && (
        <div className="p-4 bg-neutral-900 border-b border-[#FF3B3B]/40 space-y-2.5">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FF3B3B] shrink-0 mt-0.5" />
            <p className="text-xs text-[#B8B2A6]">
              We cannot refund your money yet. But we can ban this seller if they are wrong. Tell us what happened.
            </p>
          </div>
          <input
            type="text"
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#FF3B3B]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDisputeInput(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-[#B8B2A6]"
            >
              Cancel
            </button>
            <button
              onClick={handleDisputeSubmit}
              disabled={!disputeReason.trim()}
              className="px-3 py-1.5 rounded-lg bg-[#FF3B3B] text-white text-xs font-bold disabled:opacity-40"
            >
              Submit Dispute
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
        {order.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-[#C41E3A] text-white rounded-br-xs'
                    : 'bg-neutral-900 text-[#F5F0E6] border border-neutral-800 rounded-bl-xs'
                }`}
              >
                {/* Inline Attachment & Receipt Badge */}
                {msg.attachmentUrl && (
                  <div className="mb-2 relative rounded-xl overflow-hidden border border-black/30">
                    <img
                      src={msg.attachmentUrl}
                      alt="Attachment"
                      className="w-full max-h-48 object-cover"
                    />
                    {msg.isReceipt && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#E7C27A] text-[#0B0B0F] font-extrabold text-[10px] tracking-wider uppercase shadow">
                        Receipt
                      </span>
                    )}
                  </div>
                )}
                <p>{msg.text}</p>
              </div>

              <span className="text-[9px] text-neutral-500 mt-1 px-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer Pinned at bottom */}
      <div className="p-3 border-t border-neutral-800 bg-[#0B0B0F] pb-safe flex items-center gap-2 shrink-0">
        <button
          onClick={() => openReceiptUpload(order.id)}
          className="p-2.5 rounded-xl bg-neutral-900 text-[#B8B2A6] hover:text-white active:scale-95"
          title="Attach receipt"
          aria-label="Attach receipt"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${counterparty.displayName}...`}
          autoComplete="off"
          data-lpignore="true"
          data-form-type="other"
          className="flex-1 h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] placeholder-neutral-500 focus:outline-none focus:border-[#C41E3A]"
        />

        <button
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          className="w-11 h-11 rounded-xl bg-[#C41E3A] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b01a33] active:scale-95 transition-transform shrink-0"
          aria-label="Send"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Sub-modals */}
      <ContactSheet
        orderId={activeContactOrder}
        onClose={closeContactSheet}
      />

      <ReceiptUploadModal
        orderId={activeReceiptUploadOrderId}
        onClose={closeReceiptUpload}
      />
    </div>
  );
};
