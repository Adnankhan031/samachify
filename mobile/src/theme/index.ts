import { Platform, type TextStyle } from 'react-native';

/**
 * Samachify design tokens.
 *
 * The storefront's identity is Playfair Display over Inter on cream, with the
 * brand greens and a lime accent. The app inherits that rather than falling back
 * to system faces — nothing here should be reachable without importing it.
 *
 * Direction: the app is commerce-first, so it borrows the structural patterns of
 * modern q-commerce (sticky search, rails, quick-add, sticky bars) but keeps
 * Samachify's own voice through two devices:
 *
 *   1. Dark "kitchen" bands (`bark`) that break up the cream so the app never
 *      reads as an undifferentiated stack of white cards.
 *   2. Cook time set in the display serif as the hero data point on every pack,
 *      because "ready in 10–15 minutes" is the company's actual promise. Price
 *      is secondary — we compete on time, not discounts (we have no discounts).
 */

export const colors = {
  // ─── Brand greens ────────────────────────────────────────────────────────
  bark: '#0b1606', // deepest — dark bands, onboarding, hero
  forest: '#2a4f07',
  moss: '#3a6c09',
  leaf: '#498a0c', // primary action
  fern: '#4d8b14',
  sage: '#9abb50',
  sprout: '#c1ff72', // lime accent — on dark only
  mint: '#daffaa',
  wash: '#f6ffe9', // palest green tint

  // ─── Surfaces ────────────────────────────────────────────────────────────
  cream: '#fdfff5', // page background
  cream2: '#f8fcef', // pressed / inset
  paper: '#ffffff', // cards
  line: '#e6f0d4', // hairline on cream
  lineStrong: '#d9f0bd',

  // ─── Ink ─────────────────────────────────────────────────────────────────
  ink: '#111827',
  ink80: '#1f2937',
  muted: '#667085',
  faint: '#94a3b8',
  onDark: '#ffffff',
  onDarkMuted: 'rgba(255,255,255,0.72)',

  // ─── Signals ─────────────────────────────────────────────────────────────
  turmeric: '#f59e0b', // time, warmth, "hot" cues
  chilli: '#dc2626',
  chilliBg: '#fef2f2',
  success: '#15803d',
  successBg: '#f0fdf4',

  // ─── Spice scale (used by the heat dots) ─────────────────────────────────
  mild: '#65a30d',
  medium: '#ea580c',
  hot: '#dc2626',
} as const;

/** 4px base. Every gap, pad and margin comes from here. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,
  hero: 56,
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  hero: 34,
  pill: 999,
} as const;

// ─── Typefaces ─────────────────────────────────────────────────────────────
// Custom fonts on RN are one family per weight; `fontWeight` does nothing once
// `fontFamily` is set. Always take a style from `type` rather than composing
// size + weight by hand.
export const fonts = {
  displayBold: 'PlayfairDisplay_700Bold',
  displayExtra: 'PlayfairDisplay_800ExtraBold',
  displayBlack: 'PlayfairDisplay_900Black',
  bodyRegular: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  bodyExtra: 'Inter_800ExtraBold',
} as const;

/**
 * Type ramp. `hero`/`display`/`serif*` are the Playfair voice, reserved for
 * headlines, prices and cook times. Everything structural is Inter.
 */
export const type = {
  // Playfair — used with restraint
  hero: { fontFamily: fonts.displayBlack, fontSize: 38, lineHeight: 44, letterSpacing: -0.8 },
  display: { fontFamily: fonts.displayExtra, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  serifLg: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  serifMd: { fontFamily: fonts.displayBold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  /** The signature: cook-time numerals. */
  numeral: { fontFamily: fonts.displayBlack, fontSize: 26, lineHeight: 30, letterSpacing: -0.6 },

  // Inter
  h1: { fontFamily: fonts.bodyExtra, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 21, letterSpacing: -0.1 },
  body: { fontFamily: fonts.bodyRegular, fontSize: 15, lineHeight: 23 },
  bodyMed: { fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.bodySemi, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: fonts.bodyRegular, fontSize: 13, lineHeight: 19 },
  smallStrong: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 19 },
  tiny: { fontFamily: fonts.bodyMedium, fontSize: 11.5, lineHeight: 16 },
  /** Uppercase micro-label used for section eyebrows, mirrored from the site. */
  eyebrow: {
    fontFamily: fonts.bodyExtra,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;

/**
 * Elevation. Android ignores shadowOffset/Radius, so every level carries an
 * `elevation` too. Levels are named by intent, not by number.
 */
export const shadow = {
  /** Resting cards on cream. */
  card: Platform.select({
    android: { elevation: 2 },
    default: {
      shadowColor: '#0b1606',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
  })!,
  /** Lifted: sheets, sticky bars, floating actions. */
  lifted: Platform.select({
    android: { elevation: 10 },
    default: {
      shadowColor: '#0b1606',
      shadowOpacity: 0.14,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
    },
  })!,
  /** Primary CTA — tinted green so it glows rather than greys. */
  action: Platform.select({
    android: { elevation: 6 },
    default: {
      shadowColor: '#2a4f07',
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
  })!,
} as const;

/** Never ship an interactive element smaller than this. */
export const MIN_TOUCH = 44;
export const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 } as const;

/** Spice level → the dot colour and how many dots are filled. */
export const SPICE: Record<string, { color: string; dots: number }> = {
  Mild: { color: colors.mild, dots: 1 },
  Medium: { color: colors.medium, dots: 2 },
  Hot: { color: colors.hot, dots: 3 },
};

export const theme = { colors, spacing, radius, type, fonts, shadow } as const;
