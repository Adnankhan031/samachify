import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, type } from '@/theme';

interface QuantityStepperProps {
  quantity: number;
  onChange: (next: number) => void;
  /** Below this the minus button removes rather than decrements. */
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}

/**
 * The −/qty/+ control on product cards, the product page and the cart.
 * Dropping below `min` calls `onChange(0)`, which the cart reads as a removal —
 * so the trash icon appears at that boundary instead of a dead minus.
 */
export function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 50,
  size = 'md',
  label = 'item',
}: QuantityStepperProps) {
  const small = size === 'sm';
  const removing = quantity <= min;

  const tap = () => {
    if (Platform.OS !== 'web') void Haptics.selectionAsync().catch(() => {});
  };

  const dec = () => {
    tap();
    onChange(removing ? 0 : quantity - 1);
  };

  const inc = () => {
    if (quantity >= max) return;
    tap();
    onChange(quantity + 1);
  };

  const box = small ? styles.boxSm : styles.boxMd;
  const glyph = small ? 15 : 18;

  return (
    <View style={[styles.wrap, small && styles.wrapSm]}>
      <Pressable
        onPress={dec}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={removing ? `Remove ${label}` : `Decrease ${label} quantity`}
        style={({ pressed }) => [styles.btn, box, pressed && styles.pressed]}
      >
        <Ionicons
          name={removing ? 'trash-outline' : 'remove'}
          size={glyph}
          color={colors.onDark}
        />
      </Pressable>

      <Text
        style={[styles.count, small && styles.countSm]}
        accessibilityLabel={`Quantity ${quantity}`}
      >
        {quantity}
      </Text>

      <Pressable
        onPress={inc}
        disabled={quantity >= max}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label} quantity`}
        accessibilityState={{ disabled: quantity >= max }}
        style={({ pressed }) => [
          styles.btn,
          box,
          pressed && styles.pressed,
          quantity >= max && styles.off,
        ]}
      >
        <Ionicons name="add" size={glyph} color={colors.onDark} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.leaf,
    borderRadius: radius.sm,
    padding: 3,
  },
  wrapSm: { borderRadius: radius.xs + 2 },
  btn: { alignItems: 'center', justifyContent: 'center' },
  boxMd: { width: 34, height: 34 },
  boxSm: { width: 27, height: 27 },
  pressed: { opacity: 0.55 },
  off: { opacity: 0.35 },
  count: {
    ...type.h3,
    color: colors.onDark,
    minWidth: 26,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
    includeFontPadding: false,
  },
  countSm: { fontSize: 13, minWidth: 22 },
});
