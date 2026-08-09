import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PriceBreakdown } from '@/components/OrderParts';
import { ProductCard } from '@/components/ProductCard';
import {
  Button,
  Card,
  EmptyState,
  PageTitle,
  QuantityStepper,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { listProducts, type Product } from '@/lib/catalogue';
import { FREE_DELIVERY_THRESHOLD } from '@/lib/config';
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

  const [catalogue, setCatalogue] = useState<Product[]>([]);

  useEffect(() => {
    listProducts()
      .then(setCatalogue)
      .catch(() => setCatalogue([]));
  }, []);

  // Don't flash an empty cart before the saved one has been read back.
  if (!hydrated) return <Screen />;

  if (items.length === 0) {
    return (
      <Screen>
        <PageTitle title="Your cart" />
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

  const inCart = new Set(items.map((i) => i.productId));
  const suggestions = catalogue.filter((p) => !inCart.has(p.id));
  const progress = Math.min(1, subtotal / FREE_DELIVERY_THRESHOLD);
  const earned = amountToFreeDelivery === 0;

  return (
    <Screen>
      <PageTitle title="Your cart" subtitle={plural(totalItems, 'item')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 150 }]}
      >
        {/* Progress toward free delivery. Real threshold, real arithmetic — the
            same rule the server applies when it prices the order. */}
        <View style={[styles.nudge, earned && styles.nudgeEarned]}>
          <View style={styles.nudgeRow}>
            <Ionicons
              name={earned ? 'checkmark-circle' : 'bicycle-outline'}
              size={17}
              color={earned ? colors.success : colors.moss}
            />
            <Text style={[styles.nudgeText, earned && { color: colors.success }]}>
              {earned
                ? 'Free delivery unlocked'
                : `Add ${inr(amountToFreeDelivery)} more for free delivery`}
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

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
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name} from cart`}
              style={({ pressed }) => [styles.remove, pressed && { opacity: 0.5 }]}
            >
              <Ionicons name="close" size={16} color={colors.faint} />
            </Pressable>
          </Card>
        ))}

        {suggestions.length > 0 ? (
          <View style={styles.suggest}>
            <SectionHeader title="Goes well with this" eyebrow="Complete the meal" />
            <FlatList
              horizontal
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ProductCard product={item} variant="rail" />}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
            />
          </View>
        ) : null}

        <Card style={styles.summary}>
          <Text style={styles.summaryTitle}>Bill details</Text>
          <PriceBreakdown subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
        </Card>

        <View style={styles.assurance}>
          <Ionicons name="snow-outline" size={14} color={colors.faint} />
          <Text style={styles.assuranceText}>
            Packed in MAP film, delivered through a 2–8°C cold chain.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.barLabel}>Total</Text>
          <Text style={styles.barTotal}>{inr(total)}</Text>
        </View>
        <Button
          label="Checkout"
          iconRight="arrow-forward"
          size="lg"
          onPress={() => router.push('/checkout')}
          style={styles.barButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },

  nudge: {
    backgroundColor: colors.wash,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  nudgeEarned: { backgroundColor: colors.successBg, borderColor: '#bbf7d0' },
  nudgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  nudgeText: { ...type.smallStrong, color: colors.moss, flex: 1 },
  track: { height: 5, borderRadius: 3, backgroundColor: colors.lineStrong, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: colors.leaf },

  item: { flexDirection: 'row', padding: spacing.md, gap: spacing.md },
  itemImage: { width: 78, height: 78, borderRadius: radius.sm, backgroundColor: colors.wash },
  itemBody: { flex: 1 },
  itemName: { ...type.h3, color: colors.ink },
  itemUnit: { ...type.tiny, color: colors.muted, marginTop: 2 },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  itemTotal: { ...type.price, color: colors.ink },
  remove: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },

  suggest: { marginTop: spacing.xxl },

  summary: { marginTop: spacing.sm },
  summaryTitle: { ...type.h3, color: colors.ink, marginBottom: spacing.sm },

  assurance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
  },
  assuranceText: { ...type.tiny, fontSize: 10.5, color: colors.faint, textAlign: 'center' },

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
  barLabel: { ...type.tiny, color: colors.muted },
  barTotal: { ...type.priceLg, fontSize: 22, lineHeight: 27, color: colors.ink },
  barButton: { flex: 1 },
});
