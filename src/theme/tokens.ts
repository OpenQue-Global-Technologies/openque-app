/**
 * Design tokens — Scale 1 Handbook, Section 5. LOCKED. Do not deviate.
 * Product 1 (Patient App) specifics: pill radius on buttons/inputs/chips,
 * 44x44 minimum touch targets.
 */

export const colors = {
  primary: '#074FF8',
  secondary: '#4171F0',
  accent: '#DFFFFF',
  background: '#F7F8EF',

  neutralDark: '#1F2937',
  neutralMuted: '#6B7280',
  white: '#FFFFFF',

  success: { bg: '#DCFCE7', text: '#166534' },
  waiting: { bg: '#EDE4FE', text: '#6D28D9' },
  delayed: { bg: '#FEF3C7', text: '#92400E' },
  cancelled: { bg: '#F3F4F6', text: '#4B5563' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
} as const;

export const fonts = {
  heading: 'PlayfairDisplay_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export const fontSizes = {
  display: 36,
  h1: 28,
  h2: 22,
  h3: 18,
  bodyLarge: 16,
  bodyDefault: 14,
  caption: 12,
  micro: 10,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  giant: 64,
} as const;

export const radius = {
  small: 6,
  medium: 8,
  large: 12,
  pill: 999,
} as const;

export const touchTarget = {
  minimum: 44,
} as const;
