import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing, type, MIN_TOUCH } from '@/theme';

/**
 * Page chrome. Owns the status-bar inset and the cream background so no screen
 * has to think about either.
 */
export function Screen({
  children,
  style,
  edges = 'top',
  tone = 'cream',
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** 'top' for tab screens; 'none' when a parent already insets. */
  edges?: 'top' | 'none';
  tone?: 'cream' | 'dark';
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: tone === 'dark' ? colors.bark : colors.cream },
        edges === 'top' && { paddingTop: insets.top },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * In-app header for stack screens. Used instead of the native header so the back
 * affordance, title weight and spacing are identical on both platforms.
 */
export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
  tone = 'cream',
  borderless = false,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  /** Defaults to router.back(), falling back to Home when there's no stack. */
  onBack?: () => void;
  tone?: 'cream' | 'dark';
  borderless?: boolean;
}) {
  const router = useRouter();
  const dark = tone === 'dark';

  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  return (
    <View
      style={[
        styles.header,
        dark && { backgroundColor: colors.bark },
        !borderless && styles.headerBorder,
        !borderless && dark && { borderBottomColor: 'rgba(255,255,255,0.08)' },
      ]}
    >
      <Pressable
        onPress={handleBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [
          styles.back,
          dark ? styles.backDark : styles.backLight,
          pressed && { opacity: 0.55 },
        ]}
      >
        <Ionicons name="chevron-back" size={21} color={dark ? colors.onDark : colors.ink} />
      </Pressable>

      <View style={styles.headerText}>
        <Text style={[styles.title, dark && { color: colors.onDark }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, dark && { color: colors.onDarkMuted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ?? <View style={styles.back} />}
    </View>
  );
}

/** Large screen title for tab roots, where there's no back button. */
export function PageTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.pageTitle}>
      <View style={{ flex: 1 }}>
        <Text style={styles.pageTitleText}>{title}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  back: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLight: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  backDark: { backgroundColor: 'rgba(255,255,255,0.12)' },
  headerText: { flex: 1 },
  title: { ...type.h2, color: colors.ink },
  subtitle: { ...type.tiny, color: colors.muted, marginTop: 1 },

  pageTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    minHeight: MIN_TOUCH,
  },
  pageTitleText: { ...type.display, color: colors.ink },
  pageSubtitle: { ...type.small, color: colors.muted, marginTop: 2 },
});
