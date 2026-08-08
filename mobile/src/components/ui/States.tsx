import React, { useEffect } from 'react';
import { StyleSheet, Text, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius, spacing, type } from '@/theme';

import { Button } from './Button';

/**
 * Shimmering placeholder block. Screens compose these into a rough outline of the
 * content that is loading, so nothing ever renders blank.
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
  const progress = useSharedValue(0.4);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 850 }), -1, true);
  }, [progress]);

  const animated = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: r, backgroundColor: colors.line }, animated, style]}
    />
  );
}

/**
 * Nothing to show, and that is fine — an empty cart, no orders, no search results.
 * Always offers a way forward.
 */
export function EmptyState({
  emoji,
  title,
  message,
  actionLabel,
  onAction,
}: {
  emoji: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.centered}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

/**
 * Something went wrong — network, Supabase, an API route. Always retryable, and it
 * shows the real message rather than a shrug.
 */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.centered}>
      <Text style={styles.emoji}>🌐</Text>
      <Text style={styles.title}>Couldn&apos;t load this</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button label="Try again" variant="secondary" onPress={onRetry} style={styles.action} />
      ) : null}
    </View>
  );
}

/** Inline banner for a form-level failure, e.g. a rejected order. */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.banner} accessibilityLiveRegion="polite">
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.section + spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  emoji: { fontSize: 44, marginBottom: spacing.lg },
  title: { ...type.h2, color: colors.ink, textAlign: 'center', marginBottom: spacing.sm },
  message: {
    ...type.body,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 300,
  },
  action: { marginTop: spacing.xxl },
  banner: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerText: { fontSize: 13, fontWeight: '600', color: colors.danger },
});
