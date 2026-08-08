import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, type } from '@/theme';

/**
 * Page chrome. Handles the status-bar inset so no screen has to think about it,
 * and paints the cream brand background edge to edge.
 */
export function Screen({
  children,
  style,
  edges = 'top',
}: {
  /** Optional so a screen can render bare chrome while it decides what to show. */
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** 'top' for tab screens, 'none' when a native stack header already insets. */
  edges?: 'top' | 'none';
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, edges === 'top' && { paddingTop: insets.top }, style]}>
      {children}
    </View>
  );
}

/**
 * In-app header for stack screens. Used instead of the native header so the back
 * affordance, title weight and spacing match the rest of the app on both platforms.
 */
export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  /** Defaults to router.back(); pass a custom handler to override. */
  onBack?: () => void;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  return (
    <View style={styles.header}>
      <Pressable
        onPress={handleBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.5 }]}
      >
        <Text style={styles.backGlyph}>‹</Text>
      </Pressable>

      <View style={styles.headerText}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ?? <View style={styles.back} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  // The chevron glyph sits high in its line box; nudge it down to look centred.
  backGlyph: { fontSize: 32, lineHeight: 34, color: colors.ink, marginTop: -4 },
  headerText: { flex: 1 },
  headerTitle: { ...type.h2, color: colors.ink },
  headerSubtitle: { ...type.small, color: colors.muted, marginTop: 1 },
});
