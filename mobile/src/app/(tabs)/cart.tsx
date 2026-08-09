import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PriceBreakdown } from '@/components/OrderParts';
import { Button, Card, EmptyState, QuantityStepper, Screen } from '@/components/ui';
import { inr, plural } from '@/lib/format';
import { useCart } from '@/store/cart';
import { colors, radius, shadow, spacing, type } from '@/theme';

export default function Cart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    items,
    hydrated,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryFee,
    total,
    totalItems,
    amountToFreeDelivery,
  } = useCart();

  // Don't flash an empty cart before the saved one has been read back.
  if (!hydrated) {
    return <Screen />;
  }

  if (items.length === 0) {
    return (
      <Screen>
        <Text style={styles.title}>Your cart</Text>
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          message="Add a meal kit and you'll be cooking in 10–15 minutes."
          actionLabel="Browse packs"
          onAction={() => router.push('/(tabs)/categories')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Your cart</Text>
        <Text style={styles.subtitle}>{plural(totalItems, 'item')}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 160 }]}
      >
        {amountToFreeDelivery > 0 ? (
          <View style={styles.nudge}>
            <Text style={styles.nudgeText}>
              Add {inr(amountToFreeDelivery)} more for free delivery
            </Text>
          </View>
        ) : (
          <View style={[styles.nudge, styles.nudgeEarned]}>
            <Text style={[styles.nudgeText, styles.nudgeTextEarned]}>
              🎉 Free delivery unlocked
            </Text>
          </View>
        )}

        {items.map((item) => (
          <Card key={item.productId} style={styles.item} padded={false}>
            <Image source={item.image} style={styles.itemImage} contentFit="cover" />

            <View style={styles.itemBody}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.itemUnit}>{inr(item.price)} each</Text>

              <View style={styles.itemFooter}>
                <QuantityStepper
                  quantity={item.quantity}
                  size="sm"
                  label={item.name}
                  onChange={(next) => updateQuantity(item.productId, next)}
                />
                <Text style={styles.itemTotal}>{inr(item.price * item.quantity)}</Text>
              </View>
            </View>

            <Pressable
              onPress={() => removeItem(item.productId)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name} from cart`}
              style={({ pressed }) => [styles.remove, pressed && { opacity: 0.5 }]}
            >
              <Text style={styles.removeGlyph}>×</Text>
            </Pressable>
          </Card>
        ))}

        <Card style={styles.summary}>
          <Text style={styles.summaryTitle}>Bill details</Text>
          <PriceBreakdown subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
        </Card>

        <Text style={styles.disclaimer}>
          Final amount is confirmed by Samachify when the order is placed.
        </Text>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.barLabel}>Total</Text>
          <Text style={styles.barTotal}>{inr(total)}</Text>
        </View>
        <Button
          label="Proceed to checkout"
          onPress={() => router.push('/checkout')}
          size="lg"
          style={styles.barButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  title: { ...type.h1, color: colors.ink, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  subtitle: { ...type.small, color: colors.muted, marginTop: 2 },
  content: { padding: spacing.lg, gap: spacing.md },

  nudge: {
    backgroundColor: colors.wash,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  nudgeEarned: { backgroundColor: colors.successBg, borderColor: '#bbf7d0' },
  nudgeText: { ...type.small, fontWeight: '700', color: colors.moss, textAlign: 'center' },
  nudgeTextEarned: { color: colors.success },

  item: { flexDirection: 'row', padding: spacing.md, gap: spacing.md },
  itemImage: { width: 76, height: 76, borderRadius: radius.sm, backgroundColor: colors.wash },
  itemBody: { flex: 1 },
  itemName: { ...type.bodyStrong, color: colors.ink },
  itemUnit: { ...type.small, color: colors.muted, marginTop: 2 },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  itemTotal: { ...type.h3, color: colors.ink },
  remove: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  removeGlyph: { fontSize: 22, lineHeight: 24, color: colors.faint },

  summary: { marginTop: spacing.sm },
  summaryTitle: { ...type.h3, color: colors.ink, marginBottom: spacing.sm },
  disclaimer: { ...type.small, color: colors.faint, textAlign: 'center' },

  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    ...shadow.lifted,
  },
  barLabel: { ...type.small, color: colors.muted },
  barTotal: { ...type.h2, color: colors.ink },
  barButton: { flex: 1 },
});
