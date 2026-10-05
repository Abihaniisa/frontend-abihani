import { create } from 'zustand';
import { Post } from '../types/post.types';
import { UserProfile } from '../types/user.types';

export type ScreenType =
  | 'home'
  | 'discover'
  | 'create'
  | 'orders'
  | 'you'
  | 'seller_profile'
  | 'thread'
  | 'settings'
  | 'admin'
  | 'auth';

export interface MilestoneData {
  title: string;
  badge: string;
  description: string;
}

interface ToastMessage {
  id: string;
  text: string;
  type?: 'normal' | 'error' | 'success';
}

interface UIState {
  currentScreen: ScreenType;
  screenHistory: ScreenType[];
  viewingSeller: UserProfile | null;
  activeCommentPost: Post | null;
  activeBuyPost: Post | null;
  activeNegotiationPost: Post | null;
  activeContactOrder: string | null;
  activeReceiptUploadOrderId: string | null;
  activeMilestone: MilestoneData | null;
  showTermsSheet: boolean;
  showPrivacySheet: boolean;
  showAboutSheet: boolean;
  toasts: ToastMessage[];
  searchQuery: string;
  navigate: (screen: ScreenType) => void;
  navigateBack: () => void;
  openSellerProfile: (seller: UserProfile) => void;
  openComments: (post: Post) => void;
  closeComments: () => void;
  openBuySheet: (post: Post) => void;
  closeBuySheet: () => void;
  openNegotiation: (post: Post) => void;
  closeNegotiation: () => void;
  openContactSheet: (orderId: string) => void;
  closeContactSheet: () => void;
  openReceiptUpload: (orderId: string) => void;
  closeReceiptUpload: () => void;
  showMilestone: (milestone: MilestoneData) => void;
  closeMilestone: () => void;
  setTermsSheet: (show: boolean) => void;
  setPrivacySheet: (show: boolean) => void;
  setAboutSheet: (show: boolean) => void;
  addToast: (text: string, type?: 'normal' | 'error' | 'success') => void;
  removeToast: (id: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  currentScreen: 'home',
  screenHistory: ['home'],
  viewingSeller: null,
  activeCommentPost: null,
  activeBuyPost: null,
  activeNegotiationPost: null,
  activeContactOrder: null,
  activeReceiptUploadOrderId: null,
  activeMilestone: null,
  showTermsSheet: false,
  showPrivacySheet: false,
  showAboutSheet: false,
  toasts: [],
  searchQuery: '',

  navigate: (screen: ScreenType) => {
    set((state) => {
      if (state.currentScreen === screen) return state;
      return {
        currentScreen: screen,
        screenHistory: [...state.screenHistory, screen],
      };
    });
  },

  navigateBack: () => {
    const {
      activeCommentPost,
      activeBuyPost,
      activeNegotiationPost,
      activeContactOrder,
      activeReceiptUploadOrderId,
      activeMilestone,
      showTermsSheet,
      showPrivacySheet,
      showAboutSheet,
      screenHistory,
    } = get();

    // Priority 1: Close topmost sheets
    if (activeCommentPost) return set({ activeCommentPost: null });
    if (activeBuyPost) return set({ activeBuyPost: null });
    if (activeNegotiationPost) return set({ activeNegotiationPost: null });
    if (activeContactOrder) return set({ activeContactOrder: null });
    if (activeReceiptUploadOrderId) return set({ activeReceiptUploadOrderId: null });
    if (activeMilestone) return set({ activeMilestone: null });
    if (showTermsSheet) return set({ showTermsSheet: false });
    if (showPrivacySheet) return set({ showPrivacySheet: false });
    if (showAboutSheet) return set({ showAboutSheet: false });

    // Priority 2: Pop history stack
    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      return set({ currentScreen: prevScreen, screenHistory: nextHistory });
    }

    // Default to home
    set({ currentScreen: 'home' });
  },

  openSellerProfile: (seller) => {
    set((state) => ({
      viewingSeller: seller,
      currentScreen: 'seller_profile',
      screenHistory: [...state.screenHistory, 'seller_profile'],
    }));
  },

  openComments: (post) => set({ activeCommentPost: post }),
  closeComments: () => set({ activeCommentPost: null }),

  openBuySheet: (post) => set({ activeBuyPost: post }),
  closeBuySheet: () => set({ activeBuyPost: null }),

  openNegotiation: (post) => set({ activeNegotiationPost: post }),
  closeNegotiation: () => set({ activeNegotiationPost: null }),

  openContactSheet: (orderId) => set({ activeContactOrder: orderId }),
  closeContactSheet: () => set({ activeContactOrder: null }),

  openReceiptUpload: (orderId) => set({ activeReceiptUploadOrderId: orderId }),
  closeReceiptUpload: () => set({ activeReceiptUploadOrderId: null }),

  showMilestone: (milestone) => set({ activeMilestone: milestone }),
  closeMilestone: () => set({ activeMilestone: null }),

  setTermsSheet: (show) => set({ showTermsSheet: show }),
  setPrivacySheet: (show) => set({ showPrivacySheet: show }),
  setAboutSheet: (show) => set({ showAboutSheet: show }),

  addToast: (text, type = 'normal') => {
    // Under 60 characters constraint as mandated by prompt Part 19
    const safeText = text.length > 60 ? `${text.slice(0, 57)}...` : text;
    const id = `tst_${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts.slice(-1), { id, text: safeText, type }], // Never stacked more than 2
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 2400);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
}));
