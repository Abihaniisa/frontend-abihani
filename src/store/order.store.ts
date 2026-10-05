import { create } from 'zustand';
import { Order } from '../types/order.types';
import { OrderService } from '../services';
import { UserProfile } from '../types/user.types';
import { Post } from '../types/post.types';

interface OrderState {
  orders: Order[];
  selectedOrderId: string | null;
  refreshOrders: (userId?: string) => void;
  selectOrder: (orderId: string | null) => void;
  createOrder: (params: {
    post: Post;
    buyer: UserProfile;
    amount: number;
    buyerNote: string;
    contactPhone: string;
    receiptUrl?: string;
  }) => Order;
  uploadReceipt: (orderId: string, receiptUrl: string, uploader: UserProfile) => void;
  confirmPayment: (orderId: string) => void;
  shipOrder: (orderId: string) => void;
  confirmDone: (orderId: string) => void;
  cancelOrder: (orderId: string, actor: UserProfile, reason: 'payment_not_received' | 'other') => void;
  openDispute: (orderId: string, actor: UserProfile, reason: string) => void;
  sendMessage: (orderId: string, sender: UserProfile, text: string, attachmentUrl?: string) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: OrderService.getOrders(),
  selectedOrderId: null,

  refreshOrders: (userId?: string) => {
    set({ orders: [...OrderService.getOrders(userId)] });
  },

  selectOrder: (orderId: string | null) => {
    set({ selectedOrderId: orderId });
  },

  createOrder: (params) => {
    const newOrder = OrderService.createOrder(params);
    set({ orders: [...OrderService.getOrders()], selectedOrderId: newOrder.id });
    return newOrder;
  },

  uploadReceipt: (orderId, receiptUrl, uploader) => {
    OrderService.uploadReceipt(orderId, receiptUrl, uploader);
    get().refreshOrders();
  },

  confirmPayment: (orderId) => {
    OrderService.sellerConfirmPayment(orderId);
    get().refreshOrders();
  },

  shipOrder: (orderId) => {
    OrderService.sellerShipOrder(orderId);
    get().refreshOrders();
  },

  confirmDone: (orderId) => {
    OrderService.buyerConfirmDone(orderId);
    get().refreshOrders();
  },

  cancelOrder: (orderId, actor, reason) => {
    OrderService.cancelOrder(orderId, actor, reason);
    get().refreshOrders();
  },

  openDispute: (orderId, actor, reason) => {
    OrderService.openDispute(orderId, actor, reason);
    get().refreshOrders();
  },

  sendMessage: (orderId, sender, text, attachmentUrl) => {
    OrderService.sendMessage(orderId, sender, text, attachmentUrl);
    get().refreshOrders();
  },
}));
