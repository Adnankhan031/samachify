import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius, spacing, type } from '@/theme';

import { Button } from './Button';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * Shimmering placeholder. Screens compose these into the rough shape of what's
 * loading so nothing ever renders blank.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius: r = radius.sm,
  style,
}: {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const pulse = useSharedValue(0.45);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 820 }), -1, true);
  }, [pulse]);

  const animated = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: r, backgroundColor: colors.line }, animated, style]}
    />
  );
}

/**
 * Nothing to show, and that's fine — empty cart, no orders, no results.
 * Always offers the next action rather than leaving a dead end.
 */
export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: {
  icon: IoniconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <View style={styles.centered}>
      <View style={styles.iconRing}>
        <Ionicons name={icon} size={34} color={colors.leaf} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <Button
          label={secondaryLabel}
          variant="ghost"
          size="sm"
          onPress={onSecondary}
          style={styles.secondary}
        />
      ) : null}
    </View>
  );
}

/** A failure — network, Supabase, an API route. Always retryable, never vague. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.centered}>
      <View style={[styles.iconRing, styles.iconRingWarn]}>
        <Ionicons name="cloud-offline-outline" size={34} color={colors.turmeric} />
      </View>
      <Text style={styles.title}>Couldn&apos;t load this</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button
          label="Try again"
          icon="refresh"
          variant="secondary"
          onPress={onRetry}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

/** Inline banner for a form-level failure, e.g. a rejected order. */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.banner} accessibilityLiveRegion="polite">
      <Ionicons name="alert-circle" size={17} color={colors.chilli} />
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

/** Positive inline confirmation, e.g. "address saved". */
export function InfoBanner({ message, icon = 'information-circle' }: { message: string; icon?: IoniconName }) {
  return (
    <View style={styles.info}>
      <Ionicons name={icon} size={17} color={colors.moss} />
      <Text style={styles.infoText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.hero,
    paddingHorizontal: spacing.xxl,
  },
  iconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.wash,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconRingWarn: { backgroundColor: '#fff7ed', borderColor: '#fed7aa' },
  title: { ...type.serifLg, color: colors.ink, textAlign: 'center', marginBottom: spacing.sm },
  message: { ...type.small, color: colors.muted, textAlign: 'center', maxWidth: 300 },
  action: { marginTop: spacing.xxl },
  secondary: { marginTop: spacing.sm },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.chilliBg,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerText: { ...type.smallStrong, color: colors.chilli, flex: 1 },

  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.wash,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  infoText: { ...type.small, color: colors.moss, flex: 1 },
});
