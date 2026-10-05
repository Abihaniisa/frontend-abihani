import { useAuthStore } from '../store/auth.store';

export function useAuth() {
  const { currentUser, isAuthenticated, recoveryCode, linkedAccounts, loginWithOtp, updateProfile, switchAccount, logout } = useAuthStore();

  return {
    currentUser,
    isAuthenticated,
    recoveryCode,
    linkedAccounts,
    loginWithOtp,
    updateProfile,
    switchAccount,
    logout,
  };
}
