import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, radius, shadow, spacing, type, MIN_TOUCH, SPICE } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/** A card on cream. `tone="dark"` gives the bark band used to break up the page. */
export function Card({
  children,
  style,
  padded = true,
  tone = 'paper',
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  tone?: 'paper' | 'wash' | 'dark';
}) {
  return (
    <View style={[styles.card, TONE[tone], padded && styles.cardPadded, style]}>{children}</View>
  );
}

const TONE: Record<'paper' | 'wash' | 'dark', ViewStyle> = {
  paper: { backgroundColor: colors.paper, borderColor: colors.line },
  wash: { backgroundColor: colors.wash, borderColor: colors.lineStrong },
  dark: { backgroundColor: colors.bark, borderColor: colors.bark },
};

export type BadgeTone = 'lime' | 'neutral' | 'success' | 'danger' | 'warm' | 'custom';

/** Small non-interactive status pill. */
export function Badge({
  label,
  tone = 'lime',
  icon,
  color,
  background,
}: {
  label: string;
  tone?: BadgeTone;
  icon?: IoniconName;
  /** tone="custom" only — e.g. the per-status colours from STATUS_META. */
  color?: string;
  background?: string;
}) {
  const resolved =
    tone === 'custom'
      ? { bg: background ?? colors.wash, fg: color ?? colors.moss }
      : BADGE[tone];

  return (
    <View style={[styles.badge, { backgroundColor: resolved.bg }]}>
      {icon ? <Ionicons name={icon} size={11} color={resolved.fg} /> : null}
      <Text style={[styles.badgeText, { color: resolved.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const BADGE: Record<Exclude<BadgeTone, 'custom'>, { bg: string; fg: string }> = {
  lime: { bg: colors.wash, fg: colors.moss },
  neutral: { bg: '#f1f5f9', fg: colors.muted },
  success: { bg: colors.successBg, fg: colors.success },
  danger: { bg: colors.chilliBg, fg: colors.chilli },
  warm: { bg: '#fff7ed', fg: '#c2410c' },
};

/**
 * Selectable filter pill.
 *
 * `minHeight` plus an explicit `lineHeight` are load-bearing: Playfair/Inter as
 * custom fonts report tighter metrics than the system face, and without both,
 * Android clips descenders inside the pill.
 */
export function Chip({
  label,
  active = false,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  icon?: IoniconName;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipOn : styles.chipOff,
        pressed && { opacity: 0.7 },
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={14} color={active ? colors.onDark : colors.moss} />
      ) : null}
      <Text style={[styles.chipText, active ? styles.chipTextOn : styles.chipTextOff]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Section title with an optional eyebrow and right-hand action. */
export function SectionHeader({
  title,
  eyebrow,
  actionLabel,
  onAction,
  style,
}: {
  title: string;
  eyebrow?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionText}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          hitSlop={10}
          style={({ pressed }) => [styles.sectionAction, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={13} color={colors.leaf} />
        </Pressable>
      ) : null}
    </View>
  );
}

/**
 * Heat level as three dots. Reads at a glance and doesn't need a legend, which
 * a chilli-emoji count does.
 */
export function SpiceDots({ level, showLabel = true }: { level: string; showLabel?: boolean }) {
  const spec = SPICE[level];
  if (!spec) return null;

  return (
    <View style={styles.spice} accessibilityLabel={`Spice level ${level}`}>
      <View style={styles.spiceDots}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.spiceDot,
              { backgroundColor: i < spec.dots ? spec.color : colors.line },
            ]}
          />
        ))}
      </View>
      {showLabel ? <Text style={[styles.spiceLabel, { color: spec.color }]}>{level}</Text> : null}
    </View>
  );
}

/** Circular icon chip used in list rows and stat tiles. */
export function IconTile({
  name,
  tone = 'leaf',
  size = 38,
}: {
  name: IoniconName;
  tone?: 'leaf' | 'warm' | 'neutral' | 'danger';
  size?: number;
}) {
  const fg = { leaf: colors.leaf, warm: colors.turmeric, neutral: colors.muted, danger: colors.chilli }[tone];
  const bg = { leaf: colors.wash, warm: '#fff7ed', neutral: '#f1f5f9', danger: colors.chilliBg }[tone];

  return (
    <View style={[styles.iconTile, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Ionicons name={name} size={size * 0.48} color={fg} />
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

/** Uppercase micro-label. Used above section titles and as a group heading. */
export function Eyebrow({ children, style }: { children: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    ...shadow.card,
  },
  cardPadded: { padding: spacing.lg },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: { ...type.tiny, fontSize: 11, lineHeight: 15 },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 38,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  chipOff: { backgroundColor: colors.paper, borderColor: colors.lineStrong },
  chipOn: { backgroundColor: colors.leaf, borderColor: colors.leaf },
  chipText: { ...type.smallStrong, lineHeight: 18, includeFontPadding: false },
  chipTextOff: { color: colors.ink80 },
  chipTextOn: { color: colors.onDark },

  section: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  sectionText: { flex: 1 },
  sectionTitle: { ...type.serifLg, color: colors.ink },
  eyebrow: { ...type.eyebrow, color: colors.leaf, marginBottom: 3 },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: MIN_TOUCH - 20,
  },
  sectionActionText: { ...type.smallStrong, color: colors.leaf },

  spice: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  spiceDots: { flexDirection: 'row', gap: 3 },
  spiceDot: { width: 5, height: 5, borderRadius: 2.5 },
  spiceLabel: { ...type.tiny, fontSize: 11 },

  iconTile: { alignItems: 'center', justifyContent: 'center' },

  divider: { height: 1, backgroundColor: colors.line },
});
