import { UserProfile } from './user.types';

export type MediaType = 'image' | 'video';

export interface PostMedia {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  aspectRatio: 'vertical' | 'square' | 'horizontal';
}

export interface PostOffer {
  buyerId: string;
  offerPrice: number;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'accepted' | 'declined' | 'expired';
}

export interface Post {
  id: string;
  sellerId: string;
  seller: UserProfile;
  media: PostMedia[];
  caption: string;
  hashtags: string[];
  price?: number;
  stock?: number;
  shipFrom?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount: number;
  watchTimeSeconds: number;
  isLiked?: boolean;
  isSaved?: boolean;
  hasOpenReport?: boolean;
  rankingScore?: number;
  createdAt: string;
  activeOffers?: Record<string, PostOffer>;
}

export interface OfficialNotice {
  id: string;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaLink?: string;
  createdAt: string;
  isDismissed?: boolean;
}
