import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, shadow, spacing, type } from '@/theme';

/** A white card on the cream background. The app's default container. */
export function Card({
  children,
  style,
  padded = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  return (
    <View style={[styles.card, padded && styles.cardPadded, style]}>{children}</View>
  );
}

export type BadgeTone = 'lime' | 'neutral' | 'success' | 'danger' | 'custom';

/** Small status/metadata pill. Not interactive — use Chip for that. */
export function Badge({
  label,
  tone = 'lime',
  color,
  background,
}: {
  label: string;
  tone?: BadgeTone;
  /** Only used with tone="custom" — e.g. the per-status colours from STATUS_META. */
  color?: string;
  background?: string;
}) {
  const resolved =
    tone === 'custom'
      ? { backgroundColor: background ?? colors.green50, textColor: color ?? colors.green800 }
      : BADGE_TONES[tone];

  return (
    <View style={[styles.badge, { backgroundColor: resolved.backgroundColor }]}>
      <Text style={[styles.badgeText, { color: resolved.textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const BADGE_TONES: Record<Exclude<BadgeTone, 'custom'>, { backgroundColor: string; textColor: string }> = {
  lime: { backgroundColor: colors.green50, textColor: colors.green800 },
  neutral: { backgroundColor: '#f3f4f6', textColor: colors.muted },
  success: { backgroundColor: colors.successBg, textColor: colors.success },
  danger: { backgroundColor: colors.dangerBg, textColor: colors.danger },
};

/** Selectable filter pill — categories, product filters. */
export function Chip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : styles.chipIdle,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextIdle]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Section title with an optional right-hand action. */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          hitSlop={8}
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.sm,
  },
  cardPadded: { padding: spacing.lg },

  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },

  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  chipIdle: { backgroundColor: colors.white, borderColor: colors.line },
  chipActive: { backgroundColor: colors.green700, borderColor: colors.green700 },
  chipText: { fontSize: 13, fontWeight: '700' },
  chipTextIdle: { color: colors.ink80 },
  chipTextActive: { color: colors.white },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...type.h2, color: colors.ink },
  sectionAction: { fontSize: 13, fontWeight: '700', color: colors.green700 },

  divider: { height: 1, backgroundColor: colors.line },
});
