import { Order, OrderStatus, OrderMessage } from '../types/order.types';
import { UserProfile } from '../types/user.types';
import { Post } from '../types/post.types';
import { INITIAL_ORDERS } from '../constants/seedData';

class OrderMockService {
  private orders: Order[] = [...INITIAL_ORDERS];

  public getOrders(userId?: string): Order[] {
    if (!userId) return this.orders;
    return this.orders.filter((o) => o.buyerId === userId || o.sellerId === userId);
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  public createOrder(params: {
    post: Post;
    buyer: UserProfile;
    amount: number;
    buyerNote: string;
    contactPhone: string;
    receiptUrl?: string;
  }): Order {
    const orderNumber = `AH-${Math.floor(10000 + Math.random() * 90000)}`;
    const status: OrderStatus = params.receiptUrl ? 'Paid (Receipt Uploaded)' : 'Paid (Unconfirmed)';

    const initialMessages: OrderMessage[] = [
      {
        id: `msg_${Date.now()}_1`,
        orderId: `ord_${Date.now()}`,
        senderId: params.buyer.id,
        senderName: params.buyer.displayName,
        text: `Order created. Amount: ₦${params.amount.toLocaleString('en-NG')}. Note: "${params.buyerNote || 'No special note'}"`,
        createdAt: new Date().toISOString(),
      },
    ];

    if (params.receiptUrl) {
      initialMessages.push({
        id: `msg_${Date.now()}_2`,
        orderId: `ord_${Date.now()}`,
        senderId: params.buyer.id,
        senderName: params.buyer.displayName,
        text: 'Uploaded proof of payment transfer.',
        attachmentUrl: params.receiptUrl,
        isReceipt: true,
        createdAt: new Date().toISOString(),
      });
    }

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      postId: params.post.id,
      post: params.post,
      buyerId: params.buyer.id,
      buyer: params.buyer,
      sellerId: params.post.sellerId,
      seller: params.post.seller,
      amount: params.amount,
      status,
      settlementMethod: 'manual',
      buyerNote: params.buyerNote,
      contactPhone: params.contactPhone,
      receiptUrl: params.receiptUrl,
      messages: initialMessages,
      createdAt: new Date().toISOString(),
      hasUnreadSeller: true,
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  public uploadReceipt(orderId: string, receiptUrl: string, uploader: UserProfile): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.receiptUrl = receiptUrl;
    if (order.status === 'Paid (Unconfirmed)') {
      order.status = 'Paid (Receipt Uploaded)';
    }

    const message: OrderMessage = {
      id: `msg_${Date.now()}`,
      orderId,
      senderId: uploader.id,
      senderName: uploader.displayName,
      text: 'Uploaded bank payment receipt.',
      attachmentUrl: receiptUrl,
      isReceipt: true,
      createdAt: new Date().toISOString(),
    };

    order.messages.push(message);
    order.hasUnreadSeller = true;
    return { ...order };
  }

  public sellerConfirmPayment(orderId: string): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'Paid (Confirmed)';
    order.messages.push({
      id: `msg_${Date.now()}`,
      orderId,
      senderId: order.sellerId,
      senderName: order.seller.displayName,
      text: 'Payment verified in seller bank account. Packaging order now.',
      createdAt: new Date().toISOString(),
    });
    order.hasUnreadBuyer = true;
    return { ...order };
  }

  public sellerShipOrder(orderId: string): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'Shipped';
    order.shippedAt = new Date().toISOString();
    order.estimatedDeliveryCountdownHours = 72; // 3 days launch countdown

    order.messages.push({
      id: `msg_${Date.now()}`,
      orderId,
      senderId: order.sellerId,
      senderName: order.seller.displayName,
      text: 'Package handed over to courier for delivery. 72-hour countdown begun.',
      createdAt: new Date().toISOString(),
    });
    order.hasUnreadBuyer = true;
    return { ...order };
  }

  public buyerConfirmDone(orderId: string): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'Done';
    order.messages.push({
      id: `msg_${Date.now()}`,
      orderId,
      senderId: order.buyerId,
      senderName: order.buyer.displayName,
      text: 'Delivery received and inspected. Order completed successfully.',
      createdAt: new Date().toISOString(),
    });
    order.hasUnreadSeller = true;
    return { ...order };
  }

  public cancelOrder(orderId: string, actor: UserProfile, reason: 'payment_not_received' | 'other'): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'Cancelled';
    order.cancellationReason = reason;

    const reasonText = reason === 'payment_not_received' ? 'Payment was not received in bank' : 'Cancelled by seller';
    order.messages.push({
      id: `msg_${Date.now()}`,
      orderId,
      senderId: actor.id,
      senderName: actor.displayName,
      text: `Order cancelled (${reasonText}). Buyer has 7 days to open a dispute if payment was transferred.`,
      createdAt: new Date().toISOString(),
    });
    return { ...order };
  }

  public openDispute(orderId: string, actor: UserProfile, reason: string): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'Disputed';
    order.dispute = {
      id: `disp_${Date.now()}`,
      openedBy: actor.id,
      reason,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };

    order.messages.push({
      id: `msg_${Date.now()}`,
      orderId,
      senderId: actor.id,
      senderName: actor.displayName,
      text: `Dispute opened: "${reason}". Abihani moderation team notified.`,
      createdAt: new Date().toISOString(),
    });
    return { ...order };
  }

  public sendMessage(orderId: string, sender: UserProfile, text: string, attachmentUrl?: string): OrderMessage {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const msg: OrderMessage = {
      id: `msg_${Date.now()}`,
      orderId,
      senderId: sender.id,
      senderName: sender.displayName,
      text,
      attachmentUrl,
      createdAt: new Date().toISOString(),
    };

    order.messages.push(msg);
    if (sender.id === order.buyerId) {
      order.hasUnreadSeller = true;
    } else {
      order.hasUnreadBuyer = true;
    }
    return msg;
  }
}

export const orderMock = new OrderMockService();
