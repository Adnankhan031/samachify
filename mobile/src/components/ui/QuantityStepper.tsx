import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

interface QuantityStepperProps {
  quantity: number;
  onChange: (next: number) => void;
  /** Below this the minus button reads as "remove" instead of "decrease". */
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}

/**
 * The −/qty/+ control used on product cards, the product page and the cart.
 * Going below `min` calls `onChange(0)`, which the cart treats as a removal.
 */
export function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 50,
  size = 'md',
  label = 'item',
}: QuantityStepperProps) {
  const tap = () => {
    if (Platform.OS !== 'web') {
      void Haptics.selectionAsync().catch(() => {});
    }
  };

  const dec = () => {
    tap();
    onChange(quantity - 1 < min ? 0 : quantity - 1);
  };

  const inc = () => {
    if (quantity >= max) return;
    tap();
    onChange(quantity + 1);
  };

  const box = size === 'sm' ? styles.boxSm : styles.boxMd;
  const glyph = size === 'sm' ? styles.glyphSm : styles.glyphMd;

  return (
    <View style={[styles.wrapper, size === 'sm' && styles.wrapperSm]}>
      <Pressable
        onPress={dec}
        accessibilityRole="button"
        accessibilityLabel={quantity <= min ? `Remove ${label}` : `Decrease ${label} quantity`}
        hitSlop={6}
        style={({ pressed }) => [styles.button, box, pressed && styles.pressed]}
      >
        <Text style={[styles.buttonText, glyph]}>−</Text>
      </Pressable>

      <Text
        style={[styles.count, size === 'sm' && styles.countSm]}
        accessibilityLabel={`Quantity ${quantity}`}
      >
        {quantity}
      </Text>

      <Pressable
        onPress={inc}
        disabled={quantity >= max}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label} quantity`}
        accessibilityState={{ disabled: quantity >= max }}
        hitSlop={6}
        style={({ pressed }) => [
          styles.button,
          box,
          pressed && styles.pressed,
          quantity >= max && styles.disabled,
        ]}
      >
        <Text style={[styles.buttonText, glyph]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green700,
    borderRadius: radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  wrapperSm: { borderRadius: radius.sm - 2 },
  button: { alignItems: 'center', justifyContent: 'center' },
  boxMd: { width: 34, height: 34 },
  boxSm: { width: 28, height: 28 },
  buttonText: { color: colors.white, fontWeight: '700', lineHeight: 22 },
  glyphMd: { fontSize: 19 },
  glyphSm: { fontSize: 16 },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.4 },
  count: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
    minWidth: 26,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
  countSm: { fontSize: 13, minWidth: 22 },
});
