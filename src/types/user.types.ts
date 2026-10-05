export interface PayoutMethod {
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  coverUrl?: string;
  bio: string;
  location: string;
  contactPhone?: string;
  isVerified: boolean;
  salesCount: number;
  rating?: number;
  disputesCount: number;
  followersCount: number;
  followingCount: number;
  payoutMethod?: PayoutMethod;
  canBuy: boolean;
  canSell: boolean;
  canPost: boolean;
  canComment: boolean;
  canMessage: boolean;
  isSuspended: boolean;
  isBanned: boolean;
  createdAt: string;
}
