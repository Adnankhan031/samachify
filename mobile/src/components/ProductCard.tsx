import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, QuantityStepper } from '@/components/ui';
import type { Product } from '@/lib/catalogue';
import { inr } from '@/lib/format';
import { useCart } from '@/store/cart';
import { colors, radius, shadow, spacing } from '@/theme';

/**
 * The product card, in two shapes:
 *  - `grid`   two-up in the products/category lists
 *  - `rail`   fixed-width, horizontally scrolled on Home
 *
 * Deliberately shows no rating, discount or strike-through price — Samachify has
 * no ratings or discounts in the backend, and inventing them would be a lie on the
 * most trust-sensitive surface in the app.
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

  const open = () => router.push(`/product/${product.id}`);

  const add = () =>
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${inr(product.price)}`}
      accessibilityHint="Opens the pack details"
      style={({ pressed }) => [
        styles.card,
        variant === 'rail' ? styles.rail : styles.grid,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={product.image}
          style={styles.image}
          contentFit="cover"
          transition={180}
          accessibilityIgnoresInvertColors
        />
        {product.spiceLevel ? (
          <View style={styles.badgeOverlay}>
            <Badge label={product.spiceLevel} tone="lime" />
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
          <Text style={styles.meta}>⏱ {product.cookTime}</Text>
          <Text style={styles.meta}>· Serves {product.servings}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{inr(product.price)}</Text>

          {quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              size="sm"
              label={product.name}
              onChange={(next) => updateQuantity(product.id, next)}
            />
          ) : (
            <Button label="Add" size="sm" onPress={add} accessibilityHint="Adds one pack to your cart" />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadow.sm,
  },
  grid: { flex: 1 },
  rail: { width: 200 },
  pressed: { transform: [{ scale: 0.985 }] },

  imageWrap: { backgroundColor: colors.green50 },
  image: { width: '100%', aspectRatio: 1.15 },
  badgeOverlay: { position: 'absolute', top: spacing.sm, left: spacing.sm },

  body: { padding: spacing.md },
  name: { fontSize: 14, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 11.5, lineHeight: 16, color: colors.muted, marginTop: 2, minHeight: 32 },
  metaRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm },
  meta: { fontSize: 10.5, fontWeight: '600', color: colors.mutedLight },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  price: { fontSize: 16, fontWeight: '800', color: colors.ink },
});
