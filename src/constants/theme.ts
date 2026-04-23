export const theme = {
  colors: {
    primary: '#6324a4',
    primaryLight: '#F3EEFB',
    secondary: '#54277f',
    accent: '#2dbf6c',
    accentLight: '#E8F9F0',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E2E0E7',
    error: '#EF4444',
    errorBackground: '#FEE2E2',
    successBackground: '#D1FAE5',
    successText: '#065F46',
    warning: '#F59E0B',
    warningBackground: '#FEF3C7',
    warningText: '#92400E',
  },
} as const;

export type ThemeColors = typeof theme.colors;
