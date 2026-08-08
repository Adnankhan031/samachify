import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderTimeline, PriceBreakdown, StatusPill } from '@/components/OrderParts';
import {
  Button,
  Card,
  Divider,
  ErrorState,
  Screen,
  ScreenHeader,
  SectionHeader,
  Skeleton,
} from '@/components/ui';
import { formatDateTime, inr, orderRef } from '@/lib/format';
import { getOrder, subscribeToOrders, type Order } from '@/lib/orders';
import { useAuth } from '@/store/auth';
import { colors, spacing, type } from '@/theme';

export default function OrderDetail() {
  const { id, placed } = useLocalSearchParams<{ id: string; placed?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const justPlaced = placed === '1';
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      setOrder(await getOrder(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this order.');
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  // Tracking updates as the admin advances `order_status`.
  useEffect(() => {
    if (!user) return;
    return subscribeToOrders(user.id, () => void load());
  }, [user, load]);

  if (error) {
    return (
      <Screen>
        <ScreenHeader title="Order" />
        <ErrorState message={error} onRetry={() => void load()} />
      </Screen>
    );
  }

  if (order === undefined) {
    return (
      <Screen>
        <ScreenHeader title="Order" />
        <View style={styles.loading}>
          <Skeleton height={120} radius={18} />
          <Skeleton height={240} radius={18} />
        </View>
      </Screen>
    );
  }

  if (order === null) {
    return (
      <Screen>
        <ScreenHeader title="Order" />
        <ErrorState
          message="We couldn't find that order on your account."
          onRetry={() => router.replace('/(tabs)/orders')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title={orderRef(order.id)}
        subtitle={formatDateTime(order.created_at)}
        // A just-placed order has no back stack worth returning to — the cart is
        // gone and checkout is done. Send them home instead.
        onBack={justPlaced ? () => router.replace('/(tabs)') : undefined}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {justPlaced ? (
          <Card style={styles.success}>
            <Text style={styles.successMark}>✓</Text>
            <Text style={styles.successTitle}>Order placed</Text>
            <Text style={styles.successBody}>
              Thank you. We&apos;ll start preparing your pack and keep this screen updated
              as it moves.
            </Text>
          </Card>
        ) : null}

        <Card>
          <View style={styles.statusRow}>
            <Text style={styles.sectionLabel}>Status</Text>
            <StatusPill status={order.orderStatus} />
          </View>
          <Divider style={{ marginVertical: spacing.lg }} />
          <OrderTimeline status={order.orderStatus} />
        </Card>

        <View style={styles.section}>
          <SectionHeader title="Items" />
          <Card>
            {order.items.map((item, i) => (
              <View key={item.id}>
                <View style={styles.item}>
                  <Text style={styles.itemQty}>{item.quantity}×</Text>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.product_name}
                  </Text>
                  <Text style={styles.itemPrice}>{inr(item.price * item.quantity)}</Text>
                </View>
                {i < order.items.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </Card>
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionLabel}>Bill details</Text>
          <View style={{ marginTop: spacing.sm }}>
            <PriceBreakdown
              subtotal={order.subtotal}
              deliveryFee={order.delivery_fee}
              total={order.total}
            />
          </View>
          <Text style={styles.payMethod}>
            {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid online'}
            {order.status === 'paid' ? ' · Payment received' : ''}
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionLabel}>Delivery address</Text>
          <Text style={styles.addressName}>{order.customer_name}</Text>
          <Text style={styles.addressLine}>{order.address}</Text>
          <Text style={styles.addressLine}>
            {order.city} — {order.pincode}
          </Text>
          <Text style={styles.addressLine}>+91 {order.phone}</Text>
        </Card>

        <Button
          label="Continue shopping"
          variant="secondary"
          fullWidth
          onPress={() => router.replace('/(tabs)')}
          style={styles.section}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { padding: spacing.lg, gap: spacing.md },
  content: { padding: spacing.lg },

  success: { alignItems: 'center', backgroundColor: colors.successBg, borderColor: '#bbf7d0', marginBottom: spacing.md },
  successMark: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.success,
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 46,
    overflow: 'hidden',
  },
  successTitle: { ...type.h2, color: colors.success, marginTop: spacing.md },
  successBody: {
    ...type.small,
    color: colors.ink80,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 19,
  },

  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { ...type.h3, color: colors.ink },
  section: { marginTop: spacing.xxl },

  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  itemQty: { ...type.small, fontWeight: '800', color: colors.green700, minWidth: 26 },
  itemName: { ...type.small, color: colors.ink, flex: 1 },
  itemPrice: { ...type.bodyStrong, color: colors.ink },

  payMethod: {
    ...type.small,
    color: colors.muted,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },

  addressName: { ...type.bodyStrong, color: colors.ink, marginTop: spacing.md },
  addressLine: { ...type.small, color: colors.muted, marginTop: 2 },
});
