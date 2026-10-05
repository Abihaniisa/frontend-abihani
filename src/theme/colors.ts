export const ThemeColors = {
  background: '#0B0B0F',
  bone: '#F5F0E6',
  secondaryText: '#B8B2A6',
  crimson: '#C41E3A',
  gold: '#E7C27A',
  success: '#4ADE80',
  danger: '#FF3B3B',
} as const;

export type ThemeColorKey = keyof typeof ThemeColors;
