/**
 * Samachify design tokens — the React Native mirror of the storefront's
 * `src/index.css` `:root` block. Keep the two in sync: if a brand colour moves
 * on the web, move it here too.
 */

export const colors = {
  // Brand greens
  green950: '#0b1606',
  green900: '#2a4f07',
  green800: '#3a6c09',
  green700: '#498a0c',
  green600: '#4d8b14',
  green500: '#9abb50',
  green200: '#c1ff72',
  green100: '#daffaa',
  green50: '#f6ffe9',

  // Accents
  lime: '#c1ff72',
  limeLight: '#daffaa',
  amber: '#f59e0b',

  // Neutrals
  ink: '#111827',
  ink80: '#1f2937',
  muted: '#667085',
  mutedLight: '#94a3b8',
  line: '#d9f0bd',
  cream: '#fdfff5',
  cream2: '#f8fcef',
  white: '#ffffff',

  // Feedback
  danger: '#dc2626',
  dangerBg: '#fef2f2',
  success: '#15803d',
  successBg: '#f0fdf4',
} as const;

/** 4px base scale — every gap, pad and margin in the app comes from here. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

/**
 * Type ramp. `display` uses the serif face for the editorial headings the
 * storefront leans on; everything else is Inter.
 */
export const type = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '800' },
  h1: { fontSize: 24, lineHeight: 30, fontWeight: '800' },
  h2: { fontSize: 19, lineHeight: 25, fontWeight: '700' },
  h3: { fontSize: 16, lineHeight: 22, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 11, lineHeight: 15, fontWeight: '600' },
} as const;

/**
 * Android renders `shadow*` props poorly, so every elevation ships both the
 * iOS shadow and an Android `elevation`.
 */
export const shadow = {
  sm: {
    shadowColor: '#111827',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  md: {
    shadowColor: '#111827',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  green: {
    shadowColor: '#07883f',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;

/** Minimum touch target — never ship an interactive element smaller than this. */
export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;
export const MIN_TOUCH = 44;

export const theme = { colors, spacing, radius, type, shadow } as const;
