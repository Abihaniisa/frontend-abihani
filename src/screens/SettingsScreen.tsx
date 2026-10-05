import React, { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Key,
  Users,
  Bell,
  HelpCircle,
  LogOut,
  Trash2,
  Check,
  ShieldAlert,
  ChevronRight,
  Sparkles,
} from '../components/icons';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from '../store/ui.store';
import { NigerianBanks } from '../constants/banks';
import { NigerianLocations } from '../constants/locations';
import { ApiService } from '../services';

export const SettingsScreen: React.FC = () => {
  const { currentUser, updateProfile, linkedAccounts, switchAccount, logout, recoveryCode } = useAuthStore();
  const { navigate, navigateBack, addToast, setAboutSheet } = useUIStore();

  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Bank payout states
  const [selectedBankId, setSelectedBankId] = useState(currentUser.payoutMethod?.bankId || NigerianBanks[0].id);
  const [accountNumber, setAccountNumber] = useState(currentUser.payoutMethod?.accountNumber || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(
    currentUser.payoutMethod?.accountName || null
  );

  // Notification toggles
  const [notifications, setNotifications] = useState({
    orders: true,
    messages: true,
    offers: true,
    follows: true,
    comments: true,
  });

  const handleBankVerify = async (): Promise<void> => {
    if (accountNumber.length !== 10) {
      addToast('Account number must be 10 digits', 'error');
      return;
    }
    setIsVerifying(true);
    try {
      const res = await ApiService.verifyBankAccount(selectedBankId, accountNumber);
      setVerifiedAccountName(res.accountName);
      addToast('Account verified successfully', 'success');
    } catch {
      addToast('Verification failed. Check account number', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSavePayout = (): void => {
    if (!verifiedAccountName) return;
    const bank = NigerianBanks.find((b) => b.id === selectedBankId);
    updateProfile({
      payoutMethod: {
        bankId: selectedBankId,
        bankName: bank?.name || 'Nigerian Bank',
        accountNumber,
        accountName: verifiedAccountName,
        isVerified: true,
        verifiedAt: new Date().toISOString(),
      },
    });
    addToast('Payout bank saved', 'success');
    setActiveModal(null);
  };

  const handleAccountNumberChange = (val: string): void => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(cleaned);
    // Editing account number clears verified block
    if (verifiedAccountName && cleaned !== currentUser.payoutMethod?.accountNumber) {
      setVerifiedAccountName(null);
    }
  };

  const toggleNotif = (key: keyof typeof notifications): void => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = (): void => {
    addToast('Cannot delete account with open orders.', 'error');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] pb-28 pt-safe select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={navigateBack}
            className="p-1.5 rounded-full text-[#B8B2A6] hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-[#F5F0E6]">Settings</h2>
        </div>

        {/* Secret / direct Admin access for testing */}
        <button
          onClick={() => navigate('admin')}
          className="text-xs font-bold text-[#E7C27A] px-2.5 py-1 rounded-lg bg-neutral-900 border border-[#E7C27A]/30 flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* 1. Account Section */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8B2A6] block mb-2 px-1">
            Account
          </span>
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 divide-y divide-neutral-800/80">
            {/* Payout Method */}
            <div
              onClick={() => setActiveModal('payout')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#E7C27A]" />
                <div>
                  <span className="text-xs font-bold text-[#F5F0E6] block">
                    Payout method
                  </span>
                  <span className="text-[11px] text-[#B8B2A6]">
                    {currentUser.payoutMethod?.isVerified
                      ? `${currentUser.payoutMethod.bankName} (••${currentUser.payoutMethod.accountNumber.slice(-4)})`
                      : 'Set up Nigerian bank account'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Location */}
            <div
              onClick={() => setActiveModal('location')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50"
            >
              <div>
                <span className="text-xs font-bold text-[#F5F0E6] block">Location</span>
                <span className="text-[11px] text-[#B8B2A6]">{currentUser.location}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Recovery Code */}
            <div
              onClick={() => setActiveModal('recovery')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50"
            >
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-[#E7C27A]" />
                <div>
                  <span className="text-xs font-bold text-[#F5F0E6] block">
                    Recovery code
                  </span>
                  <span className="text-[11px] text-[#B8B2A6]">View 8-digit emergency key</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Switch / Add Account */}
            <div
              onClick={() => setActiveModal('accounts')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#B8B2A6]" />
                <div>
                  <span className="text-xs font-bold text-[#F5F0E6] block">
                    Switch or add account
                  </span>
                  <span className="text-[11px] text-[#B8B2A6]">
                    {linkedAccounts.length} account{linkedAccounts.length > 1 ? 's' : ''} on this device
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>
          </div>
        </div>

        {/* 2. Notifications Section (5 toggles, all on by default) */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8B2A6] block mb-2 px-1">
            Notifications
          </span>
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 divide-y divide-neutral-800/80">
            {(['orders', 'messages', 'offers', 'follows', 'comments'] as const).map((key) => (
              <div key={key} className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-medium text-[#F5F0E6] capitalize">{key}</span>
                <button
                  onClick={() => toggleNotif(key)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notifications[key] ? 'bg-[#C41E3A]' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      notifications[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Support Section */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8B2A6] block mb-2 px-1">
            Support & Legal
          </span>
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 divide-y divide-neutral-800/80">
            <div
              onClick={() => setAboutSheet(true)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#B8B2A6]" />
                <span className="text-xs font-bold text-[#F5F0E6]">About Abihani</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>
          </div>
        </div>

        {/* 4. Danger Zone */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF3B3B] block mb-2 px-1">
            Danger Zone
          </span>
          <div className="rounded-2xl bg-neutral-900 border border-[#FF3B3B]/20 divide-y divide-neutral-800/80">
            <div
              onClick={logout}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 text-[#FF3B3B]"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <div>
                  <span className="text-xs font-bold block">Log out</span>
                  <span className="text-[10px] text-neutral-500">Clears linked accounts on device</span>
                </div>
              </div>
            </div>

            <div
              onClick={handleDeleteAccount}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 text-[#FF3B3B]"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5" />
                <div>
                  <span className="text-xs font-bold block">Delete account</span>
                  <span className="text-[10px] text-neutral-500">Requires all open orders to be completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Bank Modal */}
      {activeModal === 'payout' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="w-full max-w-sm bg-[#0B0B0F] border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-[#F5F0E6]">Payout Bank Account</h3>

            <div>
              <label className="block text-xs font-semibold text-[#B8B2A6] mb-1">
                Choose Bank
              </label>
              <select
                value={selectedBankId}
                onChange={(e) => {
                  setSelectedBankId(e.target.value);
                  setVerifiedAccountName(null);
                }}
                className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] focus:outline-none"
              >
                {NigerianBanks.map((b) => (
                  <option key={b.id} value={b.id} className="bg-neutral-900">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B8B2A6] mb-1">
                10-Digit NUBAN Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                placeholder="0123456789"
                maxLength={10}
                className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono font-bold text-[#E7C27A] tracking-wider tabular-nums focus:outline-none"
              />
            </div>

            {/* Gold Verification Block */}
            {verifiedAccountName && (
              <div className="p-3.5 rounded-xl bg-[#E7C27A]/15 border border-[#E7C27A]/40 text-center">
                <span className="text-[10px] text-neutral-400 block mb-0.5">Verified Account Name</span>
                <span className="text-xs font-bold text-[#E7C27A] block tracking-wide">
                  {verifiedAccountName}
                </span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              {!verifiedAccountName ? (
                <button
                  onClick={handleBankVerify}
                  disabled={accountNumber.length !== 10 || isVerifying}
                  className="w-full h-11 rounded-xl bg-neutral-800 text-[#F5F0E6] font-bold text-xs hover:bg-neutral-700 disabled:opacity-40"
                >
                  {isVerifying ? 'Verifying with NUBAN...' : 'Verify account'}
                </button>
              ) : (
                <button
                  onClick={handleSavePayout}
                  className="w-full h-11 rounded-xl bg-[#C41E3A] text-white font-bold text-xs shadow hover:bg-[#b01a33]"
                >
                  Confirm and save
                </button>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="w-full h-10 rounded-xl text-xs text-[#B8B2A6]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recovery Code Modal */}
      {activeModal === 'recovery' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="w-full max-w-sm bg-[#0B0B0F] border border-neutral-800 rounded-3xl p-6 text-center shadow-2xl">
            <h3 className="text-base font-bold text-[#F5F0E6] mb-1">Your Recovery Code</h3>
            <p className="text-xs text-[#B8B2A6] mb-4">
              Keep this 8-digit key safe. It is your ultimate safeguard to recover this account.
            </p>
            <div className="py-3 px-6 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xl font-extrabold text-[#E7C27A] tracking-widest tabular-nums mb-5">
              {recoveryCode || '84920183'}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-xl bg-[#C41E3A] text-white font-bold text-xs"
            >
              I have stored it safely
            </button>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {activeModal === 'location' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="w-full max-w-sm bg-[#0B0B0F] border border-neutral-800 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-[#F5F0E6] mb-3">Default Shipping Location</h3>
            <div className="max-h-60 overflow-y-auto space-y-1.5 no-scrollbar mb-4">
              {NigerianLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    updateProfile({ location: loc });
                    addToast(`Location set to ${loc}`);
                    setActiveModal(null);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between ${
                    currentUser.location === loc
                      ? 'bg-[#C41E3A] text-white'
                      : 'bg-neutral-900 text-[#F5F0E6] hover:bg-neutral-800'
                  }`}
                >
                  <span>{loc}</span>
                  {currentUser.location === loc && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full h-10 rounded-xl text-xs text-[#B8B2A6]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Switch Account Modal */}
      {activeModal === 'accounts' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="w-full max-w-sm bg-[#0B0B0F] border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-[#F5F0E6]">Device Accounts</h3>
            <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
              {linkedAccounts.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => {
                    switchAccount(acc.id);
                    addToast(`Switched to @${acc.handle}`);
                    setActiveModal(null);
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer ${
                    currentUser.id === acc.id
                      ? 'bg-[#C41E3A]/20 border border-[#C41E3A]'
                      : 'bg-neutral-900 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={acc.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold block text-[#F5F0E6]">
                        {acc.displayName}
                      </span>
                      <span className="text-[10px] text-neutral-400">@{acc.handle}</span>
                    </div>
                  </div>
                  {currentUser.id === acc.id && (
                    <span className="text-[10px] font-bold text-[#C41E3A]">Active</span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full h-10 rounded-xl text-xs text-[#B8B2A6]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
