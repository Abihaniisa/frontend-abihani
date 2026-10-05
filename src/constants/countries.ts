export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  isServable: boolean;
}

export const COUNTRIES: Country[] = [
  {
    code: 'NG',
    name: 'Nigeria',
    dialCode: '+234',
    flag: '🇳🇬',
    isServable: true,
  },
];
