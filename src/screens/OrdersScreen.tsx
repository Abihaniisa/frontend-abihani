import React from 'react';
import { Package, ChevronRight, ShieldCheck } from 'lucide-react';
import { useOrderStore } from '../store/order.store';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from '../store/ui.store';
import { formatTimeAgo } from '../utils/formatDate';

export const OrdersScreen: React.FC = () => {
  const { orders, selectOrder } = useOrderStore();
  const { currentUser } = useAuthStore();
  const { navigate } = useUIStore();

  const handleOrderClick = (orderId: string): void => {
    selectOrder(orderId);
    navigate('thread');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Done':
        return 'text-[#4ADE80] bg-[#4ADE80]/10 border-[#4ADE80]/30';
      case 'Shipped':
        return 'text-[#E7C27A] bg-[#E7C27A]/10 border-[#E7C27A]/30';
      case 'Cancelled':
      case 'Disputed':
        return 'text-[#FF3B3B] bg-[#FF3B3B]/10 border-[#FF3B3B]/30';
      default:
        return 'text-[#F5F0E6] bg-neutral-800 border-neutral-700';
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] pb-28 pt-safe select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
        <div>
          <h2 className="text-lg font-extrabold text-[#F5F0E6]">Orders</h2>
          <span className="text-[11px] text-[#B8B2A6]">Manual peer-to-peer settlement</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-[#E7C27A]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Manual Mode</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3 max-w-lg mx-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-12 h-12 text-neutral-600 mb-3 stroke-[1.5]" />
            <h3 className="text-sm font-bold text-[#F5F0E6]">No orders yet</h3>
            <p className="text-xs text-[#B8B2A6] mt-1">
              Posts you purchase or orders from buyers will appear here.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const isBuyer = currentUser.id === order.buyerId;
            const counterparty = isBuyer ? order.seller : order.buyer;
            const hasUnread = isBuyer ? order.hasUnreadBuyer : order.hasUnreadSeller;

            return (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800/90 flex items-center justify-between cursor-pointer hover:border-neutral-700 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Counterparty Avatar with Unread Dot */}
                  <div className="relative shrink-0">
                    <img
                      src={counterparty.avatarUrl}
                      alt={counterparty.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-neutral-800"
                    />
                    {hasUnread && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#C41E3A] border-2 border-[#0B0B0F]" />
                    )}
                  </div>

                  {/* Order Info (avatar, name, product name, status word. NO price on row) */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F5F0E6] truncate">
                        {counterparty.displayName}
                      </span>
                      <span className="text-[10px] text-neutral-500 tabular-nums">
                        {formatTimeAgo(order.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-[#B8B2A6] truncate mt-0.5 font-medium">
                      {order.post.caption}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {order.orderNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
