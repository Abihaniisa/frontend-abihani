export interface Bank {
  id: string;
  name: string;
  code: string;
}

export const NigerianBanks: Bank[] = [
  { id: 'gtb', name: 'Guaranty Trust Bank (GTBank)', code: '058' },
  { id: 'access', name: 'Access Bank', code: '044' },
  { id: 'zenith', name: 'Zenith Bank', code: '057' },
  { id: 'kuda', name: 'Kuda Microfinance Bank', code: '50211' },
  { id: 'opay', name: 'OPay', code: '999992' },
  { id: 'palmpay', name: 'PalmPay', code: '999991' },
  { id: 'uba', name: 'United Bank for Africa (UBA)', code: '033' },
  { id: 'firstbank', name: 'First Bank of Nigeria', code: '011' },
  { id: 'stanbic', name: 'Stanbic IBTC Bank', code: '221' },
  { id: 'fidelity', name: 'Fidelity Bank', code: '070' },
  { id: 'moniepoint', name: 'Moniepoint Microfinance Bank', code: '50515' },
];
