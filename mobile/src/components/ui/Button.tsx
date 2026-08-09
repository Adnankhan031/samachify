import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, shadow, spacing, type, MIN_TOUCH } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: IoniconName;
  /** Put the icon after the label — for "continue"-style actions. */
  iconRight?: IoniconName;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

/**
 * The only button in the app. Everything tappable-and-labelled routes through
 * here so padding, radius, pressed state and disabled treatment never drift.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  style,
  accessibilityHint,
}: ButtonProps) {
  const inert = disabled || loading;
  const tint = CONTENT_COLOR[variant];

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={inert}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inert, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        SIZE[size],
        VARIANT[variant],
        variant === 'primary' && !inert && shadow.action,
        fullWidth && styles.fullWidth,
        pressed && !inert && styles.pressed,
        inert && styles.inert,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={tint} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={ICON[size]} color={tint} /> : null}
          <Text style={[LABEL[size], { color: tint }]} numberOfLines={1}>
            {label}
          </Text>
          {iconRight ? <Ionicons name={iconRight} size={ICON[size]} color={tint} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  fullWidth: { alignSelf: 'stretch' },
  // Scale, not opacity: a translucent button over cream washes out instead of
  // reading as pressed.
  pressed: { transform: [{ scale: 0.972 }] },
  inert: { opacity: 0.4 },
});

const SIZE: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: spacing.sm + 1, paddingHorizontal: spacing.lg, borderRadius: radius.sm },
  md: { paddingVertical: spacing.md + 1, paddingHorizontal: spacing.xl },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl, borderRadius: radius.lg },
};

const ICON: Record<ButtonSize, number> = { sm: 15, md: 17, lg: 19 };

const LABEL = StyleSheet.create({
  sm: { ...type.smallStrong },
  md: { ...type.h3 },
  lg: { fontFamily: type.h2.fontFamily, fontSize: 16, lineHeight: 22, letterSpacing: -0.1 },
});

const VARIANT: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.leaf },
  secondary: { backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.lineStrong },
  ghost: { backgroundColor: 'transparent' },
  // For dark bands — lime on bark is the brand's highest-contrast pairing.
  onDark: { backgroundColor: colors.sprout },
  danger: { backgroundColor: colors.chilli },
};

const CONTENT_COLOR: Record<ButtonVariant, string> = {
  primary: colors.onDark,
  secondary: colors.ink,
  ghost: colors.leaf,
  onDark: colors.bark,
  danger: colors.onDark,
};
