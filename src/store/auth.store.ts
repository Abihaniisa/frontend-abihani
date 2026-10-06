import { create } from 'zustand';
import { UserProfile } from '../types/user.types';
import { AuthService } from '../services';

interface AuthState {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  recoveryCode: string | null;
  linkedAccounts: UserProfile[];
  loginWithPhone: (phone: string, code: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchAccount: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: AuthService.getCurrentUser(),
  isAuthenticated: false,
  recoveryCode: null,
  linkedAccounts: AuthService.getLinkedAccounts(),

  loginWithPhone: async (phone: string, code: string) => {
    const session = await AuthService.verifyPhoneOtp(phone, code);
    set({
      currentUser: session.user,
      isAuthenticated: true,
      recoveryCode: session.recoveryCode,
      linkedAccounts: AuthService.getLinkedAccounts(),
    });
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    const updated = AuthService.updateCurrentUser(updates);
    set({ currentUser: updated });
  },

  switchAccount: (userId: string) => {
    const switched = AuthService.switchAccount(userId);
    set({ currentUser: switched });
  },

  logout: () => {
    AuthService.logout();
    set({ isAuthenticated: false });
  },
}));