import { UserProfile } from './user.types';
import { Post } from './post.types';

export type OrderStatus =
  | 'Paid (Unconfirmed)'
  | 'Paid (Receipt Uploaded)'
  | 'Paid (Confirmed)'
  | 'Shipped'
  | 'Done'
  | 'Cancelled'
  | 'Disputed';

export type SettlementMethod = 'manual' | 'escrow';

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  text: string;
  attachmentUrl?: string;
  isReceipt?: boolean;
  createdAt: string;
  failed?: boolean;
}

export interface DisputeDetails {
  id: string;
  openedBy: string;
  reason: string;
  status:
    | 'Open'
    | 'In Review'
    | 'Resolved — Seller Banned'
    | 'Resolved — No Action (Buyer Wrong)'
    | 'Resolved — Warning Issued'
    | 'Closed';
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  postId: string;
  post: Post;
  buyerId: string;
  buyer: UserProfile;
  sellerId: string;
  seller: UserProfile;
  amount: number;
  status: OrderStatus;
  settlementMethod: SettlementMethod;
  buyerNote: string;
  contactPhone: string;
  receiptUrl?: string;
  messages: OrderMessage[];
  dispute?: DisputeDetails;
  createdAt: string;
  shippedAt?: string;
  estimatedDeliveryCountdownHours?: number;
  cancellationReason?: 'payment_not_received' | 'other';
  hasUnreadBuyer?: boolean;
  hasUnreadSeller?: boolean;
}
