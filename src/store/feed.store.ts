import { create } from 'zustand';
import { Post, OfficialNotice, PostOffer } from '../types/post.types';
import { PostService } from '../services';

interface FeedState {
  activeTab: 'forYou' | 'following';
  posts: Post[];
  currentPostIndex: number;
  officialNotice: OfficialNotice | null;
  activeNegotiations: Record<string, PostOffer>; // postId -> offer
  followedUserIds: Set<string>;
  setActiveTab: (tab: 'forYou' | 'following') => void;
  setCurrentPostIndex: (index: number) => void;
  refreshPosts: (userId?: string) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  toggleFollow: (sellerId: string) => void;
  dismissNotice: () => void;
  recordOffer: (postId: string, offer: PostOffer) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  activeTab: 'forYou',
  posts: PostService.getPosts('forYou'),
  currentPostIndex: 0,
  officialNotice: PostService.getOfficialNotice(),
  activeNegotiations: {},
  followedUserIds: new Set<string>(['usr_amina']),

  setActiveTab: (tab: 'forYou' | 'following') => {
    set({
      activeTab: tab,
      posts: PostService.getPosts(tab),
      currentPostIndex: 0,
    });
  },

  setCurrentPostIndex: (index: number) => {
    set({ currentPostIndex: index });
  },

  refreshPosts: (userId?: string) => {
    const { activeTab } = get();
    set({ posts: PostService.getPosts(activeTab, userId) });
  },

  toggleLike: (postId: string) => {
    PostService.toggleLike(postId);
    const { activeTab } = get();
    set({ posts: PostService.getPosts(activeTab) });
  },

  toggleSave: (postId: string) => {
    PostService.toggleSave(postId);
    const { activeTab } = get();
    set({ posts: PostService.getPosts(activeTab) });
  },

  toggleFollow: (sellerId: string) => {
    const { followedUserIds } = get();
    const updated = new Set(followedUserIds);
    if (updated.has(sellerId)) {
      updated.delete(sellerId);
    } else {
      updated.add(sellerId);
    }
    set({ followedUserIds: updated });
  },

  dismissNotice: () => {
    PostService.dismissOfficialNotice();
    set({ officialNotice: null });
  },

  recordOffer: (postId: string, offer: PostOffer) => {
    set((state) => ({
      activeNegotiations: {
        ...state.activeNegotiations,
        [postId]: offer,
      },
    }));
  },
}));
