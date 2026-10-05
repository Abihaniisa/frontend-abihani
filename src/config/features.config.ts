export const FeaturesConfig = {
  useMock: import.meta.env.VITE_USE_MOCK !== 'false',
  settlementMethod: 'manual' as 'manual' | 'escrow',
  allowBuyerDisputes: true,
  allowDirectNegotiation: true,
  enableMilestoneCelebrations: true,
  enableOfficialNotices: true,
} as const;
