import { create } from 'zustand';
import { PlatformMetrics, JournalEntry, SupportTicket } from '../types/admin.types';

interface AdminState {
  buySellActive: boolean;
  sellerDefaultOpen: boolean;
  disputesAccepting: boolean;
  newSignupsOpen: boolean;
  platformFeePercent: number; // 1% default
  metrics: PlatformMetrics;
  journal: JournalEntry[];
  tickets: SupportTicket[];
  toggleBuySell: () => void;
  toggleSellerDefault: () => void;
  toggleDisputes: () => void;
  toggleSignups: () => void;
  setPlatformFee: (fee: number) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  buySellActive: true,
  sellerDefaultOpen: true,
  disputesAccepting: true,
  newSignupsOpen: true,
  platformFeePercent: 1.0,

  metrics: {
    usersToday: 18,
    usersTotal: 1420,
    ordersToday: 6,
    ordersTotal: 184,
    gmvToday: 412000,
    gmvTotal: 12450000,
    openDisputes: 1,
    revenueGenerated: 124500, // 1%
    openTickets: 2,
    openReports: 0,
    doneOrdersCount: 162,
    cancelledOrdersCount: 21,
  },

  journal: [
    {
      id: 'jnl_01',
      actor: 'Founder (Bayero Isa)',
      action: 'BOOTSTRAP',
      target: 'SYSTEM',
      details: 'System initialized in manual settlement mode for Nigeria launch.',
      timestamp: '2026-03-01T08:00:00Z',
    },
    {
      id: 'jnl_02',
      actor: 'Founder (Bayero Isa)',
      action: 'FEE_UPDATE',
      target: 'PLATFORM_FEE',
      details: 'Platform fee set to 1.0% (deferred during manual mode).',
      timestamp: '2026-03-01T08:05:00Z',
    },
  ],

  tickets: [
    {
      id: 'tkt_01',
      userId: 'usr_chidera',
      userHandle: 'chideragems',
      subject: 'Payout bank account question',
      status: 'Open',
      messages: [
        {
          sender: 'user',
          text: 'Hello team, does Zenith corporate account receive direct transfers instantly?',
          timestamp: '2026-03-04T12:00:00Z',
        },
      ],
      createdAt: '2026-03-04T12:00:00Z',
    },
  ],

  toggleBuySell: () => {
    const next = !get().buySellActive;
    get().addJournalEntry({
      actor: 'Admin',
      action: 'TOGGLE_BUY_SELL',
      target: 'GLOBAL',
      details: `Buy and Sell status switched to ${next ? 'Active' : 'Paused'}`,
    });
    set({ buySellActive: next });
  },

  toggleSellerDefault: () => {
    const next = !get().sellerDefaultOpen;
    get().addJournalEntry({
      actor: 'Admin',
      action: 'TOGGLE_SELLER_DEFAULT',
      target: 'GLOBAL',
      details: `Seller Default status switched to ${next ? 'Open' : 'Restricted'}`,
    });
    set({ sellerDefaultOpen: next });
  },

  toggleDisputes: () => {
    const next = !get().disputesAccepting;
    get().addJournalEntry({
      actor: 'Admin',
      action: 'TOGGLE_DISPUTES',
      target: 'GLOBAL',
      details: `Disputes queue switched to ${next ? 'Accepting' : 'Frozen'}`,
    });
    set({ disputesAccepting: next });
  },

  toggleSignups: () => {
    const next = !get().newSignupsOpen;
    get().addJournalEntry({
      actor: 'Admin',
      action: 'TOGGLE_SIGNUPS',
      target: 'GLOBAL',
      details: `New signups switched to ${next ? 'Open' : 'Closed'}`,
    });
    set({ newSignupsOpen: next });
  },

  setPlatformFee: (fee: number) => {
    get().addJournalEntry({
      actor: 'Admin',
      action: 'FEE_CHANGE',
      target: 'GLOBAL',
      details: `Platform fee updated to ${fee}%`,
    });
    set({ platformFeePercent: fee });
  },

  addJournalEntry: (entry) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `jnl_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ journal: [newEntry, ...state.journal] }));
  },
}));
