import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { QuantityStepper, SpiceDots } from '@/components/ui';
import type { Product } from '@/lib/catalogue';
import { inr } from '@/lib/format';
import { useCart } from '@/store/cart';
import { colors, radius, shadow, spacing, type } from '@/theme';

/**
 * The pack card, in two shapes: `grid` (two-up in listings) and `rail`
 * (fixed width, horizontally scrolled on Home).
 *
 * Cook time is the hero data point rather than a discount badge — "ready in
 * 10–15 minutes" is what Samachify actually sells, and there are no discounts
 * in the backend to display. Ratings and strike-through prices are absent for
 * the same reason: nothing here is invented.
 */
export function ProductCard({
  product,
  variant = 'grid',
}: {
  product: Product;
  variant?: 'grid' | 'rail';
}) {
  const router = useRouter();
  const { quantityOf, addItem, updateQuantity } = useCart();
  const quantity = quantityOf(product.id);

  const add = () =>
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

  // "10-15 mins" → "10–15" so the numeral can carry the display face alone.
  const minutes = product.cookTime.replace(/\s*mins?$/i, '').replace('-', '–');

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${inr(product.price)}, ready in ${product.cookTime}`}
      accessibilityHint="Opens the pack details"
      style={({ pressed }) => [
        styles.card,
        variant === 'rail' ? styles.rail : styles.grid,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.media}>
        <Image
          source={product.image}
          style={styles.image}
          contentFit="cover"
          transition={200}
          accessibilityIgnoresInvertColors
        />

        {/* Signature: time as the headline stat, in the display serif. */}
        <View style={styles.timeTag}>
          <Text style={styles.timeValue}>{minutes}</Text>
          <Text style={styles.timeUnit}>min</Text>
        </View>

        {product.dietType === 'Vegan' ? (
          <View style={styles.veganTag}>
            <Ionicons name="leaf" size={10} color={colors.moss} />
            <Text style={styles.veganText}>Vegan</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {product.subtitle}
        </Text>

        <View style={styles.metaRow}>
          {product.spiceLevel ? <SpiceDots level={product.spiceLevel} /> : <View />}
          <View style={styles.serves}>
            <Ionicons name="people-outline" size={12} color={colors.faint} />
            <Text style={styles.servesText}>{product.servings}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{inr(product.price)}</Text>
            <Text style={styles.priceNote}>per pack</Text>
          </View>

          {quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              size="sm"
              label={product.name}
              onChange={(next) => updateQuantity(product.id, next)}
            />
          ) : (
            <Pressable
              onPress={add}
              accessibilityRole="button"
              accessibilityLabel={`Add ${product.name} to cart`}
              style={({ pressed }) => [styles.add, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="add" size={16} color={colors.onDark} />
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadow.card,
  },
  grid: { flex: 1 },
  rail: { width: 210 },
  pressed: { transform: [{ scale: 0.982 }] },

  media: { backgroundColor: colors.wash },
  image: { width: '100%', aspectRatio: 1.28 },

  timeTag: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    backgroundColor: 'rgba(11,22,6,0.82)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  timeValue: { ...type.numeral, color: colors.sprout, includeFontPadding: false },
  timeUnit: { ...type.tiny, fontSize: 10, color: colors.onDarkMuted },

  veganTag: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  veganText: { ...type.tiny, fontSize: 9.5, color: colors.moss },

  body: { padding: spacing.md },
  name: { ...type.h3, color: colors.ink },
  subtitle: { ...type.tiny, color: colors.muted, marginTop: 2, minHeight: 32 },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  serves: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  servesText: { ...type.tiny, fontSize: 11, color: colors.faint },

  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  price: { ...type.price, color: colors.ink, includeFontPadding: false },
  priceNote: { ...type.tiny, fontSize: 10, color: colors.faint, marginTop: -1 },

  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.leaf,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  addText: { ...type.smallStrong, fontSize: 12.5, color: colors.onDark },
});
