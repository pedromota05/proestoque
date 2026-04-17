export const theme = {
  colors: {
    primary: '#6324a4',
    secondary: '#54277f',
    accent: '#2dbf6c',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E2E0E7',
    error: '#EF4444',
    successBackground: '#D1FAE5',
    successText: '#065F46',
  },
} as const;

export type ThemeColors = typeof theme.colors;
